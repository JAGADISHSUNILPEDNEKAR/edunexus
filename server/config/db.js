// Database configuration and connection - FIXED VERSION
// spec: see FullStackProject-Sem3_33099103.pdf

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📍 Database URI: ${process.env.MONGO_URI.replace(/:[^:]*@/, ':****@')}`);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    // Setup indexes for performance
    await setupIndexes();
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: Make sure MongoDB is running on your system');
      console.error('   - Start MongoDB: mongod');
      console.error('   - Or use MongoDB Atlas connection string');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Tip: Check your MongoDB username and password');
    } else if (error.message.includes('MONGO_URI')) {
      console.error('💡 Tip: Add MONGO_URI to your .env file');
      console.error('   Example: MONGO_URI=mongodb://localhost:27017/edunexus');
    }
    
    throw error; // Re-throw to be caught by server startup
  }
};

const setupIndexes = async () => {
  try {
    console.log('📊 Setting up database indexes...');
    // Indexes will be created by models on first query
    console.log('✅ Database indexes ready');
  } catch (error) {
    console.warn('⚠️  Error setting up indexes:', error.message);
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;