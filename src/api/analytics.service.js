import client from './client';

export const analyticsService = {
  // GET /analytics/stats → payload: { total_cases, resolved_cases, under_review, escalated, total_amount_kes }
  getStats:   () => client.get('/analytics/stats'),

  // GET /analytics/by-county → payload: { counties: [{county, case_count, total_amount_kes}] }
  getByCounty: () => client.get('/analytics/by-county'),

  // NOTE: /analytics/cases-by-category, /analytics/trend, /analytics/top-agencies,
  // /analytics/recovery-estimate do NOT exist in MVP. Add when backend builds them.
};