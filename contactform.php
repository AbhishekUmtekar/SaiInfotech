<?php
// Include PHPMailer - choose one method:
// Method 1: If using Composer
// require_once 'vendor/autoload.php';

// Method 2: If downloaded PHPMailer manually, include these files:
require_once 'PHPMailer-6.10.0/src/Exception.php';
require_once 'PHPMailer-6.10.0/src/PHPMailer.php';
require_once 'PHPMailer-6.10.0/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// GMAIL CONFIGURATION - UPDATE THESE VALUES
$config = [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_username' => 'abhishekumtekar95@gmail.com', // ⚠️ CHANGE THIS
    'smtp_password' => 'qaoe xyzf pmfd pkdp',    // ⚠️ CHANGE THIS  
    'from_email' => 'abhishekumtekar95@gmail.com',    // ⚠️ CHANGE THIS
    'from_name' => 'Saiinfotech Website',
    'to_email' => 'akshayumtekar@gmail.com.com'   // Your receiving email
];

// Get and validate form data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$company = trim($_POST['company'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($phone) || empty($company)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// Send email using PHPMailer
try {
    $mail = new PHPMailer(true);
    
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config['smtp_port'];
    
    // Recipients
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email']);
    $mail->addReplyTo($email, $name);
    
    // Email Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission from ' . $name;
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #d71d1d; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .field { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 5px; border-left: 4px solid #d71d1d; }
            .label { font-weight: bold; color: #d71d1d; margin-bottom: 8px; display: block; }
            .value { color: #333; font-size: 16px; }
            .footer { text-align: center; padding: 20px; background-color: #333; color: white; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🔔 New Contact Form Submission</h1>
                <p>Someone has contacted you through your website</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>👤 Name:</span>
                    <div class='value'>" . htmlspecialchars($name) . "</div>
                </div>
                <div class='field'>
                    <span class='label'>📧 Email:</span>
                    <div class='value'>" . htmlspecialchars($email) . "</div>
                </div>
                <div class='field'>
                    <span class='label'>📱 Phone:</span>
                    <div class='value'>" . htmlspecialchars($phone) . "</div>
                </div>
                <div class='field'>
                    <span class='label'>🏢 Company:</span>
                    <div class='value'>" . htmlspecialchars($company) . "</div>
                </div>";
    
    if (!empty($message)) {
        $mail->Body .= "
                <div class='field'>
                    <span class='label'>💬 Message:</span>
                    <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                </div>";
    }
    
    $mail->Body .= "
                <div class='field'>
                    <span class='label'>🕐 Submitted:</span>
                    <div class='value'>" . date('F j, Y \a\t g:i A (T)') . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This email was automatically generated from your website contact form.</p>
                <p>Reply directly to this email to respond to " . htmlspecialchars($name) . "</p>
            </div>
        </div>
    </body>
    </html>";
    
    // Send the email
    $mail->send();
    
    // Success response
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you for your message, ' . $name . '! We will get back to you within 24 hours.'
    ]);
    
} catch (Exception $e) {
    // Log error for debugging (optional)
    error_log('Contact form error: ' . $e->getMessage());
    
    // Error response
    echo json_encode([
        'success' => false, 
        'message' => 'There was an error sending your message. Please try again later.'
    ]);
}
?>