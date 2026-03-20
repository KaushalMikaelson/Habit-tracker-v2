import { format, parseISO, differenceInDays, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, eachDayOfInterval, isToday, isYesterday,
  isSameDay, addDays, subDays, getDay, getMonth, getYear } from 'date-fns';

// ── Formatting ───────────────────────────────────────────

/** Format a date as "Mon, Mar 20" */
export const formatDisplayDate = (date) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'EEE, MMM d');

/** Format a date as "March 20, 2026" */
export const formatFullDate = (date) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'MMMM d, yyyy');

/** Format a date as "2026-03-20" (ISO date string) */
export const toISODateString = (date) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd');

/** Format a date as "20 Mar" */
export const formatShortDate = (date) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'd MMM');

// ── Ranges ───────────────────────────────────────────────

/** Get all days in the current week (Mon–Sun) */
export const getCurrentWeekDays = () => {
  const now = new Date();
  return eachDayOfInterval({
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  });
};

/** Get all days in the current month */
export const getCurrentMonthDays = () => {
  const now = new Date();
  return eachDayOfInterval({
    start: startOfMonth(now),
    end: endOfMonth(now),
  });
};

/** Get the last N days including today */
export const getLastNDays = (n) => {
  const today = new Date();
  return eachDayOfInterval({ start: subDays(today, n - 1), end: today });
};

// ── Comparisons ─────────────────────────────────────────

export { isToday, isYesterday, isSameDay, differenceInDays };

/** Check if a date string (yyyy-MM-dd) is today */
export const isDateToday = (dateStr) => isSameDay(parseISO(dateStr), new Date());

// ── Streak Calculation ───────────────────────────────────

/**
 * Calculate current streak from an array of ISO date strings.
 * Dates must be sorted descending (most recent first).
 */
export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;

  const sorted = [...completedDates]
    .map((d) => (typeof d === 'string' ? parseISO(d) : d))
    .sort((a, b) => b - a);

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const date of sorted) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const diff = differenceInDays(cursor, d);

    if (diff === 0 || diff === 1) {
      streak++;
      cursor = d;
    } else {
      break;
    }
  }

  return streak;
};

// ── Completion Rate ──────────────────────────────────────

/**
 * Calculate % completion for a habit over the last N days.
 * @param {string[]} completedDates - ISO date strings of completions
 * @param {number} days - window (default 30)
 */
export const getCompletionRate = (completedDates, days = 30) => {
  const window = getLastNDays(days);
  if (!completedDates || completedDates.length === 0) return 0;

  const completedSet = new Set(completedDates.map(toISODateString));
  const completed = window.filter((d) => completedSet.has(toISODateString(d))).length;
  return Math.round((completed / days) * 100);
};

// ── Week/Month Helpers ───────────────────────────────────

export const getDayLabel = (date) => format(date, 'EEE');
export const getMonthLabel = (date) => format(date, 'MMM');
export const getDayOfMonth = (date) => format(date, 'd');

/** Get a map of { "yyyy-MM-dd": true } from an array of dates */
export const buildDateSet = (dates) =>
  new Set((dates || []).map((d) => toISODateString(typeof d === 'string' ? parseISO(d) : d)));
