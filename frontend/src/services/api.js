import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Applications
export const createApplication = (data) => api.post('/apply', data);
export const getApplications = () => api.get('/apply');

// Auth
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const getUsers = () => api.get('/auth/users');

// Loan Calculation
export const calculateLoan = (principal, interestRate, tenureWeeks) => 
  api.get(`/loans/calculate?principal=${principal}&interestRate=${interestRate}&tenureWeeks=${tenureWeeks}`);

// Loan Management
export const getLoans = () => api.get('/loans');
export const getLoanById = (id) => api.get(`/loans/${id}`);
export const updateLoan = (id, data) => api.patch(`/loans/${id}`, data);
export const deleteLoan = (id) => api.delete(`/loans/${id}`);

export const createLoan = (data) => api.post('/loans', data); // New function for admin to create loans

export default api;