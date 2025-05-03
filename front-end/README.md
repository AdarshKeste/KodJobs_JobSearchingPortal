# Job Portal with AI Resume Evaluation

A modern job portal website that uses AI to evaluate resumes against job descriptions. Built with HTML, CSS, JavaScript, and powered by Google's Gemini AI.

## Live Demo

Visit the live website: [Your Netlify URL will appear here after deployment]

## Features

- 🔍 Job Search and Filtering
- 📝 Resume Upload and Management
- 🤖 AI-Powered Resume Evaluation
- 💼 Job Application Tracking
- 👤 User Profile Management
- 💾 Local Storage for Data Persistence

## Quick Start

1. Visit the live website
2. Create an account or log in
3. Upload your resume in the profile section
4. Browse jobs and use the AI resume evaluation feature

## For Developers

### Local Development Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Install Netlify CLI (for local development):
```bash
npm install -g netlify-cli
```

4. Run the project locally:
```bash
netlify dev
```

5. Open `http://localhost:8888` in your browser

### Deployment

1. Fork this repository
2. Connect to Netlify
3. Add your Gemini API key in Netlify's environment variables
4. Deploy!

## Project Structure

```
project-root/
├── index.html          # Landing page
├── dashboard.html      # Job listings and search
├── profile.html        # User profile and resume upload
├── styles.css          # Main styles
├── script.js           # Main JavaScript
├── dashboard.js        # Dashboard functionality
├── profile.js          # Profile management
├── resume-evaluation.js # Resume evaluation logic
├── netlify/
│   └── functions/      # Serverless functions
│       └── evaluate-resume.js
└── README.md
```

## How It Works

1. **Job Search**
   - Browse available jobs
   - Filter by location, skills, etc.
   - View detailed job descriptions

2. **Resume Upload**
   - Upload your resume in the profile section
   - Resume is stored securely in local storage
   - Format: PDF or text

3. **AI Resume Evaluation**
   - Select a job to apply for
   - Click "Evaluate Resume"
   - AI analyzes your resume against job requirements
   - Get detailed feedback and suggestions

4. **Application Process**
   - Review AI evaluation
   - Submit application
   - Track application status

## Technologies Used

- HTML5, CSS3, JavaScript
- Google Gemini AI API
- Netlify (Hosting & Serverless Functions)
- Local Storage API

## Security

- API keys are stored securely in environment variables
- No sensitive data is exposed in the frontend code
- All API calls are made through secure serverless functions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or open an issue in the repository. 