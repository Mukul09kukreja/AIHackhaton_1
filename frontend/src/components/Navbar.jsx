import { Sparkles, FolderTree } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-400/20 p-2 text-cyan-300"><FolderTree size={18} /></div>
          <div>
            <p className="text-sm text-slate-400">Smart File Organizer</p>
            <h1 className="font-semibold text-white">AI Suggestions Dashboard</h1>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200 md:flex">
          <Sparkles size={14} /> AI Assisted
        </div>
      </div>
    </header>
  );
}
