// Main App component with routing
// spec: see FullStackProject-Sem3_33099103.pdf

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import StudentDashboard from './components/dashboard/StudentDashboard'
import InstructorDashboard from './components/dashboard/InstructorDashboard'
import AdminDashboard from './components/dashboard/AdminDashboard'
import CourseList from './components/courses/CourseList'
import CourseDetail from './components/courses/CourseDetail'
import CreateCourse from './components/courses/CreateCourse'
import ChatRoom from './components/chat/ChatRoom'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<CourseList />} />
              
              {/* Protected routes - Student */}
              <Route path="/dashboard/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Protected routes - Instructor */}
              <Route path="/dashboard/instructor" element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/courses/create" element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              
              {/* Protected routes - Admin */}
              <Route path="/dashboard/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Protected routes - All authenticated users */}
              <Route path="/courses/:id" element={
                <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                  <CourseDetail />
                </ProtectedRoute>
              } />
              <Route path="/courses/:id/chat" element={
                <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                  <ChatRoom />
                </ProtectedRoute>
              } />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/courses" replace />} />
              <Route path="*" element={<Navigate to="/courses" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App