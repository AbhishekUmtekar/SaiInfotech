const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        console.log('📧 New contact form submission');

        // Check environment variables
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.error('❌ Missing email configuration');
            return res.status(500).json({
                success: false,
                message: 'Email service is not configured.'
            });
        }

        const { name, email, phone, company, message } = req.body;

        console.log('Form data:', { name, email, phone, company });

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

        console.log('Creating transporter...');

        // Create transporter - FIXED: createTransport not createTransporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        console.log('Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP verified');

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

        console.log('Sending email to:', mailOptions.to);

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent successfully:', info.messageId);

        return res.status(200).json({
            success: true,
            message: `Thank you ${name}! Your message has been sent successfully.`
        });

    } catch (error) {
        console.error('❌ Error:', error);
        return res.status(500).json({
            success: false,
            message: 'There was an error sending your message. Please try again later.'
        });
    }
};