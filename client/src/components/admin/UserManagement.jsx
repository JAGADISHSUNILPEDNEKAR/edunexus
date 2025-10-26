// User management component for admin
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = filter !== 'all' ? { role: filter } : {}
      const response = await userAPI.getAll(params)
      setUsers(response.data.users)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return
    }

    try {
      await userAPI.update(userId, { isActive: false })
      fetchUsers()
    } catch (err) {
      alert('Failed to deactivate user')
    }
  }

  const handleActivateUser = async (userId) => {
    try {
      await userAPI.update(userId, { isActive: true })
      fetchUsers()
    } catch (err) {
      alert('Failed to activate user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      await userAPI.delete(userId)
      fetchUsers()
    } catch (err) {
      alert('Failed to delete user')
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
      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input max-w-xs"
        >
          <option value="all">All Users</option>
          <option value="student">Students Only</option>
          <option value="instructor">Instructors Only</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-100">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`badge badge-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    {user.isActive ? (
                      <button
                        onClick={() => handleDeactivateUser(user._id)}
                        className="text-sm text-orange-600 hover:underline"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateUser(user._id)}
                        className="text-sm text-green-600 hover:underline"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-600 py-8">No users found.</p>
        )}
      </div>
    </div>
  )
}

export default UserManagement