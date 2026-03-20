import { useState, useEffect } from 'react';
import { useStats } from '../hooks/useStats';
import { useHabits } from '../hooks/useHabits';
import Heatmap from '../components/stats/Heatmap';
import CategoryDonut from '../components/stats/CategoryDonut';
import WeeklyBarChart from '../components/stats/WeeklyBarChart';
import MonthlyTrendChart from '../components/stats/MonthlyTrendChart';
import Spinner from '../components/ui/Spinner';

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statVal}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Stats() {
  const { overallStats, habitStats, loading, fetchOverall, fetchHabit } = useStats();
  const { habits, loading: habitsLoading } = useHabits();
  
  const [activeTab, setActiveTab] = useState('overview'); // overview | perHabit
  const [selectedHabitId, setSelectedHabitId] = useState('');

  useEffect(() => {
    fetchOverall();
  }, [fetchOverall]);

  useEffect(() => {
    if (activeTab === 'perHabit' && selectedHabitId) {
      if (!habitStats[selectedHabitId]) {
        fetchHabit(selectedHabitId);
      }
    }
  }, [activeTab, selectedHabitId, fetchHabit, habitStats]);

  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0]._id);
    }
  }, [habits, selectedHabitId]);

  if (loading || habitsLoading || !overallStats) return <div style={styles.spinnerWrap}><Spinner size={32} color="var(--accent-green)" /></div>;

  return (
    <div style={styles.page}>
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
            <StatCard label="TOTAL HABITS" value={overallStats.totalHabits} />
            <StatCard label="TOTAL COMPLETIONS" value={overallStats.totalCompletions} />
            <StatCard label="BEST STREAK" value={`${overallStats.currentLongestStreak?.days || 0} 🔥`} />
            <StatCard label="CONSISTENCY" value={`${overallStats.overallConsistency}%`} />
          </div>

          {/* Consistency Bar */}
          <div style={styles.consistencyBox}>
            <span style={styles.boxTitle}>OVERALL CONSISTENCY</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${overallStats.overallConsistency}%` }} />
            </div>
          </div>

          <div style={styles.chartsRow}>
            <CategoryDonut data={overallStats.categoryBreakdown} />
            
            <div style={styles.compareCard}>
              <h3 style={styles.boxTitle}>CONSISTENCY COMPARISON</h3>
              <div style={styles.compareRow}>
                <div style={styles.compLabel}>Most Consistent: </div>
                <div style={{...styles.compVal, color: 'var(--accent-green)'}}>{overallStats.mostConsistentHabit?.name} ({overallStats.mostConsistentHabit?.percent}%)</div>
              </div>
              <div style={styles.compareRow}>
                <div style={styles.compLabel}>Needs Work: </div>
                <div style={{...styles.compVal, color: '#ef4444'}}>{overallStats.leastConsistentHabit?.name} ({overallStats.leastConsistentHabit?.percent}%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'perHabit' && (
        <div style={styles.tabContent}>
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
                <StatCard label="CURRENT STREAK" value={`${habitStats[selectedHabitId].currentStreak} 🔥`} />
                <StatCard label="LONGEST STREAK" value={`${habitStats[selectedHabitId].longestStreak} 🔥`} />
                <StatCard label="TOTAL COMPLETIONS" value={`${habitStats[selectedHabitId].totalCompletions} ✅`} />
              </div>

              <div style={styles.chartsRow}>
                <WeeklyBarChart data={habitStats[selectedHabitId].completionByDayOfWeek} />
                <MonthlyTrendChart data={habitStats[selectedHabitId].completionByMonth} />
              </div>

              <div style={styles.insightCard}>
                <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>💡</span> 
                {habitStats[selectedHabitId].bestDay !== 'None' ? (
                  <span>
                    You perform best on <strong>{habitStats[selectedHabitId].bestDay}s</strong> and struggle on <strong style={{ color: '#ef4444' }}>{habitStats[selectedHabitId].worstDay}s</strong>. Try setting a reminder on {habitStats[selectedHabitId].worstDay}s to boost consistency.
                  </span>
                ) : (
                  <span>No data recorded yet. Keep building your habit!</span>
                )}
              </div>
            </>
          ) : (
            <div style={styles.spinnerWrap}><Spinner size={24} color="var(--accent-green)" /></div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { paddingBottom: '40px' },
  spinnerWrap: { display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center' },
  tabsWrap: { display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' },
  tabBtn: { background: 'none', border: 'none', borderBottom: '3px solid', fontSize: '1rem', fontWeight: 600, padding: '12px 24px', cursor: 'pointer', transition: 'all 0.2s' },
  tabContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
  cardsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '150px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  statVal: { fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' },
  statLabel: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' },
  consistencyBox: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  boxTitle: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em', margin: 0 },
  barTrack: { height: '12px', background: 'var(--bg-secondary)', borderRadius: '6px', width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', background: 'linear-gradient(90deg, #00ff88, #00c9ff)', borderRadius: '6px' },
  chartsRow: { display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' },
  compareCard: { flex: 1, minWidth: '300px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' },
  compareRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px dashed var(--border-color)' },
  compLabel: { fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 },
  compVal: { fontSize: '1rem', fontWeight: 800 },
  select: { padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, minWidth: '240px', outline: 'none' },
  insightCard: { background: 'var(--bg-primary)', border: '1px dashed var(--accent-blue)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }
};
