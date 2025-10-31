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

  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    const dashboardPath = `/dashboard/${user.role}`
    navigate(dashboardPath, { replace: true })
    return null
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        {/* Card Container */}
        <div className="card-glass" style={{ 
          padding: '3rem',
          borderRadius: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            
            {/* Title */}
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              marginBottom: '0.5rem'
            }}>
              <span className="gradient-text">Welcome Back</span>
            </h2>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: '1.125rem' 
            }}>Sign in to continue your learning journey</p>
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            {/* Email Field */}
            <div style={{ marginBottom: '1.25rem' }}>
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
                className={`input ${error ? 'input-error' : ''}`}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.25rem' }}>
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
                  className={`input ${error ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem', fontSize: '1rem' }}
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
                <span style={{ color: 'var(--gray-600)' }}>Remember me</span>
              </label>
              <a href="#" style={{ 
                color: 'var(--primary-600)', 
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Forgot password?
              </a>
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
                  <span>Signing In...</span>
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span>🚀</span>
                  <span>Sign In</span>
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider"></div>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--gray-600)' }}>
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
            borderTop: '2px solid var(--gray-100)'
          }}>
            <p style={{ 
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--gray-700)',
              marginBottom: '1rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span>🎭</span>
              <span>Try Demo Accounts</span>
            </p>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem'
            }}>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                style={{
                  padding: '1rem 0.5rem',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.2))',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  color: '#7c3aed'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.25rem' }}>👑</span>
                <span style={{ display: 'block', fontSize: '0.75rem' }}>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('instructor')}
                style={{
                  padding: '1rem 0.5rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  color: '#2563eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.25rem' }}>👨‍🏫</span>
                <span style={{ display: 'block', fontSize: '0.75rem' }}>Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                style={{
                  padding: '1rem 0.5rem',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2))',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  color: '#059669'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎓</span>
                <span style={{ display: 'block', fontSize: '0.75rem' }}>Student</span>
              </button>
            </div>
            
            {/* Demo Credentials Info */}
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--gray-50)',
              borderRadius: '1rem',
              border: '1px solid var(--gray-200)'
            }}>
              <p style={{ 
                fontSize: '0.75rem',
                color: 'var(--gray-600)',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>📝 Demo Credentials:</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
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
          color: 'rgba(255, 255, 255, 0.8)',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span>🔐</span>
          <span>Protected by enterprise-grade security</span>
        </p>
      </div>
    </div>
  )
}

export default Login