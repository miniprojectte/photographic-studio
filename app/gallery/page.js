'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { uploadAPI } from '../utils/api';

const categories = [
  { id: 'all', name: 'All Work' },
  { id: 'portrait', name: 'Portrait' },
  { id: 'wedding', name: 'Wedding' },
  { id: 'family', name: 'Family' },
  { id: 'event', name: 'Event' },
  { id: 'commercial', name: 'Commercial' }
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadGallery();
  }, [selectedCategory]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await uploadAPI.getGallery(params);
      setPhotos(response.data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      // Fallback to empty array if API fails
      setPhotos([]);
    } finally {
      setLoading(false);
    }
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

  return (
    <main className="min-h-screen text-white relative bg-[#0D0D0D]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#C45D3E]/10 border border-[#C45D3E]/20 rounded-full text-[#C45D3E] text-sm font-medium mb-6">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Captured </span>
              <span className="text-gradient-warm">Moments</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Browse through our collection of stunning photographs that tell unique stories.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white shadow-lg shadow-[#C45D3E]/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {photos.map((photo, index) => (
                <motion.div
                  key={photo._id}
                  className="relative aspect-square group overflow-hidden rounded-xl cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedPhoto(photo)}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={photo.thumbnailUrl || photo.secureUrl}
                    alt={photo.title || 'Gallery photo'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {photo.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-medium truncate">{photo.title}</p>
                      <p className="text-white/50 text-sm capitalize">{photo.category}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Filter className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Photos Yet</h3>
              <p className="text-white/50">
                {selectedCategory !== 'all'
                  ? `No photos in the ${selectedCategory} category yet.`
                  : 'Our gallery is being updated. Check back soon!'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            {photos.length > 1 && (
              <>
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
              </>
            )}

            {/* Image */}
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

            {/* Photo Info */}
            {selectedPhoto.title && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                <p className="text-white font-medium">{selectedPhoto.title}</p>
                <p className="text-white/50 text-sm capitalize">{selectedPhoto.category}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <motion.div
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-[#C45D3E]/20 to-[#D4A853]/10 border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Your Story?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-2xl mx-auto">
            Let's capture your special moments with the same artistry and passion.
          </p>
          <a
            href="/booking"
            className="inline-flex px-8 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 hover:shadow-xl hover:shadow-[#C45D3E]/30 transition-all"
          >
            Book Your Session
          </a>
        </motion.div>
      </section>
    </main>
  );
}