const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

// Initialize payment
router.post('/initiate', protect, paymentController.initiatePayment);

// Chapa webhook/callback
router.post('/chapa/callback', paymentController.chapaCallback);

// Verify payment
router.get('/verify/:transactionRef', protect, paymentController.verifyPayment);

// Get payment status
router.get('/status/:bookingId', protect, paymentController.getPaymentStatus);

module.exports = router;