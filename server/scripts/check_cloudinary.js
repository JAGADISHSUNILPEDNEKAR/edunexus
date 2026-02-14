require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

console.log('--- Cloudinary Configuration Check ---');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Cloudinary Configured: ${isCloudinaryConfigured ? 'YES' : 'NO'}`);

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? '******' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING'}`);
} else {
    console.error('ERROR: Cloudinary environment variables are missing!');
    console.log('Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}
console.log('--------------------------------------');
