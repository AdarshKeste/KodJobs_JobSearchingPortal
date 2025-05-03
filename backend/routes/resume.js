const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Resume evaluation endpoint
router.post('/evaluate', async (req, res) => {
    try {
        const { resume, jobDescription } = req.body;
        
        if (!resume || !jobDescription) {
            return res.status(400).json({ error: 'Resume and job description are required' });
        }

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            {
                contents: [{
                    parts: [{
                        text: `You are a resume evaluator. Here is a candidate's resume:
${resume}

Here is the job description:
${jobDescription}

Evaluate how well the resume matches the job. Highlight missing skills, technologies, or experience. Provide suggestions to improve the resume to better fit the job.`
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_API_KEY
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error evaluating resume:', error);
        res.status(500).json({ error: 'Failed to evaluate resume' });
    }
});

module.exports = router; 