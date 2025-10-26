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
      setAssignments(assignmentsRes.data.assignments)
    } catch (err) {
      setError('Failed to load course details')
      console.error(err)
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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (!course) return null

  const isInstructor = user?.id === course.instructor._id || user?.role === 'admin'
  const isEnrolled = course.enrolledStudents.some(s => s._id === user?.id)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Header */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>👨‍🏫 {course.instructor.name}</span>
              <span>📚 {course.lectures.length} lectures</span>
              <span>👥 {course.enrolledStudents.length} students</span>
            </div>
          </div>
          {user?.role === 'student' && !isEnrolled && (
            <EnrollButton courseId={course._id} onEnroll={fetchCourseData} />
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
            <button className="btn btn-secondary">
              ✏️ Edit Course
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('lectures')}
              className={`pb-2 px-1 ${
                activeTab === 'lectures'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Lectures
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`pb-2 px-1 ${
                activeTab === 'assignments'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
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
              <p className="text-gray-600 text-center py-8">
                No lectures available yet.
              </p>
            ) : (
              course.lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium">{lecture.title}</h4>
                      <p className="text-sm text-gray-500">
                        Duration: {Math.floor(lecture.duration / 60)} min
                      </p>
                    </div>
                  </div>
                  
                    href={lecture.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-sm"
                  <a>
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