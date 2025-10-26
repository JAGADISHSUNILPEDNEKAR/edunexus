// Admin dashboard component
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect } from 'react'
import { userAPI, courseAPI } from '../../services/api'
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
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-1 ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 px-1 ${
              activeTab === 'users'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-2 px-1 ${
              activeTab === 'content'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Content Moderation
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Total Users
              </h3>
              <p className="text-4xl font-bold text-primary-600">
                {stats.totalUsers}
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Students
              </h3>
              <p className="text-4xl font-bold text-green-600">
                {stats.totalStudents}
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Instructors
              </h3>
              <p className="text-4xl font-bold text-blue-600">
                {stats.totalInstructors}
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Total Courses
              </h3>
              <p className="text-4xl font-bold text-purple-600">
                {stats.totalCourses}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">User Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold text-green-600">
                    {stats.activeUsers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inactive Users</span>
                  <span className="font-semibold text-red-600">
                    {stats.inactiveUsers}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Platform Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Rate</span>
                  <span className="font-semibold">
                    {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Students/Course</span>
                  <span className="font-semibold">
                    {stats.totalCourses > 0
                      ? (stats.totalStudents / stats.totalCourses).toFixed(1)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && <UserManagement />}

      {/* Content Tab */}
      {activeTab === 'content' && <ContentModeration />}
    </div>
  )
}

export default AdminDashboard