// Course detail component with lectures and assignments
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseAPI, assignmentAPI, userAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import EnrollButton from './EnrollButton'
import AssignmentList from '../assignments/AssignmentList'

const CourseDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [reviews, setReviews] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('lectures')
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    fetchCourseData()
  }, [id])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      const [courseRes, assignmentsRes, reviewsRes] = await Promise.all([
        courseAPI.getById(id),
        assignmentAPI.getByCourse(id),
        courseAPI.getReviews(id)
      ])
      setCourse(courseRes.data.course)
      setAssignments(assignmentsRes.data.assignments)
      setReviews(reviewsRes.data.reviews)

      // Check wishlist status
      try {
        const wishlistRes = await userAPI.getWishlist()
        setIsInWishlist(wishlistRes.data.wishlist.some(w => w._id === id))
      } catch (err) {
        // Ignore if not logged in or error
      }

      // Fetch progress if enrolled
      if (user && courseRes.data.course.enrolledStudents.some(s => s._id === user.id)) {
        try {
          const progressRes = await courseAPI.getProgress(id)
          setProgress(progressRes.data.progress)
        } catch (err) {
          console.error('Failed to load progress', err)
        }
      }
    } catch (err) {
      setError('Failed to load course details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-primary-600 border-border-light rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (!course) return null

  const isInstructor = user?.id === course.instructor._id || user?.role === 'admin'
  const isEnrolled = course.enrolledStudents.some(s => s._id === user?.id)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Header */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-text-primary">{course.title}</h1>
            <p className="text-text-secondary mb-4">{course.description}</p>
            <div className="flex items-center space-x-4 text-sm text-text-muted">
              <span>👨‍🏫 {course.instructor.name}</span>
              <span>📚 {course.lectures.length} lectures</span>
              <span>👥 {course.enrolledStudents.length} students</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {user?.role === 'student' && (
            <button
              onClick={toggleWishlist}
              className={`p-3 rounded-full transition-colors ${isInWishlist
                ? 'bg-rose-100 text-rose-600'
                : 'bg-bg-tertiary text-text-muted hover:text-rose-600'
                }`}
              title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
          )}
          {user?.role === 'student' && !isEnrolled && (
            <EnrollButton courseId={course._id} onEnroll={fetchCourseData} />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2 mt-4">
        <Link
          to={`/courses/${course._id}/chat`}
          className="btn btn-primary"
        >
          💬 Course Chat
        </Link>
        {isInstructor && (
          <button className="btn btn-secondary">
            ✏️ Edit Course
          </button>
        )}
      </div>


      {/* Tabs */}
      <div className="card">
        <div className="border-b border-border-light mb-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('lectures')}
              className={`pb-2 px-1 ${activeTab === 'lectures'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-text-muted hover:text-text-primary'
                }`}
            >
              Lectures
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`pb-2 px-1 ${activeTab === 'assignments'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-text-muted hover:text-text-primary'
                }`}
            >
              Assignments ({assignments.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 px-1 ${activeTab === 'reviews'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-text-muted hover:text-text-primary'
                }`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>

        {/* Lectures Tab */}
        {activeTab === 'lectures' && (
          <div className="space-y-3">
            {course.lectures.length === 0 ? (
              <p className="text-text-muted text-center py-8">
                No lectures available yet.
              </p>
            ) : (
              course.lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg hover:bg-bg-tertiary transition"
                >
                  <div className="flex items-center space-x-4">
                    {isEnrolled && (
                      <input
                        type="checkbox"
                        checked={progress?.completedLectures?.includes(lecture._id) || false}
                        onChange={(e) => toggleLectureProgress(lecture._id, e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        title="Mark as completed"
                      />
                    )}
                    <span className="text-text-muted font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-text-primary">{lecture.title}</h4>
                      <p className="text-sm text-text-secondary">
                        Duration: {Math.floor(lecture.duration / 60)} min
                      </p>
                    </div>
                  </div>
                  <a
                    href={lecture.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-sm"
                  >
                    ▶️ Watch
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <AssignmentList
            assignments={assignments}
            courseId={course._id}
            isInstructor={isInstructor}
            onUpdate={fetchCourseData}
          />
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {isEnrolled && !reviews.some(r => r.user?._id === user?.id) && (
              <div className="bg-bg-secondary p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Write a Review</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="input w-full"
                    >
                      {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{r} Stars {r === 5 && '🤩'} {r === 1 && '😢'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Comment</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="input w-full h-24"
                      placeholder="Share your experience..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-text-muted text-center">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border-b border-border-light pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-text-primary mr-2">{review.user?.name}</span>
                        <span className="text-text-muted text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-text-secondary">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default CourseDetail