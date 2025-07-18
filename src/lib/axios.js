'use client'

import axios from 'axios';

const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI4MWY5M2UxLTkzOWUtNGI3MS1hYmJkLTc4Y2UxZWZkYzQwNyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0OTc0NTU0NywiZXhwIjoxNzUwMzUwMzQ3fQ.eQiC1rYbKpo8UyVsZo9_78tvze6zzAkfAvS0syodmMU"

// Helper function to safely get token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token") || "";
  }
  return "";
};

export const apiClient = axios.create({
  baseURL: 'https://prompthkit.apprikart.com/api/v1/xplore',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiClientStudio = axios.create({
  baseURL: 'https://prompthkit.apprikart.com/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`
  }
});

export const apiClientWithAuth = axios.create({
  baseURL: 'https://prompthkit.apprikart.com/api/v1/xplore',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to add latest token before each request
apiClientWithAuth.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});