// Assignment controller
// spec: see FullStackProject-Sem3_33099103.pdf

const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const logger = require('../utils/logger');
const { uploadAssignmentFile } = require('../services/uploadService');

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
exports.getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
      isActive: true
    })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments
    });
  } catch (error) {
    logger.error('Get course assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments',
      error: error.message
    });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('course', 'title');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      assignment
    });
  } catch (error) {
    logger.error('Get assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment',
      error: error.message
    });
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Instructor)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, maxScore } = req.body;

    // Verify course exists and user is instructor
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create assignments for this course'
      });
    }

    let fileUrl = null;
    if (req.file) {
      const uploadResult = await uploadAssignmentFile(req.file.path);
      fileUrl = uploadResult.url;
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      instructor: req.user.id,
      fileUrl,
      dueDate,
      maxScore: maxScore || 100
    });

    logger.success(`Assignment created: ${title} for course ${course.title}`);

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    logger.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating assignment',
      error: error.message
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Instructor)
exports.updateAssignment = async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check ownership
    if (assignment.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assignment'
      });
    }

    const { title, description, dueDate, maxScore } = req.body;

    assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, maxScore },
      { new: true, runValidators: true }
    );

    logger.success(`Assignment updated: ${assignment.title}`);

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      assignment
    });
  } catch (error) {
    logger.error('Update assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating assignment',
      error: error.message
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Instructor)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check ownership
    if (assignment.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assignment'
      });
    }

    assignment.isActive = false;
    await assignment.save();

    logger.success(`Assignment deleted: ${assignment.title}`);

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    logger.error('Delete assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting assignment',
      error: error.message
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const uploadResult = await uploadAssignmentFile(req.file.path);

    // Check if student has already submitted
    let submission = await Submission.findOne({
      assignment: req.params.id,
      student: req.user.id
    });

    if (submission) {
      // Update existing submission
      submission.fileUrl = uploadResult.url;
      submission.comments = req.body.comments || '';
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      // Create new submission
      submission = await Submission.create({
        assignment: req.params.id,
        student: req.user.id,
        fileUrl: uploadResult.url,
        comments: req.body.comments || ''
      });
    }

    logger.success(`Assignment submitted by student ${req.user.name}`);

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      submission
    });
  } catch (error) {
    logger.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting assignment',
      error: error.message
    });
  }
};

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private (Instructor)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is instructor of the course
    if (assignment.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view submissions'
      });
    }

    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    logger.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};

// @desc    Get my submissions (student)
// @route   GET /api/assignments/my/submissions
// @access  Private (Student)
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate({
        path: 'assignment',
        populate: { path: 'course', select: 'title' }
      })
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    logger.error('Get my submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};

// @desc    Mark submission (Grade and Feedback)
// @route   PUT /api/assignments/submissions/:id/mark
// @access  Private (Instructor/Admin)
exports.markSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    let submission = await Submission.findById(req.params.id)
      .populate('assignment');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Verify instructor ownership via assignment -> course
    const assignment = await Assignment.findById(submission.assignment._id);
    const course = await Course.findById(assignment.course);

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to grade this submission'
      });
    }

    // Update submission
    submission.score = score;
    submission.feedback = feedback || '';
    submission.gradedAt = new Date();

    await submission.save();

    logger.success(`Submission graded for student ${submission.student} on assignment ${assignment.title}`);

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      submission
    });
  } catch (error) {
    logger.error('Mark submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error grading submission',
      error: error.message
    });
  }
};