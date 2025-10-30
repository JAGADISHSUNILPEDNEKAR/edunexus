import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI } from '../../services/api'

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [page])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await courseAPI.getAll({ page, limit: 9 })
      
      setCourses(response.data.courses || [])
      setTotalPages(response.data.pages || 1)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
      const errorMsg = err.response?.data?.message 
        || err.message 
        || 'Failed to load courses. Please try again later.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && courses.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading amazing courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">⚠️</span>
            <p className="font-bold text-lg">Oops! Something went wrong</p>
          </div>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={fetchCourses}
            className="mt-4 btn btn-primary text-sm"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Explore Courses
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover thousands of courses taught by expert instructors
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12 text-lg"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
            🔍
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="card text-center py-16 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 text-xl mb-2">No courses found</p>
          <p className="text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Check back later for new courses!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="course-card"
            >
              {/* Course Image/Gradient */}
              <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 rounded-t-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white line-clamp-2 drop-shadow-lg">
                    {course.title}
                  </h3>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6 space-y-4 relative">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {course.instructor?.name?.charAt(0) || 'I'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {course.instructor?.name || 'Unknown'}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      📚 <span className="ml-1">{course.lectures?.length || course.lectureCount || 0}</span>
                    </span>
                    <span className="flex items-center">
                      👥 <span className="ml-1">{course.enrolledStudents?.length || course.enrolledCount || 0}</span>
                    </span>
                  </div>
                  <div className="text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                    View →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-12">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    page === pageNum
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="stat-card text-center">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-3xl font-bold text-purple-600">{courses.length}+</div>
          <div className="text-gray-600">Available Courses</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl mb-2">👨‍🏫</div>
          <div className="text-3xl font-bold text-indigo-600">50+</div>
          <div className="text-gray-600">Expert Instructors</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl mb-2">🎓</div>
          <div className="text-3xl font-bold text-pink-600">1000+</div>
          <div className="text-gray-600">Active Students</div>
        </div>
      </div>
    </div>
  )
}

export default CourseList
