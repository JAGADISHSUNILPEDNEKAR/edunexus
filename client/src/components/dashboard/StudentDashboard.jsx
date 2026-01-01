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
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 mt-4 text-lg">Loading your dashboard...</p>
      </div>
    )
  }

  const totalLectures = enrolledCourses.reduce((sum, course) => sum + (course.lectureCount || 0), 0)

  return (
    <div className="min-h-screen pb-20 pt-20">
      {/* Header Section */}
      <section className="relative py-12 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-12 opacity-30 animate-pulse">
          <div className="w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg shadow-purple-500/30 animate-float">
              🎓
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-slate-300 text-lg">
                Continue your learning journey
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
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-2xl text-indigo-400">
                📚
              </div>
              <span className="badge badge-primary">Active</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{enrolledCourses.length}</div>
            <div className="text-slate-400 text-sm font-medium">Enrolled Courses</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl text-emerald-400">
                ✅
              </div>
              <span className="badge badge-success">Completed</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{submissions.length}</div>
            <div className="text-slate-400 text-sm font-medium">Assignments Done</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl text-blue-400">
                📹
              </div>
              <span className="badge badge-secondary">Watch Time</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalLectures}</div>
            <div className="text-slate-400 text-sm font-medium">Total Lectures</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl text-amber-400">
                🔥
              </div>
              <span className="badge badge-warning">Streak</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">7</div>
            <div className="text-slate-400 text-sm font-medium">Day Streak</div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">My Courses</h2>
              <p className="text-slate-400">Continue where you left off</p>
            </div>
            <Link to="/courses" className="btn btn-primary">
              Browse More Courses
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-slate-700 bg-transparent">
              <div className="text-6xl mb-6 opacity-50">📚</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Start Your Learning Journey
              </h3>
              <p className="text-slate-400 mb-8 max-w-md">
                You haven't enrolled in any courses yet. Explore our catalog and find the perfect course for you!
              </p>
              <Link to="/courses" className="btn btn-primary btn-large">
                ✨ Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group"
                >
                  <div className="card h-full flex flex-col card-hover p-0 overflow-hidden border-slate-700/50">
                    <div className="h-48 relative overflow-hidden bg-slate-800">
                      {/* Placeholder gradient/pattern if no image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 group-hover:scale-110 transition-transform duration-700"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-slate-900 to-transparent">
                        <h3 className="text-xl font-bold text-white leading-tight">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                          👨‍🏫
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {course.instructor?.name || 'Instructor'}
                          </p>
                          <p className="text-xs text-slate-500">Instructor</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div className="flex items-center text-slate-400 text-sm gap-2">
                          <span>📹</span>
                          <span>{course.lectures?.length || 0} lectures</span>
                        </div>
                        <span className="text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Continue →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Recent Submissions</h2>
            <p className="text-slate-400">Track your assignment progress</p>
          </div>

          {submissions.length === 0 ? (
            <div className="card p-12 text-center border-dashed border-slate-700">
              <div className="text-4xl mb-4 opacity-50">📝</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No submissions yet
              </h3>
              <p className="text-slate-400">
                Start completing assignments to see your progress here
              </p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Assignment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {submissions.slice(0, 5).map((submission, index) => (
                      <tr
                        key={submission._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">
                            {submission.assignment?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-400">
                            {submission.assignment?.course?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-400">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {submission.score !== null ? (
                            <span className="badge badge-success">
                              {submission.score}/{submission.assignment?.maxScore}
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard