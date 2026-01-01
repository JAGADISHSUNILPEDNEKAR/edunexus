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
      <div className="flex justify-center items-center h-96">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-danger-50 border-danger-200">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-danger-800 font-semibold">{error}</p>
        </div>
      </div>
    )
  }

  if (!course) return null

  const isInstructor = user?.id === course.instructor._id || user?.role === 'admin'
  const isEnrolled = course.enrolledStudents.some(s => s._id === user?.id)

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Breadcrumb */}
      <nav className="text-sm text-dark-600" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/courses" className="hover:text-dark-900">Courses</Link>
          </li>
          <li>
            <span className="text-dark-400">/</span>
          </li>
          <li className="truncate max-w-[65%]" title={course.title}>
            <span className="text-dark-900 font-medium truncate">{course.title}</span>
          </li>
        </ol>
      </nav>
      {/* Course Header */}
      <div className="card bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white border-0 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="badge bg-white/20 text-white border-white/30">
                {course.lectures.length} Lectures
              </span>
              <span className="badge bg-white/20 text-white border-white/30">
                {course.enrolledStudents.length} Students
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-primary-100 text-lg mb-6">{course.description}</p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold border-2 border-white/30">
                  {course.instructor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-primary-100">Instructor</p>
                  <p className="font-semibold">{course.instructor.name}</p>
                </div>
              </div>
            </div>
          </div>

          {user?.role === 'student' && !isEnrolled && (
            <div className="w-full md:w-auto">
              <EnrollButton courseId={course._id} onEnroll={fetchCourseData} />
            </div>
          )}

          {isEnrolled && (
            <span className="badge bg-success-500 text-white border-success-400 text-lg px-4 py-2">
              ✓ Enrolled
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Link to={`/courses/${course._id}/chat`} className="btn btn-primary">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Course Chat
        </Link>

        {isInstructor && (
          <button className="btn btn-secondary">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Course
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6" role="tablist" aria-label="Course content tabs">
          <nav className="flex space-x-6">
            <button
              role="tab"
              aria-selected={activeTab === 'lectures'}
              aria-controls="panel-lectures"
              id="tab-lectures"
              onClick={() => setActiveTab('lectures')}
              className={`pb-4 px-2 font-semibold transition-all relative ${
                activeTab === 'lectures'
                  ? 'text-primary-600'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Lectures</span>
              </div>
              {activeTab === 'lectures' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'assignments'}
              aria-controls="panel-assignments"
              id="tab-assignments"
              onClick={() => setActiveTab('assignments')}
              className={`pb-4 px-2 font-semibold transition-all relative ${
                activeTab === 'assignments'
                  ? 'text-primary-600'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Assignments</span>
                <span className="badge badge-primary">{assignments.length}</span>
              </div>
              {activeTab === 'assignments' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
          </nav>
        </div>

        {/* Lectures Tab */}
        {activeTab === 'lectures' && (
          <div id="panel-lectures" role="tabpanel" aria-labelledby="tab-lectures" className="space-y-3">
            {course.lectures.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-1">
                  No lectures available yet
                </h3>
                <p className="text-dark-600">The instructor will add content soon</p>
              </div>
            ) : (
              course.lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center font-bold text-primary-600 group-hover:bg-primary-200 transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark-900 group-hover:text-primary-600 transition-colors">
                        {lecture.title}
                      </h4>
                      <p className="text-sm text-dark-600">
                        Duration: {Math.floor(lecture.duration / 60)} minutes
                      </p>
                    </div>
                  </div>

                  <a
                    href={lecture.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Watch
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <AssignmentList
            aria-labelledby="tab-assignments"
            id="panel-assignments"
            role="tabpanel"
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
