import { motion } from 'framer-motion';

export default function Loader({ label = 'Scanning...', progress = 70, filesScanned = 0, elapsed = '0s', stage = 'Indexing files' }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-300/30 bg-white/5 p-4 backdrop-blur-xl">
      <div className="absolute -right-12 -top-12 h-32 w-32 animate-spin rounded-full border border-cyan-300/20" style={{ animationDuration: '4s' }} />
      <div className="mb-2 text-sm text-slate-200">{label}</div>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-700/60">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} className="h-full bg-gradient-to-r from-cyan-400 to-violet-400" />
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-slate-300">
        <span>Files scanned: {filesScanned}</span><span>Elapsed: {elapsed}</span><span>Stage: {stage}</span>
      </div>
    </div>
  );
}
