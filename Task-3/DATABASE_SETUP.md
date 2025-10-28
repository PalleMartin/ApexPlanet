# Database Setup Guide

This guide will help you properly set up the database for the User Management System.

## Prerequisites
- MySQL or MariaDB server installed and running
- Access to create databases and users
- Basic knowledge of MySQL commands

## Step 1: Create the Database

Connect to your MySQL server and create the database:

```sql
CREATE DATABASE user_management;
```

## Step 2: Create a Database User (Optional but Recommended)

For security reasons, it's recommended to create a dedicated user for the application:

```sql
CREATE USER 'user_mgmt'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON user_management.* TO 'user_mgmt'@'localhost';
FLUSH PRIVILEGES;
```

## Step 3: Import the Database Schema

Import the provided database schema:

```bash
mysql -u root -p user_management < database_schema.sql
```

Or if you're using the dedicated user:

```bash
mysql -u user_mgmt -p user_management < database_schema.sql
```

## Step 4: Configure Database Credentials

Update the `config/db.php` file with your database credentials:

```php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'user_management');
```

## Common Connection Issues and Solutions

### Issue 1: Access Denied for User 'root'@'localhost'

This is the error you're currently experiencing. Here are several solutions:

1. **Check if MySQL is running**:
   ```bash
   # On macOS
   brew services list | grep mysql
   
   # On Linux
   systemctl status mysql
   
   # On Windows
   net start | find "MySQL"
   ```

2. **Reset MySQL root password**:
   ```bash
   # Stop MySQL service
   sudo systemctl stop mysql
   
   # Start MySQL in safe mode
   sudo mysqld_safe --skip-grant-tables &
   
   # Connect to MySQL
   mysql -u root
   
   # Update root password
   USE mysql;
   UPDATE user SET authentication_string=PASSWORD('new_password') WHERE User='root';
   FLUSH PRIVILEGES;
   EXIT;
   
   # Restart MySQL normally
   sudo systemctl start mysql
   ```

3. **Create a new user with privileges**:
   ```sql
   CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON user_management.* TO 'app_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Issue 2: Cannot Connect to MySQL Server

1. **Check MySQL service status**:
   ```bash
   sudo systemctl status mysql
   ```

2. **Start MySQL service if not running**:
   ```bash
   sudo systemctl start mysql
   ```

3. **Check MySQL port** (default is 3306):
   ```bash
   netstat -tlnp | grep :3306
   ```

## Testing the Connection

Use the provided `test_db.php` script to verify your database connection:

```bash
php test_db.php
```

If successful, you should see output similar to:
```
Database connection successful!
Host: localhost
Database: user_management
MySQL Version: 8.0.27
```

## Database Schema Details

The `database_schema.sql` file contains:

1. **Roles Table**:
   ```sql
   CREATE TABLE roles (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(50) NOT NULL UNIQUE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Users Table**:
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) NOT NULL UNIQUE,
       email VARCHAR(100) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       role_id INT DEFAULT 2,
       profile_picture VARCHAR(255) DEFAULT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (role_id) REFERENCES roles(id)
   );
   ```

3. **Default Data**:
   - Roles: 'admin' (id: 1) and 'user' (id: 2)
   - Default admin user: admin@example.com with password 'admin123'

## Troubleshooting Tips

1. **Check MySQL error logs**:
   ```bash
   # Common locations for error logs
   tail -f /var/log/mysql/error.log
   tail -f /usr/local/var/mysql/*.err
   ```

2. **Verify MySQL configuration**:
   ```bash
   mysql -u root -p -e "SHOW VARIABLES LIKE 'bind_address';"
   ```

3. **Test connection with MySQL client**:
   ```bash
   mysql -h localhost -u root -p user_management
   ```

## Security Recommendations

1. **Never use root user for applications** - Create dedicated users with minimal required privileges
2. **Use strong passwords** - Follow password complexity requirements
3. **Regular backups** - Schedule regular database backups
4. **Update regularly** - Keep MySQL server updated with security patches
5. **Monitor connections** - Regularly check for unauthorized access attempts

## Next Steps

After successfully setting up the database:

1. Verify the connection using `test_db.php`
2. Test user registration and login functionality
3. Verify admin functionality with the default admin account
4. Test profile management features

If you continue to experience issues, please check the MySQL error logs for more detailed information about the connection failure.