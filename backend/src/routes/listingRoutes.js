const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { protect } = require('../middlewares/auth');

// Public routes
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);

// Protected routes (require authentication)
router.post('/', protect, listingController.createListing);
router.put('/:id', protect, listingController.updateListing);
router.delete('/:id', protect, listingController.deleteListing);
router.patch('/:id/status', protect, listingController.updateListingStatus);

// User's listings
router.get('/user/my-listings', protect, listingController.getMyListings);

module.exports = router;