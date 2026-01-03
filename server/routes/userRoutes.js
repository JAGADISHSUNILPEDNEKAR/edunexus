// User management routes (Admin)
// spec: see FullStackProject-Sem3_33099103.pdf

const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteUser,
  getStats,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { objectIdValidation, validate } = require('../utils/validation');

const router = express.Router();

// All routes require admin role
// Routes for any authenticated user
router.use(protect);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:courseId', addToWishlist);
router.delete('/wishlist/:courseId', removeFromWishlist);

// Admin only routes
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/admin/stats', getStats);
router.get('/:id', objectIdValidation('id'), validate, getUser);
router.put('/:id', objectIdValidation('id'), validate, updateUser);
router.delete('/:id', objectIdValidation('id'), validate, deleteUser);

module.exports = router;