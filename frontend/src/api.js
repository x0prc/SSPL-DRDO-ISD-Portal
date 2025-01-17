import React, { useEffect, useState } from 'react';
import api from '../api'; // Import the API instance

import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:5500', // Base URL for the API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Assuming you store the token in local storage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Export the Axios instance
export default api;
