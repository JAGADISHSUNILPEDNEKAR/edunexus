import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Video,
  MessageCircle,
  FileText,
  Zap,
  Smartphone,
  TrendingUp,
  Award,
  RefreshCw,
  Users,
  ChevronRight,
  Star,
  CheckCircle2,
  Play
} from 'lucide-react'

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const features = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience in top tech companies.',
      color: 'bg-blue-500'
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'HD Video Lectures',
      description: 'High-quality video content accessible anytime, anywhere on any device with offline viewing.',
      color: 'bg-cyan-500'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Real-time Chat',
      description: 'Connect with instructors and peers instantly through live discussions and dedicated channels.',
      color: 'bg-indigo-500'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Practical Assignments',
      description: 'Apply what you learn with real-world projects, hands-on exercises, and code reviews.',
      color: 'bg-violet-500'
    },
  ]

  const benefits = [
    { icon: <Zap className="w-5 h-5" />, text: 'Lifetime access to course materials' },
    { icon: <Smartphone className="w-5 h-5" />, text: 'Learn on mobile, tablet, or desktop' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Track your progress and achievements' },
    { icon: <Award className="w-5 h-5" />, text: 'Earn certificates upon completion' },
    { icon: <RefreshCw className="w-5 h-5" />, text: 'Regular content updates' },
    { icon: <Users className="w-5 h-5" />, text: 'Join a community of learners' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans selection:bg-cyan-500/30">

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400/20 blur-[120px] animate-float" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-4">
        <div className="container-custom relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-cyan-700 dark:text-cyan-300">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
              Files, code, and mastery in one place
            </motion.div>

            <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[0.9] text-slate-900 dark:text-white">
              Master Your Future with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 animate-gradient">
                EduNexus
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students learning from world-class instructors.
              Elevate your skills, advance your career, and build the future you deserve.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              {isAuthenticated ? (
                <>
                  <Link to={`/dashboard/${user?.role}`} className="btn-primary btn-large group shadow-lg shadow-cyan-500/25">
                    <span className="relative z-10 flex items-center gap-2">
                      Go to Dashboard <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link to="/courses" className="glass-button btn-large group">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      Explore Courses <BookOpenIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary btn-large group shadow-lg shadow-cyan-500/25">
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link to="/courses" className="glass-button btn-large group">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      View Courses <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                    </span>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Platform Stats */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 border-t border-slate-200/50 dark:border-white/10 mt-16">
              {[
                { value: '10k+', label: 'Active Students' },
                { value: '500+', label: 'Video Courses' },
                { value: '50+', label: 'Expert Mentors' },
                { value: '4.9', label: 'Student Rating' },
              ].map((stat, index) => (
                <div key={index} className="p-4">
                  <div className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">Why Choose EduNexus?</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              We've built a platform that removes the friction from learning, so you can focus on what matters most: growing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div className={`w-14 h-14 mb-6 rounded-2xl ${feature.color} bg-opacity-10 flex items-center justify-center text-${feature.color.split('-')[1]}-600 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                Unlock Your Potential with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Premium Benefits</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Everything you need to succeed is right here. From interactive lessons to certification, we provide the complete ecosystem for your growth.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative w-full aspect-square lg:aspect-auto lg:h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-full glass-panel rounded-[2.5rem] p-8 border border-white/40 shadow-2xl shadow-cyan-500/20"
              >
                <div className="absolute top-8 right-8 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-xs">A+</div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Grade</div>
                      <div className="font-bold text-slate-900 dark:text-white">Excellent</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 animate-float" style={{ animationDelay: '2.5s' }}>
                  <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Status</div>
                      <div className="font-bold text-slate-900 dark:text-white">Course Completed</div>
                    </div>
                  </div>
                </div>

                <div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 rounded-3xl overflow-hidden relative">
                  {/* Abstract code UI or dashboard representation */}
                  <div className="absolute top-0 left-0 w-full h-12 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="p-8 mt-8 space-y-4">
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded-xl mt-8 animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">What Leaders Say</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Join thousands of satisfied learners worldwide achieving their dreams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Senior Developer @ TechCo',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                text: 'EduNexus transformed my career! The courses are comprehensive and the instructors are incredibly supportive. I got promoted within 3 months.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Data Scientist @ AI Lab',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
                text: 'The best online learning platform I\'ve used. The community is gold, and the real-time chat feature makes learning interactive and engaging.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'Product Designer',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
                text: 'High-quality content and excellent instructors. The practical assignments gave me a portfolio that helped me land my dream job.',
                rating: 5
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="glass-panel p-8 rounded-3xl relative"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/30">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white font-display">
                      {testimonial.name}
                    </div>
                    <div className="text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="font-display font-bold text-xl text-slate-900 dark:text-white">EduNexus</span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Transform your future with quality education from world-class instructors.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/courses" className="hover:text-cyan-500 transition-colors">Browse Courses</Link></li>
                <li><Link to="/paths" className="hover:text-cyan-500 transition-colors">Learning Paths</Link></li>
                <li><Link to="/pricing" className="hover:text-cyan-500 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/about" className="hover:text-cyan-500 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-cyan-500 transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-cyan-500 transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  help@edunexus.com
                </li>
                <li>
                  123 Innovation Dr<br />
                  Tech City, TC 94043
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>© 2025 EduNexus. All rights reserved. Built with ❤️ for learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

export default LandingPage