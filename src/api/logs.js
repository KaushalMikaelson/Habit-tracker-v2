import api from './axios';

export const toggleLog = async (habitId, date) => {
  const { data } = await api.post('/logs/toggle', { habitId, date });
  return data;
};

export const getMonthLogs = async (year, month) => {
  const { data } = await api.get(`/logs/month?year=${year}&month=${month}`);
  return data.logs;
};

export const getStreaks = async () => {
  const { data } = await api.get('/logs/streaks');
  return data.streaks;
};

export const getCompletionStats = async () => {
  const { data } = await api.get('/logs/stats');
  return data.stats;
};
