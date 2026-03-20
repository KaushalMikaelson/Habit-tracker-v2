import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getHabits as apiGetHabits, createHabit as apiCreateHabit, updateHabit as apiUpdateHabit, deleteHabit as apiDeleteHabit, reorderHabits as apiReorderHabits } from '../api/habits';
import toast from 'react-hot-toast';

const HabitsContext = createContext(null);

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetHabits();
      setHabits(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load habits');
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const createHabit = useCallback(async (habitData) => {
    try {
      const newHabit = await apiCreateHabit(habitData);
      setHabits((prev) => [...prev, newHabit]);
      toast.success('Habit created!');
      return { success: true, habit: newHabit };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create habit';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, []);

  const updateHabit = useCallback(async (id, habitData) => {
    try {
      setHabits((prev) => prev.map((h) => (h._id === id ? { ...h, ...habitData } : h)));
      const updated = await apiUpdateHabit(id, habitData);
      setHabits((prev) => prev.map((h) => (h._id === id ? updated : h)));
      toast.success('Habit updated!');
      return { success: true, habit: updated };
    } catch (err) {
      fetchHabits();
      const msg = err.response?.data?.error || 'Failed to update habit';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, [fetchHabits]);

  const deleteHabit = useCallback(async (id) => {
    try {
      setHabits((prev) => prev.filter((h) => h._id !== id));
      await apiDeleteHabit(id);
      toast.success('Habit deleted');
      return { success: true };
    } catch (err) {
      fetchHabits();
      toast.error('Failed to delete habit');
      return { success: false };
    }
  }, [fetchHabits]);

  const reorderHabits = useCallback(async (orderedIds) => {
    try {
      const orderMap = {};
      orderedIds.forEach((item) => { orderMap[item.id] = item.order; });

      setHabits((prev) => {
        const next = prev.map((h) => {
          if (orderMap[h._id] !== undefined) {
            return { ...h, order: orderMap[h._id] };
          }
          return h;
        });
        return next.sort((a, b) => a.order - b.order);
      });

      await apiReorderHabits(orderedIds);
      return { success: true };
    } catch (err) {
      fetchHabits();
      toast.error('Failed to reorder habits');
      return { success: false };
    }
  }, [fetchHabits]);

  const value = {
    habits,
    loading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}
