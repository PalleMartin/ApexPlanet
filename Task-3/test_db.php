<?php
require_once 'config/db.php';

// Check if connection exists and is valid
if (!isset($conn) || $conn === null) {
    die("Database connection not established!\n");
}

// Additional check for connection errors
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error . "\n");
}

echo "Database connection successful!\n";
echo "Host: " . DB_HOST . "\n";
echo "Database: " . DB_NAME . "\n";

// Test a simple query
$result = $conn->query("SELECT VERSION() as version");
if ($result) {
    $row = $result->fetch_assoc();
    echo "MySQL Version: " . $row['version'] . "\n";
} else {
    echo "Query failed: " . $conn->error . "\n";
}

$conn->close();
?>