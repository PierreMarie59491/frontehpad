import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// User API
export const userApi = {
  create: (userData) => apiClient.post('/users/', userData),
  getById: (userId) => apiClient.get(`/users/${userId}`),
  getByEmail: (email) => apiClient.get(`/users/email/${email}`),
  update: (userId, userData) => apiClient.put(`/users/${userId}`, userData),
  addXP: (userId, xp) => apiClient.post(`/users/${userId}/xp?xp_points=${xp}`),
  addBadge: (userId, badgeId) => apiClient.post(`/users/${userId}/badges?badge_id=${badgeId}`),
  completeTheme: (userId, theme) => apiClient.post(`/users/${userId}/complete-theme?theme=${theme}`),
  getProgress: (userId) => apiClient.get(`/users/${userId}/progress`),
  saveProgress: (userId, progress) => apiClient.post(`/users/${userId}/progress`, progress),
};

// Quiz API
export const quizApi = {
  getThemes: () => apiClient.get('/quiz/themes'),
  getThemeQuestions: (themeId) => apiClient.get(`/quiz/themes/${themeId}/questions`),
  startSession: (userId, theme) => apiClient.post(`/quiz/sessions?user_id=${userId}&theme=${theme}`),
  getSession: (sessionId) => apiClient.get(`/quiz/sessions/${sessionId}`),
  submitAnswer: (sessionId, questionId, answer) => 
    apiClient.post(`/quiz/sessions/${sessionId}/answer?question_id=${questionId}&user_answer=${answer}`),
  getResults: (sessionId) => apiClient.get(`/quiz/sessions/${sessionId}/results`),
};

// Activities API
export const activitiesApi = {
  getAll: (params = {}) => apiClient.get('/activities/', { params }),
  getById: (activityId) => apiClient.get(`/activities/${activityId}`),
  create: (activityData) => apiClient.post('/activities/', activityData),
  update: (activityId, activityData) => apiClient.put(`/activities/${activityId}`, activityData),
  delete: (activityId) => apiClient.delete(`/activities/${activityId}`),
  getCategories: () => apiClient.get('/activities/categories/list'),
  getUserActivities: (userId) => apiClient.get(`/activities/user/${userId}`),
};

// Budget API
export const budgetApi = {
  getScenarios: () => apiClient.get('/budget/scenarios'),
  getScenario: (scenarioId) => apiClient.get(`/budget/scenarios/${scenarioId}`),
  startSession: (userId, scenarioId) => 
    apiClient.post(`/budget/sessions?user_id=${userId}&scenario_id=${scenarioId}`),
  getSession: (sessionId) => apiClient.get(`/budget/sessions/${sessionId}`),
  submitAnswer: (sessionId, questionIndex, answer) => 
    apiClient.post(`/budget/sessions/${sessionId}/answer?question_index=${questionIndex}&user_answer=${answer}`),
  getResults: (sessionId) => apiClient.get(`/budget/sessions/${sessionId}/results`),
  saveCalculation: (calculation) => apiClient.post('/budget/calculations', calculation),
  getUserCalculations: (userId) => apiClient.get(`/budget/calculations/${userId}`),
};

// Config API
export const configApi = {
  getGameConfig: () => apiClient.get('/config/game'),
  getAvatars: () => apiClient.get('/config/avatars'),
  getBadges: () => apiClient.get('/config/badges'),
  getThemes: () => apiClient.get('/config/themes'),
};

export default apiClient;