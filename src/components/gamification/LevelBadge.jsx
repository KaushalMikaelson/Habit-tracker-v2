export default function LevelBadge({ level, xp }) {
  // Formula: level = floor(XP / 500) + 1. Thus current level baselined at (level - 1) * 500
  const baseline = (level - 1) * 500;
  const target = level * 500;
  const progress = xp - baseline;
  const ratio = Math.min(100, Math.round((progress / 500) * 100));

  return (
    <div style={styles.container} title={`Level ${level} — ${progress}/500 XP to Level ${level + 1}`}>
      <div style={styles.circle}>
        <span style={styles.lvlText}>{level}</span>
      </div>
      <div style={styles.barWrap}>
        <div style={{ ...styles.barFill, width: `${ratio}%` }} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'default'
  },
  circle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-green))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--bg-card)',
    boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
  },
  lvlText: { color: '#0d1117', fontWeight: 800, fontSize: '0.85rem' },
  barWrap: { width: '36px', height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' },
  barFill: { height: '100%', background: 'var(--accent-purple)', transition: 'width 0.4s ease' }
};
