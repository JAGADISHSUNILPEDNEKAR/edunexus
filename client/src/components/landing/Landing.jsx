import { Link } from 'react-router-dom'
import Button from '../shared/Button'
import Card from '../shared/Card'

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-14">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1E1E1E]">
            Empower Your
            <br />
            Learning Journey
          </h1>
          <p className="mt-5 text-lg md:text-xl text-[#555] leading-relaxed">
            Learn, teach, and grow with expert‑led online courses.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button as={Link} to="/register" size="lg">Get Started</Button>
            <Button as={Link} to="/courses" size="lg" variant="outline">Explore Courses</Button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F1EAFE] text-[#8B5CF6] flex items-center justify-center text-2xl">👤</div>
            <div>
              <h3 className="text-xl font-bold text-[#1E1E1E]">Login</h3>
              <p className="text-[#666]">Access your account</p>
            </div>
            <div className="ml-auto">
              <Button as={Link} to="/login" variant="outline" size="sm">Open</Button>
            </div>
          </Card>

          <Card className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAF1FE] text-[#3B82F6] flex items-center justify-center text-2xl">✨</div>
            <div>
              <h3 className="text-xl font-bold text-[#1E1E1E]">Register</h3>
              <p className="text-[#666]">Create new account</p>
            </div>
            <div className="ml-auto">
              <Button as={Link} to="/register" variant="outline" size="sm">Open</Button>
            </div>
          </Card>

          <Card className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEEAF3] text-[#EC4899] flex items-center justify-center text-2xl">📚</div>
            <div>
              <h3 className="text-xl font-bold text-[#1E1E1E]">Courses</h3>
              <p className="text-[#666]">Browse available courses</p>
            </div>
            <div className="ml-auto">
              <Button as={Link} to="/courses" variant="outline" size="sm">Open</Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
