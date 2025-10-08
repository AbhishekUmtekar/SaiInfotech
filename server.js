// server.js - Secure version with environment variables
require('dotenv').config(); // Load environment variables

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

// Serve static files from public folder (JS, images)
app.use(express.static('public'));

// Serve CSS files from css folder
app.use('/css', express.static(path.join(__dirname, 'css')));

// GMAIL CONFIGURATION - From environment variables
const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
};

// Validate environment variables
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ ERROR: Missing email configuration in .env file');
    console.error('Please create a .env file with GMAIL_USER and GMAIL_APP_PASSWORD');
    process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Verify email configuration on startup
console.log('🔧 Testing email configuration...');
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email configuration error:', error.message);
    } else {
        console.log('✅ Email server is ready and authenticated');
        console.log('📧 Configured email:', emailConfig.auth.user);
    }
});

// Route to serve contact.html (outside public folder)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Contact form submission route - Business notification only
app.post('/contact', async (req, res) => {
    console.log('\n📧 ===== NEW CONTACT FORM SUBMISSION =====');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('📦 Form data received:', req.body);

    try {
        const { name, email, phone, company, message } = req.body;

        // Validation
        console.log('🔍 Validating form data...');
        if (!name || !email || !phone || !company) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields.'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Validation failed: Invalid email format:', email);
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        console.log('✅ Form validation passed');
        console.log('👤 User details:', { name, email, phone, company });

        // Business notification email
        console.log('\n📤 Preparing business notification email...');
        const businessEmailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.BUSINESS_EMAIL,
            replyTo: email,
            subject: `🔔 New Contact Form Submission from ${name}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background-color: #d71d1d; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { padding: 30px; background-color: #f9f9f9; }
                    .field { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 5px; border-left: 4px solid #d71d1d; }
                    .label { font-weight: bold; color: #d71d1d; margin-bottom: 8px; display: block; }
                    .value { color: #333; font-size: 16px; }
                    .footer { text-align: center; padding: 20px; background-color: #333; color: white; font-size: 12px; border-radius: 0 0 8px 8px; }
                    .priority { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>🔔 New Contact Form Submission</h1>
                        <p>Someone has contacted you through your website</p>
                    </div>
                    <div class='content'>
                        <div class='priority'>
                            <strong>⚡ Action Required:</strong> A potential customer has reached out. Reply promptly for better conversion!
                        </div>
                        
                        <div class='field'>
                            <span class='label'>👤 Full Name:</span>
                            <div class='value'>${name}</div>
                        </div>
                        <div class='field'>
                            <span class='label'>📧 Email Address:</span>
                            <div class='value'><a href="mailto:${email}">${email}</a></div>
                        </div>
                        <div class='field'>
                            <span class='label'>📱 Phone Number:</span>
                            <div class='value'><a href="tel:${phone}">${phone}</a></div>
                        </div>
                        <div class='field'>
                            <span class='label'>🏢 Company/Organization:</span>
                            <div class='value'>${company}</div>
                        </div>
                        ${message ? `
                        <div class='field'>
                            <span class='label'>💬 Message/Inquiry:</span>
                            <div class='value'>${message.replace(/\n/g, '<br>')}</div>
                        </div>
                        ` : ''}
                        <div class='field'>
                            <span class='label'>🕐 Received On:</span>
                            <div class='value'>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
                        </div>
                        <div class='field'>
                            <span class='label'>🌐 Source:</span>
                            <div class='value'>Website Contact Form</div>
                        </div>
                    </div>
                    <div class='footer'>
                        <p><strong>Quick Actions:</strong></p>
                        <p>📧 Reply: <a href="mailto:${email}" style="color: #ffd700;">${email}</a></p>
                        <p>📱 Call: <a href="tel:${phone}" style="color: #ffd700;">${phone}</a></p>
                        <hr style="margin: 15px 0;">
                        <small>This email was automatically generated from your website contact form.</small>
                    </div>
                </div>
            </body>
            </html>
            `
        };

        console.log('📧 Business email config:', {
            from: businessEmailOptions.from,
            to: businessEmailOptions.to,
            subject: businessEmailOptions.subject
        });

        // Send business email
        console.log('📤 Sending business notification email...');
        const businessEmailResult = await transporter.sendMail(businessEmailOptions);
        console.log('✅ Business email sent successfully!');
        console.log('📮 Email ID:', businessEmailResult.messageId);

        // Success response
        res.json({
            success: true,
            message: `Thank you ${name}! Your message has been sent successfully. We will get back to you soon!`
        });

    } catch (error) {
        console.error('\n❌ ===== ERROR =====');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);

        res.status(500).json({
            success: false,
            message: 'There was an error sending your message. Please try again later.'
        });
    }

    console.log('===== END CONTACT FORM SUBMISSION =====\n');
});

// Test route
app.get('/test', (req, res) => {
    res.json({
        message: '✅ Server is working!',
        timestamp: new Date().toISOString()
    });
});

// Test email route
app.get('/test-email/:email', async (req, res) => {
    const testEmail = req.params.email;
    console.log('🧪 Testing email sending to:', testEmail);

    try {
        const result = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: testEmail,
            subject: 'Test Email from Sai InfoTech Server',
            text: 'This is a test email to verify email configuration is working.',
            html: '<h1>✅ Test Email</h1><p>Email system is working correctly.</p>'
        });

        console.log('✅ Test email sent:', result.messageId);
        res.json({
            success: true,
            message: 'Test email sent successfully',
            messageId: result.messageId
        });
    } catch (error) {
        console.error('❌ Test email failed:', error);
        res.json({
            success: false,
            message: 'Test email failed',
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 ===== SERVER STARTED =====');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`📄 Contact page: http://localhost:${PORT}/`);
    console.log(`🔧 Test endpoint: http://localhost:${PORT}/test`);
    console.log(`📮 Test email: http://localhost:${PORT}/test-email/YOUR_EMAIL`);
    console.log('================================\n');
});