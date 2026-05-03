import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 30000,
});

export const scanFolder = (folderPath) => api.post('/scan-folder', { folder_path: folderPath });
export const organizeFiles = (folderPath) => api.post('/organize', { folder_path: folderPath });
export const undoOrganize = () => api.post('/undo');

// Backend currently returns these in /scan-folder payload, but helpers are provided
// to keep a clean contract if dedicated endpoints are added later.
export const getStats = (folderPath) => scanFolder(folderPath);
export const getAISuggestions = (folderPath) => scanFolder(folderPath);

export default api;
