import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const InstructorDashboard = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructorCourses()
  }, [])

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true)
      const response = await courseAPI.getInstructorCourses()
      setCourses(response.data.courses)
    } catch (err) {
      console.error('Failed to fetch instructor courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(courseId)
        setCourses(courses.filter(c => c._id !== courseId))
      } catch (err) {
        console.error('Failed to delete course:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-border-light border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-text-muted mt-4 text-lg">Loading dashboard...</p>
      </div>
    )
  }

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)

  // Calculate average rating safely
  const coursesWithRatings = courses.filter(c => c.rating)
  const avgRating = coursesWithRatings.length > 0
    ? (coursesWithRatings.reduce((sum, c) => sum + c.rating, 0) / coursesWithRatings.length).toFixed(1)
    : 'New'

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-bg-primary border-b border-border-light py-12 mb-8">
        <div className="container-custom">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center text-4xl shadow-sm text-primary-600">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-text-secondary text-lg">
                Manage your courses and track student progress
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card hover:-translate-y-1 transition-transform border-l-4 border-l-primary-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl text-primary-600">
                📚
              </div>
              <span className="badge badge-primary">Total</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{courses.length}</div>
            <div className="text-text-muted text-sm font-medium">Active Courses</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl text-emerald-600">
                👥
              </div>
              <span className="badge badge-success">Enrolled</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{totalStudents}</div>
            <div className="text-text-muted text-sm font-medium">Total Students</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl text-amber-600">
                ⭐
              </div>
              <span className="badge badge-warning">Rating</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{avgRating}</div>
            <div className="text-text-muted text-sm font-medium">Average Rating</div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-1">My Courses</h2>
              <p className="text-text-muted">Create and manage your content</p>
            </div>
            <Link to="/courses/create" className="btn btn-primary">
              <span>➕</span> Create New Course
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-border-light bg-bg-secondary shadow-none">
              <div className="text-6xl mb-6 opacity-50 grayscale">📝</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Start Teaching Today
              </h3>
              <p className="text-text-secondary mb-8 max-w-md">
                You haven't created any courses yet. Share your knowledge with the world!
              </p>
              <Link to="/courses/create" className="btn btn-primary btn-large">
                Create Your First Course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="card group p-0 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300">
                  <div className="h-48 bg-bg-tertiary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-600 group-hover:scale-105 transition-transform duration-500 opacity-90"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-text-secondary text-sm line-clamp-2 mb-6 flex-1">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-border-light">
                      <div className="text-center p-2 rounded-lg bg-bg-tertiary">
                        <div className="text-lg font-bold text-text-primary">{course.lectures?.length || 0}</div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Lectures</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-bg-tertiary">
                        <div className="text-lg font-bold text-text-primary">{course.enrolledStudents?.length || 0}</div>
                        <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Students</div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <Link to={`/courses/${course._id}/edit`} className="btn btn-secondary flex-1 text-sm justify-center">
                        Edit
                      </Link>
                      <Link to={`/courses/${course._id}`} className="btn btn-primary flex-1 text-sm justify-center">
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard