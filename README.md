# EduNexus — Mini Learning Management System

A full-stack MERN application for online learning with course management, video lectures, assignments, and real-time chat.

![Build Status](https://github.com/yourusername/edunexus/workflows/CI%2FCD%20Pipeline/badge.svg)

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
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### Core Features (MVP)
- ✅ **Authentication & Authorization**: JWT-based login/signup with role-based access control
- ✅ **Course Management**: Create, edit, delete, and view courses
- ✅ **Video Lectures**: Upload and stream video lectures (Cloudinary/local storage)
- ✅ **Assignments**: Upload assignments and submit solutions
- ✅ **Real-time Chat**: Course-specific chat rooms using Socket.io
- ✅ **Admin Panel**: Manage users, courses, and moderate content
- ✅ **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### User Roles
1. **Student**: Enroll in courses, watch lectures, submit assignments, participate in chat
2. **Instructor**: Create/manage courses, upload lectures/assignments, view submissions
3. **Admin**: Full platform oversight, user management, content moderation

## 🛠 Tech Stack

### Backend
- **Node.js** v18+ & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.io** - Real-time communication
- **Cloudinary** - Video/file hosting (optional)
- **express-validator** - Input validation
- **multer** - File upload handling

### Frontend
- **React** 18 (with Vite) - UI library
- **React Router v6** - Routing
- **Context API** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time client
- **Tailwind CSS** - Styling

### DevOps & Testing
- **Jest** & **Supertest** - Backend testing
- **Vitest** & **React Testing Library** - Frontend testing
- **GitHub Actions** - CI/CD pipeline
- **ESLint** & **Prettier** - Code quality

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (comes with Node.js)
- **MongoDB** >= 6.x ([Download](https://www.mongodb.com/try/download/community)) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git** ([Download](https://git-scm.com/downloads))

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

Alternatively, install all dependencies at once from the root:
```bash
npm run install:all
```

## 🔐 Environment Setup

### Server Environment Variables

Create `server/.env` from `server/.env.example`:
```env
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/edunexus

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Cloudinary (Optional - for video uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### Client Environment Variables

Create `client/.env` from `client/.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Important Notes:
- **Never commit `.env` files to version control**
- Generate a strong JWT secret for production: `openssl rand -base64 32`
- For production, use MongoDB Atlas or a managed MongoDB service
- Cloudinary is optional; the app falls back to local file storage

## 🎬 Running the Application

### Step 1: Start MongoDB

**If using local MongoDB:**
```bash
mongod
```

**If using MongoDB Atlas:**
Update `MONGO_URI` in `server/.env` with your connection string.

### Step 2: Seed the Database (First Time Only)
```bash
cd server
npm run seed
```

This creates:
- 1 Admin user
- 1 Instructor user
- 2 Student users
- 3 Sample courses with lectures
- 1 Sample assignment
- Sample chat messages

### Step 3: Start Backend Server
```bash
cd server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 4: Start Frontend Development Server

Open a new terminal:
```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

### Alternative: Run Both Servers Concurrently

From the project root:
```bash
npm run dev
```

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend (build and preview):**
```bash
cd client
npm run build
npm run preview
```

## 👥 Demo Credentials

After running the seed script, use these credentials to explore different roles:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@edunexus.com | Admin@123 | Full platform access |
| **Instructor** | instructor@edunexus.com | Instructor@123 | Create/manage courses |
| **Student 1** | student1@edunexus.com | Student@123 | Enrolled in courses |
| **Student 2** | student2@edunexus.com | Student@123 | Enrolled in courses |

## 📚 API Documentation

Detailed API documentation is available in [`docs/API.md`](./docs/API.md)

### Quick Reference

**Base URL:** `http://localhost:5000/api`

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

**Courses:**
- `GET /courses` - List all courses
- `POST /courses` - Create course (instructor)
- `GET /courses/:id` - Get course details
- `PUT /courses/:id` - Update course (instructor)
- `DELETE /courses/:id` - Delete course (instructor/admin)
- `POST /courses/:id/enroll` - Enroll in course (student)

**Assignments:**
- `GET /assignments/course/:courseId` - List course assignments
- `POST /assignments` - Create assignment (instructor)
- `POST /assignments/:id/submit` - Submit assignment (student)

**Admin:**
- `GET /users` - List all users (admin)
- `DELETE /users/:id` - Delete user (admin)
- `GET /users/admin/stats` - Platform statistics (admin)

**Chat:**
- `GET /chat/:courseId` - Get course messages
- `POST /chat/:courseId` - Send message

See full documentation for request/response formats and authentication requirements.

## 🧪 Testing

### Run All Tests

From project root:
```bash
npm test
```

### Backend Tests
```bash
cd server
npm test
```

**Test Coverage:**
- Authentication routes (register, login, logout)
- JWT token validation
- Role-based access control
- Input validation

### Frontend Tests
```bash
cd client
npm test
```

**Test Coverage:**
- Login component rendering
- Form validation
- User interactions

### Watch Mode (for development)
```bash
# Backend
cd server
npm run test:watch

# Frontend
cd client
npm test -- --watch
```

## 🚢 Deployment

### Option 1: Deploy to Render (Backend) + Vercel (Frontend)

#### Backend on Render

1. Create account on [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `node server/index.js`
   - **Environment:** Add all variables from `server/.env.example`
5. Deploy

#### Frontend on Vercel

1. Create account on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:** Add from `client/.env.example`
4. Update `VITE_API_URL` to your Render backend URL
5. Deploy

### Option 2: Deploy to Heroku

1. Install Heroku CLI
2. Create Heroku app:
```bash
   heroku create edunexus
```
3. Add MongoDB addon:
```bash
   heroku addons:create mongolab:sandbox
```
4. Set environment variables:
```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set CLIENT_URL=https://your-frontend-url.com
```
5. Deploy:
```bash
   git push heroku main
```

### Option 3: Docker Deployment

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
  
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/edunexus
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
  
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api

volumes:
  mongo-data:
```

Deploy:
```bash
docker-compose up -d
```

### Environment Variables for Production

**Critical Security Settings:**
- Set `NODE_ENV=production`
- Use strong, random `JWT_SECRET`
- Update `CLIENT_URL` to your frontend domain
- Use MongoDB Atlas or managed database
- Enable HTTPS
- Configure proper CORS origins

## 📁 Project Structure
```
edunexus/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── server/                     # Backend application
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── assignmentController.js
│   │   ├── userController.js
│   │   └── chatController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── roleCheck.js      # Role-based access
│   │   └── upload.js         # File upload handling
│   ├── models/               # Mongoose models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   └── Message.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── userRoutes.js
│   │   └── chatRoutes.js
│   ├── services/             # Business logic
│   │   └── uploadService.js
│   ├── utils/                # Utility functions
│   │   ├── validation.js
│   │   └── logger.js
│   ├── tests/                # Backend tests
│   │   └── auth.test.js
│   ├── seed.js               # Database seeder
│   ├── index.js              # Server entry point
│   ├── socket.js             # Socket.io configuration
│   └── package.json
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── courses/     # Course components
│   │   │   ├── assignments/ # Assignment components
│   │   │   ├── chat/        # Chat components
│   │   │   ├── admin/       # Admin components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── layout/      # Layout components
│   │   ├── context/         # React context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/           # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── tests/           # Frontend tests
│   │   │   ├── setup.js
│   │   │   └── Login.test.jsx
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── docs/
│   └── API.md                # API documentation
├── uploads/                  # Local file storage
│   ├── videos/
│   └── assignments/
├── .gitignore
├── ASSUMPTIONS.md            # Development assumptions
├── README.md                 # This file
├── Procfile                  # Heroku deployment
└── package.json              # Root package.json
```

## 📸 Screenshots

### Login Page
Clean and simple authentication interface with demo credentials displayed.

### Student Dashboard
Overview of enrolled courses, assignments, and progress tracking.

### Instructor Dashboard
Manage courses, view enrolled students, and track submissions.

### Course Detail Page
View lectures, assignments, and access course chat.

### Admin Dashboard
Platform statistics and user/content management tools.

### Real-time Chat
Course-specific chat with typing indicators and message history.

*(Add actual screenshots here)*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
```bash
   git checkout -b feature/AmazingFeature
```
3. Commit your changes
```bash
   git commit -m 'Add some AmazingFeature'
```
4. Push to the branch
```bash
   git push origin feature/AmazingFeature
```
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Project Specification:** `FullStackProject-Sem3_33099103.pdf`
- Built as part of Full Stack Development coursework (Semester 3)
- Inspired by modern LMS platforms like Moodle, Canvas, and Udemy
- Special thanks to the MERN stack community

## 📞 Support & Contact

For issues, questions, or suggestions:

- 📧 Email: support@edunexus.com
- 🐛 [Open an issue](https://github.com/yourusername/edunexus/issues)
- 💬 [Discussions](https://github.com/yourusername/edunexus/discussions)

## 🔮 Future Enhancements

Potential features for future versions:

- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Course progress tracking with completion percentages
- [ ] Certificate generation upon course completion
- [ ] Payment integration for paid courses
- [ ] Advanced analytics dashboard
- [ ] Video upload directly from UI (not just URL)
- [ ] Assignment grading interface for instructors
- [ ] Live video classes integration (Zoom/Google Meet)
- [ ] Mobile app (React Native)
- [ ] Course reviews and ratings
- [ ] Discussion forums per course
- [ ] Push notifications
- [ ] Calendar integration for assignment due dates
- [ ] Bulk user import (CSV)
- [ ] Course categories and tags

## ⚠️ Important Notes

- **Security:** This is an educational project. For production use, implement additional security measures:
  - Rate limiting on all endpoints
  - Input sanitization and XSS protection
  - CSRF protection
  - Helmet.js security headers
  - SQL injection prevention (N/A for MongoDB, but be aware)
  - Regular security audits
  
- **Performance:** Consider implementing:
  - Redis caching for frequent queries
  - Database indexing optimization
  - CDN for static assets
  - Load balancing for scalability
  
- **Monitoring:** Add monitoring tools:
  - Error tracking (Sentry)
  - Performance monitoring (New Relic)
  - Logging service (Winston + ELK stack)

---

*Last Updated: October 26, 2025*

<!-- spec: see FullStackProject-Sem3_33099103.pdf -->