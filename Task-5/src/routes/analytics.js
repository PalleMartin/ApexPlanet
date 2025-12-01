// routes/analytics.js
const express = require('express');
const router = express.Router();

// Mock data for analytics
const analyticsData = {
    totalJobs: 1245,
    activeJobs: 342,
    totalApplications: 2876,
    totalUsers: 1245,
    
    applicationsByStatus: {
        submitted: 1200,
        underReview: 800,
        interviewScheduled: 300,
        rejected: 400,
        accepted: 176
    },
    
    jobsByCategory: [
        { category: 'Technology', count: 420 },
        { category: 'Healthcare', count: 280 },
        { category: 'Finance', count: 190 },
        { category: 'Education', count: 150 },
        { category: 'Marketing', count: 120 },
        { category: 'Sales', count: 85 }
    ],
    
    applicationsOverTime: [
        { date: '2025-11-01', count: 45 },
        { date: '2025-11-05', count: 52 },
        { date: '2025-11-10', count: 68 },
        { date: '2025-11-15', count: 75 },
        { date: '2025-11-20', count: 82 },
        { date: '2025-11-25', count: 95 },
        { date: '2025-11-30', count: 110 }
    ]
};

// Get overall statistics
router.get('/statistics', (req, res) => {
    try {
        res.json(analyticsData);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Server error while fetching statistics' });
    }
});

module.exports = router;