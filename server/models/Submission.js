// Assignment submission model
// spec: see FullStackProject-Sem3_33099103.pdf

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String,
    required: [true, 'Submission file is required']
  },
  comments: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  gradedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
submissionSchema.index({ assignment: 1, student: 1 });
submissionSchema.index({ student: 1 });

// Ensure only one latest submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);