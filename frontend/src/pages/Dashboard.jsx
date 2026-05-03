import { useMemo, useState } from 'react';
import { FolderOpen, RotateCcw, WandSparkles, Database, HardDrive, Files } from 'lucide-react';
import toast from 'react-hot-toast';
import { scanFolder, organizeFiles, undoOrganize } from '../services/api';
import StatsCard from '../components/StatsCard';
import Loader from '../components/Loader';
import SearchFilters from '../components/SearchFilters';
import ProgressTimeline from '../components/ProgressTimeline';
import AnalyticsCharts from '../components/AnalyticsCharts';
import TreePreview from '../components/TreePreview';
import SuggestionCard from '../components/SuggestionCard';
import FileTable from '../components/FileTable';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const [folder, setFolder] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [extension, setExtension] = useState('');
  const [category, setCategory] = useState('');
  const [duplicateOnly, setDuplicateOnly] = useState(false);

  const refreshScan = async () => {
    if (!folder) return toast.error('Please enter a folder path');
    setLoading(true);
    try {
      const res = await scanFolder(folder);
      setData(res.data);
      toast.success('Scan complete');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const onOrganize = async () => {
    try { await organizeFiles(folder); toast.success('Files organized'); await refreshScan(); } catch { toast.error('Organize failed'); }
  };
  const onUndo = async () => {
    try { await undoOrganize(); toast.success('Undo complete'); await refreshScan(); } catch { toast.error('Undo failed'); }
  };

  const filteredFiles = useMemo(() => (data?.files || []).filter((f) => {
    const matchName = query ? f.filename?.toLowerCase().includes(query.toLowerCase()) : true;
    const matchExt = extension ? (f.extension || '').toLowerCase().includes(extension.toLowerCase()) : true;
    const matchCat = category ? f.category === category : true;
    const matchDup = duplicateOnly ? !!f.is_duplicate : true;
    return matchName && matchExt && matchCat && matchDup;
  }), [data, query, extension, category, duplicateOnly]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-2xl font-semibold text-white">AI-Powered File Intelligence</h2>
        <p className="mt-1 text-slate-400">Scan, analyze, preview structure changes, and organize safely.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="Absolute folder path..." className="min-w-[280px] flex-1 rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2" />
          <button onClick={refreshScan} className="btn"><FolderOpen size={16} /> Scan</button>
          <button onClick={onOrganize} className="btn"><WandSparkles size={16} /> Organize</button>
          <button onClick={onUndo} className="btn"><RotateCcw size={16} /> Undo</button>
        </div>
      </section>

      <ProgressTimeline active={data ? 3 : 0} />
      {loading ? <Loader label="Scanning folder and preparing AI insights..." /> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Total Files" value={data?.stats?.total_files ?? '-'} icon={Files} />
        <StatsCard label="Total Storage" value={data?.stats?.total_size_human ?? '-'} icon={HardDrive} accent="text-emerald-300" />
        <StatsCard label="Duplicates" value={data?.insights?.duplicate_count ?? 0} icon={Database} accent="text-amber-300" />
      </section>

      {data ? <AnalyticsCharts stats={data.stats} insights={data.insights} /> : <EmptyState title="No analytics yet" detail="Run a scan to generate charts." />}
      {data ? <TreePreview beforeTree={data.before_tree} afterTree={data.after_tree} /> : <EmptyState title="No tree preview" detail="Run a scan to compare before/after structure." />}

      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-medium text-white">AI Suggestions</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(data?.ai_suggestions || []).map((s, i) => <SuggestionCard key={`${s.title}-${i}`} suggestion={s} />)}
        </div>
      </section>

      <SearchFilters query={query} setQuery={setQuery} extension={extension} setExtension={setExtension} duplicateOnly={duplicateOnly} setDuplicateOnly={setDuplicateOnly} category={category} setCategory={setCategory} categories={Object.keys(data?.stats?.category_distribution || {})} />
      {filteredFiles.length ? <FileTable files={filteredFiles} /> : <EmptyState title="No files match filters" detail="Try changing search and filter values." />}
    </div>
  );
}
