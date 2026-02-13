// Course model
// spec: see FullStackProject-Sem3_33099103.pdf

const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lectures: [lectureSchema],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  thumbnail: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ratings: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
courseSchema.index({ instructor: 1 });
courseSchema.index({ title: 'text', description: 'text' });

// Virtual for enrolled count
courseSchema.virtual('enrolledCount').get(function () {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

courseSchema.virtual('lectureCount').get(function () {
  return this.lectures ? this.lectures.length : 0;
});

// Virtual for average rating
courseSchema.virtual('averageRating').get(function () {
  if (this.ratings.length === 0) {
    return 0;
  }
  const sum = this.ratings.reduce((total, rating) => total + rating.value, 0);
  return sum / this.ratings.length;
});

module.exports = mongoose.model('Course', courseSchema);