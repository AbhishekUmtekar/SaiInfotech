// server.js - Complete file with enhanced email debugging
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder (JS, images)
app.use(express.static('public'));

// Serve CSS files from css folder
app.use('/css', express.static(path.join(__dirname, 'css')));

// GMAIL CONFIGURATION - UPDATE THESE VALUES
const emailConfig = {
    service: 'gmail',
    auth: {
        user: 'abhishekumtekar95@gmail.com',           // ← UPDATE: Your Gmail
        pass: 'qaoe xyzf pmfd pkdp'               // ← UPDATE: Your 16-char app password
    }
};

// Create transporter with detailed logging
const transporter = nodemailer.createTransporter({
    ...emailConfig,
    debug: true,  // Enable debug mode
    logger: true  // Enable logging
});

// Verify email configuration on startup
console.log('🔧 Testing email configuration...');
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email configuration error:', error.message);
        console.log('🔍 Error details:', {
            code: error.code,
            command: error.command,
            responseCode: error.responseCode
        });
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

// Contact form submission route - ENHANCED DEBUGGING
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

        // EMAIL 1: Business notification email
        console.log('\n📤 Preparing business notification email...');
        const businessEmailOptions = {
            from: emailConfig.auth.user,
            to: 'saiinfotech085@gmail.com',
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

        // EMAIL 2: User acknowledgment email (simplified for better delivery)
        console.log('📤 Preparing user acknowledgment email...');
        const userEmailOptions = {
            from: emailConfig.auth.user,
            to: email,
            subject: `Thank you for contacting Sai InfoTech, ${name}!`,
            text: `Hello ${name}!\n\nThank you for contacting Sai InfoTech. We have successfully received your message and will get back to you as soon as possible.\n\nYour Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\n${message ? `Message: ${message}\n` : ''}\nFor immediate assistance:\nPhone: +91 9892511424\nEmail: saiinfotech085@gmail.com\n\nBest regards,\nSai InfoTech Team`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
                    .header { background-color: #28a745; color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .message-box { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                    .info-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e9ecef; }
                    .footer { text-align: center; padding: 20px; background-color: #343a40; color: white; }
                    .highlight { color: #28a745; font-weight: bold; }
                    h1, h2, h3 { margin-top: 0; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>✅ Message Received Successfully!</h1>
                        <p>Thank you for contacting Sai InfoTech</p>
                    </div>
                    <div class='content'>
                        <div class='message-box'>
                            <h2 style="color: #28a745;">Hello ${name}! 👋</h2>
                            <p>We have successfully received your message and will get back to you within <span class="highlight">2-4 business hours</span>.</p>
                        </div>

                        <div class='info-box'>
                            <h3 style="color: #d71d1d;">📋 Your Submission Summary:</h3>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Company:</strong> ${company}</p>
                            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
                            <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>

                        <div class='info-box'>
                            <h3 style="color: #d71d1d;">📞 Need Immediate Assistance?</h3>
                            <p><strong>📱 Phone:</strong> <a href="tel:+919892511424">+91 9892511424</a></p>
                            <p><strong>📧 Email:</strong> <a href="mailto:saiinfotech085@gmail.com">saiinfotech085@gmail.com</a></p>
                            <p><strong>📍 Address:</strong> Gala No: 28, Jokim Compound, Quarry Road, Ganesh Nagar, Bhandup West, Mumbai, Maharashtra, 400078</p>
                        </div>
                    </div>
                    <div class='footer'>
                        <p><strong>Sai InfoTech</strong> - Your Technology Partner</p>
                        <hr style="margin: 15px 0; border-color: #6c757d;">
                        <p style="font-size: 12px;">This is an automated confirmation email. Please do not reply directly to this email.</p>
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

        console.log('📧 User email config:', {
            from: userEmailOptions.from,
            to: userEmailOptions.to,
            subject: userEmailOptions.subject
        });

        // Send emails with detailed logging
        console.log('\n🚀 Starting email sending process...');

        // Send business email first
        console.log('📤 Sending business notification email...');
        let businessEmailResult;
        try {
            businessEmailResult = await transporter.sendMail(businessEmailOptions);
            console.log('✅ Business email sent successfully!');
            console.log('📮 Business email ID:', businessEmailResult.messageId);
            console.log('📊 Business email response:', businessEmailResult.response);
        } catch (businessEmailError) {
            console.error('❌ Business email failed:', businessEmailError.message);
            console.error('🔍 Business email error details:', {
                code: businessEmailError.code,
                command: businessEmailError.command,
                responseCode: businessEmailError.responseCode
            });
            // Continue with user email even if business email fails
        }

        // Send user acknowledgment email
        console.log('\n📤 Sending user acknowledgment email...');
        console.log('📧 Sending to user email:', email);
        let userEmailResult;
        try {
            userEmailResult = await transporter.sendMail(userEmailOptions);
            console.log('✅ User acknowledgment email sent successfully!');
            console.log('📮 User email ID:', userEmailResult.messageId);
            console.log('📊 User email response:', userEmailResult.response);
        } catch (userEmailError) {
            console.error('❌ User acknowledgment email failed:', userEmailError.message);
            console.error('🔍 User email error details:', {
                code: userEmailError.code,
                command: userEmailError.command,
                responseCode: userEmailError.responseCode,
                rejected: userEmailError.rejected
            });

            // Check specific error types
            if (userEmailError.code === 'EAUTH') {
                console.error('🔑 Authentication error - check your Gmail app password');
            } else if (userEmailError.code === 'EENVELOPE') {
                console.error('📧 Invalid email address format');
            } else if (userEmailError.responseCode === 550) {
                console.error('📮 Email rejected by recipient server (maybe invalid email)');
            }
        }

        // Response based on email success
        console.log('\n📊 Email sending summary:');
        console.log('Business email success:', !!businessEmailResult);
        console.log('User email success:', !!userEmailResult);

        if (businessEmailResult || userEmailResult) {
            console.log('✅ At least one email was sent successfully');
            res.json({
                success: true,
                message: `Thank you ${name}! Your message has been sent successfully. ${userEmailResult ? 'Please check your email for confirmation.' : 'We will get back to you soon!'}`
            });
        } else {
            console.log('❌ Both emails failed to send');
            res.status(500).json({
                success: false,
                message: 'There was an error sending your message. Please try again later or contact us directly.'
            });
        }

    } catch (error) {
        console.error('\n❌ ===== CRITICAL ERROR =====');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            code: error.code,
            command: error.command,
            responseCode: error.responseCode
        });

        res.status(500).json({
            success: false,
            message: 'There was an unexpected error. Please try again later.'
        });
    }

    console.log('===== END CONTACT FORM SUBMISSION =====\n');
});

// Test route to verify server and email config
app.get('/test', (req, res) => {
    res.json({
        message: '✅ Server is working!',
        timestamp: new Date().toISOString(),
        emailConfig: {
            user: emailConfig.auth.user,
            service: 'gmail'
        }
    });
});

// Test email route for debugging
app.get('/test-email/:email', async (req, res) => {
    const testEmail = req.params.email;
    console.log('🧪 Testing email sending to:', testEmail);

    try {
        const result = await transporter.sendMail({
            from: emailConfig.auth.user,
            to: testEmail,
            subject: 'Test Email from Sai InfoTech Server',
            text: 'This is a test email to verify email configuration is working.',
            html: '<h1>✅ Test Email</h1><p>This is a test email to verify email configuration is working.</p><p>Timestamp: ' + new Date().toISOString() + '</p>'
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
    console.log(`📧 Email system: Enhanced debugging mode`);
    console.log(`🔧 Test endpoint: http://localhost:${PORT}/test`);
    console.log(`📮 Test email: http://localhost:${PORT}/test-email/YOUR_EMAIL`);
    console.log('================================\n');
});