// Updated Landing Page - Clean Modern Design
// Replace: client/src/components/landing/LandingPage.jsx

import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Empower Your
            <br />
            Learning Journey
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Learn, teach, and grow with expert-led online courses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link to={`/dashboard/${user?.role}`} className="btn-hero btn-hero-primary">
                  Get Started
                </Link>
                <Link to="/courses" className="btn-hero btn-hero-secondary">
                  Explore Courses
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-hero btn-hero-primary">
                  Get Started
                </Link>
                <Link to="/courses" className="btn-hero btn-hero-secondary">
                  Explore Courses
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Login Card */}
            <Link to="/login" className="quick-access-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Login</h3>
              </div>
              <p className="text-gray-600">Access your account</p>
            </Link>

            {/* Register Card */}
            <Link to="/register" className="quick-access-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Register</h3>
              </div>
              <p className="text-gray-600">Create new account</p>
            </Link>

            {/* Courses Card */}
            <Link to="/courses" className="quick-access-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Courses</h3>
              </div>
              <p className="text-gray-600">Browse available courses</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose EduNexus?
            </h2>
            <p className="text-xl text-gray-600">Everything you need for online learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals</p>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📹</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Video Lectures</h3>
              <p className="text-gray-600">High-quality video content</p>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Connect with instructors instantly</p>
            </div>

            <div className="feature-card">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Assignments</h3>
              <p className="text-gray-600">Practice with real projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-purple-200">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-purple-200">Expert Instructors</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-purple-200">Online Courses</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-purple-200">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students and start your journey today
            </p>
            <Link to="/register" className="btn-hero btn-hero-primary">
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default LandingPage