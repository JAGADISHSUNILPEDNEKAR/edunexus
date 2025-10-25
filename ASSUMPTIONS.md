# EduNexus — Implementation Assumptions

This document outlines assumptions made during development where the specification was ambiguous.

## Authentication & Authorization
- JWT tokens are stored in HTTP-only cookies for web security
- Token expiration set to 7 days by default
- Refresh token mechanism not implemented (can be added later)
- Password minimum length: 6 characters
- Email validation uses standard regex pattern

## File Uploads
- Video lectures: Primary upload via Cloudinary, fallback to local `uploads/videos/`
- Assignments: Uploaded to local `uploads/assignments/` directory
- Maximum file size: 100MB for videos, 10MB for assignments
- Supported video formats: mp4, avi, mov, mkv
- Supported assignment formats: pdf, doc, docx, txt

## Course Management
- Courses have a simple structure: title, description, instructor
- Students can enroll in unlimited courses
- Instructors can only manage their own courses
- Course deletion is soft delete (archived, not removed from DB)

## Chat System
- Chat is course-specific (students and instructor of a course)
- Messages are persisted in MongoDB
- Real-time delivery via Socket.io
- No message editing or deletion (can be added as enhancement)
- No file sharing in chat (text only)

## Role-Based Access
- Three roles: admin, instructor, student
- Admin: full CRUD on users and courses, content moderation
- Instructor: CRUD own courses, view enrolled students, manage assignments
- Student: view courses, enroll, submit assignments, participate in chat
- Role is assigned during registration (default: student)

## Assignment Submissions
- Students can submit multiple times; latest submission is considered
- No grading system implemented (future feature)
- Instructors can view all submissions but no commenting/feedback UI

## Database
- MongoDB Atlas recommended for production
- Local MongoDB for development
- No database transactions used (can add for critical operations)
- Indexes added on frequently queried fields (email, courseId)

## Frontend
- Built with Vite + React for performance
- React Router v6 for routing
- Context API for authentication state
- Axios for HTTP requests
- Socket.io-client for real-time features
- Tailwind CSS for styling

## Testing
- Basic test coverage for critical paths
- Backend: Auth route tests with Jest + Supertest
- Frontend: Login component test with React Testing Library
- Full E2E testing not included (can be added)

## Deployment
- Backend: Render or similar Node.js hosting
- Frontend: Vercel or Netlify
- Environment variables managed via platform-specific config
- CORS configured for cross-origin requests

## Security
- Passwords hashed with bcrypt (10 salt rounds)
- Input validation on all routes using express-validator
- Rate limiting on auth routes (5 requests per 15 minutes)
- XSS protection via helmet middleware
- SQL injection not applicable (using MongoDB)

## Live Classes (Bonus Feature)
- Not implemented in MVP
- Can be added by storing meeting links in Course model
- Would require integration with Zoom/Google Meet API

## Demo Credentials
Seed script creates:
- Admin: admin@edunexus.com / Admin@123
- Instructor: instructor@edunexus.com / Instructor@123
- Student 1: student1@edunexus.com / Student@123
- Student 2: student2@edunexus.com / Student@123

## Performance Optimizations
- Pagination implemented for course lists (10 per page)
- Lazy loading for video lectures
- Image/video optimization via Cloudinary transformations
- React.memo for expensive components

## Future Enhancements (Out of Scope)
- Email verification for registration
- Password reset via email
- Course progress tracking
- Certificate generation
- Payment integration for paid courses
- Advanced analytics dashboard
- Mobile app (React Native)