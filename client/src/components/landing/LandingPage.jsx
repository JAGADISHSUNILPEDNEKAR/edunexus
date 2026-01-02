import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth()

  const features = [
    {
      icon: '🎓',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      icon: '📹',
      title: 'HD Video Lectures',
      description: 'High-quality video content accessible anytime, anywhere on any device',
      gradient: 'from-sky-500 to-blue-600'
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
      gradient: 'from-amber-500 to-orange-600'
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
    <div className="overflow-hidden bg-bg-primary transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-secondary-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="container-custom relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tight leading-tight">
              Transform Your Future with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                EduNexus
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Join thousands of students learning from world-class instructors in our interactive online platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuthenticated ? (
                <>
                  <Link to={`/dashboard/${user?.role}`} className="btn btn-primary btn-large shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 transform hover:-translate-y-1 transition-all">
                    <span>🎯</span>
                    <span>Go to Dashboard</span>
                  </Link>
                  <Link to="/courses" className="btn btn-secondary btn-large">
                    <span>📚</span>
                    <span>Explore Courses</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 transform hover:-translate-y-1 transition-all">
                    <span>✨</span>
                    <span>Get Started Free</span>
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    <span>🔐</span>
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
              {[
                { value: '10,000+', label: 'Students', icon: '👨‍🎓' },
                { value: '500+', label: 'Courses', icon: '📚' },
                { value: '50+', label: 'Instructors', icon: '👨‍🏫' },
                { value: '4.9/5', label: 'Rating', icon: '⭐' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-bg-primary border border-border-light shadow-lg shadow-primary-100/20 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="text-3xl mb-3 inline-block">{stat.icon}</div>
                  <div className="text-3xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">Why Choose EduNexus?</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need to succeed in your learning journey, built for modern students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-bg-primary rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border-light"
              >
                <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl text-white shadow-lg shadow-primary-100`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-bg-primary overflow-hidden">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-text-primary leading-tight">
                Unlock Your Potential with <span className="text-primary-600">Premium Benefits</span>
              </h2>
              <p className="text-text-secondary text-lg">
                We provide the tools and resources you need to master new skills and advance your career.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary border border-border-light"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-xl text-primary-600">
                      {benefit.icon}
                    </div>
                    <span className="font-medium text-text-primary">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary-50 blur-3xl rounded-full opacity-60"></div>
              <div className="relative bg-bg-primary rounded-3xl p-8 border border-border-light shadow-2xl shadow-primary-100/50 skew-y-3 hover:skew-y-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-bg-tertiary"></div>
                  <div>
                    <div className="h-4 w-32 bg-bg-tertiary rounded mb-2"></div>
                    <div className="h-3 w-24 bg-bg-secondary rounded"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-bg-secondary rounded-xl"></div>
                  <div className="h-4 w-full bg-bg-secondary rounded"></div>
                  <div className="h-4 w-3/4 bg-bg-secondary rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">What Students Say</h2>
            <p className="text-text-secondary text-lg">
              Join thousands of satisfied learners worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="bg-bg-primary rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-border-light"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-2xl border border-border-light">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-text-primary text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-primary-600 text-sm font-medium">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-text-secondary italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-primary border-t border-border-light pt-16 pb-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span>🎓</span> EduNexus
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Transform your future with quality education from world-class instructors.
              </p>
            </div>

            <div>
              <h4 className="text-text-primary font-bold mb-4 text-lg">Learn</h4>
              <ul className="space-y-3 text-text-secondary">
                <li><Link to="/courses" className="hover:text-primary-600 transition-colors">Browse Courses</Link></li>
                <li><Link to="/paths" className="hover:text-primary-600 transition-colors">Learning Paths</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-text-primary font-bold mb-4 text-lg">Community</h4>
              <ul className="space-y-3 text-text-secondary">
                <li><Link to="/register" className="hover:text-primary-600 transition-colors">Join for Free</Link></li>
                <li><Link to="/mentors" className="hover:text-primary-600 transition-colors">Find Mentors</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-text-primary font-bold mb-4 text-lg">Contact</h4>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-center gap-2">
                  <span>📧</span> support@edunexus.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border-light pt-8 text-center text-text-muted text-sm">
            <p>© 2025 EduNexus. All rights reserved. Built with ❤️ for learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage