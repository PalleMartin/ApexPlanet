<?php
session_start();
require_once '../config/db.php';

// Check if user is logged in and is admin
if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.php");
    exit();
}

// Check if database connection is established
if (!isset($conn) || $conn === null) {
    die("Database connection not established.");
}

// Check if user is admin
$stmt = $conn->prepare("SELECT r.name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$admin_user = $result->fetch_assoc();
$stmt->close();

if ($admin_user['name'] !== 'admin') {
    header("Location: dashboard.php");
    exit();
}

// Check if user ID is provided
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header("Location: read.php");
    exit();
}

$user_id = $_GET['id'];

// Fetch user data
$stmt = $conn->prepare("SELECT id, username, email, role_id FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

// If user not found
if (!$user) {
    header("Location: read.php");
    exit();
}

$errors = [];
$success = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $role_id = $_POST['role_id'];
    $password = $_POST['password'];
    
    // Validation
    if (empty($username)) {
        $errors[] = "Username is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($role_id)) {
        $errors[] = "Role is required";
    }
    
    // Check if username or email already exists (excluding current user)
    if (empty($errors)) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?");
        $stmt->bind_param("ssi", $username, $email, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $errors[] = "Username or email already exists";
        }
        $stmt->close();
    }
    
    // Update user if no errors
    if (empty($errors)) {
        if (!empty($password)) {
            // Update with new password
            if (strlen($password) < 6) {
                $errors[] = "Password must be at least 6 characters";
            } else {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, role_id = ?, password = ? WHERE id = ?");
                $stmt->bind_param("sssii", $username, $email, $role_id, $hashed_password, $user_id);
            }
        } else {
            // Update without changing password
            $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, role_id = ? WHERE id = ?");
            $stmt->bind_param("ssii", $username, $email, $role_id, $user_id);
        }
        
        if (empty($errors)) {
            if ($stmt->execute()) {
                $success = "User updated successfully!";
                // Refresh user data
                $stmt = $conn->prepare("SELECT id, username, email, role_id FROM users WHERE id = ?");
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $user = $result->fetch_assoc();
                $stmt->close();
            } else {
                $errors[] = "Error updating user. Please try again.";
            }
            $stmt->close();
        }
    }
}

// Fetch roles for dropdown
$roles_stmt = $conn->prepare("SELECT id, name FROM roles");
$roles_stmt->execute();
$roles_result = $roles_stmt->get_result();
$roles = $roles_result->fetch_all(MYSQLI_ASSOC);
$roles_stmt->close();
?>

<?php include '../includes/header.php'; ?>

<div class="row">
    <div class="col-md-12">
        <h2>Update User</h2>
        <p class="lead">Edit user information</p>
        
        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger">
                <?php foreach ($errors as $error): ?>
                    <div><?php echo htmlspecialchars($error); ?></div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <?php if (!empty($success)): ?>
            <div class="alert alert-success">
                <?php echo htmlspecialchars($success); ?>
            </div>
        <?php endif; ?>
        
        <div class="card">
            <div class="card-header">
                <h4>Edit User: <?php echo htmlspecialchars($user['username']); ?></h4>
            </div>
            <div class="card-body">
                <form method="POST" action="">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username" name="username" value="<?php echo htmlspecialchars($user['username']); ?>" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="password" class="form-label">Password (leave blank to keep current)</label>
                        <input type="password" class="form-control" id="password" name="password">
                        <div class="form-text">Only enter a new password if you want to change it</div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="role_id" class="form-label">Role</label>
                        <select class="form-control" id="role_id" name="role_id" required>
                            <option value="">Select Role</option>
                            <?php foreach ($roles as $role): ?>
                                <option value="<?php echo $role['id']; ?>" <?php echo ($user['role_id'] == $role['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($role['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <a href="read.php" class="btn btn-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary">Update User</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>