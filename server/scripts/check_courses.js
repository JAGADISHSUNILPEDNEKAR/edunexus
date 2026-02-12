const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Course = require('../models/Course');

const checkCourses = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined');
            process.exit(1);
        }

        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses.`);

        let activeCount = 0;
        let inactiveCount = 0;
        let missingFieldCount = 0;

        courses.forEach(c => {
            const isActive = c.isActive;
            console.log(`Course: ${c.title}, ID: ${c._id}, isActive: ${isActive}`);

            if (isActive === true) activeCount++;
            else if (isActive === false) inactiveCount++;
            else missingFieldCount++;
        });

        console.log('Summary:');
        console.log(`Active: ${activeCount}`);
        console.log(`Inactive: ${inactiveCount}`);
        console.log(`Missing isActive field: ${missingFieldCount}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkCourses();
