// API service with axios configuration - PRODUCTION FIXED v2
// spec: see FullStackProject-Sem3_33099103.pdf

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://edunexus-tix1.onrender.com/api'

console.log('🔧 API Configuration:', {
  apiUrl: API_URL,
  environment: import.meta.env.MODE
})

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 30000 // 30 second timeout
})

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      dataPreview: response.data?.success ? 'Success' : 'Check data'
    })
    return response
  },
  (error) => {
    // Detailed error logging
    console.error('❌ API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      code: error.code,
      isTimeout: error.code === 'ECONNABORTED',
      isNetworkError: !error.response,
      fullError: error
    })
    
    // Add user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timeout - the server took too long to respond'
    } else if (!error.response) {
      error.userMessage = 'Network error - cannot reach the server'
    } else if (error.response.status >= 500) {
      error.userMessage = 'Server error - please try again later'
    } else if (error.response.status === 401) {
      error.userMessage = 'Unauthorized - please login again'
      console.warn('⚠️ Unauthorized - clearing token')
      localStorage.removeItem('token')
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (error.response.status === 404) {
      error.userMessage = 'Resource not found'
    } else {
      error.userMessage = error.response?.data?.message || 'An error occurred'
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
  me: () => api.get('/auth/me')
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
  getEnrolledCourses: () => api.get('/courses/my/enrolled')
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
  getStats: () => api.get('/users/admin/stats')
}

// Chat
export const chatAPI = {
  getMessages: (courseId, params) => api.get(`/chat/${courseId}`, { params }),
  sendMessage: (courseId, data) => api.post(`/chat/${courseId}`, data),
  deleteMessage: (messageId) => api.delete(`/chat/message/${messageId}`)
}

export default api