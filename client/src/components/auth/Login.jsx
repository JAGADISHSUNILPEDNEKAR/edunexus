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
    setError('') // Clear error on input change
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fadeIn">
        {/* Card Container */}
        <div className="card-glass p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300 hover:rotate-3">
              <span className="text-4xl font-bold text-white">E</span>
            </div>
            
            {/* Title */}
            <h2 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Welcome Back</span>
            </h2>
            <p className="text-slate-600 text-lg">Sign in to continue your learning journey</p>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-6 animate-slideIn">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2">
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
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Password</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input pr-12 ${error ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-slate-600 group-hover:text-slate-900">Remember me</span>
              </label>
              <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4 relative overflow-hidden group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  <span>Sign In</span>
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-8"></div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-bold hover:underline">
                Create one now →
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t-2 border-slate-100">
            <p className="text-sm font-semibold text-slate-700 mb-4 text-center flex items-center justify-center gap-2">
              <span>🎭</span>
              <span>Try Demo Accounts</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="group relative px-4 py-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 rounded-xl transition-all text-sm font-medium text-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">👑</span>
                <span className="block text-xs">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('instructor')}
                className="group relative px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 rounded-xl transition-all text-sm font-medium text-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">👨‍🏫</span>
                <span className="block text-xs">Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="group relative px-4 py-3 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 rounded-xl transition-all text-sm font-medium text-green-700 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">🎓</span>
                <span className="block text-xs">Student</span>
              </button>
            </div>
            
            {/* Demo Credentials Info */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-600 font-medium mb-2">📝 Demo Credentials:</p>
              <div className="space-y-1 text-xs text-slate-500">
                <p><strong className="text-purple-600">Admin:</strong> admin@edunexus.com / Admin@123</p>
                <p><strong className="text-blue-600">Instructor:</strong> instructor@edunexus.com / Instructor@123</p>
                <p><strong className="text-green-600">Student:</strong> student1@edunexus.com / Student@123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
          <span>🔐</span>
          <span>Protected by enterprise-grade security</span>
        </p>
      </div>
    </div>
  )
}

export default Login