// Course management controller
// spec: see FullStackProject-Sem3_33099103.pdf

const Course = require('../models/Course');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Get all courses (with pagination)
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = { isActive: { $ne: false } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      courses
    });
  } catch (error) {
    logger.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const courseObj = course.toObject({ virtuals: true });
    courseObj.averageRating = course.averageRating;

    // If user is logged in, check if they have rated
    if (req.user) {
      const userRating = course.ratings.find(
        r => r.student.toString() === req.user.id.toString()
      );
      if (userRating) {
        courseObj.userRating = userRating;
      }
    }

    // Remove raw ratings array to protect privacy
    delete courseObj.ratings;

    res.status(200).json({
      success: true,
      course: courseObj
    });
  } catch (error) {
    logger.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor: req.user.id
    });

    logger.success(`Course created: ${title} by ${req.user.name}`);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    logger.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor - own courses)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    // Robust check for both populated object and direct ID
    const instructorId = course.instructor._id || course.instructor;

    // Debug logging
    console.log(`Update Course - Course ID: ${course._id}`);
    console.log(`Instructor ID from course: ${instructorId}`);
    console.log(`User ID from request: ${req.user._id}`);
    console.log(`User Role: ${req.user.role}`);

    if (instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      logger.warn(`Unauthorized update attempt by user ${req.user._id} on course ${course._id}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const { title, description, thumbnail } = req.body;

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, thumbnail },
      { new: true, runValidators: true }
    );

    logger.success(`Course updated: ${course.title}`);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    logger.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor - own courses, Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    const instructorId = course.instructor._id || course.instructor;

    if (instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      logger.warn(`Unauthorized delete attempt by user ${req.user._id} on course ${course._id}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    // Soft delete
    course.isActive = false;
    await course.save();

    logger.success(`Course deleted: ${course.title}`);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    logger.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student only)
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add student to course
    course.enrolledStudents.push(req.user.id);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: course._id }
    });

    logger.success(`Student ${req.user.name} enrolled in ${course.title}`);

    res.status(200).json({
      success: true,
      message: 'Enrolled successfully',
      course
    });
  } catch (error) {
    logger.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// @desc    Add lecture to course
// @route   POST /api/courses/:id/lectures
// @access  Private (Instructor - own courses)
exports.addLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    const instructorId = course.instructor._id || course.instructor;

    if (instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      logger.warn(`Unauthorized add lecture attempt by user ${req.user._id} on course ${course._id}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lectures to this course'
      });
    }

    const { title, videoUrl, duration } = req.body;

    const lecture = {
      title,
      videoUrl,
      duration: duration || 0,
      order: course.lectures.length + 1
    };

    course.lectures.push(lecture);
    await course.save();

    logger.success(`Lecture added to course: ${course.title}`);

    res.status(201).json({
      success: true,
      message: 'Lecture added successfully',
      lecture: course.lectures[course.lectures.length - 1]
    });
  } catch (error) {
    logger.error('Add lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding lecture',
      error: error.message
    });
  }
};

// @desc    Rate a course
// @route   POST /api/courses/:id/rate
// @access  Private (Student only)
exports.rateCourse = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Ensure enrolledStudents array exists
    if (!course.enrolledStudents) {
      course.enrolledStudents = [];
    }

    // Check if enrolled (Robust check for ObjectId vs String)
    const isEnrolled = course.enrolledStudents.some(
      studentId => studentId.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled to rate this course'
      });
    }

    // Ensure ratings array exists
    if (!course.ratings) {
      course.ratings = [];
    }

    // Check if already rated
    const existingRatingIndex = course.ratings.findIndex(
      r => r.student.toString() === req.user._id.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      course.ratings[existingRatingIndex].value = rating;
      course.ratings[existingRatingIndex].review = review;
      course.ratings[existingRatingIndex].createdAt = Date.now();
    } else {
      // Add new rating
      course.ratings.push({
        student: req.user._id,
        value: rating,
        review
      });
    }

    await course.save();

    logger.success(`Course rated: ${course.title} by ${req.user.name}`);

    // Return the updated rating object safely
    const updatedRating = existingRatingIndex !== -1
      ? course.ratings[existingRatingIndex]
      : course.ratings[course.ratings.length - 1];

    res.status(200).json({
      success: true,
      message: 'Course rated successfully',
      rating: updatedRating
    });
  } catch (error) {
    logger.error('Rate course error:', error);
    // Return detailed error in development, generic in production
    res.status(500).json({
      success: false,
      message: 'Error rating course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get my courses (as instructor)
// @route   GET /api/courses/my/instructor
// @access  Private (Instructor)
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('enrolledStudents', 'name email')
      .sort({ createdAt: -1 });

    // Add average rating to each course object for frontend
    const coursesWithRating = courses.map(course => {
      const courseObj = course.toObject({ virtuals: true });
      courseObj.rating = course.averageRating;
      // Remove raw ratings for privacy
      delete courseObj.ratings;
      return courseObj;
    });

    res.status(200).json({
      success: true,
      count: coursesWithRating.length,
      courses: coursesWithRating
    });
  } catch (error) {
    logger.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get enrolled courses (as student)
// @route   GET /api/courses/my/enrolled
// @access  Private (Student)
exports.getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      populate: { path: 'instructor', select: 'name email' }
    });

    res.status(200).json({
      success: true,
      count: user.enrolledCourses.length,
      courses: user.enrolledCourses
    });
  } catch (error) {
    logger.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrolled courses',
      error: error.message
    });
  }
};