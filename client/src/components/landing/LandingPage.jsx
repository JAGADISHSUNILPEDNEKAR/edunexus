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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[128px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight animate-float">
              Transform Your Future with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                EduNexus
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students learning from world-class instructors in our interactive online platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuthenticated ? (
                <>
                  <Link to={`/dashboard/${user?.role}`} className="btn btn-primary btn-large group">
                    <span>🎯</span>
                    <span>Go to Dashboard</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link to="/courses" className="btn btn-secondary btn-large">
                    <span>📚</span>
                    <span>Explore Courses</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large group">
                    <span>✨</span>
                    <span>Get Started Free</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    <span>🔐</span>
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
              {[
                { value: '10,000+', label: 'Students', icon: '👨‍🎓' },
                { value: '500+', label: 'Courses', icon: '📚' },
                { value: '50+', label: 'Instructors', icon: '👨‍🏫' },
                { value: '4.9/5', label: 'Rating', icon: '⭐' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="card p-6 border-slate-700/50 bg-slate-800/40 backdrop-blur-sm card-hover text-center group"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose EduNexus?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to succeed in your learning journey, built for modern students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 transition-all duration-300 card-hover group"
              >
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-indigo-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Unlock Your Potential with <span className="text-indigo-400">Premium Benefits</span>
              </h2>
              <p className="text-slate-300 text-lg">
                We provide the tools and resources you need to master new skills and advance your career.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl">
                      {benefit.icon}
                    </div>
                    <span className="font-medium text-slate-200">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-800 rounded-3xl p-8 border border-white/10 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                  <div>
                    <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-slate-700/50 rounded"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-slate-700/30 rounded-xl"></div>
                  <div className="h-4 w-full bg-slate-700/50 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-700/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">What Students Say</h2>
            <p className="text-slate-400 text-lg">
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
                className="card p-8 border-slate-700/50 bg-slate-800/30 card-hover"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-2xl border-2 border-indigo-500/30">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-indigo-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed">
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
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎓</span> Edunexus
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Transform your future with quality education from world-class instructors.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Learn</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">Browse Courses</Link></li>
                <li><Link to="/paths" className="hover:text-indigo-400 transition-colors">Learning Paths</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Community</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Join for Free</Link></li>
                <li><Link to="/mentors" className="hover:text-indigo-400 transition-colors">Find Mentors</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center gap-2">
                  <span>📧</span> support@edunexus.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-600 text-sm">
            <p>© 2025 EduNexus. All rights reserved. Built with ❤️ for learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage