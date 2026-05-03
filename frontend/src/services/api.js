import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 30000,
});

export const scanFolder = (folderPath, aiAssisted = false) => api.post('/scan-folder', { folder_path: folderPath, ai_assisted: aiAssisted });
export const organizeFiles = (folderPath, dryRun = false) => api.post(`/organize${dryRun ? '?dry_run=true' : ''}`, { folder_path: folderPath });
export const undoOrganize = () => api.post('/undo');

// Backend currently returns these in /scan-folder payload, but helpers are provided
// to keep a clean contract if dedicated endpoints are added later.
export const getStats = (folderPath) => scanFolder(folderPath);
export const getAISuggestions = (folderPath) => scanFolder(folderPath);

export default api;
