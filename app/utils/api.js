// API utility for consistent fetch requests
const API_BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for CORS
  };

  // Merge options with defaults
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Add authorization token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Specific API functions
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  getUsers: () => apiRequest('/auth/users'),
};

export const sessionsAPI = {
  getUserSessions: () => apiRequest('/sessions/user'),
  // Admin endpoints
  getAdminStats: () => apiRequest('/sessions/admin/stats'),
  getAllSessions: (params = '') => apiRequest(`/sessions/admin/all${params}`),
  updateSessionStatus: (id, status) => apiRequest(`/sessions/admin/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  createSession: (data) => apiRequest('/sessions/admin', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSession: (id, data) => apiRequest(`/sessions/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteSession: (id) => apiRequest(`/sessions/admin/${id}`, {
    method: 'DELETE',
  }),
  createFromBooking: (bookingId, data) => apiRequest(`/sessions/admin/from-booking/${bookingId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const profileAPI = {
  getProfile: () => apiRequest('/profile/me'),
  updateProfile: (data) => apiRequest('/profile/update', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export const photosAPI = {
  getPhotos: () => apiRequest('/photos'),
};

export const bookingsAPI = {
  getUserBookings: () => apiRequest('/bookings/user'),
  getMyBookings: (params = '') => apiRequest(`/bookings/my-bookings${params}`),
  getAllBookings: (params = '') => apiRequest(`/bookings/all${params}`),
  getBooking: (id) => apiRequest(`/bookings/${id}`),
  createBooking: (data) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateBooking: (id, data) => apiRequest(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateBookingStatus: (id, status) => apiRequest(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  deleteBooking: (id) => apiRequest(`/bookings/${id}`, {
    method: 'DELETE',
  }),
  getStats: () => apiRequest('/bookings/stats'),
  getTodayBookings: () => apiRequest('/bookings/today'),
};

export const messagesAPI = {
  getMyMessages: () => apiRequest('/messages/me'),
  sendToAdmin: (payload) => apiRequest('/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  markRead: (id) => apiRequest(`/messages/${id}/read`, {
    method: 'POST',
  }),
  // Admin
  getAll: () => apiRequest('/messages/admin'),
  adminReply: (payload) => apiRequest('/messages/admin/reply', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

// Upload API for Cloudinary
export const uploadAPI = {
  // Upload single image
  uploadImage: async (file, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (metadata.title) formData.append('title', metadata.title);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.category) formData.append('category', metadata.category);
      if (metadata.isPublic !== undefined) formData.append('isPublic', metadata.isPublic.toString());
      if (metadata.tags) formData.append('tags', metadata.tags);
      if (metadata.assignToUser) formData.append('assignToUser', metadata.assignToUser);

      const token = localStorage.getItem('token');

      console.log('Uploading image to:', `${API_BASE_URL}/upload/image`);
      console.log('File:', file.name, file.type, file.size, 'bytes');
      console.log('Token exists:', !!token);

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          errorMessage = `Upload failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('Upload error details:', error);
      throw error;
    }
  },

  // Upload multiple images
  uploadImages: async (files, metadata = {}) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    if (metadata.category) formData.append('category', metadata.category);
    if (metadata.isPublic !== undefined) formData.append('isPublic', metadata.isPublic.toString());
    if (metadata.assignToUser) formData.append('assignToUser', metadata.assignToUser);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  // Upload video
  uploadVideo: async (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('video', file);
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.category) formData.append('category', metadata.category);
    if (metadata.isPublic !== undefined) formData.append('isPublic', metadata.isPublic.toString());

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  // Get user's photos
  getMyPhotos: (params = '') => apiRequest(`/upload/my-photos${params}`),

  // Get public gallery
  getGallery: (params = '') => apiRequest(`/upload/gallery${params}`),

  // Delete photo
  deletePhoto: (id) => apiRequest(`/upload/${id}`, { method: 'DELETE' }),

  // Toggle favorite
  toggleFavorite: (id) => apiRequest(`/upload/${id}/favorite`, { method: 'PATCH' }),

  // Admin: Get all photos
  adminGetAll: (params = '') => apiRequest(`/upload/admin/all${params}`),
};

export const reportsAPI = {
  getMonthlyReport: (year, month) => apiRequest(`/reports/monthly?year=${year}&month=${month}`),
  getYearlyReport: (year) => apiRequest(`/reports/yearly?year=${year}`),
};
