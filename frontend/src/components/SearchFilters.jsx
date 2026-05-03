export default function SearchFilters({ query, setQuery, extension, setExtension, duplicateOnly, setDuplicateOnly, category, setCategory, categories = [] }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search file name..." className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white" />
      <input value={extension} onChange={(e) => setExtension(e.target.value)} placeholder="Extension (e.g .png)" className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white" />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white">
        <option value="">All categories</option>
        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-300">
        <input type="checkbox" checked={duplicateOnly} onChange={(e) => setDuplicateOnly(e.target.checked)} />
        Duplicate only
      </label>
    </div>
  );
}
