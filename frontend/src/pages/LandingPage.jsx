import { motion } from 'framer-motion';

export default function LandingPage({ onEnter }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.button whileHover={{ scale: 1.03 }} onClick={onEnter} className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-6 py-4 text-cyan-200">
        Enter Dashboard
      </motion.button>
    </div>
  );
}
