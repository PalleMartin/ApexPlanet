# Task-3: Backend Development & Database Integration

## Timeline: Days 25-36

## Objective
Implement dynamic features with PHP and MySQL including authentication, CRUD operations, and security.

## Features Implemented
1. Database Design
   - ER Diagram (users table, roles table)
   - Normalized database (1NF, 2NF, 3NF)
2. CRUD Operations
   - PHP form to add users
   - Fetch data in HTML table format
   - Update existing records
   - Delete with confirmation popup
3. Authentication System
   - User Registration with hashed passwords
   - Login & Logout using Sessions
   - Role-Based Login (User/Admin)
4. Security
   - Prepared Statements to prevent SQL Injection
   - Server-side validation of all user input
   - Encrypted password storage
5. Profile Management
   - Edit Profile page
   - Profile picture upload with size & type validation
   - Dynamic display of profile info

## Database Schema
### Users Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- username (VARCHAR(50), UNIQUE)
- email (VARCHAR(100), UNIQUE)
- password (VARCHAR(255))
- role_id (INT, FOREIGN KEY to roles table)
- profile_picture (VARCHAR(255))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Roles Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(50)) - e.g., 'user', 'admin'

## File Structure
- config/
  - db.php (Database connection)
- auth/
  - login.php
  - register.php
  - logout.php
- users/
  - create.php
  - read.php
  - update.php
  - profile.php
  - dashboard.php
  - change_password.php
- includes/
  - header.php
  - footer.php
  - auth_check.php
- assets/
  - css/
    - styles.css
  - js/
  - uploads/ (profile pictures)

## Security Features
- Passwords hashed using PHP's password_hash()
- SQL injection prevention using prepared statements
- Session-based authentication
- Input validation and sanitization
- Role-based access control
- File upload validation (size, type)

## Setup Instructions
1. Create a MySQL database named `user_management`
2. Execute the `database_schema.sql` file to create tables and sample data
3. Configure database credentials using one of these methods:
   - Run the automatic setup script: `php setup_database.php`
   - Run the configuration wizard: `php config_wizard.php`
   - Or manually update config/db.php with your database credentials
4. For detailed database setup instructions, refer to `DATABASE_SETUP.md`
5. Place the Task-3 folder in your web server's document root
6. Configure your web server to serve PHP files
7. Ensure the `assets/uploads` directory is writable

## Database Configuration
The system includes multiple options for database configuration:
- Automatic setup script (`php setup_database.php`) - Creates database and user automatically
- Configuration wizard for easy setup (`php config_wizard.php`)
- Manual configuration by editing `config/db.php`

## Default Accounts
- Admin Account:
  - Email: admin@example.com
  - Password: admin123

## Normalization Explanation
### First Normal Form (1NF)
- Each table cell contains only atomic (indivisible) values
- Each record is unique

### Second Normal Form (2NF)
- Meets all requirements of 1NF
- All non-key attributes are fully dependent on the primary key

### Third Normal Form (3NF)
- Meets all requirements of 2NF
- All non-key attributes are only dependent on the primary key (no transitive dependency)

## API Endpoints
- `/auth/register.php` - User registration
- `/auth/login.php` - User login
- `/auth/logout.php` - User logout
- `/users/dashboard.php` - User dashboard
- `/users/profile.php` - User profile management
- `/users/change_password.php` - Change password
- `/users/read.php` - Admin user listing (admin only)
- `/users/create.php` - Create new user (admin only)
- `/users/update.php` - Update user (admin only)

## Security Implementation Details
1. **Password Security**:
   - Passwords are hashed using PHP's `password_hash()` function with BCRYPT algorithm
   - Password verification uses `password_verify()` function

2. **SQL Injection Prevention**:
   - All database queries use prepared statements with parameterized queries
   - No direct string concatenation in SQL queries

3. **Session Management**:
   - Secure session handling with proper session start/destroy
   - Role-based access control implemented

4. **Input Validation**:
   - Server-side validation for all user inputs
   - Email format validation
   - Password strength requirements
   - File upload validation (type, size)

5. **File Upload Security**:
   - File type validation (only images allowed)
   - File size limitation (2MB max)
   - Unique filename generation to prevent conflicts
   - Secure file storage outside web root (when possible)

## Demo Script
Refer to `DEMO_SCRIPT.md` for a detailed walkthrough of all features.

## Solution Summary
Refer to `SOLUTION_SUMMARY.md` for a comprehensive overview of the implementation.

## Final Implementation Summary
Refer to `FINAL_SUMMARY.md` for the complete implementation status and verification.

## Implementation Report
Refer to `IMPLEMENTATION_REPORT.md` for a detailed technical report of the implementation.