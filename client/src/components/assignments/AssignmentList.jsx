// Assignment list component
// spec: see FullStackProject-Sem3_33099103.pdf

import { Link } from 'react-router-dom'
import CreateAssignment from './CreateAssignment'
import SubmitAssignment from './SubmitAssignment'

const AssignmentList = ({ assignments, courseId, isInstructor, onUpdate }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date()
  }

  if (assignments.length === 0 && !isInstructor) {
    return (
      <p className="text-text-muted text-center py-8">
        No assignments available yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {isInstructor && (
        <CreateAssignment courseId={courseId} onCreated={onUpdate} />
      )}

      {assignments.map((assignment) => (
        <div
          key={assignment._id}
          className="border border-border-light rounded-lg p-4 hover:shadow-md transition bg-bg-primary"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-lg text-text-primary">{assignment.title}</h4>
              <p className="text-text-secondary text-sm mt-1">
                {assignment.description}
              </p>
            </div>
            {assignment.dueDate && (
              <span
                className={`text-sm px-3 py-1 rounded-full ${isOverdue(assignment.dueDate)
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                  }`}
              >
                Due: {formatDate(assignment.dueDate)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-text-muted">
              Max Score: {assignment.maxScore} points
            </div>

            {isInstructor ? (
              <Link
                to={`/assignments/${assignment._id}/submissions`}
                className="btn btn-secondary text-sm"
              >
                View Submissions
              </Link>
            ) : (
              <SubmitAssignment assignmentId={assignment._id} onSubmitted={onUpdate} />
            )}
          </div>

          {assignment.fileUrl && (
            <a
              href={assignment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline text-sm mt-2 inline-block"
            >
              📎 Download Assignment File
            </a>
          )}

        </div>
      ))}
    </div>
  )
}

export default AssignmentList