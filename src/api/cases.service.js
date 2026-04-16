import client from './client';

export const casesService = {
  // GET /cases?page&limit&status&county&category → payload: { cases: [...] }
  getAll:       (params) => client.get('/cases', { params }),

  // GET /cases/:id → payload: { case: {...} }
  getById:      (id)     => client.get(`/cases/${id}`),

  // GET /cases/track/:code → payload: { case: {...} }
  track:        (code)   => client.get(`/cases/track/${code}`),

  // POST /cases → payload: { case: {...} } — requires auth
  submit:       (data)   => client.post('/cases', data),

  // PATCH /cases/:id/status → payload: { case: {...} } — reviewer+
  updateStatus: (id, status) => client.patch(`/cases/${id}/status`, { status }),

  // NOTE: DELETE /cases, POST /cases/:id/report, GET/POST /cases/:id/updates
  // are NOT in the MVP backend. Do not add them until the backend builds them.
};