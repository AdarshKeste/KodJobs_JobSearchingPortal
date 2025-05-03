// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize storage if it doesn't exist
    if (!localStorage.getItem('applications')) {
        localStorage.setItem('applications', JSON.stringify([]));
    }
    if (!localStorage.getItem('savedJobs')) {
        localStorage.setItem('savedJobs', JSON.stringify([]));
    }
    if (!localStorage.getItem('userProfile')) {
        localStorage.setItem('userProfile', JSON.stringify({}));
    }

    const jobsContainer = document.getElementById('jobs-container');
    if (!jobsContainer) {
        console.error('Jobs container not found!');
        return;
    }

    // Set up search and filter listeners
    const searchInput = document.getElementById('search');
    const locationFilter = document.getElementById('location-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterJobs, 300));
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('change', filterJobs);
    }

    // Load jobs initially
    loadJobs();
    setupModalListeners();
});

// Handle logout
document.getElementById('logout-btn').addEventListener('click', () => {
    // Only remove the login status, preserve other data
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
});

// Job data
const jobs = [
    {
        title: "Full Stack Developer",
        company: "TechCorp Solutions",
        location: "Bangalore",
        salary: "12-18 LPA",
        experience: "2-4 years",
        postedDate: "2024-03-20",
        skills: ["React.js", "Node.js", "MongoDB", "TypeScript", "AWS"],
        description: `We are seeking a skilled Full Stack Developer to join our dynamic team at TechCorp Solutions.

Key Responsibilities:
- Design and develop scalable web applications using React.js and Node.js
- Work with MongoDB databases and implement efficient data structures
- Implement TypeScript for better code maintainability
- Deploy and maintain applications on AWS infrastructure
- Collaborate with cross-functional teams to deliver high-quality solutions

Requirements:
- 2-4 years of experience in full stack development
- Strong proficiency in React.js, Node.js, and MongoDB
- Experience with TypeScript and AWS services
- Excellent problem-solving and communication skills
- Bachelor's degree in Computer Science or related field`
    },
    {
        title: "Data Scientist",
        company: "Analytics Pro",
        location: "Pune",
        salary: "15-22 LPA",
        experience: "3-5 years",
        postedDate: "2024-03-19",
        skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Data Visualization"],
        description: `Analytics Pro is looking for an experienced Data Scientist to drive our data-driven initiatives.

Key Responsibilities:
- Develop and implement machine learning models
- Analyze large datasets and extract meaningful insights
- Create data visualization dashboards
- Collaborate with stakeholders to understand business requirements
- Present findings to technical and non-technical audiences

Requirements:
- 3-5 years of experience in data science
- Strong programming skills in Python
- Expertise in machine learning algorithms and TensorFlow
- Proficiency in SQL and data visualization tools
- Master's degree in Data Science, Statistics, or related field`
    },
    {
        title: "DevOps Engineer",
        company: "CloudTech Systems",
        location: "Hyderabad",
        salary: "14-20 LPA",
        experience: "2-5 years",
        postedDate: "2024-03-18",
        skills: ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform"],
        description: `CloudTech Systems is seeking a DevOps Engineer to strengthen our cloud infrastructure team.

Key Responsibilities:
- Design and implement CI/CD pipelines using Jenkins
- Manage container orchestration with Docker and Kubernetes
- Automate infrastructure deployment using Terraform
- Monitor and optimize cloud resources on AWS
- Implement security best practices

Requirements:
- 2-5 years of experience in DevOps
- Strong knowledge of containerization and orchestration
- Experience with CI/CD tools and practices
- AWS certification preferred
- Bachelor's degree in Computer Science or equivalent experience`
    }
];

// Add styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .job-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .job-title {
            color: #333;
            font-size: 20px;
            margin: 0 0 10px 0;
        }

        .company-name {
            color: #666;
            font-size: 16px;
            margin-bottom: 10px;
        }

        .job-details {
            color: #666;
            margin-bottom: 15px;
        }

        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 15px 0;
        }

        .skill-tag {
            background: #f0f0f0;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            color: #666;
        }

        .job-actions {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .details-btn {
            background: #f0f0f0;
            color: #333;
        }

        .apply-btn {
            background: #ff6600;
            color: white;
        }

        .btn:hover {
            opacity: 0.9;
        }
    </style>
`);

// Function to display jobs
function displayJobs() {
    const container = document.getElementById('jobs-container');
    if (!container) {
        console.error('Jobs container not found!');
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Add jobs
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        jobCard.innerHTML = `
            <h3 class="job-title">${job.title}</h3>
            <div class="company-name">${job.company}</div>
            <div class="job-details">
                <div><i class="fas fa-map-marker-alt"></i> ${job.location}</div>
                <div><i class="fas fa-money-bill-wave"></i> ${job.salary}</div>
            </div>
            <div class="skills-list">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="job-actions">
                <button class="btn details-btn" onclick="showDetails('${job.title}')">
                    <i class="fas fa-info-circle"></i> Check Details
                </button>
                <button class="btn apply-btn" onclick="applyForJob('${job.title}')">
                    <i class="fas fa-paper-plane"></i> Apply Now
                </button>
            </div>
        `;
        
        container.appendChild(jobCard);
    });
}

// Function to show job details
function showDetails(jobTitle) {
    const job = jobs.find(j => j.title === jobTitle);
    if (!job) return;

    const modal = document.getElementById('jobModal');
    if (!modal) return;

    // Store the current job in localStorage for resume evaluation
    const jobData = {
        id: generateJobId(job),
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        skills: job.skills,
        description: job.description || `We are looking for a ${job.title} at ${job.company}. 
Required skills: ${job.skills.join(', ')}. 
Location: ${job.location}
Salary: ${job.salary}`
    };
    localStorage.setItem('currentJob', JSON.stringify(jobData));

    document.getElementById('modal-job-title').textContent = job.title;
    document.getElementById('modal-company-name').textContent = job.company;
    document.getElementById('modal-location').textContent = job.location;
    document.getElementById('modal-package').textContent = job.salary;
    document.getElementById('modal-skills').innerHTML = job.skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
    
    // Set description
    document.getElementById('modal-description').textContent = jobData.description;

    modal.style.display = 'block';
}

// Function to check if profile is complete
function isProfileComplete() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    console.log('Current profile data:', userProfile); // Debug log

    // Basic check - if we have any data, consider profile complete
    if (Object.keys(userProfile).length > 0) {
        return true;
    }

    showNotification('Please complete your profile before applying', 'error');
    return false;
}

// Function to handle job application
async function applyForJob(jobId) {
    console.log('Applying for job:', jobId);

    if (!localStorage.getItem('loggedIn')) {
        showNotification('Please log in to apply for jobs', 'error');
        window.location.href = 'index.html';
        return;
    }

    // Get user profile and resume
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (!userProfile.resumeData) {
        showNotification('Please upload your resume in your profile before applying', 'error');
        window.location.href = 'profile.html';
        return;
    }

    // Get current job details
    const job = allJobListings.find(j => j.id === jobId);
    if (!job) {
        showNotification('Job not found', 'error');
        return;
    }

    // Get existing applications
    let applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Check if already applied
    if (applications.some(app => app.jobId === jobId)) {
        showNotification('You have already applied for this job', 'error');
        return;
    }

    try {
        // Show loading state
        const applyBtn = document.querySelector(`button[onclick="applyForJob('${jobId}')"]`);
        if (applyBtn) {
            applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Evaluating...';
            applyBtn.disabled = true;
        }

        // Call Netlify function for resume evaluation
        const response = await fetch('/.netlify/functions/evaluate-resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resume: userProfile.resumeData,
                jobDescription: job.description || `We are looking for a ${job.title} at ${job.company}. 
Required skills: ${job.skills.join(', ')}. 
Location: ${job.location}
Salary: ${job.lpa} LPA`
            })
        });

        if (!response.ok) {
            throw new Error('Failed to evaluate resume');
        }

        const data = await response.json();
        const evaluation = data.candidates[0].content.parts[0].text;

        // Show evaluation results in a modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <span class="close-modal">&times;</span>
                <h2>Resume Evaluation Results</h2>
                <div class="evaluation-result" style="white-space: pre-line; margin-top: 20px;">
                    ${evaluation}
                </div>
                <div class="modal-actions" style="margin-top: 20px; text-align: right;">
                    <button class="btn cancel-btn" style="margin-right: 10px;">Cancel</button>
                    <button class="btn apply-btn">Proceed with Application</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Handle modal close
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const proceedBtn = modal.querySelector('.apply-btn');

        closeBtn.onclick = () => {
            modal.remove();
            if (applyBtn) {
                applyBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Apply Now';
                applyBtn.disabled = false;
            }
        };

        cancelBtn.onclick = () => {
            modal.remove();
            if (applyBtn) {
                applyBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Apply Now';
                applyBtn.disabled = false;
            }
        };

        proceedBtn.onclick = () => {
            // Create application object
            const application = {
                jobId: job.id,
                jobTitle: job.title,
                companyName: job.company,
                companyLogo: job.logo,
                location: job.location,
                salary: job.lpa + ' LPA',
                skills: job.skills,
                appliedDate: new Date().toISOString(),
                status: 'Applied',
                evaluation: evaluation
            };

            // Add new application
            applications.push(application);
            localStorage.setItem('applications', JSON.stringify(applications));

            // Update UI
            if (applyBtn) {
                applyBtn.innerHTML = '<i class="fas fa-check"></i> Applied';
                applyBtn.disabled = true;
                applyBtn.classList.add('applied');
            }

            modal.remove();
            showNotification('Successfully applied for the job', 'success');
        };

        // Close modal when clicking outside
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.remove();
                if (applyBtn) {
                    applyBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Apply Now';
                    applyBtn.disabled = false;
                }
            }
        };

    } catch (error) {
        console.error('Error evaluating resume:', error);
        showNotification('Failed to evaluate resume. Please try again.', 'error');
        if (applyBtn) {
            applyBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Apply Now';
            applyBtn.disabled = false;
        }
    }
}

// Function to check if user has already applied for a job
function isJobApplied(jobId) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    return applications.some(app => app.jobId === jobId);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, displaying jobs...');
    displayJobs();
});

// Sample job data (replace this with API data)
const jobListings = [
    {
        company: "ITnow Inc",
        logo: "https://th.bing.com/th/id/OIP.QDai2x3GEds6AQy--l470QHaB2?rs=1&pid=ImgDetMain",
        location: "Bengaluru",
        title: "ServiceNow Developer Intern",
        skills: ["Java", "JavaScript"],
        lpa: "3 LPA",
        posted: "3 days ago"
    },
    {
        company: "Ahana Systems",
        logo: "https://th.bing.com/th/id/OIP.3M5_4D8NxQHOyq2yanp9VwAAAA?w=335&h=110&c=7&r=0&o=5&pid=1.7",
        location: "Mumbai, Bengaluru",
        title: "Associate Database Administrator (DBA)",
        skills: ["SQL", "Oracle", "Python"],
        lpa: "2.40 LPA",
        posted: "4 days ago"
    },
    {
        company: "Infanion",
        logo: "https://logo.clearbit.com/infanion.com",
        location: "Bangalore",
        title: "Trainee Tester & Functional Analyst",
        skills: ["Core Java", "Manual Testing", "Automation Testing"],
        lpa: "3.50 LPA",
        posted: "4 days ago"
    },
    {
        company: "Townhall",
        logo: "https://logo.clearbit.com/townhall.com",
        location: "Hyderabad",
        title: "SDET Intern",
        skills: ["Selenium", "Core Java", "Manual Testing"],
        lpa: "4 LPA",
        posted: "5 days ago"
    },
    {
        company: "Kristal Ball Smart Solutions",
        logo: "https://logo.clearbit.com/kristalball.com",
        location: "Bangalore",
        title: "Fullstack Developer",
        skills: ["Core Java", "Adv. Java", "Manual Testing"],
        lpa: "1.80 LPA",
        posted: "5 days ago"
    },
    {
        company: "Mavenir",
        logo: "https://logo.clearbit.com/mavenir.com",
        location: "Bangalore",
        title: "Graduate Engineer",
        skills: ["Core Java", "Adv Java", "Java Frameworks"],
        lpa: "8 LPA",
        posted: "7 days ago"
    }
];

// Add more job listings
const additionalJobs = [
    {
        company: "TechVision",
        logo: "https://logo.clearbit.com/techvision.com",
        location: "Remote",
        title: "UI/UX Designer",
        skills: ["Figma", "Adobe XD", "User Research"],
        lpa: "7 LPA",
        posted: "1 day ago"
    },
    {
        company: "CloudMatrix",
        logo: "https://th.bing.com/th/id/R.e357ca4b1358a44c38e3d4c3bc4991b4?rik=G0y%2bQ2gUfqrguw&riu=http%3a%2f%2fcloudmatrix.com.au%2fwp-content%2fuploads%2f2021%2f03%2fpreloader-1.png&ehk=84kukBhhoyjN0Y8hKkAL9iN%2forx7o%2bWsuGoGa2udE7M%3d&risl=&pid=ImgRaw&r=0",
        location: "Hyderabad",
        title: "DevOps Engineer",
        skills: ["AWS", "Docker", "Kubernetes", "Jenkins"],
        lpa: "12 LPA",
        posted: "2 days ago"
    },
    {
        company: "DataSphere",
        logo: "https://cdn.geekwire.com/wp-content/uploads/2017/06/datasphere-logo.gif",
        location: "Bangalore",
        title: "Data Scientist",
        skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
        lpa: "15 LPA",
        posted: "3 days ago"
    },
    {
        company: "CyberGuard",
        logo: "https://www.urbannetwork.co.uk/wp-content/uploads/2023/08/CyberGuard_blue_landingpage.png",
        location: "Mumbai",
        title: "Security Analyst",
        skills: ["Network Security", "Penetration Testing", "SIEM"],
        lpa: "8 LPA",
        posted: "2 days ago"
    },
    {
        company: "WebCraft",
        logo: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/2d7a7d63880977.5abfaa22cf143.jpg",
        location: "Pune",
        title: "Full Stack Developer",
        skills: ["React", "Node.js", "MongoDB", "TypeScript"],
        lpa: "10 LPA",
        posted: "1 day ago"
    },
    {
        company: "AInovate",
        logo: "https://th.bing.com/th/id/OIP.C-v0BaO4ivn1p9zQPVTTwwHaBU?rs=1&pid=ImgDetMain",
        location: "Delhi",
        title: "AI Research Intern",
        skills: ["Python", "Deep Learning", "NLP", "PyTorch"],
        lpa: "6 LPA",
        posted: "4 days ago"
    },
    {
        company: "MobileFirst",
        logo: "https://th.bing.com/th/id/OIP.x0KTuhUOAeMNxg_to_mk7AAAAA?rs=1&pid=ImgDetMain",
        location: "Chennai",
        title: "Mobile App Developer",
        skills: ["Flutter", "React Native", "Firebase"],
        lpa: "9 LPA",
        posted: "3 days ago"
    },
    {
        company: "BlockTech",
        logo: "https://cdn.dribbble.com/users/1307817/screenshots/20143792/blocktech_4x.png",
        location: "Bangalore",
        title: "Blockchain Developer",
        skills: ["Solidity", "Web3.js", "Smart Contracts"],
        lpa: "14 LPA",
        posted: "2 days ago"
    }
];

// Combine all job listings
const allJobListings = [
    {
        id: 'job1',
        company: "ITnow Inc",
        logo: "https://th.bing.com/th/id/OIP.QDai2x3GEds6AQy--l470QHaB2?rs=1&pid=ImgDetMain",
        location: "Pune",
        title: "ServiceNow Developer Intern",
        skills: ["ServiceNow", "JavaScript", "ITSM"],
        lpa: "4-6",
        posted: "2 days ago"
    },
    {
        id: 'job2',
        company: "Ahana Systems",
        logo: "https://th.bing.com/th/id/OIP.3M5_4D8NxQHOyq2yanp9VwAAAA?w=335&h=110&c=7&r=0&o=5&pid=1.7",
        location: "Mumbai",
        title: "Associate DBA",
        skills: ["SQL", "Database Management", "Oracle"],
        lpa: "6-8",
        posted: "1 week ago"
    },
    {
        id: 'job3',
        company: "Infanion",
        logo: "https://logo.clearbit.com/infanion.com",
        location: "Bangalore",
        title: "Trainee Tester",
        skills: ["Manual Testing", "Automation", "Selenium"],
        lpa: "3-5",
        posted: "3 days ago"
    },
    {
        id: 'job4',
        company: "Townhall",
        logo: "https://logo.clearbit.com/townhall.com",
        location: "Hyderabad",
        title: "SDET Intern",
        skills: ["Java", "TestNG", "Selenium"],
        lpa: "4-6",
        posted: "5 days ago"
    },
    {
        id: 'job5',
        company: "Kristal Ball",
        logo: "https://logo.clearbit.com/kristalball.com",
        location: "Chennai",
        title: "Fullstack Developer",
        skills: ["React", "Node.js", "MongoDB"],
        lpa: "8-12",
        posted: "1 day ago"
    },
    {
        id: 'job6',
        company: "Mavenir",
        logo: "https://logo.clearbit.com/mavenir.com",
        location: "Pune",
        title: "Graduate Engineer",
        skills: ["C++", "Networking", "Linux"],
        lpa: "5-7",
        posted: "4 days ago"
    },
    {
        id: 'job7',
        company: "TechVision",
        logo: "https://logo.clearbit.com/techvision.com",
        location: "Bangalore",
        title: "UI/UX Designer",
        skills: ["Figma", "Adobe XD", "UI Design"],
        lpa: "7-10",
        posted: "2 days ago"
    },
    {
        id: 'job8',
        company: "CloudMatrix",
        logo: "https://th.bing.com/th/id/R.e357ca4b1358a44c38e3d4c3bc4991b4?rik=G0y%2bQ2gUfqrguw&riu=http%3a%2f%2fcloudmatrix.com.au%2fwp-content%2fuploads%2f2021%2f03%2fpreloader-1.png&ehk=84kukBhhoyjN0Y8hKkAL9iN%2forx7o%2bWsuGoGa2udE7M%3d&risl=&pid=ImgRaw&r=0",
        location: "Mumbai",
        title: "DevOps Engineer",
        skills: ["AWS", "Docker", "Jenkins"],
        lpa: "12-15",
        posted: "1 week ago"
    },
    {
        id: 'job9',
        company: "DataSphere",
        logo: "https://cdn.geekwire.com/wp-content/uploads/2017/06/datasphere-logo.gif",
        location: "Delhi",
        title: "Data Scientist",
        skills: ["Python", "Machine Learning", "SQL"],
        lpa: "10-14",
        posted: "3 days ago"
    },
    {
        id: 'job10',
        company: "CyberGuard",
        logo: "https://www.urbannetwork.co.uk/wp-content/uploads/2023/08/CyberGuard_blue_landingpage.png",
        location: "Hyderabad",
        title: "Security Analyst",
        skills: ["Network Security", "SIEM", "Ethical Hacking"],
        lpa: "8-12",
        posted: "6 days ago"
    },
    {
        id: 'job11',
        company: "WebCraft",
        logo: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/2d7a7d63880977.5abfaa22cf143.jpg",
        location: "Pune",
        title: "Full Stack Developer",
        skills: ["Angular", "Spring Boot", "MySQL"],
        lpa: "9-13",
        posted: "4 days ago"
    },
    {
        id: 'job12',
        company: "AInovate",
        logo: "https://th.bing.com/th/id/OIP.C-v0BaO4ivn1p9zQPVTTwwHaBU?rs=1&pid=ImgDetMain",
        location: "Bangalore",
        title: "AI Research Intern",
        skills: ["Python", "Deep Learning", "TensorFlow"],
        lpa: "5-8",
        posted: "2 days ago"
    },
    {
        id: 'job13',
        company: "MobileFirst",
        logo: "https://th.bing.com/th/id/OIP.x0KTuhUOAeMNxg_to_mk7AAAAA?rs=1&pid=ImgDetMain",
        location: "Mumbai",
        title: "Mobile App Developer",
        skills: ["React Native", "iOS", "Android"],
        lpa: "8-12",
        posted: "5 days ago"
    },
    {
        id: 'job14',
        company: "BlockTech",
        logo: "https://cdn.dribbble.com/users/1307817/screenshots/20143792/blocktech_4x.png",
        location: "Delhi",
        title: "Blockchain Developer",
        skills: ["Solidity", "Web3.js", "Smart Contracts"],
        lpa: "15-20",
        posted: "1 week ago"
    }
];

async function fetchJobListings() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com',
            'x-rapidapi-key': '72475b37acmshcb4e698203e7fafp141765jsnb4020fbf9ac8'
        },
        body: JSON.stringify({
            keyword: document.getElementById('search').value || "",
            sortBy: "date_posted",
            page: 1
        })
    };

    try {
        const response = await fetch('https://linkedin-data-api.p.rapidapi.com/search-posts', options);
        const data = await response.json();

        console.log("API Response:", data); // Debugging check

        if (data.jobs && Array.isArray(data.jobs)) {
            // Filter out jobs where the logo is missing or empty
            const validJobs = data.jobs.filter(job => job.logo && job.logo.trim() !== "");

            // Remove the first two jobs and return the rest
            return validJobs.slice(2); 
        }

        return [];
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}

// Function to generate a unique job ID
function generateJobId(job) {
    return `${job.company}-${job.title}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Function to check if a job is saved
function isSavedJob(jobId) {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    return savedJobs.some(job => job.id === jobId);
}

// Function to handle saving jobs
function saveJob(jobId) {
    if (!localStorage.getItem('loggedIn')) {
        showNotification('Please login to save jobs', 'error');
        return;
    }

    const job = allJobListings.find(j => j.id === jobId);
    if (!job) {
        showNotification('Job not found', 'error');
        return;
    }

    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isJobSaved = savedJobs.some(savedJob => savedJob.id === jobId);

    if (isJobSaved) {
        // Remove job from saved jobs
        savedJobs = savedJobs.filter(savedJob => savedJob.id !== jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));

        // Update UI
        const saveBtn = document.querySelector(`button[onclick="saveJob('${jobId}')"]`);
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Save Job';
            saveBtn.classList.remove('saved');
        }

        showNotification('Job removed from saved jobs', 'success');
    } else {
        // Add job to saved jobs
        savedJobs.push({
            id: jobId,
            title: job.title,
            company: job.company,
            logo: job.logo,
            location: job.location,
            skills: job.skills,
            lpa: job.lpa,
            posted: job.posted
        });
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));

        // Update UI
        const saveBtn = document.querySelector(`button[onclick="saveJob('${jobId}')"]`);
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            saveBtn.classList.add('saved');
        }

        showNotification('Job saved successfully', 'success');
    }
}

// Update the createJobCard function to use the new generateJobId
function createJobCard(job) {
    const jobId = generateJobId(job);
    const isSaved = isSavedJob(jobId);
    
    const card = document.createElement('div');
    card.className = 'job-card';
    card.setAttribute('data-job-id', jobId);

    card.innerHTML = `
        <div class="company-logo">
            <img src="${job.logo}" alt="${job.company} logo">
        </div>
        <div class="job-info">
            <h3>${job.title}</h3>
            <p class="company-name">${job.company}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
            <div class="skills">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="meta-info">
                <span><i class="fas fa-money-bill-wave"></i> ${job.lpa}</span>
                <span><i class="fas fa-clock"></i> ${job.posted}</span>
            </div>
            <div class="job-actions">
                <button class="check-details-btn" onclick="openJobModal('${jobId}')">
                    <i class="fas fa-info-circle"></i> Check Details
                </button>
                <button class="apply-btn" onclick="applyForJob('${jobId}')">
                    <i class="fas fa-paper-plane"></i> Apply Now
                </button>
                <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="saveJob('${jobId}')">
                    <i class="fa${isSaved ? 's' : 'r'} fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save Job'}
                </button>
            </div>
        </div>
    `;

    // Add posted date as dataset
    card.dataset.postedDate = job.postedDate || new Date().toISOString();
    
    // Add loading animation
    card.classList.add('loading');
    setTimeout(() => {
        card.classList.remove('loading');
    }, 1000);
    
    return card;
}

function openJobModal(jobId) {
    const job = allJobListings.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.getElementById('jobModal');
    const modalContent = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <div class="company-logo">
                    <img src="${job.logo}" alt="${job.company} logo">
                </div>
                <div>
                    <h2>${job.title}</h2>
                    <h3>${job.company}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                </div>
            </div>
            <div class="job-info">
                <div class="info-item">
                    <h4><i class="fas fa-money-bill-wave"></i> Package</h4>
                    <p>${job.lpa} LPA</p>
                </div>
                <div class="info-item">
                    <h4><i class="fas fa-briefcase"></i> Experience</h4>
                    <p>Entry Level</p>
                </div>
                <div class="info-item">
                    <h4><i class="fas fa-clock"></i> Posted</h4>
                    <p>${job.posted}</p>
                </div>
            </div>
            <div class="required-skills">
                <h4><i class="fas fa-tools"></i> Required Skills</h4>
                <div class="skills">
                    ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="job-description">
                <h4><i class="fas fa-file-alt"></i> Job Description</h4>
                <ul>
                    <li>Write clean and maintainable code</li>
                    <li>Collaborate with team members</li>
                    <li>Participate in code reviews</li>
                    <li>Debug and fix issues</li>
                    <li>Learn and implement best practices</li>
                </ul>
            </div>
            <div class="modal-actions">
                <button class="apply-btn" onclick="applyForJob('${jobId}')">
                    <i class="fas fa-paper-plane"></i> Apply Now
                </button>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    modal.style.display = 'block';

    // Close modal when clicking the close button or outside
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function setupModalListeners() {
    const modal = document.getElementById('jobModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Close modal when clicking the close button
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
    
    // Handle apply button click
    document.getElementById('modal-apply-btn').onclick = function() {
        const jobId = document.querySelector('.job-card[data-selected="true"]')?.dataset.jobId;
        if (!jobId) return;
        
        if (!checkProfileCompletion()) {
            alert('Please complete your profile before applying.');
            return;
        }
        
        const job = allJobListings.find(j => j.id === jobId);
        if (!job) return;
        
        // Add to applications
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        if (!applications.some(app => app.jobId === jobId)) {
            applications.push({
                jobId,
                jobTitle: job.title,
                companyName: job.company,
                companyLogo: job.logo,
                location: job.location,
                package: job.lpa,
                status: 'pending',
                appliedDate: new Date().toISOString()
            });
            localStorage.setItem('applications', JSON.stringify(applications));
            alert('Application submitted successfully!');
            modal.style.display = 'none';
        } else {
            alert('You have already applied to this job.');
        }
    }
}

// Update the filterJobs function to use the new generateJobId
function filterJobs() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const locationFilter = document.getElementById('location-filter').value.toLowerCase();
    const jobsContainer = document.getElementById('jobs-container');
    
    if (!jobsContainer) return;
    
    jobsContainer.innerHTML = '';

    const filteredJobs = allJobListings.filter(job => {
        const matchesSearch = searchInput === '' || 
            job.title.toLowerCase().includes(searchInput) ||
            job.company.toLowerCase().includes(searchInput) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchInput));
            
        const matchesLocation = locationFilter === 'all' || 
            job.location.toLowerCase().includes(locationFilter);

        return matchesSearch && matchesLocation;
    });

    if (filteredJobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="no-jobs-found">
                <i class="fas fa-search"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    // Use the same card creation logic as loadJobs
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === currentUser);
    const savedJobIds = user?.savedJobs?.map(job => job.id) || [];

    filteredJobs.forEach(job => {
        const isSaved = savedJobIds.includes(job.id);
        const hasApplied = user?.applications?.some(app => app.jobId === job.id) || false;

        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="company-logo">
                <img src="${job.logo}" alt="${job.company} logo" onerror="this.src='https://via.placeholder.com/100x100?text=${job.company[0]}'">
            </div>
            <div class="job-info">
                <h3>${job.title}</h3>
                <div class="company-name">${job.company}</div>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-money-bill-wave"></i> ${job.lpa} LPA</span>
                    <span><i class="fas fa-clock"></i> Posted ${job.posted}</span>
                </div>
                <div class="skills-list">
                    ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn details-btn" onclick="openJobModal('${job.id}')">
                    <i class="fas fa-info-circle"></i>
                    Check Details
                </button>
                <button class="action-btn ${hasApplied ? 'applied' : 'apply-btn'}" 
                        onclick="applyForJob('${job.id}')"
                        ${hasApplied ? 'disabled' : ''}>
                    <i class="fas fa-${hasApplied ? 'check' : 'paper-plane'}"></i>
                    ${hasApplied ? 'Applied' : 'Apply Now'}
                </button>
            </div>
        `;
        jobsContainer.appendChild(jobCard);
        
        setTimeout(() => {
            jobCard.classList.add('show');
        }, 100);
    });
}

// Set up event listeners for search and filter
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const locationFilter = document.getElementById('location-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            filterJobs();
        }, 300));
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('change', filterJobs);
    }
});

// Utility function to debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add this after your loadJobs function
function makeCardsReady() {
    const cards = document.querySelectorAll('.job-card');
    // Add a small delay before adding the ready class
    setTimeout(() => {
        cards.forEach(card => card.classList.add('ready'));
    }, 100);
}

// Function to check if user can apply
function canUserApply() {
    if (!localStorage.getItem('loggedIn')) {
        showNotification('Please log in to apply for jobs', 'error');
        return false;
    }

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (!userProfile.hasResume) {
        showNotification('Please upload your resume in your profile before applying', 'error');
        return false;
    }

    return true;
}

// Function to load jobs
function loadJobs() {
    console.log('Loading jobs...'); // Debug log
    const jobsContainer = document.getElementById('jobs-container');
    
    if (!jobsContainer) {
        console.error('Jobs container not found');
        return;
    }

    // Get existing applications to check applied status
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');

    // Clear existing content
    jobsContainer.innerHTML = '';

    // Loop through all jobs and create cards
    allJobListings.forEach(job => {
        const hasApplied = applications.some(app => app.jobId === job.id);
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        jobCard.innerHTML = `
            <div class="company-logo">
                <img src="${job.logo}" alt="${job.company} logo" onerror="this.src='https://via.placeholder.com/100x100?text=${job.company[0]}'">
            </div>
            <div class="job-info">
                <h3>${job.title}</h3>
                <div class="company-name">${job.company}</div>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-money-bill-wave"></i> ${job.lpa} LPA</span>
                </div>
                <div class="skills-list">
                    ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="action-buttons">
                    <button onclick="openJobModal('${job.id}')" class="action-btn details-btn">
                        <i class="fas fa-info-circle"></i> Check Details
                    </button>
                    <button onclick="applyForJob('${job.id}')" 
                            class="action-btn apply-btn ${hasApplied ? 'applied' : ''}"
                            ${hasApplied ? 'disabled' : ''}>
                        <i class="fas fa-${hasApplied ? 'check' : 'paper-plane'}"></i>
                        ${hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                </div>
            </div>
        `;
        
        jobsContainer.appendChild(jobCard);
    });
}

// Update styles for job cards
const styles = document.createElement('style');
styles.textContent = `
    #jobs-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .job-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.2s;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .job-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .company-logo {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        background: #f8f9fa;
        margin-bottom: 15px;
    }

    .company-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 8px;
    }

    .job-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .job-info h3 {
        margin: 0;
        color: #333;
        font-size: 18px;
        line-height: 1.4;
    }

    .company-name {
        color: #666;
        font-weight: 500;
        margin: 0;
    }

    .job-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        color: #666;
        margin: 10px 0;
    }

    .job-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
    }

    .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0;
    }

    .skill-tag {
        background: #f0f0f0;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 13px;
        color: #666;
    }

    .action-buttons {
        display: flex;
        gap: 10px;
        margin-top: auto;
        padding-top: 15px;
    }

    .action-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        transition: all 0.2s;
        flex: 1;
    }

    .details-btn {
        background: #f0f0f0;
        color: #333;
    }

    .apply-btn {
        background: #ff6600;
        color: white;
    }

    .action-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    @media (max-width: 768px) {
        #jobs-container {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(styles);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...'); // Debug log
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    loadJobs();
});

// Add styles for applied button state
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .action-btn.applied {
        background-color: #e0e0e0 !important;
        color: #666 !important;
        cursor: default !important;
    }

    .action-btn.applied:hover {
        opacity: 1;
        transform: none;
    }
`;
document.head.appendChild(additionalStyles);

// Function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 4px;
                color: white;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1000;
                animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
            }
            
            .notification.success {
                background-color: #4caf50;
            }
            
            .notification.error {
                background-color: #f44336;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add loading state to job cards
function showLoadingState(jobCard) {
    jobCard.classList.add('loading');
    setTimeout(() => {
        jobCard.classList.remove('loading');
    }, 1000);
}

// Enhance the apply button click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('apply-btn')) {
        const jobCard = e.target.closest('.job-card');
        if (jobCard) {
            showLoadingState(jobCard);
        }
    }
});

// Add smooth scroll when filtering
document.querySelector('#location-filter').addEventListener('change', function() {
    document.querySelector('#jobs-container').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#experience-filter').addEventListener('change', function() {
    document.querySelector('#jobs-container').scrollIntoView({ behavior: 'smooth' });
});

// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
});

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Profile completion progress bar
function addProfileProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'profile-progress';
    
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const totalFields = 5; // Total number of profile fields
    const completedFields = Math.min(Object.keys(userProfile).length, totalFields); // Cap at total fields
    const percentage = Math.min(Math.round((completedFields / totalFields) * 100), 100); // Cap at 100%
    
    progressContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Profile Completion</span>
            <span>${percentage}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
    `;
    
    document.body.appendChild(progressContainer);
}

// Mark new jobs (posted within last 24 hours)
function markNewJobs() {
    const jobCards = document.querySelectorAll('.job-card');
    const now = new Date();
    
    jobCards.forEach(card => {
        const postedDate = new Date(card.dataset.postedDate);
        const hoursDiff = (now - postedDate) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            card.setAttribute('data-new', 'true');
        }
    });
}

// Initialize new features
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...
    
    addProfileProgress();
    markNewJobs();
    
    // Add smooth scroll for filter changes
    const filters = document.querySelectorAll('select, #search');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            document.querySelector('#jobs-container').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}); 