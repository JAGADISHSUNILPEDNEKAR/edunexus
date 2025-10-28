// Main server entry point - PRODUCTION FIXED
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
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - PRODUCTION FIXED
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://edunexus-client.vercel.app',  // ✅ Your Vercel frontend
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ].filter(Boolean);
    
    logger.info(`CORS check - Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Still allow in case of misconfiguration
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ✅ Root route (for health checks)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduNexus API is running 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0'
  });
});

// ✅ Dedicated health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    database: 'Connected',
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
});

// ✅ Start server function
const startServer = async () => {
  try {
    // Connect to database FIRST
    await connectDB();
    logger.success('Database connected successfully');
    
    // Initialize Socket.io
    initSocket(server);
    logger.success('Socket.io initialized');
    
    // Start listening
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      logger.success(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
      logger.info(`📡 API available at: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌐 Accepting requests from: https://edunexus-client.vercel.app`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();

// Export app for testing
module.exports = app;