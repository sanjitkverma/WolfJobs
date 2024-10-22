const nodemailer = require('nodemailer');
const Application = require('../models/application');
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
const sendApplicationResultEmail = async (applicantId, subject, text) => {
    const application = await Application.findById(applicantId);
    if (!application) {
        console.error('Applicantion not found');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: application.applicantemail,
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

module.exports = {
    sendApplicationResultEmail,
};