<?php
echo "MySQL Connection Test Script\n";
echo "==========================\n\n";

// Test different MySQL configurations
$configurations = [
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'password' => ''],
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'password' => 'root'],
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'password' => 'password'],
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'password' => 'admin'],
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'password' => '1234'],
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'password' => '123456'],
    ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'root', 'password' => ''],
    ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'root', 'password' => 'root'],
];

echo "Testing common MySQL configurations:\n\n";

$connection_success = false;
$successful_config = null;

foreach ($configurations as $index => $config) {
    $connection_string = "{$config['host']}:{$config['port']} with user '{$config['user']}'";
    if (empty($config['password'])) {
        $connection_string .= " (no password)";
    } else {
        $connection_string .= " (password: '{$config['password']}')";
    }
    
    echo ($index + 1) . ". Testing {$connection_string}... ";
    
    // Try to connect with exception handling
    try {
        $conn = @new mysqli($config['host'], $config['user'], $config['password'], '', $config['port']);
        if ($conn->connect_error) {
            echo "Failed: " . $conn->connect_error . "\n";
        } else {
            echo "SUCCESS!\n";
            $connection_success = true;
            $successful_config = $config;
            $conn->close();
            break;
        }
    } catch (Exception $e) {
        echo "Exception: " . $e->getMessage() . "\n";
    } catch (Error $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}

if ($connection_success) {
    echo "\n✓ Successfully connected to MySQL!\n";
    echo "Configuration:\n";
    echo "- Host: {$successful_config['host']}\n";
    echo "- Port: {$successful_config['port']}\n";
    echo "- User: {$successful_config['user']}\n";
    if (empty($successful_config['password'])) {
        echo "- Password: (none)\n";
    } else {
        echo "- Password: {$successful_config['password']}\n";
    }
    
    echo "\nUse these settings in your config/db.php file.\n";
} else {
    echo "\n✗ Unable to connect to MySQL with any of the tested configurations.\n";
    echo "\nPossible solutions:\n";
    echo "1. Check if MySQL is running: brew services list | grep mysql\n";
    echo "2. Start MySQL if not running: brew services start mysql\n";
    echo "3. Reset MySQL root password:\n";
    echo "   - Stop MySQL: brew services stop mysql\n";
    echo "   - Remove socket files: sudo rm /tmp/mysql.sock /tmp/mysqlx.sock\n";
    echo "   - Start MySQL in safe mode: mysqld_safe --skip-grant-tables &\n";
    echo "   - Connect and reset password: mysql -u root\n";
    echo "4. Run the configuration wizard: php config_wizard.php\n";
}

echo "\nFor detailed instructions, see DATABASE_SETUP.md\n";
?>