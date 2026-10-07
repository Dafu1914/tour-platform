const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Basic Info
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },

  // Role Selection
  role: {
    type: String,
    enum: [
      'traveler',
      'guide',
      'driver',
      'driver_guide',
      'tour_operator',
      'travel_agency',
      'accommodation',
      'cook',
      'admin',
      'super_admin'
    ],
    required: [true, 'Role is required'],
  },

  // Profile Image
  profileImage: {
    type: String,
    default: '',
  },

  // Verification Status
  isVerified: {
    type: Boolean,
    default: false,
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true,
  },

  // Registration & Annual Fee Tracking
  registrationFeePaid: {
    type: Boolean,
    default: false,
  },
  registrationFeePaidAt: {
    type: Date,
  },
  annualFeePaid: {
    type: Boolean,
    default: false,
  },
  annualFeeExpiry: {
    type: Date,
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
  // Let Mongoose handle timestamps automatically
  timestamps: true
});

// Remove the problematic pre-save middleware - Mongoose will handle timestamps with timestamps: true

module.exports = mongoose.model('User', UserSchema);