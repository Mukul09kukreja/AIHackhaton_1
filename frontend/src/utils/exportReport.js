export function exportBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateCsv(data) {
  const rows = data.files.map((f) => [f.filename, f.category, f.extension, f.size, f.size_human, f.is_duplicate ? 'yes' : 'no']);
  return ['filename,category,extension,size,size_human,is_duplicate', ...rows.map((r) => r.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
}
