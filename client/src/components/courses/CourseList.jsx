import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI } from '../../services/api'

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
      setError('Unable to load courses. Please try again later.')
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
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 mt-4 text-lg">Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 pt-20">
      {/* Header */}
      <section className="relative py-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 p-12 opacity-30">
          <div className="w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-gradient">Premium Courses</span>
            </h1>
            <p className="text-xl text-slate-400">
              Discover thousands of courses taught by expert instructors and advance your career today.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for courses, skills, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-800 text-white placeholder-slate-400 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p><strong>Error:</strong> {error}</p>
            </div>
            <button onClick={fetchCourses} className="btn btn-secondary text-sm">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-50">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No courses found
            </h3>
            <p className="text-slate-400">
              {searchTerm ? `No results found for "${searchTerm}"` : 'Check back later for new courses!'}
            </p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCourses.map((course, index) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="group"
            >
              <div className="card h-full p-0 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border-slate-700/50 flex flex-col">
                <div className="h-56 relative overflow-hidden bg-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 group-hover:scale-110 transition-transform duration-700"></div>
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="badge badge-success backdrop-blur-md bg-emerald-500/20 border-emerald-500/30">
                      New
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900 to-transparent pt-12">
                    <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-indigo-300 transition-colors">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge badge-primary">Course</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Development</span>
                  </div>

                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 mb-4 pt-4 border-t border-slate-700/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {course.instructor?.name?.charAt(0) || 'I'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {course.instructor?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-slate-500">
                        Instructor
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 bg-slate-800/50 rounded-lg p-3">
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