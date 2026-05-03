import { useMemo } from 'react';

function normalize(node) {
  if (!node) return { name: 'No data', children: [] };
  if (typeof node === 'string') return { name: node, children: [] };
  return {
    name: node.name || node.label || 'node',
    children: (node.children || []).map(normalize),
  };
}

function TreeNode({ node, depth = 0 }) {
  return (
    <li className="pl-3">
      <div className={`rounded px-2 py-1 ${depth === 0 ? 'bg-cyan-500/20 text-cyan-100' : 'bg-slate-800/40 text-slate-200'}`}>
        {node.name}
      </div>
      {node.children?.length ? (
        <ul className="mt-1 space-y-1 border-l border-slate-700/70 pl-2">
          {node.children.map((child, idx) => (
            <TreeNode key={`${child.name}-${idx}`} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function TreePanel({ title, data }) {
  const treeData = useMemo(() => normalize(data), [data]);

  return (
    <div className="h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">{title}</h3>
      <ul className="space-y-1 rounded-xl bg-slate-900/60 p-3">
        <TreeNode node={treeData} />
      </ul>
    </div>
  );
}

export default function TreePreview({ beforeTree, afterTree }) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <TreePanel title="Before Organization" data={beforeTree} />
      <TreePanel title="After Organization" data={afterTree} />
    </section>
  );
}
