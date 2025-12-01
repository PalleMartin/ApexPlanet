// routes/applications.js
const express = require('express');
const router = express.Router();

// In-memory storage for demo purposes (in production, use a database)
let applications = [
    {
        id: 1,
        jobId: 1,
        userId: 1,
        coverLetter: "I am excited to apply for this position. With 5 years of experience in frontend development...",
        resumeUrl: "/resumes/john_doe_frontend_dev.pdf",
        status: "submitted",
        appliedAt: new Date('2025-11-16'),
        updatedAt: new Date('2025-11-16')
    },
    {
        id: 2,
        jobId: 2,
        userId: 2,
        coverLetter: "As a UX designer with extensive experience in creating user-centered designs...",
        resumeUrl: "/resumes/jane_smith_ux_designer.pdf",
        status: "under_review",
        appliedAt: new Date('2025-11-21'),
        updatedAt: new Date('2025-11-22')
    },
    {
        id: 3,
        jobId: 1,
        userId: 3,
        coverLetter: "I believe my skills in React and frontend development make me a perfect fit for this role...",
        resumeUrl: "/resumes/mike_johnson_react_dev.pdf",
        status: "interview_scheduled",
        appliedAt: new Date('2025-11-17'),
        updatedAt: new Date('2025-11-23')
    }
];

// Get all applications (with optional filtering)
router.get('/', (req, res) => {
    try {
        const { jobId, userId, status } = req.query;
        
        // Filter applications based on query parameters
        let filteredApplications = [...applications];
        
        if (jobId) {
            filteredApplications = filteredApplications.filter(app => app.jobId == jobId);
        }
        
        if (userId) {
            filteredApplications = filteredApplications.filter(app => app.userId == userId);
        }
        
        if (status) {
            filteredApplications = filteredApplications.filter(app => app.status === status);
        }
        
        res.json(filteredApplications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error while fetching applications' });
    }
});

// Get application by ID
router.get('/:id', (req, res) => {
    try {
        const applicationId = parseInt(req.params.id);
        const application = applications.find(app => app.id === applicationId);
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        res.json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ message: 'Server error while fetching application' });
    }
});

// Create a new application (job seekers only)
router.post('/', (req, res) => {
    try {
        // In a real application, you would authenticate and authorize the user
        // For demo purposes, we'll just create the application
        
        const { jobId, coverLetter, resumeUrl } = req.body;
        
        // Validation
        if (!jobId || !coverLetter) {
            return res.status(400).json({ message: 'Job ID and cover letter are required' });
        }
        
        // Check if job exists (in a real app, you would query the jobs database)
        // For demo, we'll assume job exists
        
        // Check if user has already applied (in a real app, you would check with user ID)
        // For demo, we'll allow multiple applications
        
        // Create new application
        const newApplication = {
            id: applications.length > 0 ? Math.max(...applications.map(app => app.id)) + 1 : 1,
            jobId: parseInt(jobId),
            userId: 1, // In real app, this would be the authenticated user ID
            coverLetter,
            resumeUrl: resumeUrl || null,
            status: "submitted",
            appliedAt: new Date(),
            updatedAt: new Date()
        };
        
        applications.push(newApplication);
        
        res.status(201).json(newApplication);
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ message: 'Server error while creating application' });
    }
});

// Update application status (employers only)
router.put('/:id/status', (req, res) => {
    try {
        const applicationId = parseInt(req.params.id);
        const applicationIndex = applications.findIndex(app => app.id === applicationId);
        
        if (applicationIndex === -1) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // In a real application, you would authenticate and authorize the user
        // For demo purposes, we'll just update the status
        
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['submitted', 'under_review', 'interview_scheduled', 'rejected', 'accepted'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        // Update application status
        applications[applicationIndex] = {
            ...applications[applicationIndex],
            status,
            updatedAt: new Date()
        };
        
        res.json(applications[applicationIndex]);
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Server error while updating application status' });
    }
});

// Delete an application (job seekers only)
router.delete('/:id', (req, res) => {
    try {
        const applicationId = parseInt(req.params.id);
        const applicationIndex = applications.findIndex(app => app.id === applicationId);
        
        if (applicationIndex === -1) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // In a real application, you would authenticate and authorize the user
        // For demo purposes, we'll just remove the application
        
        applications.splice(applicationIndex, 1);
        
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Server error while deleting application' });
    }
});

module.exports = router;