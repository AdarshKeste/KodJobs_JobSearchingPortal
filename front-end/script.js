// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordLink = document.getElementById('forgotPassword');

// Form Validation and Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    try {
        // Show loading state
        const submitBtn = loginForm.querySelector('.submit-btn');
        submitBtn.innerHTML = 'Logging in...';
        submitBtn.disabled = true;

        // Simulate API call (replace with your actual API endpoint)
        const response = await loginUser(username, password);
        
        if (response.success) {
            showNotification('Login successful!', 'success');
            // Redirect to dashboard after successful login
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            showNotification(response.message || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('An error occurred', 'error');
    } finally {
        // Reset button state
        const submitBtn = loginForm.querySelector('.submit-btn');
        submitBtn.innerHTML = 'Login';
        submitBtn.disabled = false;
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const email = document.getElementById('signupEmail').value.trim();

    if (!username || !password || !email) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    try {
        // Show loading state
        const submitBtn = signupForm.querySelector('.submit-btn');
        submitBtn.innerHTML = 'Creating Account...';
        submitBtn.disabled = true;

        // Simulate API call (replace with your actual API endpoint)
        const response = await registerUser(username, email, password);
        
        if (response.success) {
            showNotification('Account created successfully!', 'success');
            // Clear form
            signupForm.reset();
            // Focus on login form
            document.getElementById('loginUsername').focus();
        } else {
            showNotification(response.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showNotification('An error occurred', 'error');
    } finally {
        // Reset button state
        const submitBtn = signupForm.querySelector('.submit-btn');
        submitBtn.innerHTML = 'Sign Up';
        submitBtn.disabled = false;
    }
});

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Please enter your email address:');
    
    if (email && isValidEmail(email)) {
        // Simulate password reset email (replace with your actual implementation)
        showNotification('Password reset link sent to your email', 'success');
    } else if (email) {
        showNotification('Please enter a valid email address', 'error');
    }
});

// Helper Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// API Functions (replace these with your actual API calls)
async function loginUser(username, password) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Replace with actual API logic
            if (username && password) {
                resolve({ success: true });
            } else {
                resolve({ success: false, message: 'Invalid credentials' });
            }
        }, 1000);
    });
}

async function registerUser(username, email, password) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Replace with actual API logic
            if (username && email && password) {
                resolve({ success: true });
            } else {
                resolve({ success: false, message: 'Registration failed' });
            }
        }, 1000);
    });
}

// Add floating label animation
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Clear any previously stored skills when the page loads
localStorage.removeItem('userSkills');

// Initialize skills array
let skills = [];

// Function to add skill
function addSkill(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const skillInput = document.getElementById('skillInput');
        const skill = skillInput.value.trim();
        
        if (skill && !skills.includes(skill)) {
            // Add to skills array
            skills.push(skill);
            
            // Create skill tag
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                ${skill}
                <span class="close-btn" onclick="removeSkill('${skill}')">&times;</span>
            `;
            
            // Add to skills container
            document.getElementById('skillsContainer').appendChild(skillTag);
            
            // Clear input
            skillInput.value = '';
            
            // Save to localStorage
            localStorage.setItem('userSkills', JSON.stringify(skills));
        }
    }
}

// Function to remove skill
function removeSkill(skill) {
    // Remove from array
    skills = skills.filter(s => s !== skill);
    
    // Remove from DOM
    const skillsContainer = document.getElementById('skillsContainer');
    const skillTags = skillsContainer.getElementsByClassName('skill-tag');
    for (let tag of skillTags) {
        if (tag.textContent.trim() === skill) {
            tag.remove();
            break;
        }
    }
    
    // Update localStorage
    localStorage.setItem('userSkills', JSON.stringify(skills));
}

// Add event listener to skill input
document.getElementById('skillInput').addEventListener('keypress', addSkill);

// Initialize skills container
document.addEventListener('DOMContentLoaded', () => {
    // Clear any previously stored skills
    localStorage.removeItem('userSkills');
    skills = [];
    const skillsContainer = document.getElementById('skillsContainer');
    if (skillsContainer) {
        skillsContainer.innerHTML = '';
    }
}); 