// Create assignment component
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState } from 'react'
import { assignmentAPI } from '../../services/api'

const CreateAssignment = ({ courseId, onCreated }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('courseId', courseId)
      if (formData.dueDate) {
        formDataToSend.append('dueDate', formData.dueDate)
      }
      formDataToSend.append('maxScore', formData.maxScore)
      if (file) {
        formDataToSend.append('file', file)
      }

      await assignmentAPI.create(formDataToSend)
      
      // Reset form
      setFormData({ title: '', description: '', dueDate: '', maxScore: 100 })
      setFile(null)
      setShowForm(false)
      
      if (onCreated) onCreated()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment')
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-primary w-full mb-4"
      >
        + Create New Assignment
      </button>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
      <h3 className="font-semibold text-lg mb-4">Create New Assignment</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Score</label>
            <input
              type="number"
              name="maxScore"
              value={formData.maxScore}
              onChange={handleChange}
              className="input"
              min="1"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Assignment File (optional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="input"
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        <div className="flex space-x-2">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Create Assignment'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAssignment