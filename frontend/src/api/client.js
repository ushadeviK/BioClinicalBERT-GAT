import axios from 'axios';
import { env } from '../config/env';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Response interceptor for generic error parsing
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error responses to avoid raw axios messages in components
    const errorDetails = {
      status: error.response?.status || 500,
      message: 'Unable to complete the request.',
      data: error.response?.data || null,
      isNetworkError: !error.response
    };

    if (errorDetails.status === 404) {
      errorDetails.message = 'The requested resource was not found.';
    } else if (errorDetails.status === 429) {
      errorDetails.message = 'Too many requests. Please slow down and try again.';
    } else if (errorDetails.status === 503) {
      errorDetails.message = 'The prediction service is temporarily overloaded or offline.';
    } else if (errorDetails.isNetworkError) {
      errorDetails.message = 'Network error. The backend server appears to be offline.';
    } else if (error.response?.data?.detail) {
      // Clean backend messages if provided
      errorDetails.message = error.response.data.detail;
    }

    return Promise.reject(errorDetails);
  }
);
