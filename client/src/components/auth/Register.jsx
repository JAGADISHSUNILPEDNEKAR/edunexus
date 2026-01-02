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
    if (passwordStrength <= 1) return 'bg-rose-500' // var(--error)
    if (passwordStrength <= 3) return 'bg-amber-500' // var(--warning)
    return 'bg-emerald-500' // var(--success)
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak'
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="min-h-screen flex bg-bg-primary transition-colors duration-200">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10 bg-bg-primary">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6 shadow-primary-200 shadow-lg">
              E
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              Join EduNexus
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Create your account and start your learning journey today.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                Full Name
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

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                Email Address
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-text-muted">Strength</span>
                    <span className={`text-xs font-semibold ${passwordStrength <= 1 ? 'text-rose-600' :
                      passwordStrength <= 3 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-bg-tertiary rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Use 8+ chars with mixed types
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
                Confirm Password
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

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input cursor-pointer"
              >
                <option value="student">🎓 Student - I want to learn</option>
                <option value="instructor">👨‍🏫 Instructor - I want to teach</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary flex justify-center py-3 mt-2"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
              Sign in instead
            </Link>
          </div>

          <div className="mt-8 border-t border-border-light pt-6">
            <p className="text-center text-xs text-text-muted">
              By registering, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary-600 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-600 via-secondary-600 to-primary-800"></div>

        {/* Decorative Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white z-10">
          <h3 className="text-lg font-semibold text-primary-200 uppercase tracking-widest mb-4">
            Why Join EduNexus?
          </h3>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
              <div className="ml-5">
                <h4 className="text-xl font-bold">Limitless Learning</h4>
                <p className="mt-2 text-primary-100 leading-relaxed">
                  Access thousands of top-rated courses from industry experts.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-2xl">💬</span>
                </div>
              </div>
              <div className="ml-5">
                <h4 className="text-xl font-bold">Community & Support</h4>
                <p className="mt-2 text-primary-100 leading-relaxed">
                  Join a community of learners and get real-time feedback from instructors.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
              <div className="ml-5">
                <h4 className="text-xl font-bold">Track Your Success</h4>
                <p className="mt-2 text-primary-100 leading-relaxed">
                  Earn certificates and track your progress as you master new skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register