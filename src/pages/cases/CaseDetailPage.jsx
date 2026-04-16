import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCase } from '../../hooks/useCases';
import { evidenceService } from '../../api/evidence.service';
import { casesService }    from '../../api/cases.service';
import { useAuthStore }    from '../../store/authStore';
import { StatusBadge }     from '../../components/ui/Badge';
import EvidenceUploader    from '../../components/ui/EvidenceUploader';
import Spinner             from '../../components/ui/Spinner';
import Alert               from '../../components/ui/Alert';
import { toast }           from '../../store/notificationStore';
import { formatKES }       from '../../utils/formatKES';
import { fmtDateTime }     from '../../utils/formatDate';

const REVIEWER_ROLES = ['reviewer', 'admin', 'super_admin'];
const STATUSES = ['submitted','under_review','escalated','resolved','closed'];

export default function CaseDetailPage() {
  const { id }         = useParams();
  const { user }       = useAuthStore();
  const queryClient    = useQueryClient();
  const canReview      = REVIEWER_ROLES.includes(user?.role);

  const { data: caseRes, isLoading, isError, error } = useCase(id);
  const { data: evRes, refetch: refetchEvidence } = useQuery({
    queryKey: ['evidence', id],
    queryFn:  () => evidenceService.getByCase(id),
    enabled:  !!id,
  });

  if (isLoading) return <Spinner />;
  if (isError)   return <Alert variant="error" message={error?.message ?? 'Case not found'} />;

  const c        = caseRes?.data?.case;
  const evidence = evRes?.data?.evidence ?? [];

  const handleStatusChange = async (newStatus) => {
    try {
      await casesService.updateStatus(id, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err?.message ?? 'Update failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{c?.title}</h1>
            <p className="text-xs text-slate-400 dark:text-blue-500 mt-1 font-mono">{c?.tracking_code}</p>
          </div>
          <StatusBadge status={c?.status} />
        </div>
        <p className="text-sm text-slate-600 dark:text-blue-200 mt-4 leading-relaxed">{c?.description}</p>
      </div>

      {/* Details */}
      <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
        <h2 className="text-sm font-bold text-slate-700 dark:text-uwazi-muted uppercase tracking-wide mb-4">Details</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
          {[
            ['Category',    c?.category],
            ['County',      c?.county],
            ['Agency',      c?.agency_involved],
            ['Officer',     c?.officer_name],
            ['Amount (KES)',c?.estimated_amount_kes ? formatKES(c.estimated_amount_kes) : null],
            ['Incident Date',c?.incident_date],
            ['Submitted',   fmtDateTime(c?.created_at)],
            ['Reviewer',    c?.reviewer_name],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-slate-400 dark:text-blue-500">{k}</dt>
              <dd className="text-sm text-slate-700 dark:text-blue-200 font-medium mt-0.5 capitalize">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Reviewer status change */}
      {canReview && (
        <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-700 dark:text-uwazi-muted uppercase tracking-wide mb-3">Update Status</h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.filter((s) => s !== c?.status).map((s) => (
              <button key={s} onClick={() => handleStatusChange(s)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-blue-900/50
                  text-slate-600 dark:text-blue-300 hover:bg-uwazi-sky hover:text-white hover:border-uwazi-sky transition-colors capitalize">
                → {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Evidence */}
      <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
        <h2 className="text-sm font-bold text-slate-700 dark:text-uwazi-muted uppercase tracking-wide mb-4">Evidence ({evidence.length})</h2>
        {evidence.length > 0 && (
          <div className="space-y-2 mb-4">
            {evidence.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-blue-900/30">
                <div>
                  <p className="text-sm text-slate-700 dark:text-blue-200">{ev.file_name}</p>
                  <p className="text-xs text-slate-400 dark:text-blue-500">{ev.file_type} · {fmtDateTime(ev.created_at)}</p>
                </div>
                <a href={ev.download_url} target="_blank" rel="noreferrer"
                  className="text-uwazi-sky text-xs font-semibold hover:underline">Download</a>
              </div>
            ))}
          </div>
        )}
        <EvidenceUploader caseId={id} onUploaded={() => refetchEvidence()} />
      </div>
    </div>
  );
}
