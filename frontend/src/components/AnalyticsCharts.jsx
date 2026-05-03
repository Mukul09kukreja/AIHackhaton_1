const COLORS = ['bg-cyan-400', 'bg-violet-400', 'bg-emerald-400', 'bg-lime-400', 'bg-amber-400', 'bg-rose-400'];

function HorizontalBars({ data = [] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <div key={`${item.name}-${idx}`}>
          <div className="mb-1 flex justify-between text-xs text-slate-300"><span className="truncate pr-2">{item.name}</span><span>{item.value}</span></div>
          <div className="h-2 rounded bg-slate-800"><div className={`h-2 rounded ${COLORS[idx % COLORS.length]}`} style={{ width: `${(item.value / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsCharts({ stats = {}, insights = {} }) {
  const categories = Object.entries(stats.category_distribution || {}).map(([name, value]) => ({ name, value }));
  const largest = (stats.largest_files || []).slice(0, 5).map((file) => ({ name: file.filename, value: Math.round((file.size || 0) / (1024 * 1024)) }));
  const duplicateData = [
    { name: 'Duplicates', value: insights.duplicate_count || 0 },
    { name: 'Unique', value: Math.max((stats.total_files || 0) - (insights.duplicate_count || 0), 0) },
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {[{ title: 'Category Distribution', data: categories }, { title: 'Largest Files (MB)', data: largest }, { title: 'Duplicate Analysis', data: duplicateData }].map((chart) => (
        <div key={chart.title} className="h-72 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-sm font-medium text-slate-300">{chart.title}</h3>
          <HorizontalBars data={chart.data} />
        </div>
      ))}
    </section>
  );
}
