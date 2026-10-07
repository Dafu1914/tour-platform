const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  // Reference to the booking
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },

  // Reference to the listing
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },

  // Traveler who wrote the review
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Supplier receiving the review
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Rating (1-5)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },

  // Review text
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: 5,
    maxlength: 1000,
  },

  // Review status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  // Supplier response
  supplierResponse: {
    text: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
    },
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure one review per booking
ReviewSchema.index({ booking: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);