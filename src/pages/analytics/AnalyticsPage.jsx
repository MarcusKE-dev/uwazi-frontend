import { useAnalyticsStats, useCountyBreakdown } from '../../hooks/useAnalytics';
import StatCard       from '../../components/ui/StatCard';
import CountyBarChart from '../../components/charts/CountyBarChart';
import SummaryPieChart from '../../components/charts/SummaryPieChart';
import Spinner        from '../../components/ui/Spinner';
import { formatKES }  from '../../utils/formatKES';

export default function AnalyticsPage() {
  const { data: statsRes, isLoading } = useAnalyticsStats();
  const { data: countyRes }           = useCountyBreakdown();

  const stats    = statsRes?.data;
  const counties = countyRes?.data?.counties ?? [];

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-uwazi-muted">Live statistics from the UWAZI database</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Cases"    value={stats?.total_cases} />
        <StatCard title="Under Review"   value={stats?.under_review}    variant="warn" />
        <StatCard title="Escalated"      value={stats?.escalated}       variant="danger" />
        <StatCard title="Resolved"       value={stats?.resolved_cases}  variant="success" />
      </div>

      {stats?.total_amount_kes && (
        <div className="bg-uwazi-navy text-white rounded-xl p-6">
          <p className="text-xs text-uwazi-muted uppercase tracking-widest mb-1">Total Amount Involved</p>
          <p className="text-3xl font-bold">{formatKES(stats.total_amount_kes, false)}</p>
          <p className="text-sm text-blue-300 mt-1">Across all submitted cases</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <CountyBarChart data={counties} />
        <SummaryPieChart stats={stats} />
      </div>
    </div>
  );
}
