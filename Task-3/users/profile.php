<?php
session_start();
require_once '../config/db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.php");
    exit();
}

// Check if database connection is established
if (!isset($conn) || $conn === null) {
    die("Database connection not established.");
}

$user_id = $_SESSION['user_id'];

// Fetch user data
$stmt = $conn->prepare("SELECT id, username, email, profile_picture, created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

// Initialize user data with default values if not set
if (!$user) {
    $user = [
        'id' => '',
        'username' => '',
        'email' => '',
        'profile_picture' => '',
        'created_at' => date('Y-m-d H:i:s')
    ];
} else {
    // Ensure all keys exist with default values
    $user = array_merge([
        'id' => '',
        'username' => '',
        'email' => '',
        'profile_picture' => '',
        'created_at' => date('Y-m-d H:i:s')
    ], $user);
}

$errors = [];
$success = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update_profile'])) {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    
    // Validation
    if (empty($username)) {
        $errors[] = "Username is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
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
    
    // Update profile if no errors
    if (empty($errors)) {
        $stmt = $conn->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $username, $email, $user_id);
        
        if ($stmt->execute()) {
            $success = "Profile updated successfully!";
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            
            // Refresh user data
            $stmt = $conn->prepare("SELECT id, username, email, profile_picture, created_at FROM users WHERE id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();
            
            // Ensure all keys exist with default values
            if ($user) {
                $user = array_merge([
                    'id' => '',
                    'username' => '',
                    'email' => '',
                    'profile_picture' => '',
                    'created_at' => date('Y-m-d H:i:s')
                ], $user);
            }
        } else {
            $errors[] = "Error updating profile. Please try again.";
        }
        $stmt->close();
    }
}

// Handle profile picture upload
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['upload_picture'])) {
    if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] == 0) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_size = 2 * 1024 * 1024; // 2MB
        
        $file_type = $_FILES['profile_picture']['type'];
        $file_size = $_FILES['profile_picture']['size'];
        
        // Validate file type
        if (!in_array($file_type, $allowed_types)) {
            $errors[] = "Invalid file type. Only JPG, PNG, and GIF files are allowed.";
        }
        // Validate file size
        elseif ($file_size > $max_size) {
            $errors[] = "File size exceeds 2MB limit.";
        }
        else {
            // Generate unique filename
            $file_extension = pathinfo($_FILES['profile_picture']['name'], PATHINFO_EXTENSION);
            $new_filename = uniqid() . '.' . $file_extension;
            $upload_path = '../assets/uploads/' . $new_filename;
            
            // Move uploaded file
            if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $upload_path)) {
                // Delete old profile picture if exists
                if (!empty($user['profile_picture']) && file_exists('../assets/uploads/' . $user['profile_picture'])) {
                    unlink('../assets/uploads/' . $user['profile_picture']);
                }
                
                // Update database
                $stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
                $stmt->bind_param("si", $new_filename, $user_id);
                
                if ($stmt->execute()) {
                    $success = "Profile picture updated successfully!";
                    // Refresh user data
                    $stmt = $conn->prepare("SELECT id, username, email, profile_picture, created_at FROM users WHERE id = ?");
                    $stmt->bind_param("i", $user_id);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $user = $result->fetch_assoc();
                    $stmt->close();
                    
                    // Ensure all keys exist with default values
                    if ($user) {
                        $user = array_merge([
                            'id' => '',
                            'username' => '',
                            'email' => '',
                            'profile_picture' => '',
                            'created_at' => date('Y-m-d H:i:s')
                        ], $user);
                    }
                } else {
                    $errors[] = "Error updating profile picture. Please try again.";
                    // Delete uploaded file if database update failed
                    if (file_exists($upload_path)) {
                        unlink($upload_path);
                    }
                }
                $stmt->close();
            } else {
                $errors[] = "Error uploading file. Please try again.";
            }
        }
    } else {
        $errors[] = "Please select a file to upload.";
    }
}

// Handle profile picture removal
if (isset($_GET['remove_picture'])) {
    // Delete old profile picture if exists
    if (!empty($user['profile_picture']) && file_exists('../assets/uploads/' . $user['profile_picture'])) {
        unlink('../assets/uploads/' . $user['profile_picture']);
    }
    
    // Update database
    $stmt = $conn->prepare("UPDATE users SET profile_picture = NULL WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    
    if ($stmt->execute()) {
        $success = "Profile picture removed successfully!";
        // Refresh user data
        $stmt = $conn->prepare("SELECT id, username, email, profile_picture, created_at FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        
        // Ensure all keys exist with default values
        if ($user) {
            $user = array_merge([
                'id' => '',
                'username' => '',
                'email' => '',
                'profile_picture' => '',
                'created_at' => date('Y-m-d H:i:s')
            ], $user);
        }
    } else {
        $errors[] = "Error removing profile picture. Please try again.";
    }
    $stmt->close();
}
?>

<?php include '../includes/header.php'; ?>

<div class="row">
    <div class="col-md-12">
        <h2>Profile Management</h2>
        <p class="lead">Manage your profile information</p>
        
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
    </div>
</div>

<div class="row">
    <!-- Profile Picture Section -->
    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <h4>Profile Picture</h4>
            </div>
            <div class="card-body text-center">
                <?php if (!empty($user['profile_picture'])): ?>
                    <img src="../assets/uploads/<?php echo htmlspecialchars($user['profile_picture']); ?>" alt="Profile Picture" class="img-fluid rounded-circle mb-3" style="width: 200px; height: 200px; object-fit: cover;">
                    <div>
                        <a href="?remove_picture=1" class="btn btn-danger btn-sm">Remove Picture</a>
                    </div>
                <?php else: ?>
                    <div class="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 200px; height: 200px;">
                        <i class="fas fa-user fa-5x text-muted"></i>
                    </div>
                    <p class="text-muted">No profile picture uploaded</p>
                <?php endif; ?>
                
                <form method="POST" action="" enctype="multipart/form-data" class="mt-3">
                    <div class="mb-3">
                        <input type="file" class="form-control" id="profile_picture" name="profile_picture" accept="image/*">
                        <div class="form-text">JPG, PNG, or GIF. Max 2MB.</div>
                    </div>
                    <button type="submit" name="upload_picture" class="btn btn-primary">Upload Picture</button>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Profile Information Section -->
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h4>Profile Information</h4>
            </div>
            <div class="card-body">
                <form method="POST" action="">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username" name="username" value="<?php echo htmlspecialchars($user['username'] ?? ''); ?>" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" value="<?php echo htmlspecialchars($user['email'] ?? ''); ?>" required>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Member Since</label>
                        <input type="text" class="form-control" value="<?php echo date('F j, Y', strtotime($user['created_at'] ?? date('Y-m-d H:i:s'))); ?>" disabled>
                    </div>
                    
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="submit" name="update_profile" class="btn btn-primary">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Change Password Section -->
        <div class="card mt-4">
            <div class="card-header">
                <h4>Change Password</h4>
            </div>
            <div class="card-body">
                <form method="POST" action="change_password.php">
                    <div class="mb-3">
                        <label for="current_password" class="form-label">Current Password</label>
                        <input type="password" class="form-control" id="current_password" name="current_password" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="new_password" class="form-label">New Password</label>
                        <input type="password" class="form-control" id="new_password" name="new_password" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="confirm_password" class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
                    </div>
                    
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="submit" class="btn btn-warning">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>