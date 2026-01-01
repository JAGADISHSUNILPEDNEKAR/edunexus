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
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 mt-4 text-lg">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-200 py-12 mb-8">
        <div className="container-custom">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-4xl shadow-sm text-indigo-600">
              ⚡
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-500 text-lg">
                Platform overview and management
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
          {['overview', 'users', 'content'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 capitalize ${activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Users</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stats.totalUsers}</div>
                <span className="badge badge-primary">Active</span>
              </div>
              <div className="card border-l-4 border-l-indigo-500">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Courses</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stats.totalCourses}</div>
                <span className="badge badge-secondary">Published</span>
              </div>
              <div className="card border-l-4 border-l-emerald-500">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Enrollments</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stats.totalEnrollments}</div>
                <span className="badge badge-success">Growing</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Distribution */}
              <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6">User Distribution</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Students</span>
                      <span className="font-semibold text-slate-900">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Instructors</span>
                      <span className="font-semibold text-slate-900">12%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Admins</span>
                      <span className="font-semibold text-slate-900">3%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-slate-500 h-2 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl">👤</div>
                    <div className="font-semibold">Manage Users</div>
                  </button>
                  <button className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 hover:bg-purple-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl">📚</div>
                    <div className="font-semibold">Review Content</div>
                  </button>
                  <button className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl">📊</div>
                    <div className="font-semibold">View Reports</div>
                  </button>
                  <button className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors text-left flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-2xl">⚙️</div>
                    <div className="font-semibold">Settings</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="card text-center py-20 bg-slate-50/50 border-dashed">
            <div className="text-4xl mb-4 opacity-50 grayscale">🚧</div>
            <h3 className="text-lg font-semibold text-slate-900">Work in Progress</h3>
            <p className="text-slate-500">This section is currently under development.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard