// Configuration file for API URL
// In development, it defaults to localhost. 
// In production (Vercel), it uses the URL set in the Vercel Dashboard Environment Variables.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
