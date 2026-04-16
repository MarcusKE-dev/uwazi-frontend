import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563EB', '#F59E0B', '#EF4444', '#10B981'];

export default function SummaryPieChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: 'Submitted',    value: Number(stats.total_cases) - Number(stats.resolved_cases) - Number(stats.under_review) - Number(stats.escalated) },
    { name: 'Under Review', value: Number(stats.under_review) },
    { name: 'Escalated',    value: Number(stats.escalated) },
    { name: 'Resolved',     value: Number(stats.resolved_cases) },
  ].filter((d) => d.value > 0);

  if (!data.length) return null;

  return (
    <div className="bg-white dark:bg-uwazi-dark rounded-xl border border-slate-200 dark:border-blue-900/50 p-6">
      <p className="text-sm font-semibold text-slate-700 dark:text-white mb-4">Case Status Breakdown</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          } labelLine={{ stroke: '#64748B' }}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#0A1628', border: 'none', borderRadius: 8, color: '#E2E8F0', fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
