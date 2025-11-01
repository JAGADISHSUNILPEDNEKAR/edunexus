import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI, assignmentAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

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
      showToast('error', 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--neutral-50)' }}>
        <div className="spinner-lg"></div>
        <p style={{ color: 'var(--neutral-600)', marginTop: '1rem', fontSize: '1.0625rem', fontWeight: '500' }}>
          Loading your dashboard...
        </p>
      </div>
    )
  }

  const totalLectures = enrolledCourses.reduce((sum, course) => sum + (course.lectureCount || course.lectures?.length || 0), 0)

  return (
    <div style={{ background: 'var(--neutral-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-xl)',
          background: toast.type === 'error' ? 'var(--error-light)' : 'var(--success-light)',
          border: `2px solid ${toast.type === 'error' ? 'var(--error)' : 'var(--success)'}`,
          color: toast.type === 'error' ? '#991b1b' : '#065f46',
          boxShadow: 'var(--shadow-2xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontSize: '1.25rem' }}>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span style={{ fontWeight: '600' }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ 
            marginLeft: '0.5rem', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1.25rem',
            lineHeight: 1
          }}>×</button>
        </div>
      )}

      {/* Header with Gradient Background */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '3rem 0', 
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <span>Student</span>
            <span>›</span>
            <span>Dashboard</span>
          </div>

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
              <h1 style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                color: 'white', 
                marginBottom: '0.5rem',
                fontWeight: '800'
              }}>
                Welcome back, {user?.name}!
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.95)', 
                fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)', 
                margin: 0 
              }}>
                Continue your learning journey
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid" style={{ marginBottom: '3rem' }}>
          {[
            { 
              label: 'Enrolled Courses', 
              value: enrolledCourses.length, 
              icon: '📚', 
              color: 'purple', 
              badge: 'Active',
              description: 'Keep learning to reach your goals'
            },
            { 
              label: 'Assignments Submitted', 
              value: submissions.length, 
              icon: '✅', 
              color: 'green', 
              badge: 'Completed',
              description: 'Great progress this month!'
            },
            { 
              label: 'Total Lectures', 
              value: totalLectures, 
              icon: '📹', 
              color: 'blue', 
              badge: 'Available',
              description: 'Hours of quality content'
            },
            { 
              label: 'Day Streak', 
              value: '7', 
              icon: '🔥', 
              color: 'orange', 
              badge: 'Streak',
              description: 'Keep it up! You\'re on fire 🔥'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="stat-card animate-scaleIn"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'white',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-2xl)',
                border: '2px solid var(--neutral-100)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '1rem' 
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-xl)',
                  background: `linear-gradient(135deg, var(--${stat.color === 'purple' ? 'primary-500' : stat.color === 'green' ? 'success' : stat.color === 'blue' ? 'info' : 'warning'}), var(--${stat.color === 'purple' ? 'primary-600' : stat.color === 'green' ? 'success' : stat.color === 'blue' ? 'info' : 'warning'}))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  {stat.icon}
                </div>
                <span className={`badge badge-${stat.color === 'purple' ? 'primary' : stat.color === 'green' ? 'success' : stat.color === 'blue' ? 'info' : 'warning'}`}>
                  {stat.badge}
                </span>
              </div>
              <div className="stat-card-value" style={{ 
                fontSize: '3.5rem',
                fontWeight: '800',
                color: `var(--${stat.color === 'purple' ? 'primary-600' : stat.color === 'green' ? 'success' : stat.color === 'blue' ? 'info' : 'warning'})`
              }}>
                {stat.value}
              </div>
              <div className="stat-card-label" style={{ marginBottom: '1rem' }}>{stat.label}</div>
              <div style={{ 
                marginTop: '1rem', 
                paddingTop: '1rem', 
                borderTop: '1px solid var(--neutral-200)' 
              }}>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--neutral-600)', 
                  margin: 0 
                }}>
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* My Courses Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
                color: 'var(--neutral-900)', 
                marginBottom: '0.5rem',
                fontWeight: '800'
              }}>My Courses</h2>
              <p style={{ color: 'var(--neutral-600)', margin: 0 }}>Continue where you left off</p>
            </div>
            <Link to="/courses" className="btn btn-primary" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🔍</span>
              <span>Browse More Courses</span>
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="card text-center" style={{ padding: 'clamp(2rem, 5vw, 4rem) 2rem' }}>
              <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '1.5rem' }}>📚</div>
              <h3 style={{ 
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
                color: 'var(--neutral-900)', 
                marginBottom: '1rem',
                fontWeight: '700'
              }}>
                Start Your Learning Journey
              </h3>
              <p style={{ 
                color: 'var(--neutral-600)', 
                marginBottom: '2rem', 
                maxWidth: '500px', 
                margin: '0 auto 2rem',
                lineHeight: 1.6
              }}>
                You haven't enrolled in any courses yet. Explore our catalog and find the perfect course for you!
              </p>
              <Link to="/courses" className="btn btn-primary btn-large" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✨</span>
                <span>Explore Courses</span>
              </Link>
            </div>
          ) : (
            <div className="grid-2">
              {enrolledCourses.map((course, index) => {
                // Calculate progress (if available)
                const progress = course.progress || Math.floor(Math.random() * 100) // Fallback for demo
                
                return (
                  <Link
                    key={course._id}
                    to={`/courses/${course._id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div 
                      className="card animate-fadeIn" 
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Course Header with Gradient */}
                      <div style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
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
                          fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', 
                          color: 'white', 
                          marginBottom: '0',
                          position: 'relative',
                          zIndex: 1,
                          fontWeight: '700',
                          lineHeight: 1.3
                        }}>
                          {course.title}
                        </h3>
                      </div>
                      
                      <p style={{ 
                        color: 'var(--neutral-600)', 
                        fontSize: '0.9375rem', 
                        marginBottom: '1.5rem', 
                        lineHeight: '1.6',
                        flex: 1
                      }}>
                        {course.description}
                      </p>
                      
                      {/* Instructor Info */}
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
                          background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          flexShrink: 0
                        }}>
                          👨‍🏫
                        </div>
                        <div>
                          <div style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: 'var(--neutral-900)' 
                          }}>
                            {course.instructor?.name || 'Instructor'}
                          </div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--neutral-500)' 
                          }}>
                            Instructor
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: '600',
                            color: 'var(--neutral-600)'
                          }}>
                            Progress
                          </span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '700',
                            color: 'var(--primary-600)'
                          }}>
                            {progress}%
                          </span>
                        </div>
                        <div className="progress-bar" style={{ height: '8px', marginBottom: '1rem' }}>
                          <div 
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        {/* Footer */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          paddingTop: '1.25rem',
                          borderTop: '2px solid var(--neutral-100)'
                        }}>
                          <div style={{ 
                            fontSize: '0.875rem', 
                            color: 'var(--neutral-600)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem' 
                          }}>
                            <span>📹</span>
                            <span>{course.lectures?.length || 0} lectures</span>
                          </div>
                          <span className="btn btn-primary" style={{ 
                            padding: '0.5rem 1rem', 
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}>
                            Continue →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              color: 'var(--neutral-900)', 
              marginBottom: '0.5rem',
              fontWeight: '800'
            }}>Recent Submissions</h2>
            <p style={{ color: 'var(--neutral-600)', margin: 0 }}>Track your assignment progress</p>
          </div>
          
          {submissions.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                color: 'var(--neutral-900)', 
                marginBottom: '0.5rem',
                fontWeight: '700'
              }}>
                No submissions yet
              </h3>
              <p style={{ color: 'var(--neutral-600)', margin: 0 }}>
                Start completing assignments to see your progress here
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--neutral-50)' }}>
                      {['Assignment', 'Course', 'Submitted', 'Score'].map((header) => (
                        <th key={header} style={{ 
                          padding: '1.25rem 1.5rem', 
                          textAlign: header === 'Score' ? 'right' : 'left', 
                          fontSize: '0.875rem', 
                          fontWeight: '700', 
                          color: 'var(--neutral-700)', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em',
                          borderBottom: '2px solid var(--neutral-200)'
                        }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.slice(0, 5).map((submission, index) => (
                      <tr
                        key={submission._id}
                        className="animate-fadeIn"
                        style={{ 
                          animationDelay: `${index * 0.05}s`,
                          borderBottom: '1px solid var(--neutral-100)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--neutral-50)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ 
                            fontWeight: '600', 
                            color: 'var(--neutral-900)', 
                            marginBottom: '0.25rem' 
                          }}>
                            {submission.assignment?.title || 'Assignment'}
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                            {submission.assignment?.course?.title || 'Course'}
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
                            {new Date(submission.submittedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                          {submission.score !== null && submission.score !== undefined ? (
                            <span className="badge badge-success" style={{ 
                              padding: '0.5rem 1rem',
                              fontSize: '0.875rem'
                            }}>
                              {submission.score}/{submission.assignment?.maxScore || 100}
                            </span>
                          ) : (
                            <span className="badge badge-warning" style={{ 
                              padding: '0.5rem 1rem',
                              fontSize: '0.875rem'
                            }}>
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