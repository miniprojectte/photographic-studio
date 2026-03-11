const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  getTodayBookings
} = require('../controllers/bookingController');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

// Create booking (can be public or authenticated)
router.post('/', async (req, res) => {
  try {
    const bookingData = { ...req.body };
    
    // Check if user is authenticated (optional)
    const token = req.headers.authorization;
    if (token && token.startsWith('Bearer')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          bookingData.user = user._id;
        }
      } catch (err) {
        // Token invalid, continue as guest booking
      }
    }
    
    const booking = await Booking.create(bookingData);
    await booking.populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get user's bookings (protected) - alias for dashboard
router.get('/user', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      $or: [
        { user: req.user.id },
        { email: req.user.email } // Also match by email for guest bookings
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10);
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user bookings',
      error: error.message
    });
  }
});

// Get user's bookings (protected)
router.get('/my-bookings', protect, getUserBookings);

// Get all bookings (admin only)
router.get('/all', protect, getAllBookings);

// Get today's bookings
router.get('/today', protect, getTodayBookings);

// Get booking statistics (admin only)
router.get('/stats', protect, getBookingStats);

// Get single booking
router.get('/:id', protect, getBooking);

// Update booking status (admin only)
router.patch('/:id/status', protect, updateBookingStatus);

// Update booking
router.put('/:id', protect, updateBooking);

// Delete booking
router.delete('/:id', protect, deleteBooking);

module.exports = router;

