const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Session = require('../models/sessionModel');

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

module.exports = router;
