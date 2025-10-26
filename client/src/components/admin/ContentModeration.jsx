// Content moderation component for admin
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect } from 'react'
import { courseAPI } from '../../services/api'

const ContentModeration = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseAPI.getAll({ limit: 50 })
      setCourses(response.data.courses)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      await courseAPI.delete(courseId)
      fetchCourses()} catch (err) {
      alert('Failed to delete course')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Course Moderation</h3>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Course Title</th>
              <th className="text-left py-3 px-4">Instructor</th>
              <th className="text-left py-3 px-4">Lectures</th>
              <th className="text-left py-3 px-4">Students</th>
              <th className="text-left py-3 px-4">Created</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">{course.title}</td>
                <td className="py-3 px-4">{course.instructor?.name}</td>
                <td className="py-3 px-4">{course.lectures?.length || 0}</td>
                <td className="py-3 px-4">{course.enrolledStudents?.length || 0}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    
                      href={`/courses/${course._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    <a>
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {courses.length === 0 && (
          <p className="text-center text-gray-600 py-8">No courses found.</p>
        )}
      </div>
    </div>
  )
}

export default ContentModeration