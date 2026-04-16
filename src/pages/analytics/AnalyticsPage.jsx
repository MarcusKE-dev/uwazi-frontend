import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../api/analytics.service';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { data: stats }  = useQuery({ queryKey: ['stats'],     queryFn: analyticsService.getStats });
  const { data: county } = useQuery({ queryKey: ['by-county'], queryFn: analyticsService.getByCounty });

  // county.counties: [{ county, case_count (string), total_amount_kes (string) }]
  const countyRows = (county?.counties || []).map((r) => ({
    name:  r.county,
    cases: Number(r.case_count),
    kes:   Number(r.total_amount_kes),
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold dark:text-white">Analytics</h1>

      {/* Summary row from /analytics/stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Cases',    val: stats?.total_cases },
          { label: 'Resolved',       val: stats?.resolved_cases },
          { label: 'Under Review',   val: stats?.under_review },
          { label: 'Escalated',      val: stats?.escalated },
          { label: 'KES Flagged',    val: formatKES(stats?.total_amount_kes) },
        ].map((s) => (
          <div key={s.label} className="card-base p-4">
            <p className="text-xs text-gray-500 dark:text-blue-300">{s.label}</p>
            <p className="text-xl font-bold dark:text-white">{s.val ?? '—'}</p>
          </div>
        ))}
      </div>

      {/* County bar chart from /analytics/by-county */}
      <div className="card-base p-6">
        <h2 className="font-bold mb-4 dark:text-white">Cases by County</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countyRows}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="cases" fill="#1B4FD8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}