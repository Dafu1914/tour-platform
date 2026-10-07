const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// Create a review (only for completed bookings)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Check if booking exists and belongs to the traveler
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if booking belongs to the traveler
    if (booking.traveler.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings',
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed bookings',
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking',
      });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      listing: booking.listing,
      traveler: req.user._id,
      supplier: booking.supplier,
      rating,
      comment,
    });

    // Update listing rating
    await updateListingRating(booking.listing);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get traveler's reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ traveler: req.user._id })
      .populate('listing', 'title category destination')
      .populate('supplier', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get reviews for a listing
exports.getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ 
      listing: listingId,
      status: 'approved',
    })
      .populate('traveler', 'fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ 
      listing: listingId,
      status: 'approved',
    });

    // Get rating stats
    const stats = await getListingRatingStats(listingId);

    res.status(200).json({
      success: true,
      data: reviews,
      stats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get listing reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns the review
    if (review.traveler.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews',
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update listing rating
    await updateListingRating(review.listing);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns the review
    if (review.traveler.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin' &&
        req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews',
      });
    }

    await review.deleteOne();

    // Update listing rating
    await updateListingRating(review.listing);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Respond to review (supplier)
exports.respondToReview = async (req, res) => {
  try {
    const { text } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user is the supplier
    if (review.supplier.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin' &&
        req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to your own reviews',
      });
    }

    review.supplierResponse = {
      text,
      date: new Date(),
    };
    await review.save();

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update review status (admin only)
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update review status',
      });
    }

    review.status = status;
    await review.save();

    // Update listing rating if approved or rejected
    if (status === 'approved' || status === 'rejected') {
      await updateListingRating(review.listing);
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Helper: Update listing rating
async function updateListingRating(listingId) {
  const stats = await getListingRatingStats(listingId);
  await Listing.findByIdAndUpdate(listingId, {
    rating: stats.average,
    reviewCount: stats.total,
  });
}

// Helper: Get listing rating stats
async function getListingRatingStats(listingId) {
  const result = await Review.aggregate([
    { $match: { listing: listingId, status: 'approved' } },
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' },
        total: { $sum: 1 },
      },
    },
  ]);

  return {
    average: result.length > 0 ? Math.round(result[0].average * 10) / 10 : 0,
    total: result.length > 0 ? result[0].total : 0,
  };
}