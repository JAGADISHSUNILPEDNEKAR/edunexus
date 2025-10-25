// Database seed script with demo data
// spec: see FullStackProject-Sem3_33099103.pdf

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Message = require('./models/Message');
const logger = require('./utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.success('MongoDB Connected for seeding');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Assignment.deleteMany();
    await Message.deleteMany();
    logger.info('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@edunexus.com',
      password: 'Admin@123',
      role: 'admin'
    });
    logger.success('Admin created');

    const instructor = await User.create({
      name: 'John Instructor',
      email: 'instructor@edunexus.com',
      password: 'Instructor@123',
      role: 'instructor'
    });
    logger.success('Instructor created');

    const student1 = await User.create({
      name: 'Alice Student',
      email: 'student1@edunexus.com',
      password: 'Student@123',
      role: 'student'
    });
    logger.success('Student 1 created');

    const student2 = await User.create({
      name: 'Bob Student',
      email: 'student2@edunexus.com',
      password: 'Student@123',
      role: 'student'
    });
    logger.success('Student 2 created');

    // Create a sample course
    const course = await Course.create({
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, JavaScript, and modern frameworks. This comprehensive course covers everything from basic syntax to building full-stack applications.',
      instructor: instructor._id,
      lectures: [
        {
          title: 'Getting Started with HTML',
          videoUrl: 'https://www.example.com/sample-video-1.mp4',
          duration: 1800,
          order: 1
        },
        {
          title: 'CSS Fundamentals',
          videoUrl: 'https://www.example.com/sample-video-2.mp4',
          duration: 2100,
          order: 2
        },
        {
          title: 'JavaScript Basics',
          videoUrl: 'https://www.example.com/sample-video-3.mp4',
          duration: 2400,
          order: 3
        }
      ],
      enrolledStudents: [student1._id, student2._id]
    });
    logger.success('Course created');

    // Enroll students in course
    await User.findByIdAndUpdate(student1._id, {
      $push: { enrolledCourses: course._id }
    });
    await User.findByIdAndUpdate(student2._id, {
      $push: { enrolledCourses: course._id }
    });
    logger.success('Students enrolled in course');

    // Create a sample assignment
    const assignment = await Assignment.create({
      title: 'Build a Personal Portfolio Website',
      description: 'Create a responsive personal portfolio website using HTML, CSS, and JavaScript. Your portfolio should include: Home page with introduction, Skills section, Projects showcase, Contact form. The website must be mobile-responsive and follow modern web design principles.',
      course: course._id,
      instructor: instructor._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxScore: 100
    });
    logger.success('Assignment created');

    // Create sample chat messages
    const messages = [
      {
        course: course._id,
        sender: instructor._id,
        content: 'Welcome to the Introduction to Web Development course! Feel free to ask any questions here.'
      },
      {
        course: course._id,
        sender: student1._id,
        content: 'Thank you! I\'m excited to learn web development.'
      },
      {
        course: course._id,
        sender: student2._id,
        content: 'Hello everyone! Looking forward to this course.'
      },
      {
        course: course._id,
        sender: instructor._id,
        content: 'Great to have you both here! Make sure to complete the first assignment by the due date.'
      }
    ];

    await Message.insertMany(messages);
    logger.success('Chat messages created');

    // Create additional courses for variety
    const course2 = await Course.create({
      title: 'Advanced JavaScript and ES6+',
      description: 'Deep dive into modern JavaScript features, async programming, and best practices for writing clean, efficient code.',
      instructor: instructor._id,
      lectures: [
        {
          title: 'ES6 Arrow Functions and Destructuring',
          videoUrl: 'https://www.example.com/sample-video-4.mp4',
          duration: 1600,
          order: 1
        }
      ],
      enrolledStudents: []
    });
    logger.success('Second course created');

    const course3 = await Course.create({
      title: 'React.js for Beginners',
      description: 'Learn React.js from scratch and build modern, interactive user interfaces with components, hooks, and state management.',
      instructor: instructor._id,
      lectures: [],
      enrolledStudents: [student1._id]
    });
    logger.success('Third course created');

    await User.findByIdAndUpdate(student1._id, {
      $push: { enrolledCourses: course3._id }
    });

    logger.success('\n========================================');
    logger.success('Database seeded successfully!');
    logger.success('========================================\n');
    
    console.log('📧 Demo Credentials:\n');
    console.log('Admin:');
    console.log('  Email: admin@edunexus.com');
    console.log('  Password: Admin@123\n');
    console.log('Instructor:');
    console.log('  Email: instructor@edunexus.com');
    console.log('  Password: Instructor@123\n');
    console.log('Student 1:');
    console.log('  Email: student1@edunexus.com');
    console.log('  Password: Student@123\n');
    console.log('Student 2:');
    console.log('  Email: student2@edunexus.com');
    console.log('  Password: Student@123\n');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(seedData);