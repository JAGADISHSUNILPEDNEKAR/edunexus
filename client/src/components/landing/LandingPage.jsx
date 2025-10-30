// Landing Page Component - Modern Design
// Create this file at: client/src/components/landing/LandingPage.jsx

import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="gradient-text">Empower Your</span>
              <br />
              <span className="text-slate-800">Learning Journey</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Learn, teach, and grow with expert-led online courses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {isAuthenticated ? (
                <>
                  <Link to={`/dashboard/${user?.role}`} className="btn btn-primary btn-lg px-12">
                    Go to Dashboard
                  </Link>
                  <Link to="/courses" className="btn btn-secondary btn-lg px-12">
                    Explore Courses
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg px-12">
                    Get Started
                  </Link>
                  <Link to="/courses" className="btn btn-secondary btn-lg px-12">
                    Explore Courses
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <Link to="/login" className="card-glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Login</h3>
              </div>
              <p className="text-slate-600">Access your account</p>
            </Link>

            <Link to="/register" className="card-glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Register</h3>
              </div>
              <p className="text-slate-600">Create new account</p>
            </Link>

            <Link to="/courses" className="card-glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Courses</h3>
              </div>
              <p className="text-slate-600">Browse available courses</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Why Choose EduNexus?</span>
            </h2>
            <p className="text-xl text-slate-600">Everything you need for online learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Expert Instructors</h3>
              <p className="text-slate-600">Learn from industry professionals</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-3xl">📹</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Video Lectures</h3>
              <p className="text-slate-600">High-quality video content</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Real-time Chat</h3>
              <p className="text-slate-600">Connect with instructors instantly</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Assignments</h3>
              <p className="text-slate-600">Practice with real projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold">1000+</div>
              <div className="text-purple-200">Active Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">50+</div>
              <div className="text-purple-200">Expert Instructors</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">100+</div>
              <div className="text-purple-200">Online Courses</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">24/7</div>
              <div className="text-purple-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Ready to Start Learning?</span>
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands of students and start your journey today
            </p>
            <Link to="/register" className="btn btn-primary btn-lg px-12">
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default LandingPage