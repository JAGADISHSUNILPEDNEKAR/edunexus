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
    <div className="min-h-screen flex bg-bg-primary transition-colors duration-200">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10 bg-bg-primary">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            {/* Logo placeholder - replace with actual logo if available */}
            <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6 shadow-primary-200 shadow-lg">
              E
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Please enter your details to sign in.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26a6 6 0 018.336 9.975L8 5.485a6.002 6.002 0 00-1.115 1.074l-.089.071-.168-.168a6 6 0 01.127-.087c.362-.353.754-.672 1.168-.952z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-light text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary flex justify-center py-3"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-bg-primary px-2 text-text-muted">Or continue with demo accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="inline-flex flex-col items-center justify-center p-3 border border-secondary-200 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors"
                title="Admin Account"
              >
                <span className="text-xl mb-1">👑</span>
                <span className="text-xs font-semibold text-secondary-700">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('instructor')}
                className="inline-flex flex-col items-center justify-center p-3 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                title="Instructor Account"
              >
                <span className="text-xl mb-1">👨‍🏫</span>
                <span className="text-xs font-semibold text-blue-700">Teach</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="inline-flex flex-col items-center justify-center p-3 border border-emerald-200 rounded-xl bg-emerald-50 hover:emerald-100 transition-colors"
                title="Student Account"
              >
                <span className="text-xl mb-1">🎓</span>
                <span className="text-xs font-semibold text-emerald-700">Learn</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary-600 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-800"></div>

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary-500 opacity-20 blur-3xl"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white z-10">
          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold tracking-tight mb-6 leading-tight">
              Transform your learning journey today.
            </h2>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              EduNexus provides the tools you need to succeed. Join thousands of students and instructors in a world-class learning environment.
            </p>

            <div className="flex items-center gap-4 text-sm font-medium text-primary-200">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-primary-600 bg-white/20"></div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-primary-600 bg-white/30"></div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-primary-600 bg-white/40"></div>
              </div>
              <span>Joined by 10,000+ learners</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login