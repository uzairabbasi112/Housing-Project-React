
// services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Function to handle signup
export const signup = (data) => API.post('/auth/signup', data);

// Function to handle login
export const login = (data) => API.post('/auth/login', data);

export default API;