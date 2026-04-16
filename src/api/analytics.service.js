import client from './client';

export const analyticsService = {
  // Only these 2 endpoints exist in the backend
  getStats: () => client.get('/analytics/stats'),
  byCounty: () => client.get('/analytics/by-county'),
};
