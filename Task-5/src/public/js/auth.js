// js/auth.js

document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Send AJAX request to login
            login(email, password);
        });
    }
    
    // Handle registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const userType = document.querySelector('input[name="user-type"]:checked').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Send AJAX request to register
            register(fullname, email, password, userType);
        });
    }
    
    // Handle OTP verification form
    const otpInputs = document.querySelectorAll('.otp-input');
    if (otpInputs.length > 0) {
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                if (this.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value === '' && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
        
        // Handle OTP form submission
        const otpForm = document.getElementById('otp-form');
        if (otpForm) {
            otpForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let otp = '';
                otpInputs.forEach(input => {
                    otp += input.value;
                });
                
                // Get email from localStorage (in a real app, you might pass this differently)
                const email = localStorage.getItem('registrationEmail') || '';
                
                // Send AJAX request to verify OTP
                verifyOTP(email, otp);
            });
        }
    }
    
    // Handle resend OTP
    const resendLink = document.getElementById('resend-otp');
    if (resendLink) {
        resendLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get email from localStorage
            const email = localStorage.getItem('registrationEmail') || '';
            
            // Send AJAX request to resend OTP
            resendOTP(email);
        });
    }
});

// Function to handle login
function login(email, password) {
    // Show loading state
    const submitButton = document.querySelector('#login-form .btn-primary');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    // Send AJAX request
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        if (data.token) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard
            alert('Login successful! Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        } else {
            // Show error message
            alert(data.message || 'Login failed');
        }
    })
    .catch(error => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    });
}

// Function to handle registration
function register(fullname, email, password, userType) {
    // Show loading state
    const submitButton = document.querySelector('#register-form .btn-primary');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating Account...';
    submitButton.disabled = true;
    
    // Send AJAX request
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullname, email, password, userType })
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        if (data.userId) {
            // Store email in localStorage for OTP verification
            localStorage.setItem('registrationEmail', email);
            
            // Redirect to OTP verification page
            alert('Account created successfully! Please check your email for OTP verification.');
            window.location.href = 'verify-otp.html';
        } else {
            // Show error message
            alert(data.message || 'Registration failed');
        }
    })
    .catch(error => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
    });
}

// Function to verify OTP
function verifyOTP(email, otp) {
    // Show loading state
    const submitButton = document.querySelector('#otp-form .btn-primary');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Verifying...';
    submitButton.disabled = true;
    
    // Send AJAX request
    fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        if (data.message && data.message.includes('successfully')) {
            // Clear registration email from localStorage
            localStorage.removeItem('registrationEmail');
            
            // Redirect to login page
            alert('Email verified successfully! Please login to continue.');
            window.location.href = 'login.html';
        } else {
            // Show error message
            alert(data.message || 'OTP verification failed');
        }
    })
    .catch(error => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        console.error('OTP verification error:', error);
        alert('An error occurred during OTP verification. Please try again.');
    });
}

// Function to resend OTP
function resendOTP(email) {
    // Send AJAX request
    fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message && data.message.includes('successfully')) {
            alert('OTP has been resent to your email address.');
            
            // Reset timer if it exists
            const timerElement = document.querySelector('.timer');
            if (timerElement) {
                timerElement.textContent = '02:00';
                startTimer(120); // 2 minutes
            }
        } else {
            // Show error message
            alert(data.message || 'Failed to resend OTP');
        }
    })
    .catch(error => {
        console.error('Resend OTP error:', error);
        alert('An error occurred while resending OTP. Please try again.');
    });
}

// Timer function for OTP resend
function startTimer(duration) {
    let timer = duration;
    const timerElement = document.querySelector('.timer');
    
    if (!timerElement) return;
    
    const interval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (--timer < 0) {
            clearInterval(interval);
            timerElement.textContent = 'Expired';
        }
    }, 1000);
}