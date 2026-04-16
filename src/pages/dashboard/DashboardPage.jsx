import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../api/analytics.service';
import StatCard from '../../components/ui/StatCard';
import { CountyBarChart } from '../../components/charts/CountyBarChart';
import { formatKES } from '../../utils/formatKES';

export default function DashboardPage() {
  // GET /analytics/stats — payload: { total_cases, resolved_cases, under_review, escalated, total_amount_kes }
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn:  analyticsService.getStats,
  });

  // GET /analytics/by-county — payload: { counties: [{county, case_count, total_amount_kes}] }
  const { data: countyData } = useQuery({
    queryKey: ['analytics-by-county'],
    queryFn:  analyticsService.getByCounty,
  });

  if (isLoading) return <div className="p-6"><Spinner /></div>;

  // All field names come from the backend SQL aggregate query
  const totalCases    = Number(stats?.total_cases    || 0);
  const resolved      = Number(stats?.resolved_cases || 0);
  const underReview   = Number(stats?.under_review   || 0);
  const escalated     = Number(stats?.escalated      || 0);
  const totalAmountKes = Number(stats?.total_amount_kes || 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            National Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-blue-300">
            Live case intelligence · FY 2024/25
          </p>
        </div>
      </div>

      {/* Stat cards — using actual backend field names */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cases"       value={totalCases}    />
        <StatCard title="Resolved"          value={resolved}      variant="success" />
        <StatCard title="Under Review"      value={underReview}   variant="warning" />
        <StatCard title="Escalated"         value={escalated}     variant="danger" />
      </div>

      <StatCard
        title="Total Amount Flagged"
        value={`KES ${formatKES(totalAmountKes)}`}
        fullWidth
      />

      <CountyBarChart data={countyData?.counties || []} />
    </div>
  );
}