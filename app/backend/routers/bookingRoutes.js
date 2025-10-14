const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
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

// Get user's bookings (protected)
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const { status, sessionType, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;
    if (sessionType) query.sessionType = sessionType;

    const skip = (page - 1) * limit;
    
    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get all bookings (admin only)
router.get('/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { status, sessionType, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (sessionType) query.sessionType = sessionType;

    const skip = (page - 1) * limit;
    
    const bookings = await Booking.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get booking statistics (admin only)
router.get('/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const stats = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      User.countDocuments(),
      User.countDocuments({ role: 'admin' })
    ]);

    res.json({
      success: true,
      data: {
        totalBookings: stats[0],
        pendingBookings: stats[1],
        confirmedBookings: stats[2],
        completedBookings: stats[3],
        cancelledBookings: stats[4],
        totalUsers: stats[5],
        totalAdmins: stats[6]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;

