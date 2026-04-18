import client from './client';

export const adminService = {
  // ── Users ───────────────────────────────────────────────────────────
  getUsers:   ()             => client.get('/admin/users'),
  updateRole: (id, role)     => client.patch(`/admin/users/${id}/role`, { role }),

  // ── Audit log ────────────────────────────────────────────────────────
  getAuditLog: (params)      => client.get('/admin/audit-log', { params }),

  // ── Cases ─────────────────────────────────────────────────────────────
  getAllCases:     (params)   => client.get('/admin/cases', { params }),
  getUnassigned:  ()         => client.get('/admin/cases/unassigned'),
  assignCase:     (id, reviewer_id) =>
    client.post(`/admin/cases/${id}/assign`, { reviewer_id }),

  // ── Reviewers ─────────────────────────────────────────────────────────
  getReviewers:   ()         => client.get('/admin/reviewers'),

  // ── Stats ──────────────────────────────────────────────────────────────
  getStats:       ()         => client.get('/admin/stats'),
};
