import { cn } from '../../utils/cn';
import { getStatusClass, STATUS_LABELS } from '../../utils/statusColors';

export function StatusBadge({ status }) {
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', getStatusClass(status))}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function RoleBadge({ role }) {
  const cls = {
    citizen:     'bg-slate-100 text-slate-700',
    reviewer:    'bg-blue-100  text-blue-700',
    admin:       'bg-purple-100 text-purple-700',
    super_admin: 'bg-red-100   text-red-700',
  }[role] ?? 'bg-slate-100 text-slate-700';
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize', cls)}>
      {role?.replace('_', ' ')}
    </span>
  );
}
