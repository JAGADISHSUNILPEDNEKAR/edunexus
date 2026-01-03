const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one review per course
ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (courseId) {
    const obj = await this.aggregate([
        {
            $match: { course: courseId }
        },
        {
            $group: {
                _id: '$course',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Course').findByIdAndUpdate(courseId, {
            rating: obj[0] ? obj[0].averageRating : 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.course);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.course);
});

module.exports = mongoose.model('Review', ReviewSchema);
