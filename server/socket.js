// Socket.io configuration for real-time chat - PRODUCTION FIXED
// spec: see FullStackProject-Sem3_33099103.pdf

const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: [
        'https://edunexus-client.vercel.app',  // ✅ Your Vercel frontend
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5173',
        'http://localhost:3000'
      ],
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join course room
    socket.on('join-course', (courseId) => {
      socket.join(`course-${courseId}`);
      console.log(`User ${socket.userId} joined course ${courseId}`);
      
      socket.to(`course-${courseId}`).emit('user-joined', {
        userId: socket.userId,
        message: 'A user joined the course chat'
      });
    });

    // Leave course room
    socket.on('leave-course', (courseId) => {
      socket.leave(`course-${courseId}`);
      console.log(`User ${socket.userId} left course ${courseId}`);
    });

    // Handle chat messages
    socket.on('send-message', async (data) => {
      const { courseId, message } = data;
      
      // Broadcast to all users in the course room
      io.to(`course-${courseId}`).emit('new-message', {
        userId: socket.userId,
        message,
        timestamp: new Date()
      });
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { courseId, isTyping } = data;
      socket.to(`course-${courseId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };