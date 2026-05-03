import { motion } from 'framer-motion';

export default function Loader({ label = 'Working on it...' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 text-sm text-slate-300">{label}</div>
      <div className="h-2 overflow-hidden rounded bg-slate-700/60">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          className="h-full w-1/3 bg-cyan-400"
        />
      </div>
    </div>
  );
}
