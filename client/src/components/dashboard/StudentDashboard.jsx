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
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--gray-600)', marginTop: '1rem', fontSize: '1.0625rem' }}>Loading your dashboard...</p>
      </div>
    )
  }

  const totalLectures = enrolledCourses.reduce((sum, course) => sum + (course.lectureCount || 0), 0)

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header with Gradient Background */}
      <section style={{ 
        background: 'var(--gradient-primary)', 
        padding: '3rem 0', 
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              🎓
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'white', marginBottom: '0.5rem' }}>
                Welcome back, {user?.name}!
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.0625rem', margin: 0 }}>
                Continue your learning journey
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid" style={{ marginBottom: '3rem' }}>
          <div className="stat-card animate-scaleIn" style={{ animationDelay: '0s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                📚
              </div>
              <span className="badge badge-primary">Active</span>
            </div>
            <div className="stat-card-value">{enrolledCourses.length}</div>
            <div className="stat-card-label">Enrolled Courses</div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                Keep learning to reach your goals
              </p>
            </div>
          </div>
          
          <div className="stat-card animate-scaleIn" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--gradient-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                ✅
              </div>
              <span className="badge badge-success">Completed</span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>{submissions.length}</div>
            <div className="stat-card-label">Assignments Submitted</div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                Great progress this month!
              </p>
            </div>
          </div>
          
          <div className="stat-card animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                📹
              </div>
              <span className="badge badge-info">Available</span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--info)' }}>{totalLectures}</div>
            <div className="stat-card-label">Total Lectures</div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                Hours of quality content
              </p>
            </div>
          </div>
          
          <div className="stat-card animate-scaleIn" style={{ animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🔥
              </div>
              <span className="badge badge-warning">Streak</span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--warning)' }}>7</div>
            <div className="stat-card-label">Day Streak</div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                Keep it up! You're on fire 🔥
              </p>
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>My Courses</h2>
              <p style={{ color: 'var(--gray-600)', margin: 0 }}>Continue where you left off</p>
            </div>
            <Link to="/courses" className="btn btn-primary">
              <span>🔍</span>
              <span>Browse More Courses</span>
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="card text-center" style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginBottom: '1rem' }}>
                Start Your Learning Journey
              </h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                You haven't enrolled in any courses yet. Explore our catalog and find the perfect course for you!
              </p>
              <Link to="/courses" className="btn btn-primary btn-large">
                <span>✨</span>
                <span>Explore Courses</span>
              </Link>
            </div>
          ) : (
            <div className="grid-2">
              {enrolledCourses.map((course, index) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card animate-fadeIn" style={{ 
                    animationDelay: `${index * 0.1}s`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ 
                      background: 'var(--gradient-primary)', 
                      borderRadius: 'var(--radius-xl)',
                      padding: '2rem',
                      marginBottom: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        width: '200%',
                        height: '200%',
                        top: '-50%',
                        left: '-50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        animation: 'rotate 20s linear infinite'
                      }}></div>
                      <h3 style={{ 
                        fontSize: '1.375rem', 
                        color: 'white', 
                        marginBottom: '0',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {course.title}
                      </h3>
                    </div>
                    
                    <p style={{ 
                      color: 'var(--gray-600)', 
                      fontSize: '0.9375rem', 
                      marginBottom: '1.5rem', 
                      lineHeight: '1.6',
                      flex: 1
                    }}>
                      {course.description}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--primary-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        👨‍🏫
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-900)' }}>
                          {course.instructor?.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                          Instructor
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--gray-200)'
                    }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📹</span>
                        <span>{course.lectures?.length || 0} lectures</span>
                      </div>
                      <div className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Continue →
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
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Recent Submissions</h2>
            <p style={{ color: 'var(--gray-600)', margin: 0 }}>Track your assignment progress</p>
          </div>
          
          {submissions.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                No submissions yet
              </h3>
              <p style={{ color: 'var(--gray-600)', margin: 0 }}>
                Start completing assignments to see your progress here
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--gray-50)', borderBottom: '2px solid var(--gray-200)' }}>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700', color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Assignment
                      </th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700', color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Course
                      </th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '700', color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Submitted
                      </th>
                      <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '700', color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.slice(0, 5).map((submission, index) => (
                      <tr
                        key={submission._id}
                        className="animate-fadeIn"
                        style={{ 
                          animationDelay: `${index * 0.05}s`,
                          borderBottom: '1px solid var(--gray-100)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ fontWeight: '600', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                            {submission.assignment?.title}
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            {submission.assignment?.course?.title}
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                            {new Date(submission.submittedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                          {submission.score !== null ? (
                            <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>
                              {submission.score}/{submission.assignment?.maxScore}
                            </span>
                          ) : (
                            <span className="badge badge-warning" style={{ padding: '0.5rem 1rem' }}>
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