'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Loader2,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function DashboardGallery() {
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridSize, setGridSize] = useState('medium');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadPhotos();
  }, [router]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await uploadAPI.getMyPhotos();
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
    setUploadProgress(0);

    try {
      if (files.length === 1) {
        await uploadAPI.uploadImage(files[0], { category: 'portrait' });
      } else {
        await uploadAPI.uploadImages(files, { category: 'portrait' });
      }

      setUploadProgress(100);
      await loadPhotos();
      setShowUpload(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
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

  const handleToggleFavorite = async (photoId) => {
    try {
      await uploadAPI.toggleFavorite(photoId);
      setPhotos(photos.map(p =>
        p._id === photoId ? { ...p, isFavorite: !p.isFavorite } : p
      ));
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  const handleDownload = async (photo) => {
    window.open(photo.secureUrl || photo.url, '_blank');
  };

  const navigatePhoto = (direction) => {
    const currentIndex = photos.findIndex(p => p._id === selectedPhoto._id);
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    }
    setSelectedPhoto(photos[newIndex]);
  };

  const getGridClass = () => {
    switch (gridSize) {
      case 'small': return 'grid-cols-4 md:grid-cols-6';
      case 'large': return 'grid-cols-1 md:grid-cols-2';
      default: return 'grid-cols-2 md:grid-cols-3';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
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
        {/* Page Title */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Gallery</h1>
            <p className="text-white/50">{photos.length} photos</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#C45D3E]/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            Upload Photos
          </button>
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
                  <h2 className="text-xl font-bold text-white">Upload Photos</h2>
                  <button
                    onClick={() => !uploading && setShowUpload(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    disabled={uploading}
                  >
                    <X className="w-5 h-5 text-white/50" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />

                {uploading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#C45D3E] animate-spin" />
                    <p className="text-white font-medium mb-2">Uploading to Cloudinary...</p>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C45D3E] to-[#D4A853] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-[#C45D3E]/50 hover:bg-[#C45D3E]/5 transition-all"
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[#C45D3E]" />
                    <p className="text-white font-medium mb-2">Click to upload photos</p>
                    <p className="text-white/40 text-sm">or drag and drop files here</p>
                    <p className="text-white/30 text-xs mt-4">JPG, PNG, GIF, WEBP (max 10MB)</p>
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
            transition={{ delay: 0.1 }}
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo._id}
                className="relative aspect-square group overflow-hidden rounded-xl bg-[#161616] cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.thumbnailUrl || photo.secureUrl || photo.url}
                  alt={photo.title || 'Photo'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {photo.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Heart className="w-5 h-5 text-[#C45D3E] fill-[#C45D3E]" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleFavorite(photo._id); }}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${photo.isFavorite ? 'text-[#C45D3E] fill-[#C45D3E]' : 'text-white'}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(photo); }}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(photo._id); }}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-red-500/50 transition-colors"
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
            <h3 className="text-xl font-semibold text-white mb-2">No Photos Yet</h3>
            <p className="text-white/50 mb-6">Upload your first photos to get started</p>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload Photos
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

              <button
                onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
                className="absolute left-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
                className="absolute right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              <motion.div
                className="max-w-[90vw] max-h-[85vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedPhoto.secureUrl || selectedPhoto.url}
                  alt={selectedPhoto.title || 'Photo'}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
              </motion.div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleFavorite(selectedPhoto._id); }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Heart className={`w-5 h-5 ${selectedPhoto.isFavorite ? 'text-[#C45D3E] fill-[#C45D3E]' : 'text-white'}`} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(selectedPhoto); }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(selectedPhoto._id); }}
                  className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
