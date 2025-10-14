const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Session = require('../models/sessionModel');
const User = require('../models/userModel');

// Get all sessions for a user
router.get('/', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ client: req.user.id });
    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
});

// Get user sessions (alias for dashboard)
router.get('/user', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ client: req.user.id })
      .sort({ date: -1 }) // Most recent first
      .limit(10); // Limit to 10 for dashboard
    
    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user sessions',
      error: error.message
    });
  }
});

// Create a new session
router.post('/', protect, async (req, res) => {
  try {
    const session = new Session({
      ...req.body,
      client: req.user.id
    });
    await session.save();
    
    res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
});

// Update a session
router.put('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, client: req.user.id },
      req.body,
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
});

// Delete a session
router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      client: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting session',
      error: error.message
    });
  }
});

// Admin Routes
// Get all sessions (admin only)
router.get('/admin/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.sessionType) filter.sessionType = req.query.sessionType;
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const total = await Session.countDocuments(filter);
    const sessions = await Session.find(filter)
      .populate('client', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: sessions,
      pagination: {
        page,
        limit,
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

// Get session statistics (admin only)
router.get('/admin/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const totalSessions = await Session.countDocuments({});
    const scheduledSessions = await Session.countDocuments({ status: 'Scheduled' });
    const inProgressSessions = await Session.countDocuments({ status: 'In Progress' });
    const completedSessions = await Session.countDocuments({ status: 'Completed' });
    const cancelledSessions = await Session.countDocuments({ status: 'Cancelled' });

    // Revenue calculation
    const revenueResult = await Session.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Upcoming sessions (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingSessions = await Session.countDocuments({
      status: 'Scheduled',
      date: { $gte: new Date(), $lte: nextWeek }
    });

    res.json({
      success: true,
      data: {
        totalSessions,
        scheduledSessions,
        inProgressSessions,
        completedSessions,
        cancelledSessions,
        totalRevenue,
        upcomingSessions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Update session status (admin only)
router.patch('/admin/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { status } = req.body;
    const validStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('client', 'name email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Admin create session
router.post('/admin', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const session = await Session.create(req.body);
    await session.populate('client', 'name email');

    res.status(201).json({
      success: true,
      data: session
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

// Admin update session
router.put('/admin/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
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

// Admin delete session
router.delete('/admin/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Create session from booking (admin only)
router.post('/admin/from-booking/:bookingId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const Booking = require('../models/bookingModel');
    const booking = await Booking.findById(req.params.bookingId).populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Map booking session type to session type
    const sessionTypeMapping = {
      'portrait': 'Portrait',
      'wedding': 'Wedding',
      'family': 'Family',
      'event': 'Event',
      'commercial': 'Commercial'
    };

    // Create session data from booking
    const sessionData = {
      client: booking.user || null,
      sessionType: sessionTypeMapping[booking.sessionType] || 'Portrait',
      date: booking.date,
      status: 'Scheduled',
      price: req.body.price || 0,
      location: req.body.location || {},
      notes: `Created from booking: ${booking.name} (${booking.email})\nPhone: ${booking.phone}\nMessage: ${booking.message || 'No message'}`
    };

    const session = await Session.create(sessionData);
    await session.populate('client', 'name email');

    // Update booking status to confirmed
    await Booking.findByIdAndUpdate(booking._id, { status: 'confirmed' });

    res.status(201).json({
      success: true,
      data: session,
      message: 'Session created from booking successfully'
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

module.exports = router;
