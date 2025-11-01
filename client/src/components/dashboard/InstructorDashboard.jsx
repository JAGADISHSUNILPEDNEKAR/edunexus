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
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--gray-600)', marginTop: '1rem', fontSize: '1.0625rem' }}>Loading your dashboard...</p>
      </div>
    )
  }

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)
  const totalLectures = courses.reduce((sum, course) => sum + (course.lectures?.length || 0), 0)

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
              👨‍🏫
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'white', marginBottom: '0.5rem' }}>
                Instructor Dashboard
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.0625rem', margin: 0 }}>
                Welcome, {user?.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Stats */}
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
              <span className="badge badge-instructor">Teaching</span>
            </div>
            <div className="stat-card-value">{courses.length}</div>
            <div className="stat-card-label">My Courses</div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                Active courses you're teaching
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
                👥
              </div>
              <span className="badge badge-success">Enrolled</span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>{totalStudents}</div>
            <div className="stat-card-label">Total Students</div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                Students learning from you
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
              <span className="badge badge-info">Published</span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--info)' }}>{totalLectures}</div>
            <div className="stat-card-label">Total Lectures</div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                Content available to students
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
                ⭐
              </div>
              <span className="badge badge-warning">Rating</span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--warning)' }}>4.9</div>
            <div className="stat-card-label">Avg. Rating</div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
                Student satisfaction score
              </p>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--gray-900)', marginBottom: '0.5rem' }}>My Courses</h2>
              <p style={{ color: 'var(--gray-600)', margin: 0 }}>Manage and track your courses</p>
            </div>
            <Link to="/courses/create" className="btn btn-primary">
              <span>➕</span>
              <span>Create New Course</span>
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="card text-center" style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginBottom: '1rem' }}>
                Start Teaching Today
              </h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                You haven't created any courses yet. Share your knowledge and start teaching students worldwide!
              </p>
              <Link to="/courses/create" className="btn btn-primary btn-large">
                <span>✨</span>
                <span>Create Your First Course</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div 
                  key={course._id} 
                  className="card animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: 'var(--radius-lg)',
                          background: 'var(--gradient-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.75rem',
                          flexShrink: 0
                        }}>
                          📚
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
                            {course.title}
                          </h3>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span className="badge badge-primary">
                              📹 {course.lectures?.length || 0} lectures
                            </span>
                            <span className="badge badge-success">
                              👥 {course.enrolledStudents?.length || 0} students
                            </span>
                            <span className="badge badge-info">
                              📅 Created {new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '0' }}>
                        {course.description}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                      <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-secondary"
                      >
                        <span>👁️</span>
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="btn btn-danger"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
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