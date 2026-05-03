export default function FileTable({ files = [] }) {
  return (
    <div className="overflow-auto rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-left text-slate-300">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Modified</th>
            <th className="px-4 py-3">Extension</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.file_path} className="border-t border-white/10 text-slate-200 hover:bg-white/5">
              <td className="px-4 py-3">{file.filename}</td>
              <td className="px-4 py-3">{file.category}</td>
              <td className="px-4 py-3">{file.size_human}</td>
              <td className="px-4 py-3">{new Date(file.modified_date).toLocaleDateString()}</td>
              <td className="px-4 py-3">{file.extension || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
