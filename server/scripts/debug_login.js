// Debug script for login hangs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const debugLogin = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined');
        }
        console.log(`📍 Mongo URI: ${process.env.MONGO_URI.replace(/:[^:]*@/, ':****@')}`);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB');

        const email = 'student1@edunexus.com';
        console.log(`🔍 Searching for user: ${email}`);

        // Test findOne
        const startTime = Date.now();
        const user = await User.findOne({ email }).select('+password');
        const endTime = Date.now();

        console.log(`⏱️ Query took ${endTime - startTime}ms`);

        if (user) {
            console.log('✅ User found:', user.email);
            console.log('🔑 Password hash exists:', !!user.password);

            // We don't know the password, but we can check if comparePassword function exists and runs
            // (it will fail but shouldn't hang)
            console.log('Testing password comparison with dummy password...');
            const dummyStart = Date.now();
            const isMatch = await user.comparePassword('wrongpassword');
            const dummyEnd = Date.now();
            console.log(`⏱️ Password comparison took ${dummyEnd - dummyStart}ms`);
            console.log(`Result (should be false): ${isMatch}`);

            // Test JWT generation
            console.log('Testing JWT generation...');
            const jwt = require('jsonwebtoken');
            const startJwt = Date.now();
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );
            const endJwt = Date.now();
            console.log(`⏱️ JWT generation took ${endJwt - startJwt}ms`);
            console.log('✅ JWT generated successfully');

        } else {
            console.log('❌ User not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

debugLogin();
