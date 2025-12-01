// js/job-details.js

document.addEventListener('DOMContentLoaded', function() {
    // Get job ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    
    if (jobId) {
        loadJobDetails(jobId);
    } else {
        document.querySelector('.job-details-container').innerHTML = '<p>Job not found.</p>';
    }
    
    // Handle apply button click
    const applyButton = document.getElementById('apply-button');
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            showApplicationForm();
        });
    }
    
    // Handle save button click
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveJob(jobId);
        });
    }
    
    // Handle cancel application button click
    const cancelApplicationButton = document.getElementById('cancel-application');
    if (cancelApplicationButton) {
        cancelApplicationButton.addEventListener('click', function() {
            hideApplicationForm();
        });
    }
    
    // Handle application form submission
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitApplication(jobId);
        });
    }
});

// Function to load job details
function loadJobDetails(jobId) {
    fetch(`/api/jobs/${jobId}`)
        .then(response => response.json())
        .then(job => {
            if (job.message) {
                document.querySelector('.job-details-container').innerHTML = '<p>Job not found.</p>';
                return;
            }
            
            // Update job details in the DOM
            document.getElementById('job-title').textContent = job.title;
            document.getElementById('job-salary').textContent = `$${job.salaryMin ? job.salaryMin.toLocaleString() : 'N/A'} - $${job.salaryMax ? job.salaryMax.toLocaleString() : 'N/A'}`;
            document.getElementById('job-company').textContent = job.company ? job.company.name : 'Company N/A';
            document.getElementById('job-location').textContent = job.location;
            document.getElementById('job-type').textContent = job.jobType;
            document.getElementById('job-description').textContent = job.description;
            
            // Update company information
            if (job.company) {
                document.getElementById('company-name').textContent = job.company.name;
                document.getElementById('company-description').textContent = job.company.description;
                document.getElementById('company-website').href = job.company.website;
                document.getElementById('company-website').textContent = job.company.website;
            }
            
            // Set job ID in application form
            document.getElementById('job-id').value = jobId;
            
            // For demo purposes, we'll add some requirements
            const requirementsList = document.getElementById('job-requirements');
            requirementsList.innerHTML = `
                <li>Bachelor's degree in Computer Science or related field</li>
                <li>3+ years of experience in frontend development</li>
                <li>Proficiency in React, JavaScript, HTML, and CSS</li>
                <li>Experience with RESTful APIs</li>
                <li>Strong problem-solving and communication skills</li>
            `;
        })
        .catch(error => {
            console.error('Error loading job details:', error);
            document.querySelector('.job-details-container').innerHTML = '<p>Error loading job details. Please try again later.</p>';
        });
}

// Function to show application form
function showApplicationForm() {
    document.getElementById('application-form-container').style.display = 'block';
    document.querySelector('.job-details-container').style.display = 'none';
    
    // Scroll to application form
    document.getElementById('application-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Function to hide application form
function hideApplicationForm() {
    document.getElementById('application-form-container').style.display = 'none';
    document.querySelector('.job-details-container').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to save job
function saveJob(jobId) {
    // In a real application, this would send an AJAX request to save the job
    console.log('Saving job:', jobId);
    alert('Job saved successfully!');
}

// Function to submit application
function submitApplication(jobId) {
    const coverLetter = document.getElementById('cover-letter').value;
    const resume = document.getElementById('resume').value;
    
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
        body: JSON.stringify({ jobId, coverLetter, resumeUrl: resume })
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        if (data.id) {
            alert('Application submitted successfully!');
            hideApplicationForm();
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