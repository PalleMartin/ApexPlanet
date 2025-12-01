// js/admin-dashboard.js

document.addEventListener('DOMContentLoaded', function() {
    // Load analytics data when the page loads
    loadAnalyticsData();
});

// Function to load analytics data
function loadAnalyticsData() {
    fetch('/api/analytics/statistics')
        .then(response => response.json())
        .then(data => {
            // Update statistics cards
            updateStatistics(data);
            
            // Render charts
            renderApplicationsChart(data.applicationsOverTime);
            renderCategoriesChart(data.jobsByCategory);
            renderStatusChart(data.applicationsByStatus);
            renderUsersChart(data.usersByType);
        })
        .catch(error => {
            console.error('Error loading analytics data:', error);
        });
}

// Function to update statistics cards
function updateStatistics(data) {
    document.getElementById('total-users').textContent = data.totalUsers.toLocaleString();
    document.getElementById('total-jobs').textContent = data.totalJobs.toLocaleString();
    document.getElementById('total-applications').textContent = data.totalApplications.toLocaleString();
    document.getElementById('active-jobs').textContent = data.activeJobs.toLocaleString();
    
    // For demo purposes, we'll use static change values
    // In a real application, these would be calculated from historical data
    document.getElementById('users-change').textContent = '+23 from last week';
    document.getElementById('jobs-change').textContent = '+12 from last week';
    document.getElementById('applications-change').textContent = '+45 from last week';
    document.getElementById('active-jobs-change').textContent = '+8 from last week';
}

// Function to render applications over time chart
function renderApplicationsChart(data) {
    const ctx = document.getElementById('applicationsChart').getContext('2d');
    
    // Extract dates and counts
    const dates = data.map(item => item.date);
    const counts = data.map(item => item.count);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Applications',
                data: counts,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Function to render jobs by category chart
function renderCategoriesChart(data) {
    const ctx = document.getElementById('categoriesChart').getContext('2d');
    
    // Extract categories and counts
    const categories = data.map(item => item.category);
    const counts = data.map(item => item.count);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: counts,
                backgroundColor: [
                    '#007bff',
                    '#28a745',
                    '#ffc107',
                    '#dc3545',
                    '#6f42c1',
                    '#17a2b8'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Function to render applications by status chart
function renderStatusChart(data) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    // Extract statuses and counts
    const statuses = Object.keys(data);
    const counts = Object.values(data);
    
    // Map statuses to more readable labels
    const labels = statuses.map(status => {
        switch(status) {
            case 'submitted': return 'Submitted';
            case 'underReview': return 'Under Review';
            case 'interviewScheduled': return 'Interview Scheduled';
            case 'rejected': return 'Rejected';
            case 'accepted': return 'Accepted';
            default: return status;
        }
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Applications',
                data: counts,
                backgroundColor: '#007bff',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 100
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Function to render users by type chart
function renderUsersChart(data) {
    const ctx = document.getElementById('usersChart').getContext('2d');
    
    // Extract user types and counts
    const types = Object.keys(data);
    const counts = Object.values(data);
    
    // Map types to more readable labels
    const labels = types.map(type => {
        switch(type) {
            case 'jobseekers': return 'Job Seekers';
            case 'employers': return 'Employers';
            default: return type;
        }
    });
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: [
                    '#28a745',
                    '#ffc107'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}