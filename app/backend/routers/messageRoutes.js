const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Helper to find first admin
async function getAdminUser() {
  return await User.findOne({ role: 'admin' });
}

// Create message from current user to admin
router.post('/', protect, async (req, res) => {
  try {
    const { subject, body } = req.body;
    if (!body || body.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message body is required' });
    }
    const admin = await getAdminUser();
    if (!admin) {
      return res.status(400).json({ success: false, message: 'No admin found' });
    }
    const message = await Message.create({
      sender: req.user._id,
      recipient: admin._id,
      subject: subject || '',
      body,
      threadId: `${req.user._id}-${admin._id}`
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get current user's messages (both sent and received)
router.get('/me', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    }).populate('sender', 'name email role').populate('recipient', 'name email role').sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Admin: list all user conversations
router.get('/admin', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const messages = await Message.find({}).populate('sender', 'name email role').populate('recipient', 'name email role').sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Admin reply to a user
router.post('/admin/reply', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const { toUserId, subject, body } = req.body;
    if (!toUserId || !body) {
      return res.status(400).json({ success: false, message: 'toUserId and body are required' });
    }
    const user = await User.findById(toUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const message = await Message.create({
      sender: req.user._id,
      recipient: user._id,
      subject: subject || '',
      body,
      threadId: `${user._id}-${req.user._id}`
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Mark message as read
router.post('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    // Only recipient can mark as read
    if (String(message.recipient) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }
    message.readAt = new Date();
    await message.save();
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;


