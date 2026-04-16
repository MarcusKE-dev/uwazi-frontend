import client from './client';

export const evidenceService = {
  // POST /evidence/:caseId — multer expects field named "file"
  // caseId is a URL parameter (NOT a FormData field)
  upload: (caseId, file, description = '') => {
    const form = new FormData();
    form.append('file', file);               // ← field name must be "file"
    if (description) form.append('description', description);
    // caseId goes in the URL path — NOT as a FormData field
    return client.post(`/evidence/${caseId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // GET /evidence/:caseId → payload: { evidence: [..., download_url] }
  getByCase: (caseId) => client.get(`/evidence/${caseId}`),

  // NOTE: verify and delete evidence endpoints are NOT in the MVP backend.
}