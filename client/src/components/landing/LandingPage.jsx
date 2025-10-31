import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Transform Your Future with EduNexus</h1>
          <p>
            Join thousands of students learning from world-class instructors in our interactive online platform
          </p>
          
          <div className="flex gap-4 justify-center mt-4">
            {isAuthenticated ? (
              <>
                <Link to={`/dashboard/${user?.role}`} className="btn btn-primary btn-large">
                  Go to Dashboard →
                </Link>
                <Link to="/courses" className="btn btn-secondary btn-large">
                  Explore Courses
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="stats-grid mt-4" style={{ maxWidth: '900px', margin: '3rem auto 0' }}>
            {[
              { value: '10,000+', label: 'Students' },
              { value: '500+', label: 'Courses' },
              { value: '50+', label: 'Instructors' },
              { value: '4.9/5', label: 'Rating' },
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.9375rem', opacity: '0.9' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'var(--gray-50)', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose EduNexus?</h2>
            <p className="section-subtitle">
              Everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {[
              {
                icon: '🎓',
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of experience'
              },
              {
                icon: '📹',
                title: 'HD Video Lectures',
                description: 'High-quality video content accessible anytime, anywhere'
              },
              {
                icon: '💬',
                title: 'Real-time Chat',
                description: 'Connect with instructors and peers instantly'
              },
              {
                icon: '📝',
                title: 'Practical Assignments',
                description: 'Apply what you learn with real-world projects'
              },
            ].map((feature, index) => (
              <div key={index} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem', margin: '0' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section style={{ background: 'var(--primary-blue)', color: 'white', padding: '5rem 0' }}>
          <div className="container text-center">
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>
              Ready to Start Learning?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Join thousands of students and transform your career today
            </p>
            <Link to="/register" className="btn btn-large" style={{ background: 'white', color: 'var(--primary-blue)' }}>
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default LandingPage