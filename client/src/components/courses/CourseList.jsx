// Course list component with pagination - FIXED
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI } from '../../services/api'

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCourses()
  }, [page])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError('') // Clear previous errors
      
      console.log('🔄 Fetching courses...', { page })
      
      const response = await courseAPI.getAll({ page, limit: 9 })
      
      console.log('✅ Courses fetched:', response.data)
      
      setCourses(response.data.courses || [])
      setTotalPages(response.data.pages || 1)
    } catch (err) {
      console.error('❌ Failed to fetch courses:', err)
      
      // More detailed error message
      const errorMsg = err.response?.data?.message 
        || err.message 
        || 'Failed to load courses. Please try again later.'
      
      setError(errorMsg)
      
      // Show network-specific errors
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.')
      } else if (!err.response) {
        setError('Cannot connect to server. Please check your internet connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error loading courses</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchCourses}
            className="mt-3 btn btn-secondary text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Courses</h1>
      </div>

      {courses.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg mb-2">No courses available yet.</p>
          <p className="text-gray-500 text-sm">
            Check back later for new courses!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>👨‍🏫 {course.instructor?.name || 'Unknown'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm">
                  <span className="text-gray-600">
                    📚 {course.lectures?.length || course.lectureCount || 0} lectures
                  </span>
                  <span className="text-gray-600">
                    👥 {course.enrolledStudents?.length || course.enrolledCount || 0} enrolled
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CourseList