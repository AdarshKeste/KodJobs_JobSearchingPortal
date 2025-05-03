// Resume evaluation functionality
document.addEventListener('DOMContentLoaded', () => {
    const evaluateBtn = document.getElementById('evaluateResume');
    const modal = document.getElementById('evaluationModal');
    const closeModal = document.querySelector('.close-modal');
    const evaluationResult = document.getElementById('evaluationResult');

    // Gemini API configuration
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // Close modal when clicking the close button or outside the modal
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    evaluateBtn.addEventListener('click', async () => {
        try {
            // Show modal with loading state
            modal.style.display = 'block';
            evaluationResult.innerHTML = '<div class="loading">Evaluating your resume...</div>';

            // Get profile data from localStorage
            const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
            
            if (!profileData.resumeData) {
                throw new Error('Please upload your resume first');
            }

            // Get current job description from localStorage
            const currentJob = JSON.parse(localStorage.getItem('currentJob') || '{}');
            if (!currentJob.description) {
                throw new Error('Please select a job to evaluate your resume against');
            }

            // Call Netlify function instead of Gemini API directly
            const response = await fetch('/.netlify/functions/evaluate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resume: profileData.resumeData,
                    jobDescription: currentJob.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to evaluate resume');
            }

            const data = await response.json();
            
            // Display evaluation results
            evaluationResult.innerHTML = `
                <h3>Evaluation Results:</h3>
                <div class="evaluation-text">${data.candidates[0].content.parts[0].text}</div>
            `;
        } catch (error) {
            evaluationResult.innerHTML = `
                <div class="error-message">
                    ${error.message || 'An error occurred during evaluation'}
                </div>
            `;
        }
    });
});

// Function to evaluate resume
async function evaluateResume(resume, jobDescription) {
    try {
        // Call Netlify function instead of Gemini API directly
        const response = await fetch('/.netlify/functions/evaluate-resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resume,
                jobDescription
            })
        });

        if (!response.ok) {
            throw new Error('Failed to evaluate resume');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error evaluating resume:', error);
        throw error;
    }
} 