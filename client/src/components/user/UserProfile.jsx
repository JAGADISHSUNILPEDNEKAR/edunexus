import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { authAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
    const { user, login } = useAuth() // using login to update user state if needed, or we might need a setUser method
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }))
        }
    }, [user])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const updateData = {
                name: formData.name,
                email: formData.email
            }

            const response = await authAPI.updateProfile(updateData)

            // Update local storage and context if returned user data
            if (response.data.user) {
                // This relies on useAuth exposing a way to update user, or we just reload
                // Ideally useAuth should export a mechanism to update user state without full login
                // For now, we will just show success
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
            setIsEditing(false)
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-secondary py-12">
            <div className="container-custom max-w-2xl">
                <div className="card">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className="flex-shrink-0 flex justify-center md:justify-start">
                            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-4xl shadow-md border-4 border-white dark:border-slate-800">
                                👤
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Role</label>
                                <div className="mt-1">
                                    <span className={`badge badge-${user?.role === 'student' ? 'primary' : user?.role === 'instructor' ? 'secondary' : 'admin'}`}>
                                        {user?.role}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</label>
                                <div className="text-text-primary mt-1 font-medium">
                                    {new Date(user?.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`input ${!isEditing && 'opacity-70 bg-bg-tertiary cursor-not-allowed'}`}
                                    required
                                />
                            </div>

                            <div>
                                <label className="input-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`input ${!isEditing && 'opacity-70 bg-bg-tertiary cursor-not-allowed'}`}
                                    required
                                />
                            </div>

                            {isEditing && (
                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
