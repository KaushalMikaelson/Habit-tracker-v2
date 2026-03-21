import { motion } from 'framer-motion';
import { SkeletonTopHabitBar } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

export default function TopHabits({ habits = [], loading = false }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>TOP HABITS</span>
      </div>

      <div style={styles.list}>
        {loading ? (
          [0, 1, 2, 3].map(i => <SkeletonTopHabitBar key={i} />)
        ) : habits.length === 0 ? (
          <EmptyState
            emoji="🏅"
            title="No top habits yet"
            subtitle="Complete habits to see your rankings"
          />
        ) : (
          habits.map((habit, i) => (
            <motion.div
              key={habit._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              style={styles.habitRow}
            >
              <div style={styles.topSide}>
                <span style={{ ...styles.rank, color: habit.color }}>#{habit.rank}</span>
                <span style={styles.name}>{habit.name}</span>
                <span style={styles.count}>{habit.count} completions</span>
              </div>
              <div style={styles.barTrack}>
                <motion.div
                  style={{ ...styles.barFill, background: habit.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${habit.completionPercent}%` }}
                  transition={{ delay: i * 0.07 + 0.2, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', flex: '1', minWidth: '260px' },
  header: { marginBottom: '20px' },
  title: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  habitRow: { display: 'flex', flexDirection: 'column', gap: '8px' },
  topSide: { display: 'flex', alignItems: 'center', gap: '8px' },
  rank: { fontSize: '1.1rem', fontWeight: 800 },
  name: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  count: { fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 },
  barTrack: { height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px' },
};
