const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Photo = require('../models/photoModel');

// Get all photos for a user
router.get('/', protect, async (req, res) => {
  try {
    const photos = await Photo.find({ client: req.user.id })
      .populate('session', 'sessionType date')
      .sort('-createdAt');
    
    res.json({
      success: true,
      photos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching photos',
      error: error.message
    });
  }
});

// Toggle favorite status
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      client: req.user.id
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    photo.isFavorite = !photo.isFavorite;
    await photo.save();

    res.json({
      success: true,
      photo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling favorite',
      error: error.message
    });
  }
});

// Add comment to photo
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      client: req.user.id
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    const comment = {
      user: req.user.id,
      text: req.body.text
    };

    photo.comments.push(comment);
    await photo.save();

    res.json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

module.exports = router;
