import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getGamificationData } from '../api/gamification';

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const [gameData, setGameData] = useState(null);
  const [recentCoins, setRecentCoins] = useState(null);
  
  const executeRefetch = useCallback(async () => {
    try {
      const res = await getGamificationData();
      setGameData(res);
    } catch {}
  }, []);

  useEffect(() => {
    executeRefetch();
  }, [executeRefetch]);

  const updateFromToggle = (apiRes) => {
    if (apiRes.completed && apiRes.coinsEarned) {
       setRecentCoins(apiRes.coinsEarned);
       setGameData(prev => prev ? {
         ...prev,
         coins: apiRes.newTotal,
         level: apiRes.newLevel
       } : prev);
       
       setTimeout(() => setRecentCoins(null), 2500);
    }
  };

  return (
    <GamificationContext.Provider value={{ gameData, executionRefetch: executeRefetch, updateFromToggle, recentCoins }}>
      {children}
    </GamificationContext.Provider>
  );
}

export const useGamification = () => useContext(GamificationContext);
