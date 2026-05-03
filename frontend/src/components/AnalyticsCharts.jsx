import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PIE_COLORS = ['#22d3ee', '#8b5cf6', '#10b981', '#f59e0b', '#fb7185', '#60a5fa'];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (index) => ({ opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.45 } }),
};

function ChartCard({ title, subtitle, data, valueFormatter = (v) => v, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.01, rotateX: 2, rotateY: -2 }}
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-4 shadow-2xl backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/15 blur-2xl" />
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="mb-3 text-xs text-slate-400">{subtitle}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={3} isAnimationActive animationDuration={900}>
              {data.map((entry, i) => <Cell key={`${entry.name}-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value) => valueFormatter(value)} contentStyle={{ background: '#0b1220dd', border: '1px solid #334155', borderRadius: 12 }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default function AnalyticsCharts({ stats = {}, insights = {} }) {
  const categories = Object.entries(stats.category_distribution || {}).map(([name, value]) => ({ name, value }));
  const totalSize = stats.total_size || 0;
  const sizeData = (stats.largest_files || []).slice(0, 6).map((file) => ({
    name: file.filename,
    value: file.size,
  }));
  const clutter = insights.clutter_score || 0;
  const clutterData = [
    { name: 'Clutter score', value: clutter },
    { name: 'Healthy space', value: Math.max(100 - clutter, 0) },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <ChartCard title="File Category Distribution" subtitle="How your files are split by type" data={categories} index={0} />
      <ChartCard
        title="Storage Usage Distribution"
        subtitle="Largest files taking disk space"
        data={sizeData}
        index={1}
        valueFormatter={(v) => `${(v / (1024 * 1024)).toFixed(1)} MB`}
      />
      <ChartCard title="Clutter Score" subtitle={`Overall storage health · Total ${stats.total_size_human || totalSize}`} data={clutterData} index={2} />
    </section>
  );
}
