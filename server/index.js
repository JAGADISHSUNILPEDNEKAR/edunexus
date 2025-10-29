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
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ✅ FIXED CORS Configuration for Production
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      'https://edunexus-client.vercel.app',
      'https://edunexus-client-git-main-your-username.vercel.app', // Vercel preview URLs
      'https://edunexus-client-*.vercel.app', // Wildcard for Vercel
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ].filter(Boolean);
    
    logger.info(`🔍 CORS Request - Origin: ${origin || 'NO ORIGIN'}`);
    
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      logger.info('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check exact match
    if (allowedOrigins.includes(origin)) {
      logger.info(`✅ CORS: Allowed origin (exact match): ${origin}`);
      return callback(null, true);
    }
    
    // Check wildcard patterns for Vercel
    const isVercelDomain = origin.match(/^https:\/\/edunexus-client.*\.vercel\.app$/);
    if (isVercelDomain) {
      logger.info(`✅ CORS: Allowed origin (Vercel pattern): ${origin}`);
      return callback(null, true);
    }
    
    logger.warn(`❌ CORS: Blocked origin: ${origin}`);
    logger.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
    
    // In production, strictly enforce CORS
    if (process.env.NODE_ENV === 'production') {
      callback(new Error('Not allowed by CORS'));
    } else {
      // In development, be permissive for testing
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined')); // More detailed logging for production
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
      docs: '/api/docs'
    }
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
    environment: process.env.NODE_ENV
  });
});

// ✅ CORS Debug endpoint (remove in production after testing)
app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working!',
    origin: req.headers.origin,
    headers: req.headers,
    timestamp: new Date().toISOString()
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
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: ['/api/auth', '/api/courses', '/api/assignments', '/api/users', '/api/chat']
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
    // Validate required environment variables
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }
    
    // Connect to database FIRST
    await connectDB();
    logger.success('✅ Database connected successfully');
    
    // Initialize Socket.io
    initSocket(server);
    logger.success('✅ Socket.io initialized');
    
    // Start listening
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      logger.success(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
      logger.info(`📡 API available at: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'Vercel domains'}`);
      logger.info(`📊 Database: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    logger.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
  });
});

// Start the server
startServer();

// Export app for testing
module.exports = app;