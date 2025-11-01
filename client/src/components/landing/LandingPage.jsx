import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth()

  const features = [
    {
      icon: '🎓',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: '📹',
      title: 'HD Video Lectures',
      description: 'High-quality video content accessible anytime, anywhere on any device',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: '💬',
      title: 'Real-time Chat',
      description: 'Connect with instructors and peers instantly through live discussions',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: '📝',
      title: 'Practical Assignments',
      description: 'Apply what you learn with real-world projects and hands-on exercises',
      gradient: 'from-orange-500 to-amber-600'
    },
  ]

  const benefits = [
    { icon: '⚡', text: 'Lifetime access to course materials' },
    { icon: '📱', text: 'Learn on mobile, tablet, or desktop' },
    { icon: '🎯', text: 'Track your progress and achievements' },
    { icon: '🏆', text: 'Earn certificates upon completion' },
    { icon: '🔄', text: 'Regular content updates' },
    { icon: '👥', text: 'Join a community of learners' },
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="animate-fadeIn">
              Transform Your Future with <br />EduNexus
            </h1>
            <p className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              Join thousands of students learning from world-class instructors in our interactive online platform
            </p>
            
            <div className="flex gap-4 justify-center mt-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {isAuthenticated ? (
                <>
                  <Link to={`/dashboard/${user?.role}`} className="btn btn-large" style={{ background: 'white', color: 'var(--accent-purple)' }}>
                    <span>🎯</span>
                    <span>Go to Dashboard</span>
                  </Link>
                  <Link to="/courses" className="btn btn-large" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
                    <span>📚</span>
                    <span>Explore Courses</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-large" style={{ background: 'white', color: 'var(--accent-purple)' }}>
                    <span>✨</span>
                    <span>Get Started Free</span>
                  </Link>
                  <Link to="/login" className="btn btn-large" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
                    <span>🔐</span>
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ maxWidth: '900px', margin: '5rem auto 0', position: 'relative' }}>
              {[
                { value: '10,000+', label: 'Students', icon: '👨‍🎓' },
                { value: '500+', label: 'Courses', icon: '📚' },
                { value: '50+', label: 'Instructors', icon: '👨‍🏫' },
                { value: '4.9/5', label: 'Rating', icon: '⭐' },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="animate-scaleIn"
                  style={{ 
                    animationDelay: `${0.3 + index * 0.1}s`,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-2xl)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'var(--gray-50)', padding: '6rem 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose EduNexus?</h2>
            <p className="section-subtitle">
              Everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card animate-fadeIn"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  textAlign: 'center',
                  padding: '2.5rem 2rem'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.5rem',
                  background: `linear-gradient(135deg, var(--${feature.gradient}))`,
                  borderRadius: 'var(--radius-2xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                >
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.375rem', marginBottom: '0.75rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem', margin: '0', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ background: 'white', padding: '6rem 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What You'll Get</h2>
            <p className="section-subtitle">
              Premium features designed for your success
            </p>
          </div>

          <div className="grid-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="animate-scaleIn"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-xl)',
                  border: '2px solid var(--gray-200)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(10px)'
                  e.currentTarget.style.borderColor = 'var(--accent-purple)'
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.borderColor = 'var(--gray-200)'
                  e.currentTarget.style.background = 'var(--gray-50)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  {benefit.icon}
                </div>
                <span style={{ fontSize: '0.9375rem', color: 'var(--gray-700)', fontWeight: '500' }}>
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ background: 'var(--gray-50)', padding: '6rem 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Students Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied learners
            </p>
          </div>

          <div className="grid-3">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Web Developer',
                image: '👩‍💻',
                text: 'EduNexus transformed my career! The courses are comprehensive and the instructors are incredibly supportive.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Data Scientist',
                image: '👨‍💼',
                text: 'The best online learning platform I\'ve used. The real-time chat feature makes learning interactive and engaging.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'UX Designer',
                image: '👩‍🎨',
                text: 'High-quality content and excellent instructors. I learned more here in 3 months than I did in a year elsewhere.',
                rating: 5
              },
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="card animate-fadeIn"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  padding: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}>
                    {testimonial.image}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.0625rem', color: 'var(--gray-900)' }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--gray-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#fbbf24', fontSize: '1.25rem' }}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section style={{ 
          background: 'var(--gradient-primary)', 
          color: 'white', 
          padding: '6rem 0',
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
          
          <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem', fontWeight: '800' }}>
              Ready to Start Learning?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
              Join thousands of students and transform your career today. Get started with our free courses!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-large" style={{ background: 'white', color: 'var(--accent-purple)' }}>
                <span>✨</span>
                <span>Create Free Account</span>
              </Link>
              <Link to="/courses" className="btn btn-large" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
                <span>📚</span>
                <span>Browse Courses</span>
              </Link>
            </div>
            
            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              {[
                { icon: '✅', text: 'No credit card required' },
                { icon: '🎓', text: 'Free courses available' },
                { icon: '🔒', text: 'Secure & private' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: 'var(--gray-900)', color: 'white', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>
                Edunexus
              </h3>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                Transform your future with quality education from world-class instructors.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: 'white', fontSize: '1.0625rem', marginBottom: '1rem', fontWeight: '600' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/courses" style={{ color: 'var(--gray-400)', textDecoration: 'none', fontSize: '0.9375rem', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray-400)'}
                >
                  Browse Courses
                </Link>
                <Link to="/register" style={{ color: 'var(--gray-400)', textDecoration: 'none', fontSize: '0.9375rem', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray-400)'}
                >
                  Become a Student
                </Link>
              </div>
            </div>
            
            <div>
              <h4 style={{ color: 'white', fontSize: '1.0625rem', marginBottom: '1rem', fontWeight: '600' }}>Contact</h4>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                📧 support@edunexus.com<br />
                🌐 www.edunexus.com
              </p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--gray-800)', paddingTop: '2rem', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
            <p>© 2025 EduNexus. All rights reserved. Built with ❤️ for learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage