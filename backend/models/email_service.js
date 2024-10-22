const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service you prefer
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Function to send email notifications
const sendApplicationResultEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
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
