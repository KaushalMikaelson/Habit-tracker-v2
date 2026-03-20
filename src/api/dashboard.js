import api from './axios';

export const getStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data.stats;
};

export const getReminders = async () => {
  const { data } = await api.get('/reminders?type=reminder');
  return data.items;
};

export const getFocus = async () => {
  const { data } = await api.get('/reminders?type=focus');
  return data.items;
};

export const createReminder = async (itemData) => {
  const { data } = await api.post('/reminders', itemData);
  return data.item;
};

export const toggleReminder = async (id) => {
  const { data } = await api.put(`/reminders/${id}`);
  return data.item;
};

export const deleteReminder = async (id) => {
  await api.delete(`/reminders/${id}`);
};
