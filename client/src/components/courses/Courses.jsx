import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../shared/Card'
import Button from '../shared/Button'
import { courseAPI } from '../../services/api'

const Star = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.347l-2.986 2.125c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.378 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
)

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await courseAPI.getAll({ page: 1, limit: 12 })
        setCourses(res.data.courses || [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = courses.filter(c =>
    [c.title, c.description, c?.instructor?.name].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1E1E]">Explore Courses</h1>
        <p className="mt-3 text-[#555]">Discover thousands of courses taught by expert instructors.</p>
      </div>

      <div className="max-w-xl mx-auto mt-8">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full px-12 py-3.5 rounded-2xl border-2 border-slate-200 bg-white focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#C7B8EA]"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="mt-16 text-center text-[#555]">Loading amazing courses…</div>
      ) : filtered.length === 0 ? (
        <Card className="mt-12 text-center">No courses found.</Card>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Card key={course._id} className="p-0 overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-[#EDE9FE] via-white to-[#C7B8EA]" />
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-[#1E1E1E] line-clamp-2">{course.title}</h3>
                <p className="text-sm text-[#666] line-clamp-3">{course.description}</p>

                <div className="flex items-center gap-2 pt-1">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-sm font-bold">
                    {(course.instructor?.name || 'I').slice(0, 1)}
                  </div>
                  <div className="text-sm text-[#555]">{course.instructor?.name || 'Unknown'}</div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} filled={i < Math.round(course.rating || 4)} />
                    ))}
                  </div>
                  <Button as={Link} to={`/courses/${course._id}`} size="sm">
                    View Course
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
