// Main server entry point - PRODUCTION DEPLOYMENT FIXED
// spec: see FullStackProject-Sem3_33099103.pdf

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');

const connectDB = require('./config/db');
const { initSocket } = require('./socket');
const logger = require('./utils/logger');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ✅ FIXED CORS Configuration for Production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://edunexus-client.vercel.app',
      'https://edunexus-client-git-main-your-username.vercel.app',
      'https://edunexus-client-*.vercel.app',
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
    ].filter(Boolean);

    logger.info(`🔍 CORS Request - Origin: ${origin || 'NO ORIGIN'}`);

    if (!origin) {
      logger.info('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      logger.info(`✅ CORS: Allowed origin (exact match): ${origin}`);
      return callback(null, true);
    }

    const isVercelDomain = origin.match(/^https:\/\/edunexus-client.*\.vercel\.app$/);
    if (isVercelDomain) {
      logger.info(`✅ CORS: Allowed origin (Vercel pattern): ${origin}`);
      return callback(null, true);
    }

    logger.warn(`❌ CORS: Blocked origin: ${origin}`);
    logger.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);

    if (process.env.NODE_ENV === 'production') {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ✅ Root route (for health checks)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduNexus API is running 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      docs: '/api/docs',
    },
  });
});

// ✅ Dedicated health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    database: 'Connected',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
  });
});

// ⚠️ TEMPORARY SEED ENDPOINT - REMOVE AFTER FIRST USE!
app.post('/api/seed-database', async (req, res) => {
  try {
    const User = require('./models/User');
    const Course = require('./models/Course');
    const Assignment = require('./models/Assignment');
    const Message = require('./models/Message');

    const providedPassword = req.body.seedPassword;
    const SEED_PASSWORD = process.env.SEED_PASSWORD || 'seed-edunexus-2024';

    if (providedPassword !== SEED_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Invalid seed password' });
    }

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.json({
        success: false,
        message: 'Database already has data. Clear it first if you want to re-seed.',
        userCount: existingUsers,
      });
    }

    logger.info('🌱 Starting database seeding...');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@edunexus.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const instructor = await User.create({
      name: 'John Instructor',
      email: 'instructor@edunexus.com',
      password: 'Instructor@123',
      role: 'instructor',
    });

    const student1 = await User.create({
      name: 'Alice Student',
      email: 'student1@edunexus.com',
      password: 'Student@123',
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Bob Student',
      email: 'student2@edunexus.com',
      password: 'Student@123',
      role: 'student',
    });

    const course1 = await Course.create({
      title: 'Introduction to Web Development',
      description:
        'Learn the fundamentals of web development including HTML, CSS, JavaScript, and modern frameworks.',
      instructor: instructor._id,
      lectures: [
        { title: 'Getting Started with HTML', videoUrl: 'https://www.example.com/sample-video-1.mp4', duration: 1800, order: 1 },
        { title: 'CSS Fundamentals', videoUrl: 'https://www.example.com/sample-video-2.mp4', duration: 2100, order: 2 },
        { title: 'JavaScript Basics', videoUrl: 'https://www.example.com/sample-video-3.mp4', duration: 2400, order: 3 },
      ],
      enrolledStudents: [student1._id, student2._id],
    });

    await User.findByIdAndUpdate(student1._id, { $push: { enrolledCourses: course1._id } });
    await User.findByIdAndUpdate(student2._id, { $push: { enrolledCourses: course1._id } });

    const course2 = await Course.create({
      title: 'Advanced JavaScript and ES6+',
      description:
        'Deep dive into modern JavaScript features, async programming, and best practices for writing clean, efficient code.',
      instructor: instructor._id,
    });

    const course3 = await Course.create({
      title: 'React.js for Beginners',
      description:
        'Learn React.js from scratch and build modern, interactive user interfaces with components, hooks, and state management.',
      instructor: instructor._id,
      enrolledStudents: [student1._id],
    });

    await User.findByIdAndUpdate(student1._id, { $push: { enrolledCourses: course3._id } });

    const assignment = await Assignment.create({
      title: 'Build a Personal Portfolio Website',
      description: 'Create a responsive portfolio website using HTML, CSS, and JS.',
      course: course1._id,
      instructor: instructor._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxScore: 100,
    });

    await Message.insertMany([
      { course: course1._id, sender: instructor._id, content: 'Welcome to the course!' },
      { course: course1._id, sender: student1._id, content: 'Thank you! Excited to learn.' },
    ]);

    logger.success('🎉 Database seeded successfully!');

    res.json({
      success: true,
      message: '🎉 Database seeded successfully!',
      credentials: {
        admin: { email: 'admin@edunexus.com', password: 'Admin@123' },
        instructor: { email: 'instructor@edunexus.com', password: 'Instructor@123' },
        student1: { email: 'student1@edunexus.com', password: 'Student@123' },
        student2: { email: 'student2@edunexus.com', password: 'Student@123' },
      },
    });
  } catch (error) {
    logger.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Seed failed',
      error: error.message,
    });
  }
});

// ✅ CORS Debug endpoint (remove in production after testing)
app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working!',
    origin: req.headers.origin,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Serve static files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ✅ Start server
const startServer = async () => {
  try {
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
    const missing = requiredEnvVars.filter((v) => !process.env[v]);
    if (missing.length) throw new Error(`Missing env vars: ${missing.join(', ')}`);

    await connectDB();
    logger.success('✅ Database connected successfully');

    initSocket(server);
    logger.success('✅ Socket.io initialized');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      logger.success(`🚀 Server running in ${process.env.NODE_ENV || 'production'} on port ${PORT}`);
    });
  } catch (err) {
    logger.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  logger.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => logger.info('Process terminated'));
});

startServer();

module.exports = app;
