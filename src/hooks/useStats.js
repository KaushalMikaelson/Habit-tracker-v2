import { useState, useCallback } from 'react';
import { getOverallStats, getHabitStats } from '../api/stats';
import toast from 'react-hot-toast';

export function useStats() {
  const [overallStats, setOverallStats] = useState(null);
  const [habitStats, setHabitStats] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchOverall = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOverallStats();
      setOverallStats(data);
    } catch (err) {
      toast.error('Failed to fetch overall stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHabit = useCallback(async (habitId) => {
    if (!habitId) return;
    try {
      setLoading(true);
      const data = await getHabitStats(habitId);
      setHabitStats((prev) => ({ ...prev, [habitId]: data }));
    } catch (err) {
      toast.error('Failed to fetch habit stats');
    } finally {
      setLoading(false);
    }
  }, []);

  return { overallStats, habitStats, loading, fetchOverall, fetchHabit };
}
