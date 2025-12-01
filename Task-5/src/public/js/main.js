// js/main.js

// Job search form submission
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('job-search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get search values
            const keywords = searchForm.querySelector('input[type="text"]:nth-child(1)').value;
            const location = searchForm.querySelector('input[type="text"]:nth-child(2)').value;
            
            // In a real application, this would send an AJAX request to the server
            console.log('Searching for jobs:', { keywords, location });
            
            // Show a message to the user
            alert(`Searching for jobs with keywords: "${keywords}" in location: "${location}"`);
        });
    }
    
    // Mobile menu toggle (if needed)
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
});

// Function to handle job application (placeholder)
function applyForJob(jobId) {
    // In a real application, this would send an AJAX request to apply for a job
    console.log('Applying for job:', jobId);
    alert(`Application submitted for job ID: ${jobId}`);
}