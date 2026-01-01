import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import UserManagement from '../admin/UserManagement'
import ContentModeration from '../admin/ContentModeration'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getStats()
      setStats(response.data.stats)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 mt-4 text-lg">Loading dashboard...</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'content', label: 'Content Moderation', icon: '📝' }
  ]

  return (
    <div className="min-h-screen pb-20 pt-20 container mx-auto px-4 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Admin Dashboard</span>
        </h1>
        <p className="text-slate-400 text-lg">Manage your platform and monitor performance</p>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="mb-8 bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg p-2 border border-slate-700/50">
        <nav className="flex gap-2 text-sm sm:text-base overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 min-w-[120px]
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-scaleIn">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="card group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-3xl">👥</span>
                </div>
                <span className="badge badge-primary">Total</span>
              </div>
              <h3 className="text-slate-400 font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</p>
              <p className="text-sm text-slate-500 mt-2">All registered users</p>
            </div>

            {/* Students */}
            <div className="card group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🎓</span>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <h3 className="text-slate-400 font-semibold mb-2">Students</h3>
              <p className="text-3xl font-bold text-emerald-400 mb-1">{stats.totalStudents}</p>
              <p className="text-sm text-slate-500 mt-2">Enrolled learners</p>
            </div>

            {/* Instructors */}
            <div className="card group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <span className="badge badge-secondary">Teaching</span>
              </div>
              <h3 className="text-slate-400 font-semibold mb-2">Instructors</h3>
              <p className="text-3xl font-bold text-blue-400 mb-1">{stats.totalInstructors}</p>
              <p className="text-sm text-slate-500 mt-2">Expert teachers</p>
            </div>

            {/* Courses */}
            <div className="card group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📚</span>
                </div>
                <span className="badge badge-warning">Live</span>
              </div>
              <h3 className="text-slate-400 font-semibold mb-2">Total Courses</h3>
              <p className="text-3xl font-bold text-purple-400 mb-1">{stats.totalCourses}</p>
              <p className="text-sm text-slate-500 mt-2">Available courses</p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Status Card */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-white">User Status</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-slate-200">Active Users</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">{stats.activeUsers}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-rose-500/10 rounded-xl border border-rose-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="font-medium text-slate-200">Inactive Users</span>
                  </div>
                  <span className="text-2xl font-bold text-rose-400">{stats.inactiveUsers}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Active Rate</span>
                  <span className="font-semibold text-white">{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                    style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Platform Health Card */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💪</span>
                </div>
                <h3 className="text-xl font-bold text-white">Platform Health</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-200">Active Rate</span>
                    <span className="text-lg font-bold text-purple-400">
                      {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                      style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-200">Avg Students/Course</span>
                    <span className="text-lg font-bold text-blue-400">
                      {stats.totalCourses > 0
                        ? (stats.totalStudents / stats.totalCourses).toFixed(1)
                        : 0}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: '70%' }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-200">Instructor Ratio</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {stats.totalUsers > 0
                        ? ((stats.totalInstructors / stats.totalUsers) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                      style={{ width: `${(stats.totalInstructors / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>⚡</span>
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('users')}
                className="p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-purple-500/50 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1 group text-left"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                <div className="font-semibold text-purple-400">Manage Users</div>
                <div className="text-sm text-slate-500 mt-1">View and edit user accounts</div>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className="p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1 group text-left"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📝</div>
                <div className="font-semibold text-blue-400">Moderate Content</div>
                <div className="text-sm text-slate-500 mt-1">Review and manage courses</div>
              </button>

              <button className="p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1 group text-left">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                <div className="font-semibold text-emerald-400">View Reports</div>
                <div className="text-sm text-slate-500 mt-1">Platform analytics & insights</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="animate-scaleIn">
          <UserManagement />
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="animate-scaleIn">
          <ContentModeration />
        </div>
      )}
    </div>
  )
}

export default AdminDashboard