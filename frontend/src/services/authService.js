import api from './api.js';

// Authentication service for handling login and registration
export const authService = {
  // User login
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  // User registration
  signup: (name, email, password) => 
    api.post('/auth/register', { name, email, password })
};