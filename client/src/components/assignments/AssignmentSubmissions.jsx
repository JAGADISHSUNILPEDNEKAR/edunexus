import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { assignmentAPI, API_URL } from '../../services/api'

const AssignmentSubmissions = () => {
    const { id } = useParams()
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [assignmentTitle, setAssignmentTitle] = useState('')

    // Grading state
    const [selectedSubmission, setSelectedSubmission] = useState(null)
    const [gradeModalOpen, setGradeModalOpen] = useState(false)
    const [gradeData, setGradeData] = useState({ score: '', feedback: '' })
    const [gradingLoading, setGradingLoading] = useState(false)

    useEffect(() => {
        fetchSubmissions()
    }, [id])

    const fetchSubmissions = async () => {
        try {
            setLoading(true)
            const res = await assignmentAPI.getSubmissions(id)
            setSubmissions(res.data.submissions)

            const assignmentRes = await assignmentAPI.getById(id)
            setAssignmentTitle(assignmentRes.data.assignment.title)

        } catch (err) {
            setError('Failed to load submissions')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getFileUrl = (url) => {
        if (!url) return '#';
        if (url.startsWith('http')) return url;
        // API_URL is something like 'http://localhost:5001/api' or 'https://.../api'
        // We need the base url without /api
        const baseUrl = API_URL.replace('/api', '');
        return `${baseUrl}${url}`;
    }

    const openGradeModal = (submission) => {
        setSelectedSubmission(submission)
        setGradeData({
            score: submission.score || '',
            feedback: submission.feedback || ''
        })
        setGradeModalOpen(true)
    }

    const closeGradeModal = () => {
        setSelectedSubmission(null)
        setGradeModalOpen(false)
        setGradeData({ score: '', feedback: '' })
    }

    const handleGradeSubmit = async (e) => {
        e.preventDefault()
        if (!selectedSubmission) return

        try {
            setGradingLoading(true)
            const res = await assignmentAPI.markSubmission(selectedSubmission._id, {
                score: Number(gradeData.score),
                feedback: gradeData.feedback
            })

            // Update local state
            setSubmissions(submissions.map(sub =>
                sub._id === selectedSubmission._id ? res.data.submission : sub
            ))

            const updatedSubmission = res.data.submission;
            // Note: res.data.submission might not have populated student field depending on backend
            // So we partially merge or just update the fields we know changed
            setSubmissions(prev => prev.map(sub => {
                if (sub._id === updatedSubmission._id) {
                    return { ...sub, ...updatedSubmission, student: sub.student }; // Keep existing student population
                }
                return sub;
            }));

            closeGradeModal()
        } catch (err) {
            console.error(err)
            alert('Failed to grade submission')
        } finally {
            setGradingLoading(false)
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
        <div className="max-w-6xl mx-auto p-6 relative">
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Grade</th>
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
                                                    href={getFileUrl(submission.fileUrl)}
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
                                        <td className="px-6 py-4">
                                            {submission.score !== null ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {submission.score} / {submission.assignment?.maxScore || 100}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Not Graded
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openGradeModal(submission)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                Grade
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Grading Modal */}
            {gradeModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-bg-primary rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-border-light flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-text-primary">
                                Grade Submission
                            </h3>
                            <button onClick={closeGradeModal} className="text-text-muted hover:text-text-primary">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleGradeSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Score (Max: {selectedSubmission?.assignment?.maxScore || 100})
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max={selectedSubmission?.assignment?.maxScore || 100}
                                    value={gradeData.score}
                                    onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                                    className="input w-full"
                                    placeholder="Enter score"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Feedback (Optional)
                                </label>
                                <textarea
                                    value={gradeData.feedback}
                                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                    className="input w-full h-32 resize-none"
                                    placeholder="Enter feedback for the student..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeGradeModal}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={gradingLoading}
                                    className="btn btn-primary"
                                >
                                    {gradingLoading ? 'Saving...' : 'Save Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AssignmentSubmissions
