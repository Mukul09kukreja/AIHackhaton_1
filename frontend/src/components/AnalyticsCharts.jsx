import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Bar, CartesianGrid } from 'recharts';

const COLORS = ['#06b6d4', '#8b5cf6', '#14b8a6', '#22c55e', '#f59e0b', '#f43f5e'];

export default function AnalyticsCharts({ stats = {}, insights = {} }) {
  const categories = Object.entries(stats.category_distribution || {}).map(([name, value]) => ({ name, value }));
  const largest = Object.entries(stats.largest_categories || {}).map(([name, value]) => ({ name, value }));
  const duplicates = [
    { name: 'Duplicates', value: insights.duplicate_count || 0 },
    { name: 'Unique', value: Math.max((stats.total_files || 0) - (insights.duplicate_count || 0), 0) },
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {[{ title: 'Category Distribution', data: categories, type: 'pie' }, { title: 'Largest Categories', data: largest, type: 'bar' }, { title: 'Duplicate Analysis', data: duplicates, type: 'pie' }].map((chart) => (
        <div key={chart.title} className="h-72 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 text-sm font-medium text-slate-300">{chart.title}</h3>
          <ResponsiveContainer width="100%" height="90%">
            {chart.type === 'bar' ? (
              <BarChart data={chart.data}><CartesianGrid stroke="#334155" strokeDasharray="3 3" /><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} /></BarChart>
            ) : (
              <PieChart><Pie data={chart.data} dataKey="value" nameKey="name" outerRadius={80} label>{chart.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
            )}
          </ResponsiveContainer>
        </div>
      ))}
    </section>
  );
}
