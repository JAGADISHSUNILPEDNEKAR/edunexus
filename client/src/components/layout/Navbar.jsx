import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'
import ThemeToggle from '../common/ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  User,
  ChevronRight
} from 'lucide-react'

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
    `relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${isActive(path)
      ? 'text-cyan-600 bg-cyan-50/50 dark:text-cyan-400 dark:bg-cyan-900/10'
      : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-50/30 dark:text-slate-300 dark:hover:text-cyan-400 dark:hover:bg-cyan-900/10'
    }`

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 h-20 glass-panel border-b-0 rounded-none"
    >
      <div className="container-custom h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group outline-none">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-xl" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-slate-800 dark:text-white leading-tight">
                EduNexus
              </span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium tracking-widest uppercase">
                Learn & Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/courses" className={navClasses('/courses')}>
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className={navClasses(getDashboardLink())}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {user?.role === 'instructor' && (
                  <Link to="/courses/create" className={navClasses('/courses/create')}>
                    <PlusCircle className="w-4 h-4" />
                    <span>Create</span>
                  </Link>
                )}

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

                <ThemeToggle />

                <div className="flex items-center gap-3 pl-4">
                  <div className="flex flex-col items-end">
                    <Link to="/profile" className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-600 transition-colors">
                      {user?.name}
                    </Link>
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${user?.role === 'student' ? 'text-emerald-500' :
                        user?.role === 'instructor' ? 'text-purple-500' : 'text-rose-500'
                      }`}>
                      {user?.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                <ThemeToggle />
                <Link to="/login" className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary flex items-center gap-2 group">
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="p-4 mt-2 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 shadow-xl space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Theme</span>
                  <ThemeToggle />
                </div>

                <Link
                  to="/courses"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="w-5 h-5 text-cyan-500" />
                  <span className="font-medium">Courses</span>
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">Dashboard</span>
                    </Link>

                    {user?.role === 'instructor' && (
                      <Link
                        to="/courses/create"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <PlusCircle className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium">Create Course</span>
                      </Link>
                    )}

                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

                    <div className="flex items-center justify-between px-4 py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                          <User className="w-4 h-4" />
                        </div>
                        {user?.name}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Link
                      to="/login"
                      className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary flex items-center justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar