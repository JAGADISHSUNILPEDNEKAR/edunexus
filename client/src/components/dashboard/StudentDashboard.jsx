// Modern Student Dashboard
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  const totalLectures = enrolledCourses.reduce((sum, course) => sum + (course.lectureCount || 0), 0)

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Header */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: 'var(--gray-600)' }}>Here's your learning progress</p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value">{enrolledCourses.length}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{submissions.length}</div>
            <div className="stat-label">Assignments Submitted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{totalLectures}</div>
            <div className="stat-label">Total Lectures</div>
          </div>
        </div>

        {/* My Courses */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)' }}>My Courses</h2>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
                You haven't enrolled in any courses yet.
              </p>
              <Link to="/courses" className="btn btn-primary">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid-2">
              {enrolledCourses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card">
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '1rem', lineClamp: 2 }}>
                      {course.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                      <span>👨‍🏫 {course.instructor?.name}</span>
                      <span>📚 {course.lectures?.length || 0} lectures</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Recent Submissions</h2>
          
          {submissions.length === 0 ? (
            <div className="card text-center" style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--gray-600)' }}>No submissions yet.</p>
            </div>
          ) : (
            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submissions.slice(0, 5).map((submission) => (
                  <div
                    key={submission._id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--gray-200)'
                    }}
                  >
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {submission.assignment?.title}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: '0' }}>
                        {submission.assignment?.course?.title}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                      {submission.score !== null && (
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--success)' }}>
                          Score: {submission.score}/{submission.assignment?.maxScore}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
