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

// debug logging to file
const fs = require('fs');
const path = require('path');
app.use((req, res, next) => {
  const logMsg = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  try {
    fs.appendFileSync(path.join(__dirname, 'debug.log'), logMsg);
  } catch (e) {
    console.error('Failed to write to debug log', e);
  }
  next();
});


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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

    const PORT = process.env.PORT || 5001;
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
