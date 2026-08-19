// frontend/src/services/projectService.js
import api from './api';

const getProjects = async () => {
  const response = await api.get('/projects');
  const data = response.data;
  // Return array if already array, else extract `projects` from paginated object
  return Array.isArray(data) ? data : data.projects || [];
};

export default { getProjects };