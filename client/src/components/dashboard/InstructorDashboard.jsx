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
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
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
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 mt-4 text-lg">Loading your dashboard...</p>
      </div>
    )
  }

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)
  const totalLectures = courses.reduce((sum, course) => sum + (course.lectures?.length || 0), 0)

  return (
    <div className="min-h-screen pb-20 pt-20">
      {/* Header */}
      <section className="relative py-12 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-12 opacity-30 animate-pulse">
          <div className="w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-lg shadow-indigo-500/30 animate-float">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-slate-300 text-lg">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl text-purple-400">
                📚
              </div>
              <span className="badge badge-secondary">Teaching</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{courses.length}</div>
            <div className="text-slate-400 text-sm font-medium">My Courses</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl text-emerald-400">
                👥
              </div>
              <span className="badge badge-success">Enrolled</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalStudents}</div>
            <div className="text-slate-400 text-sm font-medium">Total Students</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl text-blue-400">
                📹
              </div>
              <span className="badge badge-primary">Published</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalLectures}</div>
            <div className="text-slate-400 text-sm font-medium">Total Lectures</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl text-amber-400">
                ⭐
              </div>
              <span className="badge badge-warning">Rating</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">4.9</div>
            <div className="text-slate-400 text-sm font-medium">Avg. Rating</div>
          </div>
        </div>

        {/* My Courses */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">My Courses</h2>
              <p className="text-slate-400">Manage and track your courses</p>
            </div>
            <Link to="/courses/create" className="btn btn-primary">
              <span>➕</span>
              <span>Create New Course</span>
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-slate-700 bg-transparent">
              <div className="text-6xl mb-6 opacity-50">🎓</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Start Teaching Today
              </h3>
              <p className="text-slate-400 mb-8 max-w-md">
                You haven't created any courses yet. Share your knowledge and start teaching students worldwide!
              </p>
              <Link to="/courses/create" className="btn btn-primary btn-large">
                <span>✨</span>
                <span>Create Your First Course</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {courses.map((course, index) => (
                <div
                  key={course._id}
                  className="card p-0 overflow-hidden flex flex-col md:flex-row card-hover border-slate-700/50"
                >
                  <div className="w-full md:w-64 h-48 md:h-auto relative bg-slate-800 shrink-0">
                    {/* Placeholder gradient/pattern if no image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">📚</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {course.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className="badge badge-primary">
                              📹 {course.lectures?.length || 0} lectures
                            </span>
                            <span className="badge badge-success">
                              👥 {course.enrolledStudents?.length || 0} students
                            </span>
                            <span className="badge badge-info">
                              📅 {new Date(course.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            to={`/courses/${course._id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            <span>👁️</span>
                            <span>View</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="btn btn-ghost hover:text-red-400 btn-sm"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-400 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-500">
                      <span>Last updated: {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}</span>
                      <span className="text-purple-400 font-medium cursor-pointer hover:underline">Manage Content →</span>
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