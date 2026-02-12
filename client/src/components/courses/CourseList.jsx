import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI } from '../../services/api'

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Only search if searchTerm has changed or page has changed
    const delayDebounceFn = setTimeout(() => {
      fetchCourses()
    }, 300) // Reduced to 300ms for better responsiveness

    return () => clearTimeout(delayDebounceFn)
  }, [page, searchTerm])

  const fetchCourses = async () => {
    try {
      if (searchTerm) setIsSearching(true)
      else setLoading(true)

      setError('')
      const response = await courseAPI.getAll({ page, limit: 9, search: searchTerm })
      setCourses(response.data.courses || [])
      setTotalPages(response.data.pages || 1)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
      setError('Unable to load courses. Please try again later.')
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setPage(1)
  }

  if (loading && courses.length === 0 && !searchTerm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-border-light border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-text-muted mt-4 text-lg">Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="bg-bg-primary border-b border-border-light py-16">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Explore Our <span className="text-primary-600">Courses</span>
            </h1>
            <p className="text-xl text-text-secondary">
              Discover thousands of courses taught by expert instructors and advance your career today.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {isSearching ? (
                  <div className="h-5 w-5 border-2 border-border-light border-t-primary-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              <input
                type="text"
                placeholder="Search for courses, skills, or topics..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                className="block w-full pl-12 pr-12 py-4 bg-bg-primary text-text-primary placeholder-text-muted border border-border-light rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p><strong>Error:</strong> {error}</p>
            </div>
            <button onClick={fetchCourses} className="btn btn-secondary text-sm bg-bg-primary text-rose-700 border-rose-200 hover:bg-rose-50">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-20 bg-bg-secondary rounded-3xl border-dashed border-2 border-border-light">
            <div className="text-6xl mb-6 opacity-50 grayscale">🔍</div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              No courses found
            </h3>
            <p className="text-text-secondary">
              {searchTerm ? `No results found for "${searchTerm}"` : 'Check back later for new courses!'}
            </p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="group"
            >
              <div className="card h-full p-0 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-border-light">
                <div className="h-56 relative overflow-hidden bg-bg-tertiary">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-600 group-hover:scale-105 transition-transform duration-500"></div>
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="badge badge-success bg-bg-primary/90 backdrop-blur text-emerald-700 shadow-sm">
                      New
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent pt-12">
                    <h3 className="text-xl font-bold text-white leading-tight mb-1">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge badge-primary">Course</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Development</span>
                  </div>

                  <p className="text-text-secondary text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 mb-4 pt-4 border-t border-border-light">
                    <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary font-bold text-sm">
                      {course.instructor?.name?.charAt(0) || 'I'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {course.instructor?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-text-muted">
                        Instructor
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-text-secondary bg-bg-secondary rounded-lg p-3">
                    <span className="flex items-center gap-1.5">
                      <span>📚</span> {course.lectures?.length || 0} lectures
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>👥</span> {course.enrolledStudents?.length || 0} students
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`btn w-10 h-10 p-0 ${page === pageNum ? 'btn-primary' : 'btn-secondary'}`}
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
      </div>
    </div>
  )
}

export default CourseList