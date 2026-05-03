import { FolderSearch } from 'lucide-react';

export default function EmptyState({ title, detail }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
      <FolderSearch className="mx-auto mb-3 text-slate-400" />
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
}
