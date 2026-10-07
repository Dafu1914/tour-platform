const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');

// Protected routes (require authentication)
router.post('/', protect, bookingController.createBooking);
router.get('/my-bookings', protect, bookingController.getMyBookings);
router.get('/my-listings-bookings', protect, bookingController.getMyListingsBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.put('/:id/status', protect, bookingController.updateBookingStatus);
router.put('/:id/cancel', protect, bookingController.cancelBooking);

module.exports = router;