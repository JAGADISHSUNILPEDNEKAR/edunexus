// User management routes (Admin)
// spec: see FullStackProject-Sem3_33099103.pdf

const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { objectIdValidation, validate } = require('../utils/validation');

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/admin/stats', getStats);
router.get('/:id', objectIdValidation('id'), validate, getUser);
router.put('/:id', objectIdValidation('id'), validate, updateUser);
router.delete('/:id', objectIdValidation('id'), validate, deleteUser);

module.exports = router;