const { body, validationResult } = require('express-validator');

// Validation rules for registration
const validateRegister = [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn([
      'traveler', 'guide', 'driver', 'driver_guide', 
      'tour_operator', 'travel_agency', 'accommodation', 
      'cook', 'admin', 'super_admin'
    ]).withMessage('Invalid role selected'),
];

// Validation rules for login
const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
];

module.exports = {
  validateRegister,
  validateLogin,
};