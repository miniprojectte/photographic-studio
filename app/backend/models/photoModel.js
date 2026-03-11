const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  // User who uploaded or owns the photo
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Optional session association
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  // Cloudinary fields
  publicId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  secureUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  // Resource type (image or video)
  resourceType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  // File info
  format: String,
  width: Number,
  height: Number,
  bytes: Number,
  duration: Number, // For videos
  // Metadata
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  tags: [String],
  // Organization
  category: {
    type: String,
    enum: ['portrait', 'wedding', 'family', 'event', 'commercial', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  // Camera metadata
  metadata: {
    camera: String,
    lens: String,
    shutterSpeed: String,
    aperture: String,
    iso: String,
    takenAt: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
photoSchema.index({ user: 1, category: 1 });
photoSchema.index({ isPublic: 1, category: 1 });

module.exports = mongoose.model('Photo', photoSchema);
