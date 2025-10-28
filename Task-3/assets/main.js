// Client-side JavaScript for User Management System

// Function to preview profile picture before upload
function previewProfilePicture(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            // Find the profile picture element and update its source
            var profileImg = document.querySelector('.profile-preview');
            if (profileImg) {
                profileImg.src = e.target.result;
            }
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Function to confirm user deletion
function confirmDelete(username) {
    return confirm("Are you sure you want to delete user '" + username + "'? This action cannot be undone.");
}

// Function to validate file upload
function validateFileUpload() {
    var fileInput = document.getElementById('profile_picture');
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var fileSize = file.size;
        var fileType = file.type;
        
        // Check file size (2MB limit)
        if (fileSize > 2 * 1024 * 1024) {
            alert('File size exceeds 2MB limit.');
            fileInput.value = '';
            return false;
        }
        
        // Check file type
        var allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.indexOf(fileType) === -1) {
            alert('Only JPG, PNG, and GIF files are allowed.');
            fileInput.value = '';
            return false;
        }
    }
    return true;
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Profile picture preview
    var fileInput = document.getElementById('profile_picture');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            previewProfilePicture(this);
        });
    }
    
    // Form validation for profile picture upload
    var uploadForm = document.querySelector('form[enctype="multipart/form-data"]');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            if (!validateFileUpload()) {
                e.preventDefault();
            }
        });
    }
});

// Toggle password visibility
function togglePasswordVisibility(fieldId) {
    var field = document.getElementById(fieldId);
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}