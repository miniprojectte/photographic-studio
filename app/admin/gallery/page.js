'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { uploadAPI } from '@/app/utils/api';
import {
    ArrowLeft,
    Grid,
    LayoutGrid,
    Heart,
    Download,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    Upload,
    Image as ImageIcon,
    Video,
    Loader2,
    RefreshCw,
    Plus,
    Filter,
    Eye,
    EyeOff
} from 'lucide-react';

const categories = [
    { value: 'all', label: 'All' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'family', label: 'Family' },
    { value: 'event', label: 'Event' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'other', label: 'Other' }
];

export default function AdminGallery() {
    const router = useRouter();
    const [photos, setPhotos] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gridSize, setGridSize] = useState('medium');
    const [category, setCategory] = useState('all');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadData, setUploadData] = useState({
        category: 'portrait',
        isPublic: true,
        title: '',
        description: '',
        assignToUser: ''
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadPhotos();
        loadUsers();
    }, [category]);

    const loadUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data || []);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadPhotos = async () => {
        try {
            setLoading(true);
            const params = category !== 'all' ? `?category=${category}` : '';
            const response = await uploadAPI.adminGetAll(params);
            setPhotos(response.data || []);
        } catch (error) {
            console.error('Error loading photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);

        try {
            if (files.length === 1) {
                await uploadAPI.uploadImage(files[0], {
                    title: uploadData.title,
                    description: uploadData.description,
                    category: uploadData.category,
                    isPublic: uploadData.isPublic,
                    assignToUser: uploadData.assignToUser
                });
            } else {
                await uploadAPI.uploadImages(files, {
                    category: uploadData.category,
                    isPublic: uploadData.isPublic,
                    assignToUser: uploadData.assignToUser
                });
            }

            await loadPhotos();
            setShowUpload(false);
            setUploadData({ category: 'portrait', isPublic: true, title: '', description: '', assignToUser: '' });
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.message || 'Failed to upload');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (photoId) => {
        if (!confirm('Are you sure you want to delete this photo?')) return;

        try {
            await uploadAPI.deletePhoto(photoId);
            setPhotos(photos.filter(p => p._id !== photoId));
            if (selectedPhoto?._id === photoId) {
                setSelectedPhoto(null);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete photo');
        }
    };

    const getGridClass = () => {
        switch (gridSize) {
            case 'small': return 'grid-cols-4 md:grid-cols-6';
            case 'large': return 'grid-cols-1 md:grid-cols-2';
            default: return 'grid-cols-2 md:grid-cols-4';
        }
    };

    const stats = {
        total: photos.length,
        public: photos.filter(p => p.isPublic).length,
        images: photos.filter(p => p.resourceType === 'image').length,
        videos: photos.filter(p => p.resourceType === 'video').length
    };

    if (loading) {
        return (
            <AdminProtection>
                <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
                        <p className="text-white/50">Loading gallery...</p>
                    </div>
                </div>
            </AdminProtection>
        );
    }

    return (
        <AdminProtection>
            <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-hidden">
                {/* Background Glow Effects */}
                <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <div
                        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(196,93,62,0.4) 0%, rgba(196,93,62,0) 70%)' }}
                    />
                    <div
                        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.35) 0%, rgba(212,168,83,0) 70%)' }}
                    />
                </div>

                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back to Admin</span>
                            </Link>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={loadPhotos}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Refresh"
                                >
                                    <RefreshCw className="w-4 h-4 text-white/50" />
                                </button>
                                <div className="flex bg-white/5 rounded-lg p-1">
                                    <button
                                        onClick={() => setGridSize('small')}
                                        className={`p-2 rounded transition-colors ${gridSize === 'small' ? 'bg-[#C45D3E] text-white' : 'text-white/50'}`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setGridSize('medium')}
                                        className={`p-2 rounded transition-colors ${gridSize === 'medium' ? 'bg-[#C45D3E] text-white' : 'text-white/50'}`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Title & Stats */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Media Gallery</h1>
                                <p className="text-white/50">Manage all uploaded photos and videos</p>
                            </div>
                            <button
                                onClick={() => setShowUpload(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#C45D3E]/20 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Upload
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: 'Total', value: stats.total, icon: ImageIcon, color: 'white' },
                                { label: 'Public', value: stats.public, icon: Eye, color: '#22c55e' },
                                { label: 'Images', value: stats.images, icon: ImageIcon, color: '#C45D3E' },
                                { label: 'Videos', value: stats.videos, icon: Video, color: '#D4A853' }
                            ].map((stat) => (
                                <div key={stat.label} className="p-4 rounded-xl bg-[#161616] border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                                        <span className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
                                    </div>
                                    <p className="text-sm text-white/40">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        className="flex gap-2 mb-6 overflow-x-auto pb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setCategory(cat.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${category === cat.value
                                    ? 'bg-[#C45D3E] text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>

                    {/* Upload Modal */}
                    <AnimatePresence>
                        {showUpload && (
                            <motion.div
                                className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => !uploading && setShowUpload(false)}
                            >
                                <motion.div
                                    className="bg-[#161616] rounded-2xl border border-white/10 p-8 max-w-lg w-full"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-white">Upload Media</h2>
                                        <button
                                            onClick={() => !uploading && setShowUpload(false)}
                                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            disabled={uploading}
                                        >
                                            <X className="w-5 h-5 text-white/50" />
                                        </button>
                                    </div>

                                    {/* Upload Options */}
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-2">Title (optional)</label>
                                            <input
                                                type="text"
                                                value={uploadData.title}
                                                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                                placeholder="Photo title..."
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
                                            <select
                                                value={uploadData.category}
                                                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C45D3E]"
                                            >
                                                {categories.filter(c => c.value !== 'all').map((cat) => (
                                                    <option key={cat.value} value={cat.value} className="bg-[#161616]">
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/60 mb-2">Assign to User (optional)</label>
                                            <select
                                                value={uploadData.assignToUser}
                                                onChange={(e) => setUploadData({ ...uploadData, assignToUser: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C45D3E]"
                                            >
                                                <option value="" className="bg-[#161616]">Admin Only</option>
                                                {users.map((user) => (
                                                    <option key={user._id} value={user._id} className="bg-[#161616]">
                                                        {user.name} ({user.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setUploadData({ ...uploadData, isPublic: !uploadData.isPublic })}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${uploadData.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/50'
                                                    }`}
                                            >
                                                {uploadData.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                {uploadData.isPublic ? 'Public' : 'Private'}
                                            </button>
                                        </div>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        disabled={uploading}
                                    />

                                    {uploading ? (
                                        <div className="text-center py-8">
                                            <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#C45D3E] animate-spin" />
                                            <p className="text-white font-medium">Uploading to Cloudinary...</p>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-[#C45D3E]/50 hover:bg-[#C45D3E]/5 transition-all"
                                        >
                                            <Upload className="w-10 h-10 mx-auto mb-3 text-[#C45D3E]" />
                                            <p className="text-white font-medium mb-1">Click to select files</p>
                                            <p className="text-white/30 text-sm">Images & Videos • Max 100MB</p>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Photos Grid */}
                    {photos.length > 0 ? (
                        <motion.div
                            className={`grid gap-4 ${getGridClass()}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {photos.map((photo, index) => (
                                <motion.div
                                    key={photo._id}
                                    className="relative aspect-square group overflow-hidden rounded-xl bg-[#161616] cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    onClick={() => setSelectedPhoto(photo)}
                                >
                                    <img
                                        src={photo.thumbnailUrl || photo.secureUrl || photo.url}
                                        alt={photo.title || 'Photo'}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Badges */}
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {photo.isPublic ? (
                                            <span className="px-2 py-1 bg-green-500/80 text-white text-xs font-medium rounded">Public</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-white/30 text-white text-xs font-medium rounded">Private</span>
                                        )}
                                        <span className="px-2 py-1 bg-black/50 text-white text-xs rounded capitalize">{photo.category}</span>
                                    </div>

                                    {photo.resourceType === 'video' && (
                                        <div className="absolute top-2 right-2">
                                            <Video className="w-5 h-5 text-white" />
                                        </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white text-sm truncate">{photo.user?.name || 'Unknown'}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(photo._id); }}
                                                className="p-2 bg-red-500/50 backdrop-blur-sm rounded-full hover:bg-red-500/70 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                                <ImageIcon className="w-10 h-10 text-white/20" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Media Found</h3>
                            <p className="text-white/50 mb-6">
                                {category !== 'all' ? 'No photos in this category' : 'Upload your first media files'}
                            </p>
                            <button
                                onClick={() => setShowUpload(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl transition-all"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Media
                            </button>
                        </div>
                    )}

                    {/* Lightbox */}
                    <AnimatePresence>
                        {selectedPhoto && (
                            <motion.div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedPhoto(null)}
                            >
                                <button
                                    onClick={() => setSelectedPhoto(null)}
                                    className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-10"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>

                                <motion.div
                                    className="max-w-[90vw] max-h-[85vh]"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {selectedPhoto.resourceType === 'video' ? (
                                        <video
                                            src={selectedPhoto.secureUrl || selectedPhoto.url}
                                            controls
                                            className="max-w-full max-h-[85vh] rounded-lg"
                                        />
                                    ) : (
                                        <img
                                            src={selectedPhoto.secureUrl || selectedPhoto.url}
                                            alt={selectedPhoto.title || 'Photo'}
                                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                                        />
                                    )}
                                </motion.div>

                                {/* Photo Info */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3">
                                    <div className="flex items-center gap-6 text-sm">
                                        <span className="text-white">{selectedPhoto.title || 'Untitled'}</span>
                                        <span className="text-white/50 capitalize">{selectedPhoto.category}</span>
                                        <span className="text-white/50">{selectedPhoto.user?.name}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(selectedPhoto._id); }}
                                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AdminProtection>
    );
}
