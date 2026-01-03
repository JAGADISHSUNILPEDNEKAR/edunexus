import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { userAPI } from '../../services/api'
import UserManagement from '../admin/UserManagement'
import ContentModeration from '../admin/ContentModeration'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalEnrollments: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await userAPI.getStats()
      if (response.data && response.data.stats) {
        setStats(response.data.stats)
      }
    } catch (err) {
      console.error('Failed to load admin stats', err)
      // Fallback to zeros/visual placeholder if API fails
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-border-light border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-text-muted mt-4 text-lg">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-bg-primary border-b border-border-light py-12 mb-8">
        <div className="container-custom">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center text-4xl shadow-sm text-primary-600">
              ⚡
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                Admin Dashboard
              </h1>
              <p className="text-text-secondary text-lg">
                Platform overview and management
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-bg-primary p-2 rounded-xl border border-border-light shadow-sm w-fit">
          {['overview', 'users', 'content'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 capitalize ${activeTab === tab
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card border-l-4 border-l-blue-500">
                <div className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">Total Users</div>
                <div className="text-4xl font-bold text-text-primary mb-2">{stats.totalUsers || 0}</div>
                <span className="badge badge-primary">Active</span>
              </div>
              <div className="card border-l-4 border-l-primary-500">
                <div className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">Total Courses</div>
                <div className="text-4xl font-bold text-text-primary mb-2">{stats.totalCourses || 0}</div>
                <span className="badge badge-secondary">Published</span>
              </div>
              <div className="card border-l-4 border-l-emerald-500">
                <div className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">Total Enrollments</div>
                <div className="text-4xl font-bold text-text-primary mb-2">{stats.totalEnrollments || 0}</div>
                <span className="badge badge-success">Growing</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Distribution */}
              <div className="card">
                <h3 className="text-lg font-bold text-text-primary mb-6">User Distribution</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Students</span>
                      <span className="font-semibold text-text-primary">
                        {stats.totalUsers ? Math.round(((stats.totalUsers - stats.totalInstructors) / stats.totalUsers) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{
                          width: `${stats.totalUsers ? ((stats.totalUsers - stats.totalInstructors) / stats.totalUsers) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Instructors</span>
                      <span className="font-semibold text-text-primary">
                        {stats.totalUsers ? Math.round((stats.totalInstructors / stats.totalUsers) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div
                        className="bg-secondary-500 h-2 rounded-full"
                        style={{
                          width: `${stats.totalUsers ? (stats.totalInstructors / stats.totalUsers) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-bold text-text-primary mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 hover:bg-primary-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2"
                  >
                    <div className="text-2xl">👤</div>
                    <div className="font-semibold">Manage Users</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="p-4 rounded-xl bg-secondary-50 border border-secondary-100 text-secondary-700 hover:bg-secondary-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2"
                  >
                    <div className="text-2xl">📚</div>
                    <div className="font-semibold">Review Content</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'content' && <ContentModeration />}
      </div>
    </div>
  )
}

export default AdminDashboard