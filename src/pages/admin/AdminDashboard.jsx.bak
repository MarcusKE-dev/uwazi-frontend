import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService }     from '../../api/admin.service';
import { analyticsService } from '../../api/analytics.service';
import { casesService }     from '../../api/cases.service';
import { StatusBadge, RoleBadge } from '../../components/ui/Badge';
import Spinner    from '../../components/ui/Spinner';
import { fmtDateTime } from '../../utils/formatDate';
import { toast }   from '../../store/notificationStore';
import { formatKES } from '../../utils/formatKES';

const TABS = ['Cases', 'Users', 'Audit Log'];
const ROLES = ['citizen', 'reviewer', 'admin', 'super_admin'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Cases');
  const queryClient   = useQueryClient();

  // Stats from /analytics/stats (correct — no /admin/stats endpoint)
  const { data: statsRes } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn:  analyticsService.getStats,
  });

  // Cases via public /cases (no /admin/cases endpoint)
  const { data: casesRes, isLoading: casesLoading } = useQuery({
    queryKey: ['cases', { limit: 50 }],
    queryFn:  () => casesService.getAll({ limit: 50 }),
  });

  // Users via /admin/users
  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn:  adminService.getUsers,
  });

  // Audit log via /admin/audit-log
  const { data: auditRes, isLoading: auditLoading } = useQuery({
    queryKey: ['audit-log'],
    queryFn:  adminService.getAuditLog,
  });

  // Role change mutation (super_admin only)
  const roleChange = useMutation({
    mutationFn: ({ id, role }) => adminService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Role updated');
    },
    onError: (err) => toast.error(err?.message ?? 'Update failed'),
  });

  const stats    = statsRes?.data;
  const cases    = casesRes?.data?.cases ?? [];
  const users    = usersRes?.data?.users ?? [];
  const auditLog = auditRes?.data?.logs  ?? [];

  const cellCls = "px-4 py-3 text-sm text-slate-700 dark:text-blue-200";
  const thCls   = "px-4 py-3 text-xs font-bold text-white bg-uwazi-navy text-left";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
      </div>

      {/* Stats summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Total Cases',  stats.total_cases],
            ['Under Review', stats.under_review],
            ['Escalated',    stats.escalated],
            ['Resolved',     stats.resolved_cases],
          ].map(([label, val]) => (
            <div key={label} className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{val ?? '—'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-blue-900/50 flex gap-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-uwazi-sky text-uwazi-sky'
                : 'border-transparent text-slate-500 dark:text-blue-400 hover:text-slate-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Cases tab */}
      {tab === 'Cases' && (casesLoading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-blue-900/50">
          <table className="w-full text-sm">
            <thead><tr>
              {['Code','Title','Category','Status','County','Amount','Filed'].map((h) => (
                <th key={h} className={thCls}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 dark:border-blue-900/20 hover:bg-slate-50 dark:hover:bg-uwazi-mid/30">
                  <td className={`${cellCls} font-mono text-xs`}>{c.tracking_code}</td>
                  <td className={cellCls}><p className="max-w-xs truncate">{c.title}</p></td>
                  <td className={`${cellCls} capitalize`}>{c.category}</td>
                  <td className={cellCls}><StatusBadge status={c.status} /></td>
                  <td className={cellCls}>{c.county ?? '—'}</td>
                  <td className={cellCls}>{c.estimated_amount_kes ? formatKES(c.estimated_amount_kes) : '—'}</td>
                  <td className={`${cellCls} text-xs`}>{fmtDateTime(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!cases.length && <p className="text-center text-slate-400 py-8 text-sm">No cases yet</p>}
        </div>
      ))}

      {/* Users tab */}
      {tab === 'Users' && (usersLoading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-blue-900/50">
          <table className="w-full text-sm">
            <thead><tr>
              {['Name','Email','Role','Joined','Change Role'].map((h) => (
                <th key={h} className={thCls}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 dark:border-blue-900/20 hover:bg-slate-50 dark:hover:bg-uwazi-mid/30">
                  <td className={cellCls}>{u.full_name}</td>
                  <td className={cellCls}>{u.email}</td>
                  <td className={cellCls}><RoleBadge role={u.role} /></td>
                  <td className={`${cellCls} text-xs`}>{fmtDateTime(u.created_at)}</td>
                  <td className={cellCls}>
                    <select defaultValue={u.role}
                      onChange={(e) => roleChange.mutate({ id: u.id, role: e.target.value })}
                      className="text-xs border border-slate-200 dark:border-blue-900/50 rounded-lg px-2 py-1 bg-white dark:bg-uwazi-dark outline-none">
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && <p className="text-center text-slate-400 py-8 text-sm">No users yet</p>}
        </div>
      ))}

      {/* Audit Log tab */}
      {tab === 'Audit Log' && (auditLoading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-blue-900/50">
          <table className="w-full text-sm">
            <thead><tr>
              {['Time','Action','Role','IP','Resource','Status'].map((h) => (
                <th key={h} className={thCls}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {auditLog.map((log) => (
                <tr key={log.id} className="border-t border-slate-100 dark:border-blue-900/20 hover:bg-slate-50 dark:hover:bg-uwazi-mid/30">
                  <td className={`${cellCls} text-xs font-mono`}>{fmtDateTime(log.created_at)}</td>
                  <td className={`${cellCls} font-mono text-xs`}>{log.action}</td>
                  <td className={`${cellCls} capitalize text-xs`}>{log.actor_role ?? '—'}</td>
                  <td className={`${cellCls} text-xs font-mono`}>{log.actor_ip}</td>
                  <td className={`${cellCls} text-xs`}>{log.resource_type ?? '—'}</td>
                  <td className={cellCls}>
                    <span className={`text-xs font-semibold ${log.success ? 'text-green-600' : 'text-red-600'}`}>
                      {log.success ? '✓ OK' : '✗ Fail'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!auditLog.length && <p className="text-center text-slate-400 py-8 text-sm">No audit logs yet</p>}
        </div>
      ))}
    </div>
  );
}
