// Enroll button component
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState } from 'react'
import { courseAPI } from '../../services/api'

const EnrollButton = ({ courseId, onEnroll }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEnroll = async () => {
    try {
      setLoading(true)
      setError('')
      await courseAPI.enroll(courseId)
      if (onEnroll) onEnroll()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Enrolling...' : '✓ Enroll in Course'}
      </button>
    </div>
  )
}

export default EnrollButton