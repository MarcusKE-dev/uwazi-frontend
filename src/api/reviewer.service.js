import client from './client';

export const reviewerService = {
  // GET /api/v1/reviewer/queue
  getQueue: () =>
    client.get('/reviewer/queue'),

  // GET /api/v1/reviewer/cases/:id
  getCaseDetail: (id) =>
    client.get(`/reviewer/cases/${id}`),

  // PATCH /api/v1/reviewer/cases/:id/status
  updateStatus: (id, status, notes) =>
    client.patch(`/reviewer/cases/${id}/status`, { status, notes }),
};
