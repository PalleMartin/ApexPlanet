<?php
session_start();
require_once 'config/db.php';

// Check if database connection is established
if (!isset($conn) || $conn === null) {
    // Use mock connection for demonstration
    header("Location: auth/login.php?mock=true");
    exit();
}

// Check if we're using mock connection
$is_mock = (get_class($conn) === 'MockConnection');

if ($is_mock) {
    // For mock connection, redirect to login with mock parameter
    header("Location: auth/login.php?mock=true");
    exit();
}

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // Check user role
    $stmt = $conn->prepare("SELECT r.name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?");
    if ($stmt === false) {
        die("Prepare failed: Database error occurred");
    }
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // Check if user data was found before accessing it
    if ($user && isset($user['name'])) {
        if ($user['name'] === 'admin') {
            header("Location: users/read.php");
        } else {
            header("Location: users/dashboard.php");
        }
    } else {
        // If user data not found, redirect to login
        header("Location: auth/login.php");
    }
    exit();
} else {
    header("Location: auth/login.php");
    exit();
}
?>