import { useState, useCallback } from 'react';
import { toggleLog as apiToggle, getMonthLogs, getStreaks as apiGetStreaks } from '../api/logs';
import { useGamification } from '../store/GamificationContext';
import { triggerConfetti } from '../components/gamification/ConfettiEffect';
import toast from 'react-hot-toast';

export function useLogs() {
  const gContext = useGamification() || {};
  const [logs, setLogs] = useState({}); // { habitId: ['YYYY-MM-DD'] }
  const [streaks, setStreaks] = useState({}); // { habitId: { current, longest } }
  const [isLoading, setIsLoading] = useState(false);

  const fetchMonthLogs = useCallback(async (year, month) => {
    try {
      setIsLoading(true);
      const data = await getMonthLogs(year, month);
      setLogs(data);
    } catch (err) {
      toast.error('Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStreaks = useCallback(async () => {
    try {
      const data = await apiGetStreaks();
      setStreaks(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggleLog = async (habitId, date) => {
    // Optimistic UI update
    const isCompleted = logs[habitId]?.includes(date);
    const newLogs = { ...logs };
    if (!newLogs[habitId]) newLogs[habitId] = [];
    
    if (isCompleted) {
      newLogs[habitId] = newLogs[habitId].filter(d => d !== date);
    } else {
      newLogs[habitId] = [...newLogs[habitId], date];
    }
    setLogs(newLogs);

    try {
      const res = await apiToggle(habitId, date);
      fetchStreaks(); // Resync streaks after a successful toggle
      
      if (gContext.updateFromToggle) {
        gContext.updateFromToggle(res);
      }
      
      if (res.completed && res.newAchievements && res.newAchievements.length > 0) {
        triggerConfetti('achievement');
        res.newAchievements.forEach(ach => {
          toast(`🏆 Achievement Unlocked!\n${ach.name} ${ach.emoji}`, {
            style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '2px dashed var(--accent-purple)', fontWeight: 800, padding: '16px 24px', letterSpacing: '0.05em' },
            duration: 4000,
          });
        });
      }

      return res;
    } catch (err) {
      toast.error('Failed to update log');
      // Revert optimism if API fails
      setLogs(logs); 
    }
  };

  return {
    logs,
    streaks,
    isLoading,
    fetchMonthLogs,
    fetchStreaks,
    toggleLog,
  };
}
