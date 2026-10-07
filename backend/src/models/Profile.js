const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One profile per user
  },

  // Role-specific fields (stored as mixed/JSON)
  roleData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Common Profile Fields
  bio: {
    type: String,
    default: '',
  },
  languages: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    default: '',
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  website: {
    type: String,
    default: '',
  },
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },

  // Verification Documents
  documents: {
    idCard: { type: String, default: '' },
    license: { type: String, default: '' },
    certificate: { type: String, default: '' },
    other: { type: String, default: '' },
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

module.exports = mongoose.model('Profile', ProfileSchema);