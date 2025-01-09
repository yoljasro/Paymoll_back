const nodemailer = require('nodemailer');

/**
 * Sends an email using nodemailer.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Email body text.
 */
const sendEmail = async (to, subject, text) => {
    try {
        // Create a transporter object using your email provider's SMTP settings
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // E.g., smtp.gmail.com
            port: process.env.SMTP_PORT, // E.g., 587
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // Your SMTP email
                pass: process.env.SMTP_PASS, // Your SMTP email password
            },
        });

        // Define the email options
        const mailOptions = {
            from: process.env.SMTP_FROM, // Sender address
            to,
            subject,
            text,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send email');
    }
};

module.exports = sendEmail;
