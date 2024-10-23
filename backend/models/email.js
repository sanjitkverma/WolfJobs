const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Function to send email notifications
const sendEmail = async (applicantemail, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: applicantemail,
        subject,
        text,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;