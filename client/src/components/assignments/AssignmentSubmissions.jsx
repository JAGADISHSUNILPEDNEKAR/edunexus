import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { assignmentAPI } from '../../services/api'

const AssignmentSubmissions = () => {
    const { id } = useParams()
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [assignmentTitle, setAssignmentTitle] = useState('')

    useEffect(() => {
        fetchSubmissions()
    }, [id])

    const fetchSubmissions = async () => {
        try {
            setLoading(true)
            const res = await assignmentAPI.getSubmissions(id)
            setSubmissions(res.data.submissions)
            // Assuming the API returns assignment details or we can extract it from the first submission
            // If not, we might need a separate call to get assignment details, but let's try this first.
            // Actually, looking at the controller, getSubmissions returns { success, count, submissions }
            // The submissions have populated student data.
            // We might want to fetch the assignment details separately to get the title if it's not in the response.
            // Let's do a quick fetch of the assignment itself to get the title.
            const assignmentRes = await assignmentAPI.getById(id)
            setAssignmentTitle(assignmentRes.data.assignment.title)

        } catch (err) {
            setError('Failed to load submissions')
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
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Submissions: {assignmentTitle}
                    </h1>
                    <p className="text-text-secondary">
                        View and manage student submissions
                    </p>
                </div>
                <button
                    onClick={() => window.history.back()}
                    className="btn btn-secondary"
                >
                    ← Back
                </button>
            </div>

            <div className="card overflow-hidden">
                {submissions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4 opacity-50 grayscale">📂</div>
                        <h3 className="text-lg font-medium text-text-primary">No submissions yet</h3>
                        <p className="text-text-muted mt-1">
                            Students haven't submitted any work for this assignment.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-bg-tertiary border-b border-border-light">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Submitted Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">File</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {submissions.map((submission) => (
                                    <tr key={submission._id} className="hover:bg-bg-tertiary transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3">
                                                    {submission.student?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-text-primary">{submission.student?.name || 'Unknown User'}</div>
                                                    <div className="text-xs text-text-muted">{submission.student?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">
                                            {new Date(submission.submittedAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {submission.fileUrl ? (
                                                <a
                                                    href={submission.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary-600 hover:text-primary-700 hover:underline text-sm flex items-center"
                                                >
                                                    📎 View File
                                                </a>
                                            ) : (
                                                <span className="text-text-muted text-sm italic">No file</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* Future: Add grading/feedback button here */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AssignmentSubmissions
