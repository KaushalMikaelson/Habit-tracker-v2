const DailyLog = require('../models/DailyLog');
const Habit = require('../models/Habit');

exports.toggleLog = async (req, res) => {
  try {
    const { habitId, date } = req.body;
    
    if (!habitId || !date) {
      return res.status(400).json({ error: 'habitId and date are required' });
    }

    const existingLog = await DailyLog.findOne({ userId: req.user._id, habitId, date });
    
    if (existingLog) {
      await DailyLog.deleteOne({ _id: existingLog._id });
      return res.json({ success: true, completed: false, date, habitId });
    } else {
      await DailyLog.create({ userId: req.user._id, habitId, date, completed: true });
      
      const { processGamification } = require('../utils/gamificationCore');
      const gameData = await processGamification(req.user._id, habitId, date) || {};

      return res.json({ 
        success: true, 
        completed: true, 
        date, 
        habitId, 
        coinsEarned: gameData.coinsEarned || 0,
        newTotal: gameData.newTotal,
        newLevel: gameData.newLevel,
        newAchievements: gameData.achievements || []
      });
    }
  } catch (err) {
    console.error('toggleLog error:', err);
    res.status(500).json({ error: 'Failed to toggle log' });
  }
};

exports.getMonthLogs = async (req, res) => {
  try {
    const { year, month } = req.query; // e.g. 2026, 3
    if (!year || !month) return res.status(400).json({ error: 'year and month required' });

    // Format month to 2 digits
    const paddedMonth = String(month).padStart(2, '0');
    // Using simple string comparison for date ranges (YYYY-MM-DD format works well for this)
    const startDate = `${year}-${paddedMonth}-01`;
    const endDate = `${year}-${paddedMonth}-31`;

    const logs = await DailyLog.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Format: { "habitId": ["2026-03-01", "2026-03-05", ...] }
    const result = {};
    logs.forEach(log => {
      if (!result[log.habitId]) result[log.habitId] = [];
      result[log.habitId].push(log.date);
    });

    res.json({ success: true, logs: result });
  } catch (err) {
    console.error('getMonthLogs error:', err);
    res.status(500).json({ error: 'Failed to fetch month logs' });
  }
};

exports.getStreaks = async (req, res) => {
  try {
    // 1. Fetch all logs for user
    const logs = await DailyLog.find({ userId: req.user._id }).sort({ habitId: 1, date: 1 });
    
    // 2. Group by habitId
    const grouped = {};
    logs.forEach(l => {
      if (!grouped[l.habitId]) grouped[l.habitId] = [];
      grouped[l.habitId].push(l.date);
    });

    const streaks = {};
    // Get today's local date in YYYY-MM-DD (approx based on UTC to avoid strict timezone sync logic)
    const today = new Date().toISOString().split('T')[0];

    for (const habitId in grouped) {
      const dates = grouped[habitId];
      if (!dates.length) continue;
      
      let current = 0;
      let longest = 0;
      let tempStreak = 1;
      
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        // Difference in days (ignoring daylight saving shifts if using strict UTC midday)
        // using UTC to avoid offset issues
        const diffInDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 1) {
          tempStreak++;
        } else {
          if (tempStreak > longest) longest = tempStreak;
          tempStreak = 1;
        }
      }
      if (tempStreak > longest) longest = tempStreak;

      // Current streak check
      const lastDate = dates[dates.length - 1];
      const diffToToday = Math.round((new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
      
      // If completed today or yesterday, they have a current streak active
      if (diffToToday <= 1) {
        current = tempStreak;
      } else {
        current = 0;
      }

      streaks[habitId] = { current, longest };
    }

    res.json({ success: true, streaks });
  } catch (err) {
    console.error('getStreaks error:', err);
    res.status(500).json({ error: 'Failed to calculate streaks' });
  }
};

exports.getCompletionStats = async (req, res) => {
  try {
    // Placeholder for extended completion stats calculations.
    // Full implementation requires logic for week boundaries and habit targetDays.
    res.json({ success: true, stats: {} });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
};
