import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, RotateCcw, WandSparkles, Database, HardDrive, Files, Download } from 'lucide-react';
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
import FolderDropzone from '../components/upload/FolderDropzone';
import RecentActivityTimeline from '../components/timeline/RecentActivityTimeline';
import { exportBlob, generateCsv } from '../utils/exportReport';

const STORAGE_KEY = 'sfo_recent_activity';

export default function Dashboard() {
  const [folder, setFolder] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [extension, setExtension] = useState('');
  const [category, setCategory] = useState('');
  const [duplicateOnly, setDuplicateOnly] = useState(false);
  const [activities, setActivities] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

  const logActivity = (type, summary) => {
    const next = [{ type, summary, timestamp: new Date().toISOString() }, ...activities].slice(0, 20);
    setActivities(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const refreshScan = async () => {
    if (!folder) return toast.error('Please enter a folder path');
    setLoading(true);
    try {
      const res = await scanFolder(folder);
      setData(res.data);
      const dupCount = res.data?.insights?.duplicate_count || 0;
      logActivity('scan', `Scanned ${res.data?.stats?.total_files || 0} files in ${folder}`);
      if (dupCount) logActivity('duplicate', `Detected ${dupCount} duplicate files`);
      toast.success('Scan complete');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const onOrganize = async () => {
    try { await organizeFiles(folder); logActivity('organize', `Organized files in ${folder}`); toast.success('Files organized'); await refreshScan(); } catch { toast.error('Organize failed'); }
  };
  const onUndo = async () => {
    try { await undoOrganize(); logActivity('undo', `Undo operation executed for ${folder}`); toast.success('Undo complete'); await refreshScan(); } catch { toast.error('Undo failed'); }
  };

  const onExport = (kind) => {
    if (!data) return toast.error('Run scan before export');
    const report = { generated_at: new Date().toISOString(), folder, stats: data.stats, insights: data.insights, suggestions: data.ai_suggestions, files: data.files };
    if (kind === 'json') exportBlob('scan-report.json', JSON.stringify(report, null, 2), 'application/json');
    if (kind === 'txt') exportBlob('scan-summary.txt', `Folder: ${folder}\nFiles: ${data.stats?.total_files}\nSize: ${data.stats?.total_size_human}\nDuplicates: ${data.insights?.duplicate_count || 0}\nClutter score: ${data.insights?.clutter_score || 0}\nSuggestions:\n${(data.ai_suggestions || []).map((s) => `- ${s.title}: ${s.detail}`).join('\n')}`, 'text/plain');
    if (kind === 'csv') exportBlob('analytics.csv', generateCsv(data), 'text/csv');
    toast.success(`${kind.toUpperCase()} exported`);
  };

  const filteredFiles = useMemo(() => (data?.files || []).filter((f) => {
    const matchName = query ? f.filename?.toLowerCase().includes(query.toLowerCase()) : true;
    const matchExt = extension ? (f.extension || '').toLowerCase().includes(extension.toLowerCase()) : true;
    const matchCat = category ? f.category === category : true;
    const matchDup = duplicateOnly ? !!f.is_duplicate : true;
    return matchName && matchExt && matchCat && matchDup;
  }), [data, query, extension, category, duplicateOnly]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
        <h2 className="text-3xl font-semibold text-white">Premium Smart File Command Center</h2>
        <p className="mt-1 text-slate-400">Futuristic local file intelligence with analytics, cleanup insights, and reversible actions.</p>
        <div className="mt-4"><FolderDropzone folder={folder} setFolder={setFolder} /></div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={refreshScan} className="btn"><FolderOpen size={16} /> Scan</button>
          <button onClick={onOrganize} className="btn"><WandSparkles size={16} /> Organize</button>
          <button onClick={onUndo} className="btn"><RotateCcw size={16} /> Undo</button>
        </div>
      </section>

      <ProgressTimeline active={data ? 3 : 0} />
      {loading ? <Loader label="Scanning folder and preparing AI insights..." progress={75} filesScanned={data?.stats?.total_files || 0} elapsed="~2s" stage="Analyzing metadata" /> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Files" value={data?.stats?.total_files ?? '-'} icon={Files} />
        <StatsCard label="Total Storage" value={data?.stats?.total_size_human ?? '-'} icon={HardDrive} accent="text-emerald-300" />
        <StatsCard label="Duplicates" value={data?.insights?.duplicate_count ?? 0} icon={Database} accent="text-amber-300" />
        <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-300">Export Center</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button onClick={() => onExport('json')} className="btn"><Download size={14} /> JSON</button>
            <button onClick={() => onExport('txt')} className="btn"><Download size={14} /> TXT</button>
            <button onClick={() => onExport('csv')} className="btn"><Download size={14} /> CSV</button>
          </div>
        </motion.div>
      </section>

      {data ? <AnalyticsCharts stats={data.stats} insights={data.insights} /> : <EmptyState title="No analytics yet" detail="Run a scan to generate charts." />}
      {data ? <TreePreview beforeTree={data.before_tree} afterTree={data.after_tree} /> : <EmptyState title="No tree preview" detail="Run a scan to compare before/after structure." />}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-2">
          <h3 className="text-lg font-medium text-white">AI Suggestions</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {(data?.ai_suggestions || []).map((s, i) => <SuggestionCard key={`${s.title}-${i}`} suggestion={s} />)}
          </div>
        </div>
        <RecentActivityTimeline activities={activities} />
      </section>

      <SearchFilters query={query} setQuery={setQuery} extension={extension} setExtension={setExtension} duplicateOnly={duplicateOnly} setDuplicateOnly={setDuplicateOnly} category={category} setCategory={setCategory} categories={Object.keys(data?.stats?.category_distribution || {})} />
      {filteredFiles.length ? <FileTable files={filteredFiles} /> : <EmptyState title="No files match filters" detail="Try changing search and filter values." />}
    </div>
  );
}
