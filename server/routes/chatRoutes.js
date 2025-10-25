// Chat routes
// spec: see FullStackProject-Sem3_33099103.pdf

const express = require('express');
const {
  getCourseMessages,
  sendMessage,
  deleteMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { objectIdValidation, validate } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/:courseId', objectIdValidation('courseId'), validate, getCourseMessages);
router.post('/:courseId', objectIdValidation('courseId'), validate, sendMessage);
router.delete('/message/:messageId', objectIdValidation('messageId'), validate, deleteMessage);

module.exports = router;