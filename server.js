const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, phone, company, message, recaptchaResponse } = req.body;

        // Verify reCAPTCHA
        const recaptchaVerification = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=YOUR_RECAPTCHA_SECRET_KEY&response=${recaptchaResponse}`
        );

        if (!recaptchaVerification.data.success) {
            return res.json({ success: false, message: 'Failed reCAPTCHA verification' });
        }

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // or use SMTP details
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-app-password'  // Use app password if 2FA is enabled
            }
        });

        // Email options
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'recipient-email@example.com',  // Where you want to receive notifications
            subject: 'New Contact Form Submission',
            text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Message: ${message}
            `,
            html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Company:</strong> ${company}</p>
<p><strong>Message:</strong> ${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ success: false, message: 'Failed to send email' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});