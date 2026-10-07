const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

// Protected routes
router.put('/profile', protect, userController.updateProfile);
router.get('/profile', protect, userController.getProfile);

module.exports = router;