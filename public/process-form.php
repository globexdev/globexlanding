<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Validate input
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Sanitize input
$to = 'hello@globexenterprises.net';
$from_name = htmlspecialchars($data['name']);
$from_email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($data['subject']);
$message = htmlspecialchars($data['message']);

// Validate email
if (!filter_var($from_email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Simpler headers for shared hosting
$headers = "From: $from_name <$from_email>\r\n";
$headers .= "Reply-To: $from_email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Simple plain text message (more reliable on shared hosting)
$emailBody = "New Contact Form Submission\n\n";
$emailBody .= "Name: $from_name\n";
$emailBody .= "Email: $from_email\n";
$emailBody .= "Subject: $subject\n\n";
$emailBody .= "Message:\n$message\n";

// Send email
$success = mail($to, $subject, $emailBody, $headers);

if ($success) {
    echo json_encode(['message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>