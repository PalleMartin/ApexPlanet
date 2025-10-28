<?php
// Test database connection with the credentials we set
echo "Testing database connection...\n";

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'user_mgmt');
define('DB_PASS', 'UserMgmt2025!');
define('DB_NAME', 'user_management');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    echo "Connection failed: " . $conn->connect_error . "\n";
    exit(1);
} else {
    echo "Connected successfully!\n";
}

// Set charset to UTF-8
$conn->set_charset("utf8");

echo "Database connection test completed.\n";
?>