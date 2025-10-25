# EduNexus — Mini Learning Management System

A full-stack MERN application for online learning with course management, video lectures, assignments, and real-time chat.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Demo Credentials](#demo-credentials)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

### Core Features (MVP)
- **Authentication & Authorization**: JWT-based login/signup with role-based access control
- **Course Management**: Create, edit, delete, and view courses
- **Video Lectures**: Upload and stream video lectures
- **Assignments**: Upload assignments and submit solutions
- **Real-time Chat**: Course-specific chat rooms using Socket.io
- **Admin Panel**: Manage users, courses, and moderate content

### User Roles
1. **Student**: Enroll in courses, watch lectures, submit assignments, participate in chat
2. **Instructor**: Create/manage courses, upload lectures/assignments, view submissions
3. **Admin**: Full platform oversight, user management, content moderation

## 🛠 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.io** - Real-time communication
- **Cloudinary** - Video/file hosting (optional)
- **express-validator** - Input validation

### Frontend
- **React** (with Vite) - UI library
- **React Router v6** - Routing
- **Context API** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time client
- **Tailwind CSS** - Styling

### DevOps
- **Jest** & **Supertest** - Backend testing
- **React Testing Library** - Frontend testing
- **GitHub Actions** - CI/CD
- **Render/Vercel** - Deployment

## 📦 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** >= 6.x (local or Atlas)
- **Git**

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/edunexus.git
cd edunexus
```

### 2. Install server dependencies
```bash
cd server
npm install
```

### 3. Install client dependencies
```bash
cd ../client
npm install
```

## 🔐 Environment Setup

### Server Environment Variables

Create `server/.env` from `server/.env.example`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/edunexus
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=10

# Cloudinary (Optional - for video uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Client Environment Variables

Create `client/.env` from `client/.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🎬 Running the Application

### Start MongoDB
```bash
# If using local MongoDB
mongod
```

### Seed the Database (First Time)
```bash
cd server
npm run seed
```

This creates demo users and sample course.

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Access the application at `http://localhost:5173`

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 👥 Demo Credentials

After running the seed script, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edunexus.com | Admin@123 |
| Instructor | instructor@edunexus.com | Instructor@123 |
| Student 1 | student1@edunexus.com | Student@123 |
| Student 2 | student2@edunexus.com | Student@123 |

## 📚 API Documentation

Detailed API documentation available in [`docs/API.md`](./docs/API.md)

### Quick Reference

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Courses:**
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create course (instructor)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (instructor)
- `DELETE /api/courses/:id` - Delete course (instructor/admin)
- `POST /api/courses/:id/enroll` - Enroll in course (student)

**Assignments:**
- `GET /api/assignments/course/:courseId` - List course assignments
- `POST /api/assignments` - Create assignment (instructor)
- `POST /api/assignments/:id/submit` - Submit assignment (student)

**Admin:**
- `GET /api/users` - List all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### Run All Tests
```bash
# From project root
npm test --workspaces
```

## 🚢 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `node server/index.js`
5. Add environment variables from `.env.example`

### Frontend Deployment (Vercel)

1. Connect repository to Vercel
2. Set root directory to `client`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables

### Deployment Configuration Files

- `Procfile` - For Heroku/Render deployment
- `.github/workflows/ci.yml` - GitHub Actions CI/CD

## 📁 Project Structure
```
edunexus/
├── server/              # Backend application
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── tests/          # Backend tests
├── client/             # Frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React context
│   │   ├── hooks/      # Custom hooks
│   │   ├── services/   # API services
│   │   └── tests/      # Frontend tests
├── docs/               # Documentation
└── uploads/            # Local file storage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Project specification: `FullStackProject-Sem3_33099103.pdf`
- Built as part of Full Stack Development coursework
- Inspired by modern LMS platforms like Moodle and Canvas

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@edunexus.com

---

**Note:** This is an educational project. For production use, implement additional security measures, comprehensive testing, and performance optimizations.

<!-- spec: see FullStackProject-Sem3_33099103.pdf -->