const mongoose = require('mongoose');

const CourseProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLectures: [{
        type: String, // Storing lecture IDs or unique identifiers
    }],
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    },
    completionDate: {
        type: Date
    }
});

// Ensure one progress record per user per course
CourseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('CourseProgress', CourseProgressSchema);
