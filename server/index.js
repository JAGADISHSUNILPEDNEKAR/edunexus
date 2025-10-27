// Main server entry point
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

// Initialize express app
const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// Initialize Socket.io
initSocket(server);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Root route (for Render health check)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduNexus backend is live 🚀',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Dedicated health check route (for monitoring tools or Render)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduNexus API is running',
    timestamp: new Date().toISOString(),
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
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ✅ Start server
// Important: Bind to 0.0.0.0 so Render's internal health checker can access it
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Export app for testing
module.exports = app;
