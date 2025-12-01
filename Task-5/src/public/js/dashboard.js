// js/dashboard.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize any dashboard-specific functionality
    
    // Example: Add event listeners for job applications
    const applyButtons = document.querySelectorAll('.job-card .btn-small');
    applyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const jobTitle = this.closest('.job-card').querySelector('h3').textContent;
            applyForJob(jobTitle);
        });
    });
    
    // Example: Notification badge update
    updateNotificationBadges();
});

// Function to handle job application
function applyForJob(jobTitle) {
    // In a real application, this would send an AJAX request to apply for a job
    console.log('Applying for job:', jobTitle);
    
    // Show confirmation
    if (confirm(`Are you sure you want to apply for "${jobTitle}"?`)) {
        alert(`Application submitted for "${jobTitle}" successfully!`);
        
        // Update stats (in a real app, this would come from the server)
        updateStats();
    }
}

// Function to update dashboard stats
function updateStats() {
    const appliedJobsElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
    if (appliedJobsElement) {
        const currentCount = parseInt(appliedJobsElement.textContent);
        appliedJobsElement.textContent = currentCount + 1;
    }
}

// Function to update notification badges
function updateNotificationBadges() {
    // In a real application, this would fetch notifications from the server
    console.log('Updating notification badges');
    
    // Example: Update messages badge
    const messagesBadge = document.querySelector('.stat-card:nth-child(4) .stat-number');
    if (messagesBadge) {
        // This would normally come from an API
        messagesBadge.textContent = '5';
    }
}