import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderUp } from 'lucide-react';

export default function FolderDropzone({ folder, setFolder }) {
  const [hover, setHover] = useState(false);

  const pickFolder = async () => {
    if (window.showDirectoryPicker) {
      try {
        const handle = await window.showDirectoryPicker();
        if (handle?.name) setFolder(handle.name);
      } catch {
        // silent cancel
      }
    }
  };

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        const droppedPath = e.dataTransfer?.files?.[0]?.path;
        if (droppedPath) setFolder(droppedPath.replace(/[/\\][^/\\]+$/, ''));
        setHover(false);
      }}
      whileHover={{ scale: 1.01 }}
      className={`relative rounded-2xl border p-5 transition-all ${hover ? 'border-cyan-300/80 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.35)]' : 'border-white/20 bg-white/5'}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,#22d3ee22,transparent_45%)]" />
      <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-cyan-200/30 bg-cyan-400/15 p-3 text-cyan-200"><FolderUp size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-white">Drag & drop folder path input</p>
            <p className="text-xs text-slate-400">Drop from your file manager, or browse manually.</p>
          </div>
        </div>
        <button onClick={pickFolder} className="btn">Browse Folder</button>
      </div>
      <input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="Absolute folder path fallback..." className="relative mt-4 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-sm text-white outline-none ring-cyan-300 transition focus:ring-2" />
    </motion.div>
  );
}
