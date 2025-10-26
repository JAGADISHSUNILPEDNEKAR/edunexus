// Instructor dashboard component
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const InstructorDashboard = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseAPI.getInstructorCourses()
      setCourses(response.data.courses)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      await courseAPI.delete(courseId)
      fetchCourses()
    } catch (err) {
      alert('Failed to delete course')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)
  const totalLectures = courses.reduce((sum, course) => sum + (course.lectures?.length || 0), 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Instructor Dashboard - {user?.name}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            My Courses
          </h3>
          <p className="text-4xl font-bold text-primary-600">
            {courses.length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Students
          </h3>
          <p className="text-4xl font-bold text-green-600">
            {totalStudents}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total Lectures
          </h3>
          <p className="text-4xl font-bold text-blue-600">
            {totalLectures}
          </p>
        </div>
      </div>

      {/* Courses List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <Link to="/courses/create" className="btn btn-primary">
            + Create New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven't created any courses yet.
            </p>
            <Link to="/courses/create" className="btn btn-primary">
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>📚 {course.lectures?.length || 0} lectures</span>
                      <span>👥 {course.enrolledStudents?.length || 0} students</span>
                      <span>
                        📅 Created: {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-secondary text-sm"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="btn btn-danger text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard