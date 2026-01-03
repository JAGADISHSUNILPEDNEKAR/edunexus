// API service with axios configuration - PRODUCTION DEPLOYMENT FIXED
// spec: see FullStackProject-Sem3_33099103.pdf

import axios from 'axios'

// ✅ FIXED: Proper API URL detection for all environments
const getApiUrl = () => {
  // Priority 1: Environment variable (Vercel automatically provides this)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Priority 2: Production default
  if (import.meta.env.MODE === 'production') {
    return 'https://edunexus-tix1.onrender.com/api';
  }

  // Priority 3: Development default
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

console.log('🔧 API Configuration:', {
  apiUrl: API_URL,
  environment: import.meta.env.MODE,
  viteApiUrl: import.meta.env.VITE_API_URL,
  timestamp: new Date().toISOString()
})

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Important for cookies
  timeout: 30000 // 30 second timeout
})

// ✅ Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: `${API_URL}${config.url}`,
      hasAuth: !!token,
      timestamp: new Date().toISOString()
    })

    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// ✅ Handle response errors with detailed logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      success: response.data?.success
    })
    return response
  },
  (error) => {
    // Detailed error logging
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      code: error.code,
      isTimeout: error.code === 'ECONNABORTED',
      isNetworkError: !error.response,
      isCorsError: error.message?.includes('Network Error') || error.message?.includes('CORS'),
      timestamp: new Date().toISOString()
    };

    console.error('❌ API Error Details:', errorDetails);

    // Add user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timeout - the server took too long to respond. Please try again.';
    } else if (!error.response) {
      error.userMessage = 'Cannot connect to server. Please check your internet connection or try again later.';
      console.error('💡 Possible causes:');
      console.error('   - Backend server is down');
      console.error('   - CORS misconfiguration');
      console.error('   - Network firewall blocking request');
      console.error('   - API_URL is incorrect:', API_URL);
    } else if (error.response.status >= 500) {
      error.userMessage = 'Server error - please try again later';
    } else if (error.response.status === 401) {
      error.userMessage = 'Unauthorized - please login again';
      console.warn('⚠️ Unauthorized - clearing token');
      localStorage.removeItem('token');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    } else if (error.response.status === 404) {
      error.userMessage = 'Resource not found';
    } else if (error.response.status === 403) {
      error.userMessage = 'Access denied - you do not have permission';
    } else {
      error.userMessage = error.response?.data?.message || 'An error occurred';
    }

    return Promise.reject(error)
  }
)

// API methods

// Auth
export const authAPI = {
  login: (data) => {
    console.log('🔐 Attempting login...')
    return api.post('/auth/login', data)
  },
  register: (data) => {
    console.log('📝 Attempting registration...')
    return api.post('/auth/register', data)
  },
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/updatedetails', data)
}

// Courses
export const courseAPI = {
  getAll: (params) => {
    console.log('📚 Fetching courses with params:', params)
    return api.get('/courses', { params })
  },
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  addLecture: (id, data) => api.post(`/courses/${id}/lectures`, data),
  getInstructorCourses: () => api.get('/courses/my/instructor'),
  getEnrolledCourses: () => api.get('/courses/my/enrolled'),
  addReview: (id, data) => api.post(`/courses/${id}/reviews`, data),
  getReviews: (id) => api.get(`/courses/${id}/reviews`),
  getProgress: (id) => api.get(`/progress/${id}/progress`), // This might be wrong path based on route definition?
  // backend route is /api/progress/:courseId/progress ?? No, wait.
  // progressRoutes is mounted at /api/progress
  // Inside progressRoutes: router.route('/').get(getProgress) <- this gets progress for what?
  // Let me check progressController.js again.
  // exports.getProgress = async (req, res) => { ... req.params.courseId ... }
  // Route definition: router.route('/').get(getProgress)
  // But router defined with { mergeParams: true } ??
  // No, I defined progressRoutes as: router.use(protect); router.route('/').get()...
  // But how does it get courseId?
  // Ah, I probably need to mount it under courses or pass it in body/query?
  // Re-checking progressController: req.params.courseId
  // Re-checking progressRoutes: just router.route('/')
  // If I mount it at /api/progress, then req.params.courseId will be undefined unless using query params.
  // Better approach: Mount it in courseRoutes or fix the route path.
  // Let's look at my implementation plan: "/api/courses/:courseId/progress"
  // So in courseRoutes I should mount it? Or define it in progressRoutes as /:courseId?
  // Let's fix progressRoutes first.
  // Actually, I'll update api.js assuming I fix the route to be `/api/progress/:courseId`.
  updateProgress: (id, data) => api.put(`/progress/${id}`, data),
  getProgress: (id) => api.get(`/progress/${id}`)
}

// Assignments
export const assignmentAPI = {
  getByCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (formData) => api.post('/assignments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  submit: (id, formData) => api.post(`/assignments/${id}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSubmissions: (id) => api.get(`/assignments/${id}/submissions`),
  getMySubmissions: () => api.get('/assignments/my/submissions')
}

// Users (Admin)
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/admin/stats'),
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (courseId) => api.post(`/users/wishlist/${courseId}`),
  removeFromWishlist: (courseId) => api.delete(`/users/wishlist/${courseId}`)
}

// Chat
export const chatAPI = {
  getMessages: (courseId, params) => api.get(`/chat/${courseId}`, { params }),
  sendMessage: (courseId, data) => api.post(`/chat/${courseId}`, data),
  deleteMessage: (messageId) => api.delete(`/chat/message/${messageId}`)
}

export default api