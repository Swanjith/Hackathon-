/**
 * API service for communicating with Flask backend
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const API = {
  healthCheck: () => api.get('/health'),
  
  getConfig: () => api.get('/config').then(res => res.data),
  
  getCurrentMetrics: () => api.get('/metrics/current').then(res => res.data),
  
  getHistoricalMetrics: () => api.get('/metrics/historical').then(res => res.data),
  
  getAgents: () => api.get('/agents').then(res => res.data.agents),
  
  getAgent: (agentId) => api.get(`/agents/${agentId}`).then(res => res.data),
  
  getActiveAssignments: () => api.get('/assignments/active').then(res => res.data.assignments),
  
  getRoutingMatrix: (batchSize = 10) => 
    api.post('/routing/matrix', { batch_size: batchSize }).then(res => res.data),
  
  getDualVariables: () => api.get('/constraints/dual').then(res => res.data),
  
  getPolicyComparison: () => api.get('/policies/compare').then(res => res.data.policies),
  
  startSimulation: (nBatches = 50, policy = 'CUCB-OTA') =>
    api.post('/simulation/start', { n_batches: nBatches, policy }),
  
  stopSimulation: () => api.post('/simulation/stop'),
  
  getSimulationStatus: () => api.get('/simulation/status').then(res => res.data),
};

export default API;

