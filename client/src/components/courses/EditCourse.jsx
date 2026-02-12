// Edit course component for instructors and admins
// spec: see implementation_plan.md

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { courseAPI } from '../../services/api'

const EditCourse = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        description: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchCourseDetails()
    }, [id])

    const fetchCourseDetails = async () => {
        try {
            setLoading(true)
            const response = await courseAPI.getById(id)
            const course = response.data.course
            setFormData({
                title: course.title,
                description: course.description
            })
        } catch (err) {
            setError('Failed to fetch course details')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            await courseAPI.update(id, formData)
            navigate(`/courses/${id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update course')
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="card">
                <h1 className="text-3xl font-bold mb-6 text-text-primary">Edit Course</h1>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium mb-2 text-text-secondary">
                            Course Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium mb-2 text-text-secondary">
                            Course Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input"
                            rows={6}
                            required
                            maxLength={1000}
                        />
                        <p className="text-sm text-text-muted mt-1">
                            {formData.description.length}/1000 characters
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCourse
