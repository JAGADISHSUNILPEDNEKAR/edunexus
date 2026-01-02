import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Mock API calls for admin stats - replace with real API
const fetchAdminStats = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalUsers: 1250,
        activeUsers: 850,
        inactiveUsers: 400,
        totalCourses: 156,
        totalInstructors: 42,
        totalEnrollments: 3400,
        revenue: 45000
      })
    }, 1000)
  })
}

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await fetchAdminStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load admin stats', err)
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
                <div className="text-4xl font-bold text-text-primary mb-2">{stats.totalUsers}</div>
                <span className="badge badge-primary">Active</span>
              </div>
              <div className="card border-l-4 border-l-primary-500">
                <div className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">Total Courses</div>
                <div className="text-4xl font-bold text-text-primary mb-2">{stats.totalCourses}</div>
                <span className="badge badge-secondary">Published</span>
              </div>
              <div className="card border-l-4 border-l-emerald-500">
                <div className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">Total Enrollments</div>
                <div className="text-4xl font-bold text-text-primary mb-2">{stats.totalEnrollments}</div>
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
                      <span className="font-semibold text-text-primary">85%</span>
                    </div>
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Instructors</span>
                      <span className="font-semibold text-text-primary">12%</span>
                    </div>
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Admins</span>
                      <span className="font-semibold text-text-primary">3%</span>
                    </div>
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div className="bg-text-muted h-2 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-bold text-text-primary mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 hover:bg-primary-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl">👤</div>
                    <div className="font-semibold">Manage Users</div>
                  </button>
                  <button className="p-4 rounded-xl bg-secondary-50 border border-secondary-100 text-secondary-700 hover:bg-secondary-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl">📚</div>
                    <div className="font-semibold">Review Content</div>
                  </button>
                  <button className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl">📊</div>
                    <div className="font-semibold">View Reports</div>
                  </button>
                  <button className="p-4 rounded-xl bg-bg-tertiary border border-border-light text-text-secondary hover:bg-border-light transition-colors text-left flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl">⚙️</div>
                    <div className="font-semibold">Settings</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="card text-center py-20 bg-bg-secondary border-dashed">
            <div className="text-4xl mb-4 opacity-50 grayscale">🚧</div>
            <h3 className="text-lg font-semibold text-text-primary">Work in Progress</h3>
            <p className="text-text-muted">This section is currently under development.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard