// Chat controller for course discussions
// spec: see FullStackProject-Sem3_33099103.pdf

const Message = require('../models/Message');
const Course = require('../models/Course');
const logger = require('../utils/logger');

// @desc    Get messages for a course
// @route   GET /api/chat/:courseId
// @access  Private (Enrolled students, instructor, admin)
exports.getCourseMessages = async (req, res) => {
  try {
    const { courseId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify course exists and user has access
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has access to course
    const isInstructor = course.instructor.toString() === req.user.id.toString();
    const isEnrolled = course.enrolledStudents.some(id => id.toString() === req.user.id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isEnrolled && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this course chat'
      });
    }

    const messages = await Message.find({ course: courseId })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ course: courseId });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      messages: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    logger.error('Get course messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// @desc    Send message to course
// @route   POST /api/chat/:courseId
// @access  Private (Enrolled students, instructor, admin)
exports.sendMessage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Verify course exists and user has access
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const isInstructor = course.instructor.toString() === req.user.id.toString();
    const isEnrolled = course.enrolledStudents.some(id => id.toString() === req.user.id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isEnrolled && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages to this course'
      });
    }

    const message = await Message.create({
      course: courseId,
      sender: req.user.id,
      content: content.trim()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email role');

    logger.success(`Message sent to course ${courseId} by ${req.user.name}`);

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// @desc    Delete message (Admin or message sender)
// @route   DELETE /api/chat/message/:messageId
// @access  Private (Admin or sender)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is admin or message sender
    if (message.sender.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await message.deleteOne();

    logger.success(`Message deleted: ${req.params.messageId}`);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
};