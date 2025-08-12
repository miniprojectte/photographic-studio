'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Download, Share2 } from 'lucide-react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/photos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (photoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/photos/${photoId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setPhotos(photos.map(photo => 
          photo._id === photoId 
            ? { ...photo, isFavorite: !photo.isFavorite }
            : photo
        ));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addComment = async (photoId, comment) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/photos/${photoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: comment })
      });
      
      const data = await response.json();
      if (data.success) {
        setPhotos(photos.map(photo =>
          photo._id === photoId
            ? { ...photo, comments: [...photo.comments, data.comment] }
            : photo
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Photo Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <motion.div
            key={photo._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative aspect-square">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              />
              <button
                onClick={() => toggleFavorite(photo._id)}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  photo.isFavorite ? 'bg-red-500' : 'bg-white'
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    photo.isFavorite ? 'text-white' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium">{photo.title}</h3>
              <p className="text-sm text-gray-600">{photo.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {photo.comments?.length || 0} comments
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden">
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-auto"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-white"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{selectedPhoto.title}</h2>
              <p className="text-gray-600 mb-4">{selectedPhoto.description}</p>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Comments</h3>
                <div className="space-y-2">
                  {selectedPhoto.comments?.map(comment => (
                    <div key={comment._id} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
