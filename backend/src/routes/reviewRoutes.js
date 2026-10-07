const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

// Protected routes
router.post('/', protect, reviewController.createReview);
router.get('/my-reviews', protect, reviewController.getMyReviews);
router.get('/listing/:listingId', reviewController.getListingReviews);
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

// Supplier response
router.put('/:id/respond', protect, reviewController.respondToReview);

// Admin routes
router.put('/:id/status', protect, reviewController.updateReviewStatus);

module.exports = router;