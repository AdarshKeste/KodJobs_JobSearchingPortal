const API_URL = 'http://localhost:5000/api';

// API endpoints
const ENDPOINTS = {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    UPDATE_PROFILE: `${API_URL}/auth/profile`,
};

// Export the configuration
window.CONFIG = {
    API_URL,
    ENDPOINTS
}; 