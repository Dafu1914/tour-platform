const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  // Reference to the user who created the listing
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Basic Info
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    enum: ['tour', 'accommodation', 'transport', 'experience'],
    required: true,
  },

  // Location
  destination: {
    type: String,
    required: [true, 'Destination is required'],
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
  },
  address: {
    type: String,
  },
  locationCoordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },

  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  pricePer: {
    type: String,
    enum: ['person', 'group', 'room', 'night'],
    default: 'person',
  },
  currency: {
    type: String,
    default: 'ETB',
  },

  // Duration
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
  durationUnit: {
    type: String,
    enum: ['hours', 'days', 'nights'],
    default: 'days',
  },

  // Capacity
  minGuests: {
    type: Number,
    default: 1,
  },
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
  },

  // Availability
  availability: {
    type: String,
    enum: ['always', 'custom', 'seasonal'],
    default: 'always',
  },
  availableDates: [{
    start: Date,
    end: Date,
  }],
  unavailableDates: [Date],

  // Features & Inclusions
  inclusions: [String],
  exclusions: [String],
  amenities: [String],
  activities: [String],

  // Media
  images: [String],
  coverImage: {
    type: String,
    default: '',
  },
  video: {
    type: String,
    default: '',
  },

  // Booking Settings
  bookingType: {
    type: String,
    enum: ['instant', 'request'],
    default: 'request',
  },
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate',
  },
  cancellationDeadline: {
    type: Number, // hours before booking
    default: 24,
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'paused', 'rejected'],
    default: 'pending',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },

  // Verification
  isVerified: {
    type: Boolean,
    default: false,
  },

  // Statistics
  views: {
    type: Number,
    default: 0,
  },
  bookings: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
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

// Index for search
ListingSchema.index({ title: 'text', description: 'text', destination: 'text' });

module.exports = mongoose.model('Listing', ListingSchema);