import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStats } from '../hooks/useStats';
import { useHabits } from '../hooks/useHabits';
import Heatmap from '../components/stats/Heatmap';
import CategoryDonut from '../components/stats/CategoryDonut';
import WeeklyBarChart from '../components/stats/WeeklyBarChart';
import MonthlyTrendChart from '../components/stats/MonthlyTrendChart';
import { SkeletonStatCard, SkeletonHeatmap, SkeletonCard } from '../components/ui/Skeleton';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function StatCard({ label, value, i = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08, duration: 0.3 }}
      style={styles.statCard}
    >
      <div style={styles.statVal}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </motion.div>
  );
}

export default function Stats() {
  const { overallStats, habitStats, loading, fetchOverall, fetchHabit } = useStats();
  const { habits, loading: habitsLoading } = useHabits();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHabitId, setSelectedHabitId] = useState('');

  useEffect(() => { fetchOverall(); }, [fetchOverall]);

  useEffect(() => {
    if (activeTab === 'perHabit' && selectedHabitId && !habitStats[selectedHabitId]) {
      fetchHabit(selectedHabitId);
    }
  }, [activeTab, selectedHabitId, fetchHabit, habitStats]);

  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0]._id);
    }
  }, [habits, selectedHabitId]);

  if (loading || habitsLoading) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" style={styles.page}>
        <h2 className="text-gradient-green" style={{ margin: '0 0 24px 0' }}>Stats & Insights</h2>
        <div style={styles.cardsRow}>
          {[0, 1, 2, 3].map(i => <SkeletonStatCard key={i} />)}
        </div>
        <SkeletonCard style={{ marginTop: 24 }}>
          <SkeletonHeatmap />
        </SkeletonCard>
      </motion.div>
    );
  }

  if (!overallStats) return null;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={styles.page}
    >
      <h2 className="text-gradient-green" style={{ margin: '0 0 24px 0' }}>Stats & Insights</h2>

      {/* Tabs */}
      <div style={styles.tabsWrap}>
        <button
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'overview' ? 'var(--accent-green)' : 'transparent', color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          onClick={() => setActiveTab('overview')}
        >Overview</button>
        <button
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'perHabit' ? 'var(--accent-green)' : 'transparent', color: activeTab === 'perHabit' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          onClick={() => setActiveTab('perHabit')}
        >Per-Habit Detail</button>
      </div>

      {activeTab === 'overview' && (
        <div style={styles.tabContent}>
          {/* Summary Cards */}
          <div style={styles.cardsRow}>
            <StatCard i={0} label="TOTAL HABITS" value={overallStats.totalHabits} />
            <StatCard i={1} label="TOTAL COMPLETIONS" value={overallStats.totalCompletions} />
            <StatCard i={2} label="BEST STREAK" value={`${overallStats.currentLongestStreak?.days || 0} 🔥`} />
            <StatCard i={3} label="CONSISTENCY" value={`${overallStats.overallConsistency}%`} />
          </div>

          {/* Consistency Bar */}
          <div style={styles.consistencyBox}>
            <span style={styles.boxTitle}>OVERALL CONSISTENCY</span>
            <div style={styles.barTrack}>
              <motion.div
                style={{ ...styles.barFill }}
                initial={{ width: 0 }}
                animate={{ width: `${overallStats.overallConsistency}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div style={styles.chartsRow}>
            {overallStats.categoryBreakdown?.length > 0 ? (
              <CategoryDonut data={overallStats.categoryBreakdown} />
            ) : (
              <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16 }}>
                <EmptyState emoji="🥧" title="No category data" subtitle="Complete habits to see your category breakdown" />
              </div>
            )}

            <div style={styles.compareCard}>
              <h3 style={styles.boxTitle}>CONSISTENCY COMPARISON</h3>
              {overallStats.mostConsistentHabit ? (
                <>
                  <div style={styles.compareRow}>
                    <div style={styles.compLabel}>Most Consistent: </div>
                    <div style={{ ...styles.compVal, color: 'var(--accent-green)' }}>{overallStats.mostConsistentHabit?.name} ({overallStats.mostConsistentHabit?.percent}%)</div>
                  </div>
                  <div style={styles.compareRow}>
                    <div style={styles.compLabel}>Needs Work: </div>
                    <div style={{ ...styles.compVal, color: '#ef4444' }}>{overallStats.leastConsistentHabit?.name} ({overallStats.leastConsistentHabit?.percent}%)</div>
                  </div>
                </>
              ) : (
                <EmptyState emoji="📊" title="No comparison yet" subtitle="Log habits for a few days to see insights" />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'perHabit' && (
        <div style={styles.tabContent}>
          {habits.length === 0 ? (
            <EmptyState emoji="🌱" title="No habits yet" subtitle="Add your first habit to see detailed stats" />
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <select
                  style={styles.select}
                  value={selectedHabitId}
                  onChange={(e) => setSelectedHabitId(e.target.value)}
                >
                  {habits.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              {habitStats[selectedHabitId] ? (
                <>
                  <Heatmap data={habitStats[selectedHabitId].heatmap} />

                  <div style={styles.cardsRow}>
                    <StatCard i={0} label="CURRENT STREAK" value={`${habitStats[selectedHabitId].currentStreak} 🔥`} />
                    <StatCard i={1} label="LONGEST STREAK" value={`${habitStats[selectedHabitId].longestStreak} 🔥`} />
                    <StatCard i={2} label="TOTAL COMPLETIONS" value={`${habitStats[selectedHabitId].totalCompletions} ✅`} />
                  </div>

                  <div style={styles.chartsRow}>
                    <WeeklyBarChart data={habitStats[selectedHabitId].completionByDayOfWeek} />
                    <MonthlyTrendChart data={habitStats[selectedHabitId].completionByMonth} />
                  </div>

                  <div style={styles.insightCard}>
                    <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>💡</span>
                    {habitStats[selectedHabitId].bestDay !== 'None' ? (
                      <span>
                        You perform best on <strong>{habitStats[selectedHabitId].bestDay}s</strong> and struggle on{' '}
                        <strong style={{ color: '#ef4444' }}>{habitStats[selectedHabitId].worstDay}s</strong>.
                        Try setting a reminder on {habitStats[selectedHabitId].worstDay}s to boost consistency.
                      </span>
                    ) : (
                      <span>No data recorded yet. Keep building your habit!</span>
                    )}
                  </div>
                </>
              ) : (
                <div style={styles.spinnerWrap}>
                  {[0, 1, 2].map(i => <SkeletonStatCard key={i} />)}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

const styles = {
  page: { paddingBottom: '40px' },
  spinnerWrap: { display: 'flex', gap: 16, flexWrap: 'wrap', height: '200px', alignItems: 'center', justifyContent: 'center' },
  tabsWrap: { display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', overflowX: 'auto' },
  tabBtn: { background: 'none', border: 'none', borderBottom: '3px solid', fontSize: '0.95rem', fontWeight: 600, padding: '12px 20px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'inherit' },
  tabContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
  cardsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '130px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  statVal: { fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' },
  statLabel: { fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textAlign: 'center' },
  consistencyBox: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  boxTitle: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em', margin: 0 },
  barTrack: { height: '12px', background: 'var(--bg-primary)', borderRadius: '6px', width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', background: 'linear-gradient(90deg, #00ff88, #00c9ff)', borderRadius: '6px' },
  chartsRow: { display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' },
  compareCard: { flex: 1, minWidth: '280px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' },
  compareRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px dashed var(--border-color)' },
  compLabel: { fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 },
  compVal: { fontSize: '0.95rem', fontWeight: 800 },
  select: { padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, minWidth: '200px', outline: 'none', width: '100%', maxWidth: 360, fontFamily: 'inherit' },
  insightCard: { background: 'var(--bg-primary)', border: '1px dashed var(--accent-blue)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 },
};
