import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    const dashboardPath = `/dashboard/${user.role}`
    navigate(dashboardPath, { replace: true })
    return null
  }

  const validateField = (name, value) => {
    const errors = {}
    if (name === 'email') {
      if (!value) errors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(value)) errors.email = 'Email is invalid'
    }
    if (name === 'password') {
      if (!value) errors.password = 'Password is required'
      else if (value.length < 6) errors.password = 'Password must be at least 6 characters'
    }
    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError('')
    
    // Real-time validation
    const errors = validateField(name, value)
    setFieldErrors(prev => ({
      ...prev,
      ...errors,
      ...(Object.keys(errors).length === 0 && { [name]: undefined })
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const emailErrors = validateField('email', formData.email)
    const passwordErrors = validateField('password', formData.password)
    const allErrors = { ...emailErrors, ...passwordErrors }
    
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors)
      return
    }

    setError('')
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
    }
  }

  const fillDemoCredentials = (role) => {
    const credentials = {
      admin: { email: 'admin@edunexus.com', password: 'Admin@123' },
      instructor: { email: 'instructor@edunexus.com', password: 'Instructor@123' },
      student: { email: 'student1@edunexus.com', password: 'Student@123' }
    }
    setFormData(credentials[role])
    setError('')
    setFieldErrors({})
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
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
        {/* Card Container */}
        <div className="card-glass" style={{ 
          padding: 'clamp(2rem, 5vw, 3rem)',
          borderRadius: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {/* Logo */}
            <div style={{
              margin: '0 auto 1.5rem',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
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
            
            {/* Title */}
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 2.5rem)', 
              fontWeight: '800', 
              marginBottom: '0.5rem'
            }}>
              <span className="gradient-text">Welcome Back</span>
            </h1>
            <p style={{ 
              color: 'var(--neutral-600)', 
              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' 
            }}>Sign in to continue your learning journey</p>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error animate-slideIn" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }} role="img" aria-label="warning">⚠️</span>
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--error)' }}>Error</p>
                  <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--error)' }}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            {/* Email Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="email" style={{ 
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'var(--neutral-700)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span role="img" aria-label="email">📧</span>
                  <span>Email Address</span>
                </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input ${fieldErrors.email ? 'error' : formData.email ? 'success' : ''}`}
                placeholder="you@example.com"
                required
                autoComplete="email"
                aria-invalid={fieldErrors.email ? 'true' : 'false'}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                style={{ fontSize: '1rem' }}
              />
              {fieldErrors.email && (
                <p id="email-error" style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>⚠️</span>{fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="password" style={{ 
                display: 'block',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'var(--neutral-700)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span role="img" aria-label="lock">🔒</span>
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
                  className={`input ${fieldErrors.password ? 'error' : formData.password ? 'success' : ''}`}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  aria-invalid={fieldErrors.password ? 'true' : 'false'}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  style={{ paddingRight: '3rem', fontSize: '1rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--neutral-500)',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  tabIndex="-1"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>⚠️</span>{fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer'
              }}>
                <input type="checkbox" style={{ 
                  width: '1rem', 
                  height: '1rem',
                  cursor: 'pointer'
                }} />
                <span style={{ color: 'var(--neutral-600)' }}>Remember me</span>
              </label>
              <a href="#forgot" style={{ 
                color: 'var(--primary-600)', 
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary btn-large"
              style={{ width: '100%' }}
              aria-busy={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <div className="spinner-sm" style={{ borderWidth: '2px' }}></div>
                  <span>Signing In...</span>
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span role="img" aria-label="rocket">🚀</span>
                  <span>Sign In</span>
                </span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="divider" style={{ margin: '2rem 0' }}></div>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--neutral-600)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ 
                color: 'var(--primary-600)', 
                fontWeight: '700',
                textDecoration: 'none'
              }}>
                Create one now →
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div style={{ 
            paddingTop: '1.5rem',
            borderTop: '2px solid var(--neutral-100)'
          }}>
            <p style={{ 
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--neutral-700)',
              marginBottom: '1rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span role="img" aria-label="masks">🎭</span>
              <span>Try Demo Accounts</span>
            </p>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem'
            }}>
              {[
                { role: 'admin', emoji: '👑', label: 'Admin', color: '#7c3aed' },
                { role: 'instructor', emoji: '👨‍🏫', label: 'Teacher', color: '#2563eb' },
                { role: 'student', emoji: '🎓', label: 'Student', color: '#059669' }
              ].map(({ role, emoji, label, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemoCredentials(role)}
                  aria-label={`Fill ${label} demo credentials`}
                  style={{
                    padding: '1rem 0.5rem',
                    background: `${color}15`,
                    border: `2px solid ${color}30`,
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: color
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{emoji}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem' }}>{label}</span>
                </button>
              ))}
            </div>
            
            {/* Demo Credentials Info */}
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--neutral-50)',
              borderRadius: '1rem',
              border: '1px solid var(--neutral-200)'
            }}>
              <p style={{ 
                fontSize: '0.75rem',
                color: 'var(--neutral-600)',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                <span role="img" aria-label="memo">📝</span> Demo Credentials:
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong style={{ color: '#7c3aed' }}>Admin:</strong> admin@edunexus.com / Admin@123
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong style={{ color: '#2563eb' }}>Instructor:</strong> instructor@edunexus.com / Instructor@123
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong style={{ color: '#059669' }}>Student:</strong> student1@edunexus.com / Student@123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ 
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.9)',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span role="img" aria-label="shield">🔐</span>
          <span>Protected by enterprise-grade security</span>
        </p>
      </div>
    </div>
  )
}

export default Login