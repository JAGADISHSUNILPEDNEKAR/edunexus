// Student dashboard component
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI, assignmentAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [coursesRes, submissionsRes] = await Promise.all([
        courseAPI.getEnrolledCourses(),
        assignmentAPI.getMySubmissions()
      ])
      setEnrolledCourses(coursesRes.data.courses)
      setSubmissions(submissionsRes.data.submissions)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
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
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {user?.name}!
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Enrolled Courses
          </h3>
          <p className="text-4xl font-bold text-primary-600">
            {enrolledCourses.length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Assignments Submitted
          </h3>
          <p className="text-4xl font-bold text-green-600">
            {submissions.length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Lectures
          </h3>
          <p className="text-4xl font-bold text-blue-600">
            {enrolledCourses.reduce((sum, course) => sum + (course.lectureCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven't enrolled in any courses yet.
            </p>
            <Link to="/courses" className="btn btn-primary">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>👨‍🏫 {course.instructor?.name}</span>
                  <span>📚 {course.lectures?.length || 0} lectures</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
        {submissions.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-600">No submissions yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="space-y-3">
              {submissions.slice(0, 5).map((submission) => (
                <div
                  key={submission._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <h4 className="font-medium">
                      {submission.assignment?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {submission.assignment?.course?.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                    {submission.score !== null && (
                      <p className="text-sm font-semibold text-green-600">
                        Score: {submission.score}/{submission.assignment?.maxScore}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard