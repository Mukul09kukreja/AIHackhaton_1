import { useMemo } from 'react';
import Tree from 'react-d3-tree';

function normalize(node) {
  if (!node) return { name: 'No data' };
  if (typeof node === 'string') return { name: node };
  return {
    name: node.name || node.label || 'node',
    children: (node.children || []).map(normalize),
  };
}

function TreePanel({ title, data }) {
  const treeData = useMemo(() => normalize(data), [data]);

  return (
    <div className="h-[420px] rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-300">{title}</h3>
      <div className="h-[360px] rounded-xl bg-slate-900/60">
        <Tree
          data={treeData}
          translate={{ x: 140, y: 140 }}
          orientation="vertical"
          pathFunc="step"
          zoomable
          collapsible
          initialDepth={2}
          separation={{ siblings: 1.1, nonSiblings: 1.4 }}
        />
      </div>
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
