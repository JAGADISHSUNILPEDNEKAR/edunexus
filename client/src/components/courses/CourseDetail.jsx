// Course detail component with lectures and assignments
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseAPI, assignmentAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import EnrollButton from './EnrollButton'
import AssignmentList from '../assignments/AssignmentList'

const CourseDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('lectures')
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [id])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      const [courseRes, assignmentsRes] = await Promise.all([
        courseAPI.getById(id),
        assignmentAPI.getByCourse(id)
      ])
      setCourse(courseRes.data.course)
      if (courseRes.data.course.userRating) {
        setUserRating(courseRes.data.course.userRating.value)
      }
      setAssignments(assignmentsRes.data.assignments)
    } catch (err) {
      setError('Failed to load course details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRate = async (value) => {
    try {
      setIsRatingSubmitting(true)
      await courseAPI.rate(id, { rating: value })
      setUserRating(value)
      // Refresh course data to update average rating
      const courseRes = await courseAPI.getById(id)
      setCourse(prev => ({ ...prev, averageRating: courseRes.data.course.averageRating }))
    } catch (err) {
      console.error('Failed to rate course:', err)
      alert('Failed to submit rating')
    } finally {
      setIsRatingSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-primary-600 border-border-light rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (!course) return null

  const isInstructor = user?.id === course.instructor._id?.toString() || user?.id === course.instructor.toString() || user?.role === 'admin'
  const isEnrolled = course.enrolledStudents.some(s => s._id?.toString() === user?.id)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Header */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-text-primary">{course.title}</h1>
            <p className="text-text-secondary mb-4">{course.description}</p>
            <div className="flex items-center space-x-4 text-sm text-text-muted">
              <span>👨‍🏫 {course.instructor.name}</span>
              <span>⭐ {course.averageRating ? Number(course.averageRating).toFixed(1) : 'New'}</span>
              <span>📚 {course.lectures.length} lectures</span>
              <span>👥 {course.enrolledStudents.length} students</span>
            </div>
          </div>
          {user?.role === 'student' && !isEnrolled && (
            <EnrollButton courseId={course._id} onEnroll={fetchCourseData} />
          )}
          {user?.role === 'student' && isEnrolled && (
            <div className="flex flex-col items-end">
              <span className="text-sm text-text-muted mb-1">Your Rating</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`text-2xl transition-colors ${(hoverRating || userRating) >= star ? 'text-yellow-400' : 'text-gray-300'
                      } ${isRatingSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}`}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={isRatingSubmitting}
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 mt-4">
          <Link
            to={`/courses/${course._id}/chat`}
            className="btn btn-primary"
          >
            💬 Course Chat
          </Link>
          {isInstructor && (
            <Link
              to={`/courses/${course._id}/edit`}
              className="btn btn-secondary"
            >
              ✏️ Edit Course
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-border-light mb-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('lectures')}
              className={`pb-2 px-1 ${activeTab === 'lectures'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-text-muted hover:text-text-primary'
                }`}
            >
              Lectures
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`pb-2 px-1 ${activeTab === 'assignments'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-text-muted hover:text-text-primary'
                }`}
            >
              Assignments ({assignments.length})
            </button>
          </nav>
        </div>

        {/* Lectures Tab */}
        {activeTab === 'lectures' && (
          <div className="space-y-3">
            {course.lectures.length === 0 ? (
              <p className="text-text-muted text-center py-8">
                No lectures available yet.
              </p>
            ) : (
              course.lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg hover:bg-bg-tertiary transition"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-text-muted font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-text-primary">{lecture.title}</h4>
                      <p className="text-sm text-text-secondary">
                        Duration: {Math.floor(lecture.duration / 60)} min
                      </p>
                    </div>
                  </div>
                  <a
                    href={lecture.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-sm"
                  >
                    ▶️ Watch
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <AssignmentList
            assignments={assignments}
            courseId={course._id}
            isInstructor={isInstructor}
            onUpdate={fetchCourseData}
          />
        )}
      </div>
    </div>
  )
}

export default CourseDetail