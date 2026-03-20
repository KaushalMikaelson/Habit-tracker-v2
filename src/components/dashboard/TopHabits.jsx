export default function TopHabits({ habits = [] }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>TOP HABITS</span>
      </div>
      
      <div style={styles.list}>
        {habits.length === 0 ? (
          <div style={styles.empty}>No top habits yet</div>
        ) : habits.map(habit => (
          <div key={habit._id} style={styles.habitRow}>
            <div style={styles.topSide}>
              <span style={{...styles.rank, color: habit.color}}>#{habit.rank}</span>
              <span style={styles.name}>{habit.name}</span>
              <span style={styles.count}>{habit.count} completions</span>
            </div>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${habit.completionPercent}%`, background: habit.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', flex: '1', minWidth: '280px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  empty: { color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' },
  habitRow: { display: 'flex', flexDirection: 'column', gap: '8px' },
  topSide: { display: 'flex', alignItems: 'center', gap: '8px' },
  rank: { fontSize: '1.2rem', fontWeight: 800 },
  name: { fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  count: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 },
  barTrack: { height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 0.4s ease' }
};
