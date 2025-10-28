# Demo Script for User Management System

## Setup Instructions

1. Create a MySQL database named `user_management`
2. Execute the `database_schema.sql` file to create tables and insert sample data
3. Update database credentials in `config/db.php` if needed
4. Place the Task-3 folder in your web server's document root
5. Access the application through your web browser

## Default Accounts

- Admin Account:
  - Email: admin@example.com
  - Password: admin123

## Demo Walkthrough

### 1. User Registration
- Navigate to the registration page
- Fill in the registration form with:
  - Username: testuser
  - Email: test@example.com
  - Password: test123
- Submit the form
- Verify successful registration message

### 2. User Login
- Navigate to the login page
- Enter credentials:
  - Email: test@example.com
  - Password: test123
- Submit the form
- Verify redirection to user dashboard

### 3. User Dashboard
- Show the user dashboard with account information
- Demonstrate navigation to profile page

### 4. Profile Management
- Navigate to the profile page
- Show current profile information
- Demonstrate profile picture upload:
  - Select an image file (JPG/PNG/GIF)
  - Click Upload Picture
  - Verify successful upload and display
- Demonstrate profile information update:
  - Change username or email
  - Click Update Profile
  - Verify changes saved

### 5. Change Password
- Navigate to Change Password section
- Enter current password: test123
- Enter new password: newpass456
- Confirm new password: newpass456
- Click Change Password
- Verify success message

### 6. Admin Login
- Logout as regular user
- Login as admin:
  - Email: admin@example.com
  - Password: admin123

### 7. User Management (Admin)
- Navigate to Manage Users page
- Show user listing table
- Demonstrate creating a new user:
  - Click Add New User
  - Fill in user details
  - Select role (user/admin)
  - Click Create User
- Demonstrate editing a user:
  - Click Edit button for a user
  - Modify user information
  - Click Update User
- Demonstrate deleting a user:
  - Click Delete button for a user
  - Confirm deletion in popup
  - Verify user removed from table

### 8. Security Features
- Demonstrate SQL injection prevention:
  - Try entering malicious SQL in forms
  - Show that inputs are properly sanitized
- Demonstrate password hashing:
  - Show that passwords are stored as hashes in database
- Demonstrate session management:
  - Show login/logout functionality
  - Demonstrate role-based access control

## Key Features Demonstrated

1. **Database Design**:
   - Normalized database structure (1NF, 2NF, 3NF)
   - ER diagram visualization

2. **CRUD Operations**:
   - Create: User registration and admin user creation
   - Read: User listing and profile display
   - Update: Profile editing and user management
   - Delete: User removal with confirmation

3. **Authentication System**:
   - Secure user registration with password hashing
   - Login/logout functionality
   - Role-based access control (User/Admin)

4. **Security Features**:
   - Prepared statements preventing SQL injection
   - Server-side input validation
   - Password encryption using PHP's password_hash()

5. **Profile Management**:
   - Edit profile information
   - Profile picture upload with validation
   - Dynamic profile display

## Technical Implementation Details

1. **Backend**: PHP with MySQL database
2. **Frontend**: HTML, CSS, Bootstrap 5, JavaScript
3. **Security**: 
   - Password hashing with password_hash()
   - Prepared statements for database queries
   - Session-based authentication
   - Input validation and sanitization
4. **Database Design**:
   - Users table with foreign key to Roles table
   - Proper indexing and constraints
   - Normalized structure