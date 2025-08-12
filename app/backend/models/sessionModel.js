const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    required: true,
    enum: ['Wedding', 'Portrait', 'Family', 'Event', 'Commercial']
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  price: {
    type: Number,
    required: true
  },
  notes: String,
  reminders: [{
    date: Date,
    message: String,
    sent: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
