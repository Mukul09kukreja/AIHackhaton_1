import { motion } from 'framer-motion';
import { ScanSearch, WandSparkles, RotateCcw, Copy } from 'lucide-react';

const icons = { scan: ScanSearch, organize: WandSparkles, undo: RotateCcw, duplicate: Copy };

export default function RecentActivityTimeline({ activities = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">Recent Activity</h3>
      <div className="space-y-3">
        {activities.length === 0 ? <p className="text-sm text-slate-400">No activity yet. Run a scan to begin timeline tracking.</p> : activities.map((activity, i) => {
          const Icon = icons[activity.type] || ScanSearch;
          return (
            <motion.div key={`${activity.type}-${activity.timestamp}-${i}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-3">
              <div className="rounded-lg border border-cyan-200/20 bg-cyan-400/10 p-2 text-cyan-200"><Icon size={14} /></div>
              <div>
                <p className="text-sm text-white">{activity.summary}</p>
                <p className="text-xs text-slate-400">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
