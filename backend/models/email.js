const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Function to send email notifications
module.exports.sendEmail = async (applicantemail, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: applicantemail,
        subject,
        html,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};