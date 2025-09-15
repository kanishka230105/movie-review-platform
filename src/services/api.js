import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, request, message } = error;
    
    let errorMessage = 'An unexpected error occurred';
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || 'Bad Request';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          // Clear auth data and redirect to login
          localStorage.removeItem('authData');
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = data.message || 'Resource not found';
          break;
        case 422:
          errorMessage = data.message || 'Validation error';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = data.message || `Server error (${status})`;
      }
    } else if (request) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else {
      errorMessage = message || 'An unexpected error occurred';
    }
    
    // Show error in console
    console.error('API Error:', errorMessage);
    
    return Promise.reject({
      ...error,
      message: errorMessage
    });
  }
);

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
  },
  
  // Movie endpoints
  movies: {
    getAll: (params) => api.get('/movies', { params }),
    getById: (id) => api.get(`/movies/${id}`),
    create: (movieData) => api.post('/movies', movieData),
    update: (id, movieData) => api.put(`/movies/${id}`, movieData),
    delete: (id) => api.delete(`/movies/${id}`),
    getTrending: () => api.get('/movies/trending'),
    getFeatured: () => api.get('/movies/featured'),
    getGenres: () => api.get('/movies/genres'),
    getYears: () => api.get('/movies/years'),
  },
  
  // Review endpoints
  reviews: {
    getMovieReviews: (movieId, params) => api.get(`/reviews/movie/${movieId}`, { params }),
    getUserReviews: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
    getStats: (movieId) => api.get(`/reviews/stats/${movieId}`),
    create: (reviewData) => api.post('/reviews', reviewData),
    update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
    delete: (id) => api.delete(`/reviews/${id}`),
  },
  
  // User endpoints
  users: {
    getProfile: (id) => api.get(`/users/${id}`),
    updateProfile: (id, userData) => api.put(`/users/${id}`, userData),
    getWatchlist: (id) => api.get(`/users/${id}/watchlist`),
    addToWatchlist: (id, movieId) => api.post(`/users/${id}/watchlist`, { movieId }),
    removeFromWatchlist: (id, movieId) => api.delete(`/users/${id}/watchlist/${movieId}`),
    getStats: (id) => api.get(`/users/${id}/stats`),
    search: (params) => api.get('/users/search', { params }),
  },
  
  // Utility methods
  health: () => api.get('/health'),
};

export default api;