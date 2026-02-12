// Assignment routes
// spec: see FullStackProject-Sem3_33099103.pdf

const express = require('express');
const {
  getCourseAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getAssignmentSubmissions,
  getMySubmissions,
  markSubmission
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { uploadAssignment } = require('../middleware/upload');
const {
  assignmentValidation,
  objectIdValidation,
  validate
} = require('../utils/validation');

const router = express.Router();

// Student routes
router.get('/my/submissions', protect, authorize('student'), getMySubmissions);
router.post('/:id/submit', protect, authorize('student'), uploadAssignment.single('file'), submitAssignment);

// Instructor routes
router.post('/', protect, authorize('instructor', 'admin'), uploadAssignment.single('file'), createAssignment);
router.put('/:id', protect, authorize('instructor', 'admin'), objectIdValidation('id'), validate, updateAssignment);
router.delete('/:id', protect, authorize('instructor', 'admin'), objectIdValidation('id'), validate, deleteAssignment);
router.get('/:id/submissions', protect, authorize('instructor', 'admin'), objectIdValidation('id'), validate, getAssignmentSubmissions);
router.put('/submissions/:id/mark', protect, authorize('instructor', 'admin'), objectIdValidation('id'), validate, markSubmission);

// Common routes
router.get('/course/:courseId', protect, objectIdValidation('courseId'), validate, getCourseAssignments);
router.get('/:id', protect, objectIdValidation('id'), validate, getAssignment);

module.exports = router;