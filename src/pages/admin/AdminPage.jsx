import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';
import { casesService } from '../../api/cases.service';  // ← use GET /cases for case list

export default function AdminPage() {
  const [tab, setTab] = useState('cases');

  // Cases: use the public /cases endpoint (no /admin/cases exists)
  const { data: casesData }    = useQuery({ queryKey: ['cases'], queryFn: () => casesService.getAll({}) });

  // Users: GET /admin/users → payload: { users: [...] }
  const { data: usersData }    = useQuery({ queryKey: ['admin-users'],     queryFn: adminService.getUsers });

  // Audit log: GET /admin/audit-log → payload: { logs: [...] }
  const { data: auditData }    = useQuery({ queryKey: ['admin-audit-log'],  queryFn: adminService.getAuditLog });

  const qc = useQueryClient();
  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => adminService.updateRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold dark:text-white mb-6">Admin Panel</h1>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-6">
        {['cases', 'users', 'audit-log'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={tab === t ? 'btn-primary' : 'btn-secondary'}>
            {t.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {tab === 'cases'    && <CasesTable   cases={casesData?.cases || []}           />}
      {tab === 'users'    && <UsersTable   users={usersData?.users || []} onRoleChange={roleMutation.mutate} />}
      {tab === 'audit-log' && <AuditLogTable logs={auditData?.logs || []}            />}
    </div>
  );
}