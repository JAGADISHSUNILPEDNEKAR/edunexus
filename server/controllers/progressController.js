const CourseProgress = require('../models/CourseProgress');
const Course = require('../models/Course');
const logger = require('../utils/logger');

// @desc    Get progress for a specific course
// @route   GET /api/courses/:courseId/progress
// @access  Private
exports.getProgress = async (req, res) => {
    try {
        let progress = await CourseProgress.findOne({
            user: req.user.id,
            course: req.params.courseId
        });

        if (!progress) {
            // Create initial progress if not exists (auto-initialize on first access)
            progress = await CourseProgress.create({
                user: req.user.id,
                course: req.params.courseId,
                completedLectures: []
            });
        }

        res.status(200).json({
            success: true,
            progress
        });
    } catch (error) {
        logger.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching course progress',
            error: error.message
        });
    }
};

// @desc    Update lecture completion status
// @route   PUT /api/courses/:courseId/progress
// @access  Private
exports.updateProgress = async (req, res) => {
    try {
        const { lectureId, isCompleted } = req.body;
        const courseId = req.params.courseId;

        let progress = await CourseProgress.findOne({
            user: req.user.id,
            course: courseId
        });

        if (!progress) {
            progress = new CourseProgress({
                user: req.user.id,
                course: courseId,
                completedLectures: []
            });
        }

        // Update completed lectures array
        if (isCompleted) {
            if (!progress.completedLectures.includes(lectureId)) {
                progress.completedLectures.push(lectureId);
            }
        } else {
            progress.completedLectures = progress.completedLectures.filter(id => id !== lectureId);
        }

        progress.lastAccessed = Date.now();

        // Check if course is fully completed
        const course = await Course.findById(courseId);
        if (course) {
            const totalLectures = course.lectures.length;
            if (progress.completedLectures.length === totalLectures && totalLectures > 0) {
                progress.completed = true;
                progress.completionDate = Date.now();
            } else {
                progress.completed = false;
                progress.completionDate = null;
            }
        }

        await progress.save();

        res.status(200).json({
            success: true,
            progress
        });
    } catch (error) {
        logger.error('Update progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating progress',
            error: error.message
        });
    }
};
