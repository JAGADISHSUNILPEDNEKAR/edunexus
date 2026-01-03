const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const { getProgress, updateProgress } = require('../controllers/progressController');

router.use(protect);

router.route('/:courseId')
    .get(getProgress)
    .put(updateProgress);

module.exports = router;
