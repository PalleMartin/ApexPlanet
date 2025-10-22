// Authentication Pages JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Password Toggle Functionality
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.textContent = 'visibility';
            } else {
                input.type = 'password';
                eyeIcon.textContent = 'visibility_off';
            }
        });
    });
    
    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simple validation
            if (email && password) {
                // Show loading state
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing In...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showAlert('Login successful! Redirecting...', 'success');
                    
                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = '../portfolio-project/index.html';
                    }, 1500);
                }, 1500);
            } else {
                showAlert('Please fill in all required fields.', 'danger');
            }
        });
    }
    
    // Registration Form Submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Password Match Validation
        const password = document.getElementById('regPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const passwordMismatch = document.getElementById('passwordMismatch');
        
        function validatePasswordMatch() {
            if (confirmPassword.value !== '') {
                if (password.value === confirmPassword.value) {
                    confirmPassword.classList.remove('is-invalid');
                    confirmPassword.classList.add('is-valid');
                    passwordMismatch.classList.add('d-none');
                } else {
                    confirmPassword.classList.remove('is-valid');
                    confirmPassword.classList.add('is-invalid');
                    passwordMismatch.classList.remove('d-none');
                }
            } else {
                confirmPassword.classList.remove('is-valid', 'is-invalid');
                passwordMismatch.classList.add('d-none');
            }
        }
        
        password.addEventListener('input', validatePasswordMatch);
        confirmPassword.addEventListener('input', validatePasswordMatch);
        
        // Email Availability Check (Simulated AJAX)
        const regEmail = document.getElementById('regEmail');
        regEmail.addEventListener('blur', function() {
            if (this.value) {
                // Show loading state
                const feedback = this.parentElement.querySelector('.invalid-feedback');
                feedback.textContent = 'Checking availability...';
                feedback.classList.remove('d-none');
                
                // Simulate AJAX call
                setTimeout(() => {
                    // Simulate checking if email exists (dummy check)
                    const emailExists = this.value === 'existing@example.com';
                    
                    if (emailExists) {
                        this.classList.remove('is-valid');
                        this.classList.add('is-invalid');
                        feedback.textContent = 'This email is already registered.';
                        feedback.classList.remove('d-none');
                        document.getElementById('emailAvailable').classList.add('d-none');
                    } else {
                        this.classList.remove('is-invalid');
                        this.classList.add('is-valid');
                        feedback.classList.add('d-none');
                        document.getElementById('emailAvailable').classList.remove('d-none');
                    }
                }, 1000);
            }
        });
        
        // Form submission
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validation
            let isValid = true;
            
            // Check required fields
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showAlert('Please fill in all required fields.', 'danger');
                isValid = false;
            }
            
            // Check password match
            if (password !== confirmPassword) {
                showAlert('Passwords do not match.', 'danger');
                isValid = false;
            }
            
            // Check password strength (minimum 8 characters)
            if (password.length < 8) {
                showAlert('Password must be at least 8 characters long.', 'danger');
                isValid = false;
            }
            
            // Check terms agreement
            if (!terms) {
                showAlert('Please agree to the Terms of Service and Privacy Policy.', 'danger');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating Account...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showAlert('Account created successfully! Redirecting to login...', 'success');
                    
                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                }, 1500);
            }
        });
    }
});

// Show alert function
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.maxWidth = '500px';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to body
    document.body.appendChild(alertDiv);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});