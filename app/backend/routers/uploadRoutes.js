const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadImage, uploadVideo, deleteFromCloudinary, getThumbnailUrl } = require('../config/cloudinary');
const Photo = require('../models/photoModel');

// Upload single image
router.post('/image', protect, (req, res, next) => {
    uploadImage.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary error:', err);
            return res.status(400).json({ 
                success: false, 
                message: err.message || 'Error uploading file'
            });
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log('=== Upload Debug ===');
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        console.log('req.user:', req.user ? { id: req.user._id, email: req.user.email } : 'undefined');
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        const { title, description, category, isPublic, tags, assignToUser } = req.body;

        // Determine which user to assign the photo to
        const photoUser = assignToUser || req.user._id;

        // Cloudinary returns public_id in filename property or directly as public_id
        const publicId = req.file.filename || req.file.public_id;
        
        if (!publicId) {
            console.error('No public_id found in upload response:', JSON.stringify(req.file, null, 2));
            return res.status(500).json({ success: false, message: 'Upload failed - no public ID received' });
        }

        const photo = await Photo.create({
            user: photoUser,
            publicId: publicId,
            url: req.file.path,
            secureUrl: req.file.path,
            thumbnailUrl: getThumbnailUrl(publicId),
            resourceType: 'image',
            format: req.file.format || 'jpg',
            title: title || '',
            description: description || '',
            category: category || 'other',
            isPublic: isPublic === 'true',
            tags: tags ? tags.split(',').map(t => t.trim()) : []
        });

        console.log('Photo created successfully:', photo._id);

        res.status(201).json({
            success: true,
            data: photo
        });
    } catch (error) {
        console.error('Upload error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: error.message || 'Error uploading image' });
    }
});

// Upload multiple images
router.post('/images', protect, uploadImage.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No image files provided' });
        }

        const { category, isPublic, assignToUser } = req.body;
        const photos = [];

        // Determine which user to assign photos to
        const photoUser = assignToUser || req.user._id;

        for (const file of req.files) {
            const publicId = file.filename || file.public_id;
            
            if (!publicId) {
                console.error('No public_id found in file:', file);
                continue;
            }

            const photo = await Photo.create({
                user: photoUser,
                publicId: publicId,
                url: file.path,
                secureUrl: file.path,
                thumbnailUrl: getThumbnailUrl(publicId),
                resourceType: 'image',
                format: file.format || 'jpg',
                category: category || 'other',
                isPublic: isPublic === 'true'
            });
            photos.push(photo);
        }

        res.status(201).json({
            success: true,
            count: photos.length,
            data: photos
        });
    } catch (error) {
        console.error('Upload error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: error.message || 'Error uploading images' });
    }
});

// Upload video
router.post('/video', protect, uploadVideo.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No video file provided' });
        }

        const { title, description, category, isPublic } = req.body;
        
        const publicId = req.file.filename || req.file.public_id;
        
        if (!publicId) {
            console.error('No public_id found in upload response:', req.file);
            return res.status(500).json({ success: false, message: 'Upload failed - no public ID received' });
        }

        const photo = await Photo.create({
            user: req.user._id,
            publicId: publicId,
            url: req.file.path,
            secureUrl: req.file.path,
            resourceType: 'video',
            format: req.file.format || 'mp4',
            title: title || '',
            description: description || '',
            category: category || 'other',
            isPublic: isPublic === 'true'
        });

        res.status(201).json({
            success: true,
            data: photo
        });
    } catch (error) {
        console.error('Upload error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: error.message || 'Error uploading video' });
    }
});

// Get user's photos
router.get('/my-photos', protect, async (req, res) => {
    try {
        const { category, resourceType, page = 1, limit = 20 } = req.query;

        const query = { user: req.user._id };
        if (category) query.category = category;
        if (resourceType) query.resourceType = resourceType;

        const photos = await Photo.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Photo.countDocuments(query);

        res.json({
            success: true,
            data: photos,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Get public gallery photos
router.get('/gallery', async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query;

        const query = { isPublic: true, resourceType: 'image' };
        if (category && category !== 'all') query.category = category;

        const photos = await Photo.find(query)
            .select('secureUrl thumbnailUrl title category createdAt')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Photo.countDocuments(query);

        res.json({
            success: true,
            data: photos,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Delete photo
router.delete('/:id', protect, async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ success: false, message: 'Photo not found' });
        }

        // Check ownership or admin
        if (photo.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(photo.publicId, photo.resourceType);

        // Delete from database
        await Photo.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: 'Error deleting photo' });
    }
});

// Toggle favorite
router.patch('/:id/favorite', protect, async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ success: false, message: 'Photo not found' });
        }

        if (photo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        photo.isFavorite = !photo.isFavorite;
        await photo.save();

        res.json({ success: true, data: photo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Admin: Get all photos
router.get('/admin/all', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { category, resourceType, page = 1, limit = 20 } = req.query;

        const query = {};
        if (category) query.category = category;
        if (resourceType) query.resourceType = resourceType;

        const photos = await Photo.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Photo.countDocuments(query);

        res.json({
            success: true,
            data: photos,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
