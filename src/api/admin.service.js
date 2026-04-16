import client from './client';

export const adminService = {
  getUsers:    ()            => client.get('/admin/users'),
  updateRole:  (id, role)    => client.patch(`/admin/users/${id}/role`, { role }),
  getAuditLog: (params)      => client.get('/admin/audit-log', { params }),
};
