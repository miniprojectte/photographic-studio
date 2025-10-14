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
  getAdminStats: () => apiRequest('/sessions/admin/stats'),
  getAllSessions: (params = '') => apiRequest(`/sessions/admin${params}`),
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
  getStats: () => apiRequest('/bookings/stats'),
  createBooking: (data) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};