import { useState, useCallback } from 'react';

/**
 * useHabits – Habits data hook.
 * Stage 1: Returns stubs. Will make real API calls in Stage 2.
 */
export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: call GET /api/habits in Stage 2
      setHabits([]);
    } catch (err) {
      setError(err.message || 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  }, []);

  const createHabit = useCallback(async (habitData) => {
    setLoading(true);
    try {
      // TODO: call POST /api/habits in Stage 2
      console.log('Create habit stub:', habitData);
    } catch (err) {
      setError(err.message || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHabit = useCallback(async (id, habitData) => {
    setLoading(true);
    try {
      // TODO: call PATCH /api/habits/:id in Stage 2
      console.log('Update habit stub:', id, habitData);
    } catch (err) {
      setError(err.message || 'Failed to update habit');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteHabit = useCallback(async (id) => {
    setLoading(true);
    try {
      // TODO: call DELETE /api/habits/:id in Stage 2
      console.log('Delete habit stub:', id);
    } catch (err) {
      setError(err.message || 'Failed to delete habit');
    } finally {
      setLoading(false);
    }
  }, []);

  const logHabit = useCallback(async (habitId, date) => {
    setLoading(true);
    try {
      // TODO: call POST /api/habits/:id/log in Stage 2
      console.log('Log habit stub:', habitId, date);
    } catch (err) {
      setError(err.message || 'Failed to log habit');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    habits,
    loading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    logHabit,
  };
}
