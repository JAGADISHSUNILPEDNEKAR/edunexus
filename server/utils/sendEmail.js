const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
    // Create transporter
    // If no SMTP credentials, we'll log the email content to console (Dev mode)
    if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL) {
        console.log('------------------------------------------');
        console.log('WARNING: SMTP not configured. Email NOT sent.');
        console.log('To: ' + options.email);
        console.log('Subject: ' + options.subject);
        console.log('Message: \n' + options.message);
        console.log('------------------------------------------');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'EduNexus'} <${process.env.FROM_EMAIL || 'noreply@edunexus.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
        // html: options.html // Extend if we want HTML emails later
    };

    const info = await transporter.sendMail(message);

    logger.info(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
