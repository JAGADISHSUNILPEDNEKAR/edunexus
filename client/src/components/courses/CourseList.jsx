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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner"></div>
          <p style={{ color: 'var(--gray-600)', marginTop: '1rem' }}>Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '3rem 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
              Explore Courses
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto' }}>
              Discover thousands of courses taught by expert instructors
            </p>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div style={{ position: 'relative' }}>
              <svg 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'var(--gray-400)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '3rem' }}>
        {/* Error State */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            <strong>Error:</strong> {error}
            <button onClick={fetchCourses} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              No courses found
            </h3>
            <p style={{ color: 'var(--gray-600)' }}>
              {searchTerm ? 'Try a different search term' : 'Check back later for new courses!'}
            </p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {filteredCourses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="course-card">
                <div className="course-card-header">
                  <h3 className="course-card-title">{course.title}</h3>
                </div>
                
                <div className="course-card-body">
                  <div style={{ marginBottom: '1rem' }}>
                    <span className="badge badge-primary">Course</span>
                  </div>
                  
                  <p className="course-card-description">
                    {course.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      background: 'var(--primary-blue)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      {course.instructor?.name?.charAt(0) || 'I'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-900)' }}>
                        {course.instructor?.name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        Instructor
                      </div>
                    </div>
                  </div>

                  <div className="course-card-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      📚 {course.lectures?.length || 0} lectures
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      👥 {course.enrolledStudents?.length || 0} students
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary"
              style={{ opacity: page === 1 ? '0.5' : '1' }}
            >
              ← Previous
            </button>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={page === pageNum ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ 
                      minWidth: '40px',
                      ...(page === pageNum && { transform: 'scale(1.1)' })
                    }}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary"
              style={{ opacity: page === totalPages ? '0.5' : '1' }}
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