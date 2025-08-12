const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  title: String,
  description: String,
  isFavorite: {
    type: Boolean,
    default: false
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
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

module.exports = mongoose.model('Photo', photoSchema);
