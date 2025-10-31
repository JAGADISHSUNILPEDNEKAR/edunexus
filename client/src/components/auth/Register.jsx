import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const { register, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    const dashboardPath = `/dashboard/${user.role}`
    navigate(dashboardPath, { replace: true })
    return null
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return strength
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError('')
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    )

    if (!result.success) {
      setError(result.error)
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'var(--error)'
    if (passwordStrength <= 3) return 'var(--warning)'
    return 'var(--success)'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak'
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '3rem 1rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '2s'
        }}></div>
      </div>

      <div style={{ 
        maxWidth: '480px', 
        width: '100%', 
        position: 'relative',
        zIndex: 10
      }} className="animate-fadeIn">
        <div className="card-glass" style={{ 
          padding: '3rem',
          borderRadius: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              margin: '0 auto 1.5rem',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              transform: 'rotate(-5deg)',
              transition: 'transform 0.3s ease'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-5deg) scale(1)'}>
              <span style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                color: 'white' 
              }}>E</span>
            </div>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              marginBottom: '0.5rem'
            }}>
              <span className="gradient-text">Join EduNexus</span>
            </h2>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: '1.125rem' 
            }}>Create your account and start learning today</p>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error animate-slideIn" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--error)' }}>Error</p>
                  <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--error)' }}>{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
            {/* Name Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ 
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👤</span>
                  <span>Full Name</span>
                </span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ 
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📧</span>
                  <span>Email Address</span>
                </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ 
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🔒</span>
                  <span>Password</span>
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--gray-500)',
                    padding: '0.5rem'
                  }}
                  tabIndex="-1"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>Password Strength:</span>
                    <span style={{ 
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: getPasswordStrengthColor()
                    }}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${(passwordStrength / 5) * 100}%`,
                        background: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem', marginBottom: 0 }}>
                    At least 6 characters recommended
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="confirmPassword" style={{ 
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🔐</span>
                  <span>Confirm Password</span>
                </span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Role Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="role" style={{ 
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎭</span>
                  <span>I am a</span>
                </span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                style={{ cursor: 'pointer' }}
              >
                <option value="student">🎓 Student - I want to learn</option>
                <option value="instructor">👨‍🏫 Instructor - I want to teach</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-large"
              style={{ width: '100%' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  <span>Creating Account...</span>
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span>✨</span>
                  <span>Create Account</span>
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider"></div>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--gray-600)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ 
                color: 'var(--primary-600)', 
                fontWeight: '700',
                textDecoration: 'none'
              }}>
                Sign in instead →
              </Link>
            </p>
          </div>

          {/* Features */}
          <div style={{ 
            paddingTop: '1.5rem',
            borderTop: '2px solid var(--gray-100)'
          }}>
            <p style={{ 
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--gray-700)',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              ✨ What you'll get
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.2))',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  📚
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Access to thousands of courses</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  💬
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Real-time chat with instructors</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2))',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  🏆
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Track your learning progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ 
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span>📜</span>
          <span>By registering, you agree to our Terms & Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}

export default Register