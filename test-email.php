<?php
require_once 'PHPMailer-6.10.0/src/Exception.php';
require_once 'PHPMailer-6.10.0/src/PHPMailer.php';
require_once 'PHPMailer-6.10.0/src/SMTP.php';     // Update path

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$config = [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_username' => 'abhishekumtekar95@gmail.com', // ⚠️ CHANGE THIS
    'smtp_password' => 'qaoe xyzf pmfd pkdp',    // ⚠️ CHANGE THIS  
    'from_email' => 'abhishekumtekar95@gmail.com',    // ⚠️ CHANGE THIS
    'from_name' => 'Saiinfotech Website',
    'to_email' => 'akshayumtekar@gmail.com.com'   // Your receiving email
];

try {
    $mail = new PHPMailer(true);
    
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config['smtp_port'];
    
    $mail->setFrom($config['from_email'], 'Test Email');
    $mail->addAddress($config['to_email']);
    
    $mail->isHTML(true);
    $mail->Subject = 'PHPMailer Test Email';
    $mail->Body = '<h1>Success!</h1><p>PHPMailer is working correctly.</p>';
    
    $mail->send();
    echo 'SUCCESS: Test email sent!';
    
} catch (Exception $e) {
    echo "ERROR: {$e->getMessage()}";
}
?>