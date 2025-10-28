// Course routes
// spec: see FullStackProject-Sem3_33099103.pdf

const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addLecture,
  getInstructorCourses,
  getEnrolledCourses
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  courseValidation,
  objectIdValidation,
  validate
} = require('../utils/validation');

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', objectIdValidation('id'), validate, getCourse);

// 👇 Public for testing (was protected before)
router.post('/', courseValidation, validate, createCourse);

// Protected routes - Student
router.post('/:id/enroll', protect, authorize('student'), objectIdValidation('id'), validate, enrollCourse);
router.get('/my/enrolled', protect, authorize('student'), getEnrolledCourses);

// Protected routes - Instructor/Admin (other endpoints remain protected)
router.put('/:id', protect, authorize('instructor', 'admin'), objectIdValidation('id'), validate, updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), objectIdValidation('id'), validate, deleteCourse);
router.post('/:id/lectures', protect, authorize('instructor', 'admin'), objectIdValidation('id'), validate, addLecture);
router.get('/my/instructor', protect, authorize('instructor', 'admin'), getInstructorCourses);

module.exports = router;