import { useAnalyticsStats, useCountyBreakdown } from '../../hooks/useAnalytics';
import StatCard       from '../../components/ui/StatCard';
import CountyBarChart from '../../components/charts/CountyBarChart';
import Spinner        from '../../components/ui/Spinner';
import { formatKES }  from '../../utils/formatKES';

export default function DashboardPage() {
  const { data: statsRes, isLoading } = useAnalyticsStats();
  const { data: countyRes }           = useCountyBreakdown();

  // Axios interceptor returns full { success, data } — drill into .data
  const stats    = statsRes?.data;
  const counties = countyRes?.data?.counties ?? [];

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">National Overview</h1>
        <p className="text-sm text-slate-500 dark:text-uwazi-muted">Real-time corruption case intelligence</p>
      </div>

      {/* Stat cards — field names match /analytics/stats response */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Cases"     value={stats?.total_cases} />
        <StatCard title="Resolved"        value={stats?.resolved_cases} variant="success" />
        <StatCard title="Under Review"    value={stats?.under_review}   variant="warn" />
        <StatCard title="Total Amount"    value={formatKES(stats?.total_amount_kes)} />
      </div>

      {/* Escalated callout */}
      {Number(stats?.escalated) > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.escalated}</span>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-300 text-sm">Cases Escalated</p>
            <p className="text-xs text-red-500">Require urgent attention</p>
          </div>
        </div>
      )}

      {/* County chart */}
      <CountyBarChart data={counties} />
    </div>
  );
}
