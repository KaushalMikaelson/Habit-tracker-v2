const DailyLog = require('../models/DailyLog');
const Habit = require('../models/Habit');

function getDayName(dateStr) {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getUTCDay()];
}

function getMonthName(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

exports.getHabitStats = async (req, res) => {
  try {
    const { habitId } = req.params;
    const logs = await DailyLog.find({ userId: req.user._id, habitId }).sort({ date: 1 });
    
    const heatmap = {};
    let totalCompletions = 0;
    
    // We want Monday to be first conventionally, but let's do object mapping
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const monthCounts = {};

    logs.forEach(log => {
      heatmap[log.date] = true;
      totalCompletions++;
      dayCounts[getDayName(log.date)]++;
      
      const mName = getMonthName(log.date);
      monthCounts[mName] = (monthCounts[mName] || 0) + 1;
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;
    const todayStr = new Date().toISOString().split('T')[0];

    logs.forEach(log => {
      if (!lastDate) {
        tempStreak = 1;
      } else {
        const prev = new Date(lastDate);
        const curr = new Date(log.date);
        const diff = Math.round((curr - prev) / 86400000);
        if (diff === 1) tempStreak++;
        else if (diff > 1) {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          tempStreak = 1;
        }
      }
      lastDate = log.date;
    });
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    if (lastDate) {
      const diffToToday = Math.round((new Date(todayStr) - new Date(lastDate)) / 86400000);
      if (diffToToday <= 1) currentStreak = tempStreak;
    }

    let bestDay = 'N/A';
    let worstDay = 'N/A';
    let max = -1, min = 999999;
    for (const d in dayCounts) {
      if (dayCounts[d] > max) { max = dayCounts[d]; bestDay = d; }
      if (dayCounts[d] < min) { min = dayCounts[d]; worstDay = d; }
    }

    res.json({
      success: true,
      stats: {
        heatmap,
        currentStreak,
        longestStreak,
        totalCompletions,
        completionByDayOfWeek: dayCounts,
        completionByMonth: monthCounts,
        bestDay: (max === 0) ? 'None' : bestDay,
        worstDay: (min === 0 && max === 0) ? 'None' : worstDay
      }
    });
  } catch (err) {
    console.error('getHabitStats error:', err);
    res.status(500).json({ error: 'Failed to fetch habit stats' });
  }
};

exports.getOverallStats = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, isArchived: false });
    const logs = await DailyLog.find({ userId: req.user._id });

    const totalHabits = habits.length;
    const totalCompletions = logs.length;

    let overallConsistency = 0;
    let categoryBreakdown = {};
    const habitCompletions = {};

    logs.forEach(log => {
      habitCompletions[log.habitId] = (habitCompletions[log.habitId] || 0) + 1;
    });

    habits.forEach(h => {
      if (!categoryBreakdown[h.category]) categoryBreakdown[h.category] = { done: 0, total: 30 }; // assumed 30 day target basis
      categoryBreakdown[h.category].done += (habitCompletions[h._id] || 0);
      categoryBreakdown[h.category].total += 30; // dynamic scaling
    });

    let mostConsistentHabit = { name: 'None', percent: 0 };
    let leastConsistentHabit = { name: 'None', percent: 100 };
    
    let maxPct = -1;
    let minPct = 101;

    habits.forEach(h => {
      const comps = habitCompletions[h._id] || 0;
      const pct = Math.min(100, Math.round((comps / 30) * 100)); // arbitrary 30-day target for consistency metric
      
      if (pct > maxPct) { maxPct = pct; mostConsistentHabit = { name: h.name, percent: pct }; }
      if (pct < minPct) { minPct = pct; leastConsistentHabit = { name: h.name, percent: pct }; }
    });

    if (totalHabits > 0) {
      const totalPct = habits.reduce((acc, h) => {
        const comps = habitCompletions[h._id] || 0;
        return acc + Math.min(100, Math.round((comps / 30) * 100));
      }, 0);
      overallConsistency = Math.round(totalPct / totalHabits);
    }

    res.json({
      success: true,
      stats: {
        totalHabits,
        totalCompletions,
        currentLongestStreak: { habitName: mostConsistentHabit.name, days: Math.floor(mostConsistentHabit.percent / 5) }, // Dummy dynamic longest streak based on completion
        overallConsistency,
        mostConsistentHabit,
        leastConsistentHabit,
        categoryBreakdown
      }
    });
  } catch (err) {
    console.error('getOverallStats error:', err);
    res.status(500).json({ error: 'Failed to fetch overall stats' });
  }
};
