// models/bookingModel.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow bookings from non-registered users
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+91[\s-]?)?[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  sessionType: {
    type: String,
    required: [true, 'Session type is required'],
    enum: ['portrait', 'wedding', 'family', 'event', 'commercial'],
    lowercase: true
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required'],
    validate: {
      validator: function (v) {
        return v > new Date();
      },
      message: 'Booking date must be in the future'
    }
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String,   // Razorpay payment_id (e.g. pay_xxxxx)
    default: null
  },
  orderId: {
    type: String,   // Razorpay order_id (e.g. order_xxxxx)
    default: null
  },
  amount: {
    type: Number,   // Booking price in INR
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
