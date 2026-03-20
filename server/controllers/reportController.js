const DailyLog = require('../models/DailyLog');
const Habit = require('../models/Habit');

function formatD(d) {
  return d.toISOString().split('T')[0];
}

exports.getDailyReport = async (req, res) => {
  try {
    const dateStr = req.query.date || formatD(new Date());
    const habits = await Habit.find({ userId: req.user._id, isArchived: false });
    const logs = await DailyLog.find({ userId: req.user._id, date: dateStr });
    
    const completedSet = new Set(logs.map(l => l.habitId.toString()));
    
    const habitData = habits.map(h => ({
      name: h.name,
      category: h.category,
      completed: completedSet.has(h._id.toString()),
      streak: completedSet.has(h._id.toString()) ? 1 : 0 // Simplified streak for demo
    }));

    const doneCount = logs.length;
    const totalCount = habits.length;

    res.json({
      success: true,
      report: {
        date: dateStr,
        userName: req.user.name,
        habits: habitData,
        summary: {
          done: doneCount,
          total: totalCount,
          percent: totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0,
          coinsEarned: doneCount * 10
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily report' });
  }
};

exports.getWeeklyReport = async (req, res) => {
  try {
    // Basic approximate week for provided start date
    const startStr = req.query.startDate || formatD(new Date());
    const startDate = new Date(startStr);
    
    // Default to last 7 days from start
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(formatD(d));
    }
    
    const habits = await Habit.find({ userId: req.user._id, isArchived: false });
    const logs = await DailyLog.find({ userId: req.user._id, date: { $in: dates } });

    const logsByHabit = {};
    const chartDataMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    logs.forEach(l => {
      const hId = l.habitId.toString();
      if (!logsByHabit[hId]) logsByHabit[hId] = new Set();
      logsByHabit[hId].add(l.date);
      chartDataMap[dayNames[new Date(l.date).getUTCDay()]]++;
    });

    const chartData = Object.keys(chartDataMap).map(k => ({ day: k, count: chartDataMap[k] }));
    const perfectHabits = [];
    const missedMostHabits = [];

    const habitData = habits.map(h => {
      const doneSet = logsByHabit[h._id.toString()] || new Set();
      const days = {};
      
      dates.forEach(d => {
        const dayKey = dayNames[new Date(d).getUTCDay()].toLowerCase();
        days[dayKey] = doneSet.has(d);
      });
      
      const total = doneSet.size;
      const pct = Math.round((total / 7) * 100);
      
      if (total === 7) perfectHabits.push(h.name);
      if (total <= 1) missedMostHabits.push(h.name);

      return {
        name: h.name,
        days,
        total,
        percent: pct,
        streak: total // stub
      };
    });

    const grandTotal = logs.length;
    res.json({
      success: true,
      report: {
        weekRange: `${dates[0]} to ${dates[6]}`,
        userName: req.user.name,
        habits: habitData,
        summary: {
          totalCompletions: grandTotal,
          bestDay: chartData.sort((a,b)=>b.count-a.count)[0].day,
          worstDay: chartData.sort((a,b)=>a.count-b.count)[0].day,
          completionPercent: habits.length > 0 ? Math.round((grandTotal / (habits.length*7))*100) : 0,
          vsLastWeek: 5, // mock
          perfectHabits,
          missedMostHabits
        },
        chartData
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weekly report' });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || (new Date().getMonth() + 1);
    
    const paddedMonth = String(month).padStart(2, '0');
    const startStr = `${year}-${paddedMonth}-01`;
    const endStr = `${year}-${paddedMonth}-31`;

    const habits = await Habit.find({ userId: req.user._id, isArchived: false });
    const logs = await DailyLog.find({ 
      userId: req.user._id, 
      date: { $gte: startStr, $lte: endStr } 
    });

    const habitCounts = {};
    const dailyDataMap = {};
    for(let i=1; i<=31; i++) dailyDataMap[String(i).padStart(2, '0')] = 0;

    logs.forEach(l => {
      const hId = l.habitId.toString();
      habitCounts[hId] = (habitCounts[hId] || 0) + 1;
      
      const dayStr = l.date.split('-')[2];
      if (dailyDataMap[dayStr] !== undefined) dailyDataMap[dayStr]++;
    });

    const categoryBreakdown = {};
    const habitData = habits.map(h => {
      const count = habitCounts[h._id.toString()] || 0;
      const target = 30; // Approx
      const pct = Math.min(100, Math.round((count / target) * 100));
      
      let status = 'Inactive';
      if (pct > 80) status = 'On Fire';
      else if (pct >= 60) status = 'On Track';
      else if (pct >= 30) status = 'Needs Work';

      if (!categoryBreakdown[h.category]) categoryBreakdown[h.category] = { done: 0, target: 0 };
      categoryBreakdown[h.category].done += count;
      categoryBreakdown[h.category].target += target;

      return {
        name: h.name,
        doneCount: count,
        targetCount: target,
        percent: pct,
        streak: count, // mock
        status
      };
    });

    // Top habits
    let topHabits = [...habitData].sort((a,b) => b.percent - a.percent).slice(0,3);
    topHabits = topHabits.map((h, i) => ({ rank: i+1, name: h.name, percent: h.percent }));

    const dailyDataFormat = Object.keys(dailyDataMap).map(d => ({
      date: d,
      count: dailyDataMap[d]
    }));

    const totalCompletions = logs.length;
    res.json({
      success: true,
      report: {
        monthName: `${year}-${paddedMonth}`,
        userName: req.user.name,
        habits: habitData,
        summary: {
          totalCompletions,
          bestWeek: 'Week 2', // mock
          mostConsistentHabit: topHabits[0]?.name || 'N/A',
          completionPercent: habits.length ? Math.round((totalCompletions / (habits.length*30))*100) : 0,
          vsLastMonth: 12, // mock
          coinsEarned: totalCompletions * 10,
          categoryBreakdown
        },
        dailyData: dailyDataFormat,
        topHabits
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch monthly report' });
  }
};
