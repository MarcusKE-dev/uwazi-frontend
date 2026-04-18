import { useQuery }       from '@tanstack/react-query';
import { Link }           from 'react-router-dom';
import { reviewerService } from '../../api/reviewer.service';
import { StatusBadge }    from '../../components/ui/Badge';
import Spinner            from '../../components/ui/Spinner';
import { fmtDateTime }    from '../../utils/formatDate';
import { formatKES }      from '../../utils/formatKES';

export default function ReviewerQueue() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reviewer-queue'],
    queryFn:  reviewerService.getQueue,
    refetchInterval: 60_000, // refresh every minute
  });

  const cases = data?.data?.cases ?? [];

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
        ⚠ {typeof error === 'string' ? error : error?.message ?? 'Failed to load queue'}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Reviewer Queue
        </h1>
        <p className="text-sm text-slate-500 dark:text-blue-400 mt-1">
          {cases.length === 0
            ? 'No cases assigned to you right now'
            : `${cases.length} case${cases.length !== 1 ? 's' : ''} assigned to you`}
        </p>
      </div>

      {/* Empty state */}
      {cases.length === 0 && (
        <div className="border-2 border-dashed border-slate-200 dark:border-blue-900/40 rounded-xl p-16 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-500 dark:text-blue-400 font-medium">Your queue is empty</p>
          <p className="text-slate-400 dark:text-blue-500 text-sm mt-1">
            New cases will appear here when assigned by an admin
          </p>
        </div>
      )}

      {/* Table */}
      {cases.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-blue-900/50">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Code', 'Title', 'Ministry', 'Amount', 'Status', 'Assigned', ''].map((h) => (
                  <th key={h}
                    className="px-4 py-3 text-xs font-bold text-white bg-uwazi-navy text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id}
                  className="border-t border-slate-100 dark:border-blue-900/20 hover:bg-slate-50 dark:hover:bg-uwazi-mid/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                    {c.tracking_code}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-blue-200 max-w-xs">
                    <p className="truncate">{c.title}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-blue-400 text-xs">
                    {c.ministry ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-blue-300 text-xs whitespace-nowrap">
                    {c.amount_involved ? formatKES(c.amount_involved) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                    {c.assigned_at ? fmtDateTime(c.assigned_at) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/reviewer/cases/${c.id}`}
                      className="inline-block px-3 py-1.5 bg-uwazi-navy hover:bg-uwazi-mid text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                    >
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
