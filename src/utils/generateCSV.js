import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export function downloadCSV(type, data) {
  let csvData = [];
  let filename = `HabitTracker_${type}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

  if (type === 'Daily') {
    csvData = data.habits.map(h => ({
      date: data.date,
      habit_name: h.name,
      completed: h.completed ? 'Yes' : 'No',
      streak: h.streak
    }));
  } else if (type === 'Weekly') {
    csvData = data.habits.map(h => ({
      week_start: data.weekRange,
      habit_name: h.name,
      mon: h.days.mon ? 'Yes' : 'No', 
      tue: h.days.tue ? 'Yes' : 'No', 
      wed: h.days.wed ? 'Yes' : 'No', 
      thu: h.days.thu ? 'Yes' : 'No', 
      fri: h.days.fri ? 'Yes' : 'No', 
      sat: h.days.sat ? 'Yes' : 'No', 
      sun: h.days.sun ? 'Yes' : 'No',
      total: h.total, 
      percent: h.percent
    }));
  } else if (type === 'Monthly') {
    csvData = data.habits.map(h => ({
      month: data.monthName,
      habit_name: h.name,
      days_done: h.doneCount,
      days_target: h.targetCount,
      percent: h.percent,
      longest_streak: h.streak,
      status: h.status
    }));
  }
  
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}
