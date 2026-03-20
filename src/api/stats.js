import api from './axios';

export const getOverallStats = async () => {
  const { data } = await api.get('/stats/overall');
  return data.stats;
};

export const getHabitStats = async (habitId) => {
  const { data } = await api.get(`/stats/habit/${habitId}`);
  return data.stats;
};
