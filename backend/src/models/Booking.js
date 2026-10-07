const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Reference to the listing
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },

  // Traveler (who booked)
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Supplier (owner of the listing)
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Booking Details
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'ETB',
  },

  // Date & Time
  bookingDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    default: '',
  },
  endTime: {
    type: String,
    default: '',
  },

  // Special Requests
  specialRequests: {
    type: String,
    default: '',
  },

  // Contact Info
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'],
    default: 'pending',
  },

  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['chapa', 'telebirr', 'stripe', 'cash'],
    default: 'cash',
  },
  paymentId: {
    type: String,
    default: '',
  },

  // Cancellation
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  refundAmount: {
    type: Number,
    default: 0,
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

module.exports = mongoose.model('Booking', BookingSchema);