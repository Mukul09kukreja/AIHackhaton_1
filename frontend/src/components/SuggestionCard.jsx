import { motion } from 'framer-motion';
import { AlertTriangle, Box, Brush, Info } from 'lucide-react';

const iconFor = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('duplicate')) return AlertTriangle;
  if (t.includes('large')) return Box;
  if (t.includes('screenshot')) return Brush;
  return Info;
};

export default function SuggestionCard({ suggestion }) {
  const Icon = iconFor(suggestion.title);
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-4 shadow-lg shadow-cyan-900/20 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-cyan-300/20 p-2 text-cyan-200"><Icon size={16} /></div>
        <div>
          <p className="font-medium text-white">{suggestion.title}</p>
          <p className="mt-1 text-sm text-slate-300">{suggestion.detail}</p>
        </div>
      </div>
    </motion.div>
  );
}
