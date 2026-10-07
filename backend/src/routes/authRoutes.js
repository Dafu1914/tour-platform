const express = require('express');
const router = express.Router();

// Import controller with destructuring to see if it works
const authController = require('../controllers/authController');

console.log('🔍 Auth Controller loaded:', Object.keys(authController));

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

module.exports = router;