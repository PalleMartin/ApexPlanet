// js/jobs.js

document.addEventListener('DOMContentLoaded', function() {
    // Load jobs when the page loads
    loadJobs();
    
    // Handle job search form submission
    const searchForm = document.getElementById('job-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchJobs();
        });
    }
    
    // Handle job filters form submission
    const filtersForm = document.getElementById('job-filters-form');
    if (filtersForm) {
        filtersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            filterJobs();
        });
    }
    
    // Handle reset filters button
    const resetFiltersButton = document.getElementById('reset-filters');
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', function() {
            resetFilters();
        });
    }
    
    // Handle job application form submission
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitApplication();
        });
    }
    
    // Load categories and companies for filters
    loadCategories();
    loadCompanies();
});

// Function to load jobs
function loadJobs() {
    fetch('/api/jobs')
        .then(response => response.json())
        .then(jobs => {
            displayJobs(jobs);
            updateResultsCount(jobs.length);
        })
        .catch(error => {
            console.error('Error loading jobs:', error);
            document.getElementById('jobs-container').innerHTML = '<p>Error loading jobs. Please try again later.</p>';
        });
}

// Function to search jobs
function searchJobs() {
    const searchInput = document.querySelector('#job-search-form input[type="text"]:nth-child(1)');
    const locationInput = document.querySelector('#job-search-form input[type="text"]:nth-child(2)');
    
    const search = searchInput ? searchInput.value : '';
    const location = locationInput ? locationInput.value : '';
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (location) queryParams.append('location', location);
    
    fetch(`/api/jobs?${queryParams.toString()}`)
        .then(response => response.json())
        .then(jobs => {
            displayJobs(jobs);
            updateResultsCount(jobs.length);
        })
        .catch(error => {
            console.error('Error searching jobs:', error);
            document.getElementById('jobs-container').innerHTML = '<p>Error searching jobs. Please try again later.</p>';
        });
}

// Function to filter jobs
function filterJobs() {
    const keyword = document.getElementById('search-keyword').value;
    const location = document.getElementById('search-location').value;
    const category = document.getElementById('job-category').value;
    const jobType = document.getElementById('job-type').value;
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append('search', keyword);
    if (location) queryParams.append('location', location);
    if (category) queryParams.append('category', category);
    if (jobType) queryParams.append('jobType', jobType);
    
    fetch(`/api/jobs?${queryParams.toString()}`)
        .then(response => response.json())
        .then(jobs => {
            displayJobs(jobs);
            updateResultsCount(jobs.length);
        })
        .catch(error => {
            console.error('Error filtering jobs:', error);
            document.getElementById('jobs-container').innerHTML = '<p>Error filtering jobs. Please try again later.</p>';
        });
}

// Function to reset filters
function resetFilters() {
    document.getElementById('job-filters-form').reset();
    loadJobs();
}

// Function to display jobs
function displayJobs(jobs) {
    const container = document.getElementById('jobs-container');
    
    if (!container) return;
    
    if (jobs.length === 0) {
        container.innerHTML = '<p>No jobs found matching your criteria.</p>';
        return;
    }
    
    let jobsHTML = '<div class="jobs-grid">';
    
    jobs.forEach(job => {
        jobsHTML += `
            <div class="job-card">
                <div class="job-header">
                    <h3>${job.title}</h3>
                    <span class="salary">$${job.salaryMin ? job.salaryMin.toLocaleString() : 'N/A'} - $${job.salaryMax ? job.salaryMax.toLocaleString() : 'N/A'}</span>
                </div>
                <div class="job-meta">
                    <span>${job.company ? job.company.name : 'Company N/A'}</span>
                    <span>${job.location}</span>
                    <span>${job.jobType}</span>
                </div>
                <p>${job.description.substring(0, 100)}${job.description.length > 100 ? '...' : ''}</p>
                <div class="job-footer">
                    <span class="posted">Posted ${timeSince(job.createdAt)} ago</span>
                    <a href="job-details.html?id=${job.id}" class="btn btn-small">View Details</a>
                </div>
            </div>
        `;
    });
    
    jobsHTML += '</div>';
    container.innerHTML = jobsHTML;
}

// Function to update results count
function updateResultsCount(count) {
    const resultsCountElement = document.getElementById('results-count');
    if (resultsCountElement) {
        resultsCountElement.textContent = count;
    }
}

// Function to load categories
function loadCategories() {
    fetch('/api/jobs/categories/all')
        .then(response => response.json())
        .then(categories => {
            const container = document.getElementById('categories-container');
            if (!container) return;
            
            let categoriesHTML = '<div class="categories-grid">';
            
            categories.forEach(category => {
                categoriesHTML += `
                    <div class="category-card">
                        <h3>${category.name}</h3>
                        <span>${getJobCountByCategory(category.id)} jobs</span>
                    </div>
                `;
            });
            
            categoriesHTML += '</div>';
            container.innerHTML = categoriesHTML;
        })
        .catch(error => {
            console.error('Error loading categories:', error);
        });
}

// Function to load companies
function loadCompanies() {
    fetch('/api/jobs/companies/all')
        .then(response => response.json())
        .then(companies => {
            const container = document.getElementById('companies-container');
            if (!container) return;
            
            let companiesHTML = '<div class="companies-grid">';
            
            companies.forEach(company => {
                companiesHTML += `
                    <div class="company-card">
                        <h3>${company.name}</h3>
                        <p>${company.description}</p>
                    </div>
                `;
            });
            
            companiesHTML += '</div>';
            container.innerHTML = companiesHTML;
        })
        .catch(error => {
            console.error('Error loading companies:', error);
        });
}

// Helper function to calculate time since
function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " year(s)";
    }
    
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " month(s)";
    }
    
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " day(s)";
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hour(s)";
    }
    
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minute(s)";
    }
    
    return Math.floor(seconds) + " second(s)";
}

// Helper function to get job count by category (demo implementation)
function getJobCountByCategory(categoryId) {
    // In a real application, this would come from the server
    const counts = {1: 1245, 2: 876, 3: 621};
    return counts[categoryId] || 0;
}

// Function to submit job application
function submitApplication() {
    const jobId = document.getElementById('job-id').value;
    const coverLetter = document.getElementById('cover-letter').value;
    
    // Show loading state
    const submitButton = document.querySelector('#application-form .btn-primary');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Send AJAX request
    fetch('/api/applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId, coverLetter })
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        if (data.id) {
            alert('Application submitted successfully!');
            // Reset form
            document.getElementById('application-form').reset();
        } else {
            alert(data.message || 'Failed to submit application');
        }
    })
    .catch(error => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        console.error('Application submission error:', error);
        alert('An error occurred while submitting your application. Please try again.');
    });
}