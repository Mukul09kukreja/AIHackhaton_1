import { motion } from 'framer-motion';

export default function StatsCard({ label, value, icon: Icon, accent = 'text-cyan-300' }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        {Icon ? <Icon size={18} className={accent} /> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </motion.article>
  );
}
