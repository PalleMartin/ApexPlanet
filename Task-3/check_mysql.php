<?php
echo "=== MySQL Server Status Check ===\n\n";

// Check if MySQL extension is installed
if (!extension_loaded('mysqli')) {
    echo "✗ MySQLi extension is not installed or enabled.\n";
    echo "Please install the MySQL extension for PHP.\n";
    exit(1);
} else {
    echo "✓ MySQLi extension is available.\n";
}

// Try to connect to MySQL server with common configurations
$hosts = ['localhost', '127.0.0.1'];
$ports = [3306, 3307]; // Common MySQL ports
$users = ['root'];
$passwords = ['', 'root', 'password', 'admin', '1234', '123456'];

$connection_success = false;
$successful_config = null;

echo "\nTesting common MySQL configurations...\n";

foreach ($hosts as $host) {
    foreach ($ports as $port) {
        foreach ($users as $user) {
            foreach ($passwords as $password) {
                $connection_string = "{$host}:{$port} with user '{$user}'";
                if (empty($password)) {
                    $connection_string .= " (no password)";
                } else {
                    $connection_string .= " (password: '{$password}')";
                }
                
                echo "Testing {$connection_string}... ";
                
                try {
                    $conn = @new mysqli($host, $user, $password, '', $port);
                    if ($conn->connect_error) {
                        echo "Failed: " . $conn->connect_error . "\n";
                    } else {
                        echo "SUCCESS!\n";
                        $connection_success = true;
                        $successful_config = [
                            'host' => $host,
                            'port' => $port,
                            'user' => $user,
                            'password' => $password
                        ];
                        $conn->close();
                        break 4; // Break out of all loops
                    }
                } catch (Exception $e) {
                    echo "Exception: " . $e->getMessage() . "\n";
                }
            }
        }
    }
}

if ($connection_success) {
    echo "\n✓ MySQL server is running and accessible!\n";
    echo "Successful configuration:\n";
    echo "- Host: {$successful_config['host']}\n";
    echo "- Port: {$successful_config['port']}\n";
    echo "- User: {$successful_config['user']}\n";
    if (empty($successful_config['password'])) {
        echo "- Password: (none)\n";
    } else {
        echo "- Password: {$successful_config['password']}\n";
    }
    echo "\nYou can now configure your database connection using these settings.\n";
    echo "Run 'php config_wizard.php' to configure the database.\n";
} else {
    echo "\n✗ Unable to connect to MySQL server with common configurations.\n";
    echo "Possible issues:\n";
    echo "1. MySQL server is not running\n";
    echo "2. MySQL server is running on a different host/port\n";
    echo "3. Different username/password required\n";
    echo "4. Firewall blocking connection\n";
    echo "\nTroubleshooting steps:\n";
    echo "1. Start MySQL server:\n";
    echo "   - macOS: brew services start mysql\n";
    echo "   - Linux: sudo systemctl start mysql\n";
    echo "   - Windows: net start mysql\n";
    echo "2. Check if MySQL is running: netstat -an | grep 3306\n";
    echo "3. Refer to DATABASE_SETUP.md for detailed instructions\n";
}

echo "\n=== Check Complete ===\n";
?>