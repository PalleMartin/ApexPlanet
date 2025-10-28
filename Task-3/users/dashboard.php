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

// Get user details
$stmt = $conn->prepare("SELECT u.id, u.username, u.email, u.profile_picture, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();
?>

<?php include '../includes/header.php'; ?>

<div class="row">
    <div class="col-md-12">
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <p class="lead">This is your dashboard.</p>
    </div>
</div>

<div class="row">
    <div class="col-md-4">
        <div class="card">
            <div class="card-body text-center">
                <i class="fas fa-user-circle fa-3x text-primary mb-3"></i>
                <h5 class="card-title">Profile</h5>
                <p class="card-text">View and edit your profile information.</p>
                <a href="profile.php" class="btn btn-primary">View Profile</a>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card">
            <div class="card-body text-center">
                <i class="fas fa-cog fa-3x text-info mb-3"></i>
                <h5 class="card-title">Settings</h5>
                <p class="card-text">Manage your account settings.</p>
                <a href="profile.php" class="btn btn-info">Account Settings</a>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card">
            <div class="card-body text-center">
                <i class="fas fa-question-circle fa-3x text-warning mb-3"></i>
                <h5 class="card-title">Help</h5>
                <p class="card-text">Get help and support.</p>
                <a href="#" class="btn btn-warning">Get Help</a>
            </div>
        </div>
    </div>
</div>

<div class="row mt-4">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <h4>Your Account Information</h4>
            </div>
            <div class="card-body">
                <table class="table table-bordered">
                    <tr>
                        <th>Username</th>
                        <td><?php echo htmlspecialchars($user['username']); ?></td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td><?php echo htmlspecialchars($user['email']); ?></td>
                    </tr>
                    <tr>
                        <th>Role</th>
                        <td><?php echo htmlspecialchars($user['role']); ?></td>
                    </tr>
                    <tr>
                        <th>Member Since</th>
                        <td><?php echo date('F j, Y', strtotime($user['created_at'])); ?></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>