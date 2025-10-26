# EduNexus API Documentation

Base URL: `http://localhost:5000/api`

## Table of Contents
- [Authentication](#authentication)
- [Courses](#courses)
- [Assignments](#assignments)
- [Users (Admin)](#users-admin)
- [Chat](#chat)

---

## Authentication

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // Optional: "student", "instructor", or "admin"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Login
**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Logout
**POST** `/auth/logout`

Logout current user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User
**GET** `/auth/me`

Get current authenticated user details.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "enrolledCourses": []
  }
}
```

---

## Courses

### Get All Courses
**GET** `/courses`

Get list of all courses with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "courses": [
    {
      "_id": "course_id",
      "title": "Web Development",
      "description": "Learn web development",
      "instructor": {
        "_id": "instructor_id",
        "name": "Jane Smith"
      },
      "lectures": [],
      "enrolledStudents": [],
      "enrolledCount": 5,
      "lectureCount": 3
    }
  ]
}
```

---

### Get Single Course
**GET** `/courses/:id`

Get details of a specific course.

**Response:** `200 OK`
```json
{
  "success": true,
  "course": {
    "_id": "course_id",
    "title": "Web Development",
    "description": "Learn web development",
    "instructor": {
      "_id": "instructor_id",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "lectures": [
      {
        "_id": "lecture_id",
        "title": "Introduction",
        "videoUrl": "https://example.com/video.mp4",
        "duration": 1800,
        "order": 1
      }
    ],
    "enrolledStudents": []
  }
}
```

---

### Create Course
**POST** `/courses`

Create a new course (Instructor only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Web Development",
  "description": "Learn web development from scratch"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "_id": "course_id",
    "title": "Web Development",
    "description": "Learn web development from scratch",
    "instructor": "instructor_id"
  }
}
```

---

### Update Course
**PUT** `/courses/:id`

Update course details (Instructor/Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Advanced Web Development",
  "description": "Updated description"
}
```

**Response:** `200 OK`

---

### Delete Course
**DELETE** `/courses/:id`

Delete a course (Instructor/Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Enroll in Course
**POST** `/courses/:id/enroll`

Enroll in a course (Student only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Add Lecture to Course
**POST** `/courses/:id/lectures`

Add a lecture to course (Instructor only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Introduction to HTML",
  "videoUrl": "https://example.com/video.mp4",
  "duration": 1800
}
```

**Response:** `201 Created`

---

### Get Instructor Courses
**GET** `/courses/my/instructor`

Get all courses created by instructor (Instructor only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Get Enrolled Courses
**GET** `/courses/my/enrolled`

Get all enrolled courses (Student only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Assignments

### Get Course Assignments
**GET** `/assignments/course/:courseId`

Get all assignments for a course.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Get Single Assignment
**GET** `/assignments/:id`

Get assignment details.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Create Assignment
**POST** `/assignments`

Create a new assignment (Instructor only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `title`: Assignment title
- `description`: Assignment description
- `courseId`: Course ID
- `dueDate`: Due date (optional)
- `maxScore`: Maximum score (default: 100)
- `file`: Assignment file (optional)

**Response:** `201 Created`

---

### Submit Assignment
**POST** `/assignments/:id/submit`

Submit assignment solution (Student only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Submission file
- `comments`: Submission comments (optional)

**Response:** `201 Created`

---

### Get Assignment Submissions
**GET** `/assignments/:id/submissions`

Get all submissions for an assignment (Instructor only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Get My Submissions
**GET** `/assignments/my/submissions`

Get all your submissions (Student only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Users (Admin)

### Get All Users
**GET** `/users`

Get list of all users (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `role` (optional): Filter by role

**Response:** `200 OK`

---

### Get User
**GET** `/users/:id`

Get user details (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Update User
**PUT** `/users/:id`

Update user details (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "instructor",
  "isActive": true
}
```

**Response:** `200 OK`

---

### Delete User
**DELETE** `/users/:id`

Deactivate user (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Get Platform Stats
**GET** `/users/admin/stats`

Get platform statistics (Admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "stats": {
    "totalUsers": 100,
    "totalStudents": 80,
    "totalInstructors": 15,
    "totalAdmins": 5,
    "totalCourses": 25,
    "activeUsers": 95
  }
}
```

---

## Chat

### Get Course Messages
**GET** `/chat/:courseId`

Get messages for a course.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page (default: 50)

**Response:** `200 OK`

---

### Send Message
**POST** `/chat/:courseId`

Send a message to course chat.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "content": "Hello everyone!"
}
```

**Response:** `201 Created`

---

### Delete Message
**DELETE** `/chat/message/:messageId`

Delete a message (Admin or sender only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Role 'student' is not authorized to access this route"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Socket.io Events

### Connection
Connect to Socket.io server with JWT token:
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'jwt_token_here' }
})
```

### Events

**Client → Server:**
- `join-course` - Join a course chat room
```javascript
  socket.emit('join-course', courseId)
```

- `leave-course` - Leave a course chat room
```javascript
  socket.emit('leave-course', courseId)
```

- `send-message` - Send a message
```javascript
  socket.emit('send-message', { courseId, message })
```

- `typing` - Indicate typing status
```javascript
  socket.emit('typing', { courseId, isTyping: true })
```

**Server → Client:**
- `new-message` - Receive new message
- `user-joined` - User joined the chat
- `user-typing` - User is typing

---

## Rate Limiting

Authentication endpoints (`/auth/login`, `/auth/register`) are rate limited to:
- **5 requests per 15 minutes** per IP address

---

## Notes

- All timestamps are in ISO 8601 format
- File uploads limited to 100MB for videos, 10MB for assignments
- Pagination defaults: page=1, limit=10
- All protected routes require valid JWT token in Authorization header

<!-- spec: see FullStackProject-Sem3_33099103.pdf -->