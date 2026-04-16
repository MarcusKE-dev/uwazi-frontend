import client from './client';

export const adminService = {
  // GET /admin/users → payload: { users: [{id, email, full_name, role, created_at}] } — admin+
  getUsers:   () => client.get('/admin/users'),

  // PATCH /admin/users/:id/role → payload: { user: {id, email, role} } — super_admin only
  updateRole: (id, role) => client.patch(`/admin/users/${id}/role`, { role }),

  // GET /admin/audit-log → payload: { logs: [{id, actor_id, actor_ip, action, ...}] } — admin+
  getAuditLog: () => client.get('/admin/audit-log'),

  // NOTE: /admin/cases, /admin/stats, /admin/cases/:id/assign do NOT exist.
  // Use GET /cases (public) for listing cases in the admin panel.
};