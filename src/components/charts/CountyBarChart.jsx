import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CountyBarChart({ data = [] }) {
  if (!data.length) return (
    <div className="bg-white dark:bg-uwazi-dark rounded-xl border border-slate-200 dark:border-blue-900/50 p-6">
      <p className="text-sm font-semibold text-slate-700 dark:text-white mb-4">Cases by County</p>
      <p className="text-slate-400 text-sm text-center py-8">No county data yet</p>
    </div>
  );

  const top = [...data].sort((a, b) => b.case_count - a.case_count).slice(0, 10);

  return (
    <div className="bg-white dark:bg-uwazi-dark rounded-xl border border-slate-200 dark:border-blue-900/50 p-6">
      <p className="text-sm font-semibold text-slate-700 dark:text-white mb-6">
        Cases by County <span className="text-slate-400 font-normal">(top 10)</span>
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={top} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
          <XAxis dataKey="county" tick={{ fontSize: 11, fill: '#64748B' }}
            angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
          <Tooltip
            contentStyle={{ background: '#0A1628', border: 'none', borderRadius: 8, color: '#E2E8F0', fontSize: 12 }}
            formatter={(v) => [v, 'Cases']}
          />
          <Bar dataKey="case_count" radius={[4, 4, 0, 0]}>
            {top.map((_, i) => (
              <Cell key={i} fill={`hsl(${215 + i * 4}, 70%, ${50 + i * 2}%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
