import api from './axios';

export const getGamificationData = async () => {
  const { data } = await api.get('/gamification/data');
  return data.data;
};
