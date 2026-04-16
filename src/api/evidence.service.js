import client from './client';

export const evidenceService = {
  // caseId in URL — matches POST /api/v1/evidence/:caseId
  upload: (caseId, file, description = '') => {
    const form = new FormData();
    form.append('file', file);
    if (description) form.append('description', description);
    return client.post(`/evidence/${caseId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getByCase: (caseId) => client.get(`/evidence/${caseId}`),
};
