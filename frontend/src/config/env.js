/**
 * Environment configuration helper to fetch config values
 * with robust defaults.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
};
