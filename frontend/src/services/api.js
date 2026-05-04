import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API,
  timeout: 30000,
});

export const scanFolder = (folderPath, aiAssisted = false) => api.post('/scan-folder', { folder_path: folderPath, ai_assisted: aiAssisted });
export const organizeFiles = (folderPath, dryRun = false) => api.post(`/organize${dryRun ? '?dry_run=true' : ''}`, { folder_path: folderPath });
export const undoOrganize = () => api.post('/undo');
export const getStats = (folderPath) => scanFolder(folderPath);
export const getAISuggestions = () => api.get('/ai-suggestions');

export default api;
