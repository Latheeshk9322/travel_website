import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  },
};

// Places API
export const placesAPI = {
  getAll: async (params) => {
    const response = await api.get('/places', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/places/${id}`);
    return response.data;
  },
  getPackages: async (id, location = 'Karnataka') => {
    const response = await api.get(`/places/${id}/packages`, { 
      params: { location } 
    });
    return response.data;
  },
  getFeatured: async () => {
    const response = await api.get('/places/featured');
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/places/categories');
    return response.data;
  },
  create: async (placeData) => {
    const response = await api.post('/places', placeData);
    return response.data;
  },
  update: async (id, placeData) => {
    const response = await api.put(`/places/${id}`, placeData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/places/${id}`);
    return response.data;
  },
  toggleFeature: async (id) => {
    const response = await api.post(`/admin/places/${id}/feature`);
    return response.data;
  },
};

// Packages API
export const packagesAPI = {
  getAll: async (params) => {
    const response = await api.get('/packages', { params });
    return response.data;
  },
  getById: async (id, location = 'Karnataka') => {
    const response = await api.get(`/packages/${id}`, { 
      params: { location } 
    });
    return response.data;
  },
  getFeatured: async (location = 'Karnataka') => {
    const response = await api.get('/packages/featured', { 
      params: { location } 
    });
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/packages/categories');
    return response.data;
  },
  create: async (packageData) => {
    const response = await api.post('/packages', packageData);
    return response.data;
  },
  update: async (id, packageData) => {
    const response = await api.put(`/packages/${id}`, packageData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },
  addDiscount: async (id, discountData) => {
    const response = await api.post(`/packages/${id}/discounts`, discountData);
    return response.data;
  },
  updateDiscount: async (id, discountId, discountData) => {
    const response = await api.put(`/packages/${id}/discounts/${discountId}`, discountData);
    return response.data;
  },
  removeDiscount: async (id, discountId) => {
    const response = await api.delete(`/packages/${id}/discounts/${discountId}`);
    return response.data;
  },
  toggleFeature: async (id) => {
    const response = await api.post(`/admin/packages/${id}/feature`);
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getAll: async (params) => {
    const response = await api.get('/reviews', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },
  getByUser: async (userId, params) => {
    const response = await api.get(`/reviews/user/${userId}`, { params });
    return response.data;
  },
  create: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  update: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
  markHelpful: async (id, helpful) => {
    const response = await api.post(`/reviews/${id}/helpful`, { helpful });
    return response.data;
  },
  moderate: async (id, moderationData) => {
    const response = await api.put(`/reviews/${id}/moderate`, moderationData);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  getFavorites: async () => {
    const response = await api.get('/users/favorites');
    return response.data;
  },
  addToFavorites: async (placeId) => {
    const response = await api.post(`/users/favorites/${placeId}`);
    return response.data;
  },
  removeFromFavorites: async (placeId) => {
    const response = await api.delete(`/users/favorites/${placeId}`);
    return response.data;
  },
  updateNotifications: async (notifications) => {
    const response = await api.put('/users/notifications', { notifications });
    return response.data;
  },
  // Admin only
  getAll: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/users/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  getPlaces: async (params) => {
    const response = await api.get('/admin/places', { params });
    return response.data;
  },
  getPackages: async (params) => {
    const response = await api.get('/admin/packages', { params });
    return response.data;
  },
  getReviews: async (params) => {
    const response = await api.get('/admin/reviews', { params });
    return response.data;
  },
  createPackage: async (packageData) => {
    const response = await api.post('/admin/packages', packageData);
    return response.data;
  },
  updatePackage: async (id, packageData) => {
    const response = await api.put(`/admin/packages/${id}`, packageData);
    return response.data;
  },
  deletePackage: async (id) => {
    const response = await api.delete(`/admin/packages/${id}`);
    return response.data;
  },
  togglePackageFeature: async (id) => {
    const response = await api.post(`/admin/packages/${id}/feature`);
    return response.data;
  },
  approveReview: async (id) => {
    const response = await api.put(`/admin/reviews/${id}/approve`);
    return response.data;
  },
  rejectReview: async (id) => {
    const response = await api.put(`/admin/reviews/${id}/reject`);
    return response.data;
  },
  togglePlaceStatus: async (id) => {
    const response = await api.put(`/admin/places/${id}/toggle`);
    return response.data;
  },
  getPendingReviews: async (params) => {
    const response = await api.get('/admin/reviews/pending', { params });
    return response.data;
  },
  getReviewStats: async () => {
    const response = await api.get('/admin/reviews/stats');
    return response.data;
  },
  getPlaceStats: async () => {
    const response = await api.get('/admin/places/stats');
    return response.data;
  },
  getPackageStats: async () => {
    const response = await api.get('/admin/packages/stats');
    return response.data;
  },
  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },
  createPlace: async (placeData) => {
    const response = await api.post('/admin/places', placeData);
    return response.data;
  },
};

// File upload helper
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },
  createStripePaymentIntent: async (bookingId) => {
    const response = await api.post(`/bookings/${bookingId}/stripe-payment-intent`);
    return response.data;
  },
  payBooking: async (bookingId, paymentData) => {
    const response = await api.post(`/bookings/${bookingId}/payment`, paymentData);
    return response.data;
  },
  getUserBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
};

export default api; 