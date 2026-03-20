import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function TodaysFocus({ items, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('');
  
  const handleAdd = async () => {
    if (!text.trim()) return;
    await onAdd(text, 'focus');
    setText('');
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>TODAY'S FOCUS 🎯</span>
        <span style={styles.badge}>{items.filter(i => !i.done).length} PENDING</span>
      </div>

      <div style={styles.inputRow}>
        <input 
          style={styles.input} 
          placeholder="Add today's focus..." 
          value={text} 
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button style={styles.addBtn} onClick={handleAdd}><Plus size={16} /></button>
      </div>

      <div style={styles.list}>
        {items.map(item => (
          <div key={item._id} style={styles.itemRow}>
            <input 
              type="checkbox" 
              checked={item.done} 
              onChange={() => onToggle(item._id, 'focus')}
              style={styles.checkbox}
            />
            <span style={{ ...styles.text, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
              {item.text}
            </span>
            <button style={styles.delBtn} onClick={() => onDelete(item._id, 'focus')}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', flex: '1', minWidth: '300px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' },
  badge: { fontSize: '0.7rem', fontWeight: 700, color: '#0d1117', background: 'var(--accent-green)', padding: '2px 8px', borderRadius: '10px' },
  inputRow: { display: 'flex', gap: '8px', marginBottom: '16px' },
  input: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem' },
  addBtn: { width: '38px', height: '38px', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--accent-green)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 },
  itemRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' },
  checkbox: { width: '16px', height: '16px', accentColor: 'var(--accent-green)', cursor: 'pointer' },
  text: { flex: 1, fontSize: '0.9rem', wordBreak: 'break-word', transition: 'all 0.2s' },
  delBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }
};
