// Updated Navbar Component - Cleaner Design
// Replace: client/src/components/layout/Navbar.jsx

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    return `/dashboard/${user.role}`
  }

  const isActive = (path) => location.pathname === path

  // Don't show navbar on landing page
  if (location.pathname === '/') {
    return (
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">E</span>
              </div>
              <span className="text-2xl font-bold gradient-text">EduNexus</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="text-slate-700 hover:text-purple-600 font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Register
                  </Link>
                  <Link to="/courses" className="text-slate-700 hover:text-purple-600 font-medium transition-colors">
                    Courses
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/courses" className="text-slate-700 hover:text-purple-600 font-medium transition-colors">
                    📚 Courses
                  </Link>
                  <Link to={getDashboardLink()} className="text-slate-700 hover:text-purple-600 font-medium transition-colors">
                    🎯 Dashboard
                  </Link>
                  <div className="flex items-center space-x-4 pl-4 border-l-2 border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
                    <button onClick={handleLogout} className="btn btn-secondary text-sm">
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-white rounded-lg shadow-xl mt-2">
              <div className="flex flex-col space-y-3 px-4">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" className="px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Register
                    </Link>
                    <Link to="/courses" className="px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Courses
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/courses" className="px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                      📚 Courses
                    </Link>
                    <Link to={getDashboardLink()} className="px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                      🎯 Dashboard
                    </Link>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <span className="font-semibold text-gray-700">{user?.name}</span>
                      <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-secondary w-full mt-2">
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <span className="text-2xl font-bold text-white">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                EduNexus
              </span>
              <span className="text-xs text-gray-500 font-medium">Learn & Grow</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/courses" 
              className={`nav-link ${isActive('/courses') ? 'text-purple-600' : ''}`}
            >
              📚 Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className={`nav-link ${isActive(getDashboardLink()) ? 'text-purple-600' : ''}`}
                >
                  🎯 Dashboard
                </Link>
                
                {user?.role === 'instructor' && (
                  <Link 
                    to="/courses/create" 
                    className={`nav-link ${isActive('/courses/create') ? 'text-purple-600' : ''}`}
                  >
                    ➕ Create Course
                  </Link>
                )}

                <div className="flex items-center space-x-4 pl-4 border-l-2 border-gray-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-700">
                      {user?.name}
                    </span>
                    <span className={`badge badge-${user?.role} text-xs mt-1`}>
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary text-sm py-2"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn btn-secondary text-sm py-2">
                  🔐 Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm py-2">
                  ✨ Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link
                to="/courses"
                className="px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                📚 Courses
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🎯 Dashboard
                  </Link>

                  {user?.role === 'instructor' && (
                    <Link
                      to="/courses/create"
                      className="px-4 py-2 rounded-lg hover:bg-purple-50 text-gray-700 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ➕ Create Course
                    </Link>
                  )}

                  <div className="px-4 py-2 border-t border-gray-100 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">{user?.name}</span>
                      <span className={`badge badge-${user?.role} text-xs`}>
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="btn btn-secondary w-full text-sm"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-4 space-y-2">
                  <Link
                    to="/login"
                    className="btn btn-secondary w-full text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🔐 Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary w-full text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ✨ Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar