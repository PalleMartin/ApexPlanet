// routes/jobs.js
const express = require('express');
const router = express.Router();

// In-memory storage for demo purposes (in production, use a database)
let jobs = [
    {
        id: 1,
        title: "Frontend Developer",
        description: "We are looking for an experienced frontend developer with React expertise to join our team.",
        location: "San Francisco, CA",
        jobType: "Full-time",
        salaryMin: 70000,
        salaryMax: 90000,
        companyId: 1,
        categoryId: 1,
        postedBy: 1,
        createdAt: new Date('2025-11-15'),
        updatedAt: new Date('2025-11-15'),
        expiryDate: new Date('2025-12-15'),
        isActive: true
    },
    {
        id: 2,
        title: "UX Designer",
        description: "Join our design team to create beautiful and intuitive user experiences.",
        location: "Remote",
        jobType: "Full-time",
        salaryMin: 65000,
        salaryMax: 85000,
        companyId: 2,
        categoryId: 1,
        postedBy: 2,
        createdAt: new Date('2025-11-20'),
        updatedAt: new Date('2025-11-20'),
        expiryDate: new Date('2025-12-20'),
        isActive: true
    },
    {
        id: 3,
        title: "Data Scientist",
        description: "We're looking for a data scientist to help us analyze customer behavior.",
        location: "Seattle, WA",
        jobType: "Full-time",
        salaryMin: 90000,
        salaryMax: 120000,
        companyId: 3,
        categoryId: 2,
        postedBy: 3,
        createdAt: new Date('2025-11-10'),
        updatedAt: new Date('2025-11-10'),
        expiryDate: new Date('2025-12-10'),
        isActive: true
    },
    {
        id: 4,
        title: "Backend Developer",
        description: "Looking for an experienced backend developer with Node.js expertise.",
        location: "Menlo Park, CA",
        jobType: "Full-time",
        salaryMin: 80000,
        salaryMax: 110000,
        companyId: 4,
        categoryId: 1,
        postedBy: 1,
        createdAt: new Date('2025-11-25'),
        updatedAt: new Date('2025-11-25'),
        expiryDate: new Date('2025-12-25'),
        isActive: true
    },
    {
        id: 5,
        title: "Product Manager",
        description: "Join our product team to drive innovation and user growth.",
        location: "Los Angeles, CA",
        jobType: "Full-time",
        salaryMin: 95000,
        salaryMax: 130000,
        companyId: 5,
        categoryId: 3,
        postedBy: 2,
        createdAt: new Date('2025-11-23'),
        updatedAt: new Date('2025-11-23'),
        expiryDate: new Date('2025-12-23'),
        isActive: true
    }
];

let companies = [
    { id: 1, name: "Google Inc.", description: "Leading technology company", website: "https://google.com" },
    { id: 2, name: "Microsoft", description: "Software giant", website: "https://microsoft.com" },
    { id: 3, name: "Amazon", description: "E-commerce and cloud computing", website: "https://amazon.com" },
    { id: 4, name: "Facebook", description: "Social media platform", website: "https://facebook.com" },
    { id: 5, name: "Netflix", description: "Streaming entertainment service", website: "https://netflix.com" }
];

let categories = [
    { id: 1, name: "Technology", description: "Tech jobs" },
    { id: 2, name: "Data Science", description: "Data-related jobs" },
    { id: 3, name: "Product Management", description: "Product roles" }
];

// Get all jobs with optional filtering
router.get('/', (req, res) => {
    try {
        const { search, location, category } = req.query;
        
        // Filter jobs based on query parameters
        let filteredJobs = jobs.filter(job => job.isActive);
        
        if (search) {
            filteredJobs = filteredJobs.filter(job => 
                job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        if (location) {
            filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase().includes(location.toLowerCase())
            );
        }
        
        if (category) {
            filteredJobs = filteredJobs.filter(job => 
                job.categoryId == category
            );
        }
        
        // Add company and category information to each job
        const jobsWithDetails = filteredJobs.map(job => {
            const company = companies.find(c => c.id === job.companyId);
            const category = categories.find(c => c.id === job.categoryId);
            
            return {
                ...job,
                company: company ? { id: company.id, name: company.name } : null,
                category: category ? { id: category.id, name: category.name } : null
            };
        });
        
        res.json(jobsWithDetails);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server error while fetching jobs' });
    }
});

// Get job by ID
router.get('/:id', (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        const job = jobs.find(j => j.id === jobId);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        // Add company and category information
        const company = companies.find(c => c.id === job.companyId);
        const category = categories.find(c => c.id === job.categoryId);
        
        const jobWithDetails = {
            ...job,
            company: company ? { id: company.id, name: company.name, description: company.description, website: company.website } : null,
            category: category ? { id: category.id, name: category.name, description: category.description } : null
        };
        
        res.json(jobWithDetails);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Server error while fetching job' });
    }
});

// Create a new job (employers only)
router.post('/', (req, res) => {
    try {
        // In a real application, you would authenticate and authorize the user
        // For demo purposes, we'll just create the job
        
        const { title, description, location, jobType, salaryMin, salaryMax, companyId, categoryId } = req.body;
        
        // Validation
        if (!title || !description || !location || !jobType || !companyId || !categoryId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Create new job
        const newJob = {
            id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
            title,
            description,
            location,
            jobType,
            salaryMin: salaryMin || null,
            salaryMax: salaryMax || null,
            companyId: parseInt(companyId),
            categoryId: parseInt(categoryId),
            postedBy: 1, // In real app, this would be the authenticated user ID
            createdAt: new Date(),
            updatedAt: new Date(),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            isActive: true
        };
        
        jobs.push(newJob);
        
        res.status(201).json(newJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Server error while creating job' });
    }
});

// Update a job (employers only)
router.put('/:id', (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        const jobIndex = jobs.findIndex(j => j.id === jobId);
        
        if (jobIndex === -1) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        // In a real application, you would authenticate and authorize the user
        // For demo purposes, we'll just update the job
        
        const { title, description, location, jobType, salaryMin, salaryMax, companyId, categoryId, isActive } = req.body;
        
        // Update job
        jobs[jobIndex] = {
            ...jobs[jobIndex],
            title: title || jobs[jobIndex].title,
            description: description || jobs[jobIndex].description,
            location: location || jobs[jobIndex].location,
            jobType: jobType || jobs[jobIndex].jobType,
            salaryMin: salaryMin !== undefined ? salaryMin : jobs[jobIndex].salaryMin,
            salaryMax: salaryMax !== undefined ? salaryMax : jobs[jobIndex].salaryMax,
            companyId: companyId ? parseInt(companyId) : jobs[jobIndex].companyId,
            categoryId: categoryId ? parseInt(categoryId) : jobs[jobIndex].categoryId,
            isActive: isActive !== undefined ? isActive : jobs[jobIndex].isActive,
            updatedAt: new Date()
        };
        
        res.json(jobs[jobIndex]);
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Server error while updating job' });
    }
});

// Delete a job (employers only)
router.delete('/:id', (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        const jobIndex = jobs.findIndex(j => j.id === jobId);
        
        if (jobIndex === -1) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        // In a real application, you would authenticate and authorize the user
        // For demo purposes, we'll just remove the job
        
        jobs.splice(jobIndex, 1);
        
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Server error while deleting job' });
    }
});

// Get all categories
router.get('/categories/all', (req, res) => {
    try {
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error while fetching categories' });
    }
});

// Get all companies
router.get('/companies/all', (req, res) => {
    try {
        res.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Server error while fetching companies' });
    }
});

module.exports = router;