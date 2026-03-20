import { Edit2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function GreetingCard() {
  const { user } = useAuth();
  
  const firstName = user?.name?.split(' ')[0] || 'User';
  const quote = user?.quote || 'No rest for me in this world. Perhaps in the next.';

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.welcome}>Welcome back</div>
          <h2 style={styles.name}>{firstName} 👋</h2>
        </div>
        <button style={styles.editBtn}>
          <Edit2 size={16} /> Edit
        </button>
      </div>
      
      <div style={styles.quoteBox}>
        <p style={styles.quoteText}>"{quote}"</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    flex: '2.5',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderLeft: '4px solid var(--accent-green)',
    borderRadius: '16px',
    padding: '24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '280px'
  },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  welcome: { fontSize: '0.9rem', color: 'var(--text-secondary)' },
  name: { fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--accent-green), #00c9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  editBtn: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 },
  quoteBox: { background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)' },
  quoteText: { fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }
};
