const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve contact page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Contact form submission
app.post('/contact', async (req, res) => {
    try {
        // Check environment variables
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.error('❌ Missing email configuration');
            return res.status(500).json({
                success: false,
                message: 'Email service is not configured. Please contact the administrator.'
            });
        }

        const { name, email, phone, company, message } = req.body;

        // Validation
        if (!name || !email || !phone || !company) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields.'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        // Create transporter
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.BUSINESS_EMAIL || process.env.GMAIL_USER,
            replyTo: email,
            subject: `🔔 New Contact Form - ${name}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #d71d1d; color: white; padding: 20px; text-align: center;">
                    <h1>New Contact Form Submission</h1>
                </div>
                <div style="padding: 20px; background-color: #f9f9f9;">
                    <p><strong>👤 Name:</strong> ${name}</p>
                    <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>📱 Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p><strong>🏢 Company:</strong> ${company}</p>
                    ${message ? `<p><strong>💬 Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
                    <p><strong>🕐 Received:</strong> ${new Date().toLocaleString()}</p>
                </div>
            </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: `Thank you ${name}! Your message has been sent successfully.`
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            message: 'There was an error sending your message. Please try again later.'
        });
    }
});

// Test route
app.get('/test', (req, res) => {
    res.json({
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        env: {
            hasGmailUser: !!process.env.GMAIL_USER,
            hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
            hasBusinessEmail: !!process.env.BUSINESS_EMAIL
        }
    });
});

// Export for Vercel
module.exports = app;

// Start server locally
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}