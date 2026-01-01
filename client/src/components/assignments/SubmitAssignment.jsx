// Submit assignment component
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState } from 'react'
import { assignmentAPI } from '../../services/api'

const SubmitAssignment = ({ assignmentId, onSubmitted }) => {
  const [showForm, setShowForm] = useState(false)
  const [file, setFile] = useState(null)
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError('Please select a file to submit')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('comments', comments)

      await assignmentAPI.submit(assignmentId, formData)

      setSuccess('Assignment submitted successfully!')
      setFile(null)
      setComments('')
      setShowForm(false)

      if (onSubmitted) onSubmitted()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assignment')
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-primary text-sm"
      >
        Submit Assignment
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-bg-primary rounded-lg p-6 max-w-md w-full mx-4 border border-border-light shadow-xl">
        <h3 className="font-semibold text-lg mb-4 text-text-primary">Submit Assignment</h3>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Upload File *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="input"
              accept=".pdf,.doc,.docx,.txt,.zip"
              required
            />
            <p className="text-xs text-text-muted mt-1">
              Accepted formats: PDF, DOC, DOCX, TXT, ZIP (Max 10MB)
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Comments (optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="input"
              rows={3}
              placeholder="Add any comments about your submission..."
            />
          </div>

          <div className="flex space-x-2">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Submitting...' : 'Submit'}
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
    </div>
  )
}

export default SubmitAssignment