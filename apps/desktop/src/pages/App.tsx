import { motion } from 'framer-motion'

export function App() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight">BridgeX</h1>
        <p className="text-zinc-400 mt-2">Your files organize themselves.</p>
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-xl font-medium">Safety-first Automation</h2>
          <p className="text-zinc-400 mt-2">Preview every action, commit transactionally, rollback anytime.</p>
        </div>
      </motion.section>
    </main>
  )
}
