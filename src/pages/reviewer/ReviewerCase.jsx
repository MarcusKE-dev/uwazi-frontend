import { useState }        from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewerService }  from '../../api/reviewer.service';
import { StatusBadge }     from '../../components/ui/Badge';
import Spinner             from '../../components/ui/Spinner';
import { fmtDateTime }     from '../../utils/formatDate';
import { formatKES }       from '../../utils/formatKES';
import { toast }           from '../../store/notificationStore';

const ACTIONS = [
  { status: 'under_review', label: 'Under Review',  cls: 'bg-amber-500 hover:bg-amber-600' },
  { status: 'flagged',      label: 'Flag as Fraud', cls: 'bg-orange-600 hover:bg-orange-700' },
  { status: 'escalated',    label: 'Escalate to EACC', cls: 'bg-red-600 hover:bg-red-700' },
  { status: 'resolved',     label: 'Mark Resolved', cls: 'bg-green-600 hover:bg-green-700' },
  { status: 'dismissed',    label: 'Dismiss',       cls: 'bg-slate-500 hover:bg-slate-600' },
];

export default function ReviewerCase() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const queryClient   = useQueryClient();
  const [notes, setNotes] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['reviewer-case', id],
    queryFn:  () => reviewerService.getCaseDetail(id),
  });

  const mutation = useMutation({
    mutationFn: ({ status, notes }) =>
      reviewerService.updateStatus(id, status, notes),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['reviewer-case', id] });
      queryClient.invalidateQueries({ queryKey: ['reviewer-queue'] });
      toast.success(`Status updated to "${status.replace(/_/g, ' ')}". Citizen notified.`);
      setNotes('');
    },
    onError: (err) =>
      toast.error(typeof err === 'string' ? err : err?.message ?? 'Update failed'),
  });

  const handleUpdate = (status) => {
    if (!window.confirm(
      `Set status to "${status.replace(/_/g, ' ')}"?\n\nThis is recorded in the audit trail and the citizen will be notified by email.`
    )) return;
    mutation.mutate({ status, notes });
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
        ⚠ {typeof error === 'string' ? error : error?.message ?? 'Failed to load case'}
      </div>
    </div>
  );

  const c = data?.data;
  if (!c) return null;

  const thCls   = 'px-4 py-3 text-xs font-bold text-white bg-uwazi-navy text-left';
  const cellCls = 'px-4 py-3 text-sm text-slate-700 dark:text-blue-200';

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/reviewer')}
        className="text-sm text-slate-500 dark:text-blue-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors"
      >
        ← Back to Queue
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {c.tracking_code}
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {c.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-blue-400 mt-1">
            Submitted by {c.submitted_by ?? 'Anonymous'} · {fmtDateTime(c.created_at)}
          </p>
        </div>
        <StatusBadge status={c.status} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['Ministry',         c.ministry],
          ['Amount involved',  c.amount_involved ? formatKES(c.amount_involved) : null],
          ['Reviewer',         c.reviewer_name],
          ['Assigned',         c.assigned_at ? fmtDateTime(c.assigned_at) : null],
        ].map(([label, val]) => (
          <div key={label}
            className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {val ?? <span className="text-slate-300 font-normal">—</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Description */}
      {c.description && (
        <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
            Description
          </h3>
          <p className="text-sm text-slate-700 dark:text-blue-200 leading-relaxed">
            {c.description}
          </p>
        </div>
      )}

      {/* Evidence */}
      {c.evidence?.length > 0 && (
        <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
            Evidence ({c.evidence.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {c.evidence.map((ev) => (
              <a key={ev.id} href={ev.file_url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                📎 {ev.original_filename ?? 'View file'}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Case history */}
      {c.updates?.length > 0 && (
        <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl overflow-hidden">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-4 border-b border-slate-100 dark:border-blue-900/30">
            Case History
          </h3>
          {c.updates.map((u, i) => (
            <div key={i}
              className={`flex gap-4 px-5 py-4 text-sm ${
                i < c.updates.length - 1
                  ? 'border-b border-slate-100 dark:border-blue-900/20' : ''
              }`}>
              <div className="w-0.5 bg-slate-200 dark:bg-blue-900/40 self-stretch rounded-full flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-medium capitalize text-slate-800 dark:text-white">
                  {u.status?.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-slate-400 dark:text-blue-500 mt-0.5">
                  {u.updated_by_name ?? 'System'} · {fmtDateTime(u.created_at)}
                </p>
                {u.notes && (
                  <p className="text-slate-600 dark:text-blue-300 text-xs mt-1.5 leading-relaxed">
                    {u.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status update panel */}
      <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">
          Update Status
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add reviewer notes (optional — stored in case history and visible to citizen)…"
          rows={3}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-blue-900/50 rounded-lg bg-white dark:bg-uwazi-dark text-slate-700 dark:text-blue-200 placeholder-slate-400 dark:placeholder-blue-600 outline-none focus:ring-2 focus:ring-uwazi-sky/30 resize-y mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {ACTIONS.map((a) => {
            const isCurrent = c.status === a.status;
            return (
              <button
                key={a.status}
                onClick={() => handleUpdate(a.status)}
                disabled={mutation.isPending || isCurrent}
                className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors
                  ${isCurrent
                    ? 'bg-slate-200 dark:bg-blue-900/30 text-slate-400 dark:text-blue-600 cursor-not-allowed'
                    : `${a.cls} disabled:opacity-60 disabled:cursor-not-allowed`
                  }`}
              >
                {isCurrent ? `✓ ${a.label}` : a.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
