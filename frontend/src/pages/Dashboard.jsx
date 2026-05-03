import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, RotateCcw, WandSparkles, Database, HardDrive, Files, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { scanFolder, organizeFiles, undoOrganize, getAISuggestions } from '../services/api';
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
  const [actionLoading, setActionLoading] = useState('');
  const [aiAssisted, setAiAssisted] = useState(false);
  const [query, setQuery] = useState('');
  const [extension, setExtension] = useState('');
  const [category, setCategory] = useState('');
  const [duplicateOnly, setDuplicateOnly] = useState(false);
  const [activities, setActivities] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  const [insights, setInsights] = useState(null);
  const [scanProgress, setScanProgress] = useState({ active: 0, percent: 0, stage: 'Idle', running: false });

  const logActivity = (type, summary) => {
    const next = [{ type, summary, timestamp: new Date().toISOString() }, ...activities].slice(0, 20);
    setActivities(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const refreshScan = async () => {
    if (!folder) return toast.error('Please enter a folder path');
    setLoading(true);
    setScanProgress({ active: 0, percent: 10, stage: 'Preparing scan', running: true });
    try {
      setScanProgress({ active: 1, percent: 35, stage: 'Scanning files', running: true });
      const res = await scanFolder(folder, aiAssisted);
      setData(res.data);
      setScanProgress({ active: 2, percent: 75, stage: 'Generating AI suggestions', running: true });
      const aiRes = await getAISuggestions();
      setInsights(aiRes.data);
      const dupCount = res.data?.insights?.duplicate_count || 0;
      logActivity('scan', `Scanned ${res.data?.stats?.total_files || 0} files in ${folder}`);
      if (dupCount) logActivity('duplicate', `Detected ${dupCount} duplicate files`);
      setScanProgress({ active: 3, percent: 100, stage: 'Complete', running: false });
      toast.success('Scan complete');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Scan failed');
      setScanProgress({ active: 0, percent: 0, stage: 'Scan failed', running: false });
    } finally {
      setLoading(false);
    }
  };

  const onOrganize = async () => {
    setActionLoading('organize');
    try { await organizeFiles(folder); logActivity('organize', `Organized files in ${folder}`); toast.success('Organized'); await refreshScan(); } catch { toast.error('Organize failed'); } finally { setActionLoading(''); }
  };
  const onUndo = async () => {
    setActionLoading('undo');
    try {
      const undoRes = await undoOrganize();
      setData(null);
      setInsights(null);
      logActivity('undo', `Undo operation executed for ${folder}`);
      const restored = undoRes?.data?.restored ?? 0;
      const skipped = undoRes?.data?.skipped?.length ?? 0;
      toast.success(`Undo completed. Restored: ${restored}${skipped ? `, Skipped: ${skipped}` : ''}`);
      await refreshScan();
    } catch { toast.error('Undo failed'); } finally { setActionLoading(''); }
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
          <button onClick={refreshScan} disabled={loading || actionLoading} className="btn"><FolderOpen size={16} /> {loading ? 'Scanning...' : 'Scan'}</button>
          <button onClick={onOrganize} disabled={loading || actionLoading} className="btn"><WandSparkles size={16} /> {actionLoading === 'organize' ? 'Organizing...' : 'Organize'}</button>
          <button onClick={onUndo} disabled={loading || actionLoading} className="btn"><RotateCcw size={16} /> {actionLoading === 'undo' ? 'Undoing...' : 'Undo'}</button>
          <label className="ml-2 inline-flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={aiAssisted} onChange={(e) => setAiAssisted(e.target.checked)} />
            AI Assisted Insights {aiAssisted ? 'ON' : 'OFF'}
          </label>
        </div>
      </section>


      <section className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">AI Workspace Insights</h3>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-cyan-200">{insights?.mode === 'openai' ? 'OpenAI enhanced' : 'Using local AI insights'}</span>
        </div>
        <p className="mt-2 text-slate-200">{insights?.summary || 'Run a scan to generate insights.'}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-3 text-white">Health Score: <span className="font-bold text-cyan-200">{insights?.workspace_health_score ?? '-'}</span></div>
          {[...(insights?.suggestions || []), ...(insights?.cleanup_recommendations || []), ...(insights?.risks || []), ...(insights?.category_insights || [])].slice(0, 6).map((item, idx) => (
            <motion.div key={idx} whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100">{item}</motion.div>
          ))}
        </div>
      </section>

      <ProgressTimeline active={scanProgress.active} />
      {loading || scanProgress.running ? <Loader label="Scanning folder and preparing AI insights..." progress={scanProgress.percent} filesScanned={data?.stats?.total_files || 0} elapsed="~2s" stage={scanProgress.stage} /> : null}

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
