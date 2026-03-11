const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 140
  },
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  readAt: {
    type: Date
  },
  threadId: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);


