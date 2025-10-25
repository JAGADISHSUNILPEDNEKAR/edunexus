// Input validation utilities using express-validator
// spec: see FullStackProject-Sem3_33099103.pdf

const { body, param, validationResult } = require('express-validator');

// Validation middleware to check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Registration validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['student', 'instructor', 'admin']).withMessage('Invalid role')
];

// Login validation rules
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Course validation rules
const courseValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Course description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters')
];

// Assignment validation rules
const assignmentValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Assignment title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Assignment description is required'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
];

// MongoDB ObjectId validation
const objectIdValidation = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage('Invalid ID format')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  courseValidation,
  assignmentValidation,
  objectIdValidation
};