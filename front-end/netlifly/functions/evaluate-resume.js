const axios = require('axios');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    try {
        const { resume, jobDescription } = JSON.parse(event.body);

        if (!resume || !jobDescription) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Resume and job description are required' })
            };
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

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to evaluate resume' })
        };
    }
}; 