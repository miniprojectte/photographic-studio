// Cloudinary Configuration
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage configuration for images
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mn-studio/photos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'tiff', 'svg'],
        transformation: [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto' }]
    }
});

// Storage configuration for videos
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mn-studio/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'webm']
    }
});

// Multer upload middleware
const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

// Helper to get optimized URL
const getOptimizedUrl = (publicId, options = {}) => {
    const defaultOptions = {
        fetch_format: 'auto',
        quality: 'auto'
    };
    return cloudinary.url(publicId, { ...defaultOptions, ...options });
};

// Helper to get thumbnail URL
const getThumbnailUrl = (publicId, width = 300, height = 300) => {
    return cloudinary.url(publicId, {
        width,
        height,
        crop: 'fill',
        fetch_format: 'auto',
        quality: 'auto'
    });
};

module.exports = {
    cloudinary,
    uploadImage,
    uploadVideo,
    deleteFromCloudinary,
    getOptimizedUrl,
    getThumbnailUrl
};
