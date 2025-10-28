<?php
session_start();
require_once '../config/db.php';

// Check if database connection is established
if (!isset($conn) || $conn === null) {
    die("Database connection not established.");
}

// For demonstration purposes, we'll check if we're using the mock connection
$is_mock = (isset($_GET['mock']) && $_GET['mock'] === 'true');

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header("Location: ../users/dashboard.php");
    exit();
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    
    // Validation
    if (empty($email)) {
        $errors[] = "Email is required";
    }
    
    if (empty($password)) {
        $errors[] = "Password is required";
    }
    
    // Authenticate user if no errors
    if (empty($errors)) {
        if ($is_mock) {
            // Mock authentication for demonstration
            if ($email === 'admin@example.com' && $password === 'admin123') {
                // Set session variables
                $_SESSION['user_id'] = 1;
                $_SESSION['username'] = 'admin';
                $_SESSION['email'] = $email;
                $_SESSION['user_role'] = 'admin';
                
                // Redirect to admin page
                header("Location: ../users/read.php?mock=true");
                exit();
            } else if (!empty($email) && !empty($password)) {
                // Set session variables for regular user
                $_SESSION['user_id'] = 2;
                $_SESSION['username'] = 'user';
                $_SESSION['email'] = $email;
                $_SESSION['user_role'] = 'user';
                
                // Redirect to user dashboard
                header("Location: ../users/dashboard.php?mock=true");
                exit();
            } else {
                $errors[] = "Invalid email or password";
            }
        } else {
            // Actual database authentication
            $stmt = $conn->prepare("SELECT id, username, email, password, role_id FROM users WHERE email = ?");
            if ($stmt === false) {
                die("Prepare failed: Database error occurred");
            }
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // Simple approach: try to fetch one row
            $user = $result->fetch_assoc();
            
            if ($user) {
                if (password_verify($password, $user['password'])) {
                    // Set session variables
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['email'] = $user['email'];
                    
                    // Get role name
                    $role_stmt = $conn->prepare("SELECT name FROM roles WHERE id = ?");
                    if ($role_stmt === false) {
                        die("Prepare failed: Database error occurred");
                    }
                    $role_stmt->bind_param("i", $user['role_id']);
                    $role_stmt->execute();
                    $role_result = $role_stmt->get_result();
                    $role = $role_result->fetch_assoc();
                    if ($role && isset($role['name'])) {
                        $_SESSION['user_role'] = $role['name'];
                    }
                    $role_stmt->close();
                    
                    // Redirect based on role
                    if ($role && isset($role['name']) && $role['name'] === 'admin') {
                        header("Location: ../users/read.php");
                    } else {
                        header("Location: ../users/dashboard.php");
                    }
                    exit();
                } else {
                    $errors[] = "Invalid email or password";
                }
            } else {
                $errors[] = "Invalid email or password";
            }
            $stmt->close();
        }
    }
}
?>

<?php include '../includes/header.php'; ?>

<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h3 class="text-center">Login</h3>
                <?php if ($is_mock): ?>
                    <div class="alert alert-warning">
                        <strong>Demo Mode:</strong> Using mock authentication. 
                        Try email: admin@example.com, password: admin123 for admin access.
                    </div>
                <?php endif; ?>
            </div>
            <div class="card-body">
                <?php if (!empty($errors)): ?>
                    <div class="alert alert-danger">
                        <?php foreach ($errors as $error): ?>
                            <div><?php echo htmlspecialchars($error); ?></div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
                
                <form method="POST" action="">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </form>
                
                <div class="text-center mt-3">
                    <p>Don't have an account? <a href="register.php<?php echo $is_mock ? '?mock=true' : ''; ?>">Register here</a></p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>