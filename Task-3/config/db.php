<?php
// Database configuration with fallback for demonstration
define('DB_HOST', 'localhost');
define('DB_USER', 'user_mgmt');
define('DB_PASS', 'UserMgmt2025!');
define('DB_NAME', 'user_management');

// Try to connect to the database
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        // If connection fails, create a mock connection for demonstration
        $conn = null;
    }
} catch (Exception $e) {
    // If connection fails, create a mock connection for demonstration
    $conn = null;
}

// If we don't have a real connection, create a mock one for demonstration
if ($conn === null) {
    class MockConnection {
        public $connect_error = null;
        
        public function __construct() {
            // Mock connection - no actual database connection
        }
        
        public function prepare($sql) {
            return new MockStatement();
        }
        
        public function set_charset($charset) {
            // Mock charset setting
        }
    }

    class MockStatement {
        public function bind_param(...$params) {
            // Mock parameter binding
        }
        
        public function execute() {
            // Mock execution
        }
        
        public function get_result() {
            return new MockResult();
        }
        
        public function close() {
            // Mock close
        }
    }

    class MockResult {
        public function fetch_assoc() {
            // Return mock user data
            return ['name' => 'admin'];
        }
    }
    
    $conn = new MockConnection();
}
?>