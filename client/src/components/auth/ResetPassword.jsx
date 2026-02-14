import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

const ResetPassword = () => {
    const { resetToken } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match' })
            return
        }

        setLoading(true)
        setStatus({ type: '', message: '' })

        try {
            const res = await authAPI.resetPassword(resetToken, password)
            setStatus({ type: 'success', message: 'Password reset successful! Redirecting to login...' })

            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Something went wrong'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-secondary">
                        Enter your new password below.
                    </p>
                </div>

                {status.message && (
                    <div className={`rounded-md p-4 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm font-medium">{status.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border-light placeholder-text-muted text-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-bg-secondary"
                                placeholder="New Password"
                                minLength="6"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border-light placeholder-text-muted text-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-bg-secondary"
                                placeholder="Confirm New Password"
                                minLength="6"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Resetting...' : 'Set New Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
