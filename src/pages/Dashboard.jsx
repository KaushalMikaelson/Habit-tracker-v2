import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import GreetingCard from '../components/dashboard/GreetingCard';
import StatRingCard from '../components/dashboard/StatRingCard';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import HabitAnalyticsChart from '../components/dashboard/HabitAnalyticsChart';
import TopHabits from '../components/dashboard/TopHabits';
import RemindersPanel from '../components/dashboard/RemindersPanel';
import { SkeletonStatCard, SkeletonChartArea } from '../components/ui/Skeleton';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function Dashboard() {
  const { stats, reminders, focusItems, loading, addReminder, toggleReminder, deleteReminder } = useDashboard();
  const [focusOpen, setFocusOpen] = useState(true);

  if (loading || !stats) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" style={styles.container}>
        {/* Skeleton stat cards */}
        <div style={styles.topRow}>
          <div style={{ flex: 1, minWidth: 200, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 20 }} />
          <div style={styles.ringsContainer}>
            {[0,1,2,3].map(i => <SkeletonStatCard key={i} />)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <SkeletonChartArea />
          <SkeletonChartArea />
        </div>
      </motion.div>
    );
  }

  const ringCards = [
    { label: 'MOMENTUM', percent: stats.momentum.score, delta: stats.momentum.delta, color: 'var(--accent-green)' },
    { label: 'TODAY', percent: stats.today.percent, delta: stats.today.delta, color: 'var(--accent-blue)' },
    { label: 'WEEKLY', percent: stats.weekly.percent, delta: stats.weekly.delta, color: 'var(--accent-purple)' },
    { label: 'MONTHLY', percent: stats.monthly.percent, delta: stats.monthly.delta, color: '#ef4444' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={styles.container}
    >
      {/* TOP ROW: Greeting + Ring Cards */}
      <div style={styles.topRow}>
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" style={{ flex: 1, minWidth: 200 }}>
          <GreetingCard />
        </motion.div>

        {/* Ring cards: 4-in-a-row desktop, 2x2 mobile */}
        <div style={styles.ringsContainer}>
          {ringCards.map((card, i) => (
            <motion.div
              key={card.label}
              custom={i + 1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ flex: 1, minWidth: 130 }}
            >
              <StatRingCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* MAIN ROW */}
      <div style={styles.mainRow}>
        {/* Today's Focus — collapsible on mobile */}
        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" style={{ flex: '1.5', minWidth: 220 }}>
          <div className="collapsible-panel">
            <button
              className="collapsible-header"
              onClick={() => setFocusOpen(o => !o)}
              aria-expanded={focusOpen}
            >
              <span>📋 TODAY'S FOCUS</span>
              <span className="collapsible-chevron" style={{ transform: focusOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
            </button>
            {focusOpen && (
              <TodaysFocus items={focusItems} onAdd={addReminder} onToggle={toggleReminder} onDelete={deleteReminder} />
            )}
          </div>
        </motion.div>

        {/* Analytics chart */}
        <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible" style={{ flex: '3', minWidth: 260 }}>
          <HabitAnalyticsChart data={stats.chartData} />
        </motion.div>

        {/* Right col: Top Habits + Reminders */}
        <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible" style={styles.rightCol}>
          <TopHabits habits={stats.topHabits} />
          <RemindersPanel items={reminders} onAdd={addReminder} onToggle={toggleReminder} onDelete={deleteReminder} />
        </motion.div>
      </div>
    </motion.div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' },
  topRow: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  ringsContainer: { display: 'flex', flex: '3', gap: '16px', flexWrap: 'wrap' },
  mainRow: { display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '24px', flex: '1', minWidth: '280px' },
};
