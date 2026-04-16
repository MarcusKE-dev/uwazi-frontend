import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import Spinner     from '../../components/ui/Spinner';
import EmptyState  from '../../components/ui/EmptyState';
import Alert       from '../../components/ui/Alert';
import { StatusBadge } from '../../components/ui/Badge';
import { fmtDate } from '../../utils/formatDate';
import { formatKES } from '../../utils/formatKES';
import { ROUTES } from '../../constants/routes';
import { COUNTIES } from '../../constants/counties';

const STATUSES = ['submitted','under_review','escalated','resolved','closed'];
const CATEGORIES = ['procurement','budget','salary','land','contracts','other'];

export default function CaseListPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 20 });

  const { data, isLoading, isError, error } = useCases(filters);

  if (isLoading) return <Spinner />;
  if (isError)   return <Alert variant="error" message={error?.message ?? 'Failed to load cases'} />;

  const cases = data?.data?.cases ?? [];

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val || undefined, page: 1 }));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cases</h1>
          <p className="text-sm text-slate-500 dark:text-uwazi-muted">{cases.length} results</p>
        </div>
        <Link to={ROUTES.SUBMIT_CASE}
          className="bg-uwazi-sky hover:bg-uwazi-blue text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Report Case
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select onChange={(e) => set('status', e.target.value)}
          className="text-sm border border-slate-200 dark:border-blue-900/50 rounded-lg px-3 py-2 bg-white dark:bg-uwazi-dark text-slate-700 dark:text-blue-200 outline-none">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
        <select onChange={(e) => set('category', e.target.value)}
          className="text-sm border border-slate-200 dark:border-blue-900/50 rounded-lg px-3 py-2 bg-white dark:bg-uwazi-dark text-slate-700 dark:text-blue-200 outline-none">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select onChange={(e) => set('county', e.target.value)}
          className="text-sm border border-slate-200 dark:border-blue-900/50 rounded-lg px-3 py-2 bg-white dark:bg-uwazi-dark text-slate-700 dark:text-blue-200 outline-none">
          <option value="">All Counties</option>
          {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Cases list */}
      {!cases.length ? (
        <EmptyState message="No cases match your filters" sub="Try adjusting the filters above" />
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <Link key={c.id} to={ROUTES.CASE_DETAIL(c.id)}
              className="block bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50
                rounded-xl p-5 hover:border-uwazi-sky/50 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 dark:text-blue-500 mt-0.5">{c.tracking_code}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-blue-500">
                <span className="capitalize">{c.category}</span>
                {c.county && <span>📍 {c.county}</span>}
                {c.estimated_amount_kes && <span>{formatKES(c.estimated_amount_kes)}</span>}
                <span>{fmtDate(c.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
