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
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Places API
export const placesAPI = {
  getAll: (params) => api.get('/places', { params }),
  getById: (id) => api.get(`/places/${id}`),
  getFeatured: () => api.get('/places/featured'),
  getCategories: () => api.get('/places/categories'),
  create: (placeData) => api.post('/places', placeData),
  update: (id, placeData) => api.put(`/places/${id}`, placeData),
  delete: (id) => api.delete(`/places/${id}`),
  toggleFeature: (id) => api.post(`/admin/places/${id}/feature`),
};

// Packages API
export const packagesAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
  getFeatured: () => api.get('/packages/featured'),
  getCategories: () => api.get('/packages/categories'),
  create: (packageData) => api.post('/packages', packageData),
  update: (id, packageData) => api.put(`/packages/${id}`, packageData),
  delete: (id) => api.delete(`/packages/${id}`),
  addDiscount: (id, discountData) => api.post(`/packages/${id}/discounts`, discountData),
  updateDiscount: (id, discountId, discountData) =>
    api.put(`/packages/${id}/discounts/${discountId}`, discountData),
  removeDiscount: (id, discountId) => api.delete(`/packages/${id}/discounts/${discountId}`),
  toggleFeature: (id) => api.post(`/admin/packages/${id}/feature`),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  getByUser: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id, helpful) => api.post(`/reviews/${id}/helpful`, { helpful }),
  moderate: (id, moderationData) => api.put(`/reviews/${id}/moderate`, moderationData),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getFavorites: () => api.get('/users/favorites'),
  addToFavorites: (placeId) => api.post(`/users/favorites/${placeId}`),
  removeFromFavorites: (placeId) => api.delete(`/users/favorites/${placeId}`),
  updateNotifications: (notifications) => api.put('/users/notifications', { notifications }),
  // Admin only
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPendingReviews: (params) => api.get('/admin/reviews/pending', { params }),
  getReviewStats: () => api.get('/admin/reviews/stats'),
  getPlaceStats: () => api.get('/admin/places/stats'),
  getPackageStats: () => api.get('/admin/packages/stats'),
  getUserStats: () => api.get('/admin/users/stats'),
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

export default api; 