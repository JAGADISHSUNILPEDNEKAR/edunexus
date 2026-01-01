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
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 mt-4 text-lg">Loading your dashboard...</p>
      </div>
    )
  }

  const totalLectures = enrolledCourses.reduce((sum, course) => sum + (course.lectureCount || 0), 0)

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-200 py-12 mb-8">
        <div className="container-custom">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-4xl shadow-sm text-indigo-600">
              🎓
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-slate-500 text-lg">
                Continue your learning journey
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card hover:-translate-y-1 transition-transform border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl text-indigo-600">
                📚
              </div>
              <span className="badge badge-primary">Active</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{enrolledCourses.length}</div>
            <div className="text-slate-500 text-sm font-medium">Enrolled Courses</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl text-emerald-600">
                ✅
              </div>
              <span className="badge badge-success">Completed</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{submissions.length}</div>
            <div className="text-slate-500 text-sm font-medium">Assignments Done</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl text-purple-600">
                📹
              </div>
              <span className="badge badge-secondary">Watch Time</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalLectures}</div>
            <div className="text-slate-500 text-sm font-medium">Total Lectures</div>
          </div>

          <div className="card hover:-translate-y-1 transition-transform border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl text-amber-600">
                🔥
              </div>
              <span className="badge badge-warning">Streak</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">7</div>
            <div className="text-slate-500 text-sm font-medium">Day Streak</div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">My Courses</h2>
              <p className="text-slate-500">Continue where you left off</p>
            </div>
            <Link to="/courses" className="btn btn-primary">
              Browse More Courses
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none">
              <div className="text-6xl mb-6 opacity-50 grayscale">📚</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Start Your Learning Journey
              </h3>
              <p className="text-slate-500 mb-8 max-w-md">
                You haven't enrolled in any courses yet. Explore our catalog and find the perfect course for you!
              </p>
              <Link to="/courses" className="btn btn-primary btn-large">
                ✨ Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group"
                >
                  <div className="card h-full flex flex-col p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 relative overflow-hidden bg-slate-100">
                      {/* Generative placeholder pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-105 transition-transform duration-500"></div>
                      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {course.instructor?.name?.charAt(0) || 'I'}
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-medium text-slate-900">{course.instructor?.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center text-slate-500 text-xs font-medium gap-1.5">
                          <span>📹</span>
                          <span>{course.lectures?.length || 0} lectures</span>
                        </div>
                        <span className="text-indigo-600 text-sm font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Recent Submissions</h2>
            <p className="text-slate-500">Track your assignment progress</p>
          </div>

          {submissions.length === 0 ? (
            <div className="card p-12 text-center border-dashed border-slate-200 bg-slate-50/50 shadow-none">
              <div className="text-4xl mb-4 opacity-50 grayscale">📝</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No submissions yet
              </h3>
              <p className="text-slate-500">
                Start completing assignments to see your progress here
              </p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.slice(0, 5).map((submission) => (
                      <tr
                        key={submission._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">
                            {submission.assignment?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-500">
                            {submission.assignment?.course?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-500">
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