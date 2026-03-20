import api from './axios';

export const getDailyReport = async (date) => (await api.get(`/reports/daily?date=${date}`)).data.report;
export const getWeeklyReport = async (startDate) => (await api.get(`/reports/weekly?startDate=${startDate}`)).data.report;
export const getMonthlyReport = async (year, month) => (await api.get(`/reports/monthly?year=${year}&month=${month}`)).data.report;
