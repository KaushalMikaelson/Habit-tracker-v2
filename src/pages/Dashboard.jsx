import { useDashboard } from '../hooks/useDashboard';
import GreetingCard from '../components/dashboard/GreetingCard';
import StatRingCard from '../components/dashboard/StatRingCard';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import HabitAnalyticsChart from '../components/dashboard/HabitAnalyticsChart';
import TopHabits from '../components/dashboard/TopHabits';
import RemindersPanel from '../components/dashboard/RemindersPanel';
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
  const { stats, reminders, focusItems, loading, addReminder, toggleReminder, deleteReminder } = useDashboard();

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={32} color="var(--accent-green)" />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* TOP ROW: Greeting + Ring Cards */}
      <div style={styles.topRow}>
        <GreetingCard />
        <div style={styles.ringsContainer}>
          <StatRingCard label="MOMENTUM" percent={stats.momentum.score} delta={stats.momentum.delta} color="var(--accent-green)" />
          <StatRingCard label="TODAY" percent={stats.today.percent} delta={stats.today.delta} color="var(--accent-blue)" />
          <StatRingCard label="WEEKLY" percent={stats.weekly.percent} delta={stats.weekly.delta} color="var(--accent-purple)" />
          <StatRingCard label="MONTHLY" percent={stats.monthly.percent} delta={stats.monthly.delta} color="#ef4444" />
        </div>
      </div>

      {/* MAIN ROW: Todays Focus (left) + Analytics (center) + Top Habits & Reminders (right) */}
      <div style={styles.mainRow}>
        <TodaysFocus items={focusItems} onAdd={addReminder} onToggle={toggleReminder} onDelete={deleteReminder} />
        <HabitAnalyticsChart data={stats.chartData} />
        <div style={styles.rightCol}>
          <TopHabits habits={stats.topHabits} />
          <RemindersPanel items={reminders} onAdd={addReminder} onToggle={toggleReminder} onDelete={deleteReminder} />
        </div>
      </div>
    </div>
  );
}

// Fixed styling to match screenshot request
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBottom: '24px'
  },
  topRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  ringsContainer: {
    display: 'flex',
    flex: '3',
    gap: '16px',
    flexWrap: 'wrap'
  },
  mainRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    alignItems: 'stretch'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flex: '1',
    minWidth: '280px'
  }
};
