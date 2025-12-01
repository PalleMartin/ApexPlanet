// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage for demo purposes (in production, use a database)
let users = [];
let otpStore = {};

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { fullname, email, password, userType } = req.body;
        
        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const newUser = {
            id: uuidv4(),
            fullname,
            email,
            password: hashedPassword,
            userType,
            isVerified: false,
            createdAt: new Date()
        };
        
        users.push(newUser);
        
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
        };
        
        // Send OTP email (in production, use a real email service)
        await sendOTPEmail(email, otp);
        
        res.status(201).json({ 
            message: 'User registered successfully. Please check your email for OTP verification.',
            userId: newUser.id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }
        
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '24h' }
        );
        
        res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Check if OTP exists and is valid
        const storedOTP = otpStore[email];
        if (!storedOTP) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }
        
        if (Date.now() > storedOTP.expiresAt) {
            delete otpStore[email];
            return res.status(400).json({ message: 'OTP has expired' });
        }
        
        if (storedOTP.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        
        // Mark user as verified
        const user = users.find(user => user.email === email);
        if (user) {
            user.isVerified = true;
        }
        
        // Remove OTP from store
        delete otpStore[email];
        
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
});

// Resend OTP endpoint
router.post('/resend-otp', (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
        };
        
        // Send OTP email
        sendOTPEmail(email, otp);
        
        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error while resending OTP' });
    }
});

// Function to send OTP email (demo implementation)
async function sendOTPEmail(email, otp) {
    // In production, use a real email service like SendGrid, Nodemailer with SMTP, etc.
    console.log(`Sending OTP ${otp} to ${email}`);
    
    // For demo purposes, we're just logging the OTP
    // In a real application, you would use nodemailer with SMTP settings:
    /*
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'JobBoard - Email Verification',
        text: `Your OTP for JobBoard registration is: ${otp}`
    };
    
    await transporter.sendMail(mailOptions);
    */
}

module.exports = router;