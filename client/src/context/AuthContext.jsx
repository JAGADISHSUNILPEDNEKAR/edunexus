// Authentication context for global state management - FIXED VERSION
// spec: see FullStackProject-Sem3_33099103.pdf

import { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.log('🔓 No token found')
      setLoading(false)
      return
    }

    try {
      console.log('🔍 Checking authentication...')
      const response = await api.get('/auth/me')
      console.log('✅ User authenticated:', response.data.user)
      setUser(response.data.user)
    } catch (err) {
      console.error('❌ Auth check failed:', err.response?.data?.message || err.message)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      console.log('🔐 Logging in...', { email })
      
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      console.log('✅ Login successful:', user)
      
      localStorage.setItem('token', token)
      setUser(user)
      
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      console.error('❌ Login error:', message)
      setError(message)
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password, role = 'student') => {
    try {
      setError(null)
      console.log('📝 Registering...', { name, email, role })
      
      const response = await api.post('/auth/register', { name, email, password, role })
      const { token, user } = response.data
      
      console.log('✅ Registration successful:', user)
      
      localStorage.setItem('token', token)
      setUser(user)
      
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.'
      console.error('❌ Registration error:', message)
      setError(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      console.log('👋 Logging out...')
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      console.log('✅ Logged out successfully')
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isInstructor: user?.role === 'instructor',
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}