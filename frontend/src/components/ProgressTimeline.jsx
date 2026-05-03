const steps = ['Scan folder', 'Analyze patterns', 'Generate AI suggestions', 'Preview reorganization'];

export default function ProgressTimeline({ active = 0 }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-2 md:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step} className={`rounded-lg border px-3 py-2 text-xs ${i <= active ? 'border-cyan-300/30 bg-cyan-400/10 text-cyan-200' : 'border-white/10 text-slate-400'}`}>
            {i + 1}. {step}
          </div>
        ))}
      </div>
    </div>
  );
}
