import { cn } from '../../utils/cn';

export default function StatCard({ title, value, sub, variant = 'default', live = false }) {
  const isDanger  = variant === 'danger';
  const isSuccess = variant === 'success';
  const isWarn    = variant === 'warn';

  return (
    <div className={cn(
      'rounded-xl p-5 border',
      isDanger  && 'bg-red-50   border-red-200   dark:bg-red-900/20   dark:border-red-800',
      isSuccess && 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      isWarn    && 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
      !isDanger && !isSuccess && !isWarn &&
        'bg-white border-slate-200 dark:bg-uwazi-dark dark:border-blue-900/50'
    )}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-uwazi-muted mb-2">
        {title}
      </p>
      <p className={cn(
        'text-2xl font-bold',
        isDanger  && 'text-red-600   dark:text-red-400',
        isSuccess && 'text-green-600 dark:text-green-400',
        isWarn    && 'text-amber-600 dark:text-amber-400',
        !isDanger && !isSuccess && !isWarn && 'text-slate-900 dark:text-white'
      )}>
        {value ?? '—'}
      </p>
      {sub  && <p className="text-xs text-slate-500 dark:text-blue-400 mt-1">{sub}</p>}
      {live && <p className="text-xs text-green-500 mt-1">● Live</p>}
    </div>
  );
}
