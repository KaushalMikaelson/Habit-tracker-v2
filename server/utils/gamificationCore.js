const User = require('../models/User');
const Habit = require('../models/Habit');
const DailyLog = require('../models/DailyLog');
const CoinTransaction = require('../models/CoinTransaction');

const ACHIEVEMENTS = [
  { id: "first_habit", name: "First Step", desc: "Complete your first habit", emoji: "🌱" },
  { id: "week_streak", name: "Week Warrior", desc: "7-day streak on any habit", emoji: "🔥" },
  { id: "month_streak", name: "Iron Will", desc: "30-day streak", emoji: "⚡" },
  { id: "century", name: "Century Club", desc: "100 total completions", emoji: "💯" },
  { id: "perfect_day", name: "Perfect Day", desc: "Complete all habits in a day", emoji: "✨" },
  { id: "perfect_week", name: "Perfect Week", desc: "Complete all habits for 7 days", emoji: "👑" },
  { id: "coin_1000", name: "Rich Habits", desc: "Earn 1000 coins", emoji: "🪙" }
];

exports.processGamification = async (userId, habitId, date) => {
  try {
    let coinsEarned = 10;
    let perfectDay = false;
    
    const logs = await DailyLog.find({ userId }).sort({ date: 1 });
    const habits = await Habit.find({ userId, isArchived: false });
    const todayLogs = logs.filter(l => l.date === date);
    
    // 1. Check all habits done today
    if (todayLogs.length >= habits.length && habits.length > 0) {
      coinsEarned += 15;
      perfectDay = true;
    }
    
    // 2. Streak calc for this habit
    const hLogs = logs.filter(l => l.habitId.toString() === habitId.toString());
    let streak = 0; let temp = 0; let lastD = null;
    hLogs.forEach(l => {
      if (!lastD) temp = 1;
      else {
        const diff = Math.round((new Date(l.date) - new Date(lastD))/86400000);
        if (diff === 1) temp++; else temp = 1;
      }
      lastD = l.date;
    });
    streak = temp;
    
    if (streak >= 3) coinsEarned += 5;
    if (streak >= 7) coinsEarned += 20;
    if (streak >= 30) coinsEarned += 50;

    // Save transaction
    await CoinTransaction.create({ userId, amount: coinsEarned, reason: 'Habit Completion', habitId, date });

    // Update User XP & Coins
    const user = await User.findById(userId);
    user.coins += coinsEarned;
    user.totalXP += coinsEarned; // XP = Coins
    
    user.level = Math.floor(user.totalXP / 500) + 1;
    
    // Achievement Checks
    let unlocked = [];
    const hasAch = (id) => user.achievements.some(a => a.id === id);
    const unlock = (id) => {
      user.achievements.push({ id, unlockedAt: new Date() });
      unlocked.push(ACHIEVEMENTS.find(a => a.id === id));
    };

    if (!hasAch('first_habit') && logs.length >= 1) unlock('first_habit');
    if (!hasAch('century') && logs.length >= 100) unlock('century');
    if (!hasAch('week_streak') && streak >= 7) unlock('week_streak');
    if (!hasAch('month_streak') && streak >= 30) unlock('month_streak');
    if (!hasAch('perfect_day') && perfectDay) unlock('perfect_day');
    if (!hasAch('coin_1000') && user.coins >= 1000) unlock('coin_1000');

    await user.save();

    return { coinsEarned, newTotal: user.coins, newLevel: user.level, achievements: unlocked };

  } catch (err) {
    console.error('Gamification process failed', err);
    return { coinsEarned: 0 };
  }
};

exports.getGamificationData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const tx = await CoinTransaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);
    
    res.json({
      success: true,
      data: {
        coins: user.coins,
        level: user.level,
        totalXP: user.totalXP,
        achievements: user.achievements,
        transactions: tx,
        ACHIEVEMENTS_LIST: ACHIEVEMENTS
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
};
