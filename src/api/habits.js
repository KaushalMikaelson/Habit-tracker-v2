import api from './axios';

export const getHabits = async () => {
  const { data } = await api.get('/habits');
  return data.habits;
};

export const createHabit = async (habitData) => {
  const { data } = await api.post('/habits', habitData);
  return data.habit;
};

export const updateHabit = async (id, habitData) => {
  const { data } = await api.put(`/habits/${id}`, habitData);
  return data.habit;
};

export const deleteHabit = async (id) => {
  const { data } = await api.delete(`/habits/${id}`);
  return data.habit;
};

export const reorderHabits = async (orderedIds) => {
  const { data } = await api.put('/habits/reorder', { orderedIds });
  return data;
};
