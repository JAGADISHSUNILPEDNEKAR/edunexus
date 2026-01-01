import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'
import ThemeToggle from '../common/ThemeToggle'

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

  const navClasses = (path) =>
    `nav-link ${isActive(path) ? 'active' : ''}`

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/80 dark:bg-bg-secondary/80 backdrop-blur-md border-b border-border-light dark:border-border-light transition-all duration-300">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl">🎓</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-text-primary leading-tight">
                Edunexus
              </span>
              <span className="text-[10px] text-text-muted font-medium tracking-wider uppercase">
                Learn & Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/courses" className={navClasses('/courses')}>
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className={navClasses(getDashboardLink())}>
                  Dashboard
                </Link>

                {user?.role === 'instructor' && (
                  <Link to="/courses/create" className={navClasses('/courses/create')}>
                    Create
                  </Link>
                )}



                {/* Theme Toggle in Desktop */}
                <ThemeToggle className="ml-2" />

                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-border-light">                  <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-text-primary">
                    {user?.name}
                  </span>
                  <span className={`badge badge-${user?.role === 'student' ? 'primary' : user?.role === 'instructor' ? 'secondary' : 'admin'} text-[10px] mt-0.5 capitalize`}>
                    {user?.role}
                  </span>
                </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary py-2 px-4 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <ThemeToggle />
                <Link to="/login" className="btn btn-ghost py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary py-2 px-4">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-bg-tertiary text-text-secondary transition-colors"
          >
            <svg
              className="w-6 h-6"
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
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-[30rem] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
          <div className="bg-bg-primary rounded-xl border border-border-light p-4 space-y-2 shadow-lg dark:bg-bg-secondary dark:border-border-medium">
            <div className="flex items-center justify-between px-4 mb-2">
              <span className="text-sm font-medium text-text-secondary">Theme</span>
              <ThemeToggle />
            </div>
            <Link
              to="/courses"
              className="block px-4 py-3 rounded-lg hover:bg-bg-tertiary text-text-secondary font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              📚 Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block px-4 py-3 rounded-lg hover:bg-bg-tertiary text-text-secondary font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🎯 Dashboard
                </Link>

                {user?.role === 'instructor' && (
                  <Link
                    to="/courses/create"
                    className="block px-4 py-3 rounded-lg hover:bg-bg-tertiary text-text-secondary font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ➕ Create Course
                  </Link>
                )}

                <div className="border-t border-border-light pt-4 mt-2">
                  <div className="flex items-center justify-between px-4 mb-3">
                    <span className="font-semibold text-text-primary">
                      {user?.name}
                    </span>
                    <span className={`badge badge-${user?.role === 'student' ? 'primary' : user?.role === 'instructor' ? 'secondary' : 'admin'} capitalize`}>
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="btn btn-secondary w-full justify-center"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  className="btn btn-secondary justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar