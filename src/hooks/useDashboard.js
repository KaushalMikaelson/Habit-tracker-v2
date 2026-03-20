import { useState, useCallback, useEffect } from 'react';
import * as dbApi from '../api/dashboard';
import toast from 'react-hot-toast';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [focusItems, setFocusItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [st, rem, foc] = await Promise.all([
        dbApi.getStats(),
        dbApi.getReminders(),
        dbApi.getFocus()
      ]);
      setStats(st);
      setReminders(rem);
      setFocusItems(foc);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addReminder = async (text, type = 'reminder') => {
    try {
      const item = await dbApi.createReminder({ text, type });
      if (type === 'focus') setFocusItems(p => [item, ...p]);
      else setReminders(p => [item, ...p]);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add item');
      return { success: false };
    }
  };

  const toggleReminder = async (id, type = 'reminder') => {
    try {
      // Opt UI
      const updater = type === 'focus' ? setFocusItems : setReminders;
      updater(p => p.map(i => i._id === id ? { ...i, done: !i.done } : i));
      await dbApi.toggleReminder(id);
    } catch (err) {
      toast.error('Failed to toggle');
      fetchAll();
    }
  };

  const deleteReminder = async (id, type = 'reminder') => {
    try {
      const updater = type === 'focus' ? setFocusItems : setReminders;
      updater(p => p.filter(i => i._id !== id));
      await dbApi.deleteReminder(id);
    } catch (err) {
      toast.error('Failed to delete');
      fetchAll();
    }
  };

  return {
    stats,
    reminders,
    focusItems,
    loading,
    addReminder,
    toggleReminder,
    deleteReminder,
    refresh: fetchAll
  };
}
