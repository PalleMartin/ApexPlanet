// middleware/auth.js
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Authorization middleware for job seekers
const authorizeJobSeeker = (req, res, next) => {
    if (req.user.userType !== 'jobseeker') {
        return res.status(403).json({ message: 'Access denied. Job seekers only.' });
    }
    next();
};

// Authorization middleware for employers
const authorizeEmployer = (req, res, next) => {
    if (req.user.userType !== 'employer') {
        return res.status(403).json({ message: 'Access denied. Employers only.' });
    }
    next();
};

// Authorization middleware for admin
const authorizeAdmin = (req, res, next) => {
    if (req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = {
    authenticate,
    authorizeJobSeeker,
    authorizeEmployer,
    authorizeAdmin
};