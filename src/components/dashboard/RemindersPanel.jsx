import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function RemindersPanel({ items = [], onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('');

  const handleAdd = async () => {
    if (!text.trim()) return;
    await onAdd(text, 'reminder');
    setText('');
  };

  const pendingCount = items.filter(i => !i.done).length;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>REMINDERS 📋</span>
        <span style={styles.badge}>{pendingCount} LEFT</span>
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="New reminder..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button style={styles.addBtn} onClick={handleAdd}><Plus size={16} /></button>
      </div>

      <div style={styles.list}>
        {items.length === 0 ? (
          <EmptyState
            emoji="🔔"
            title="No reminders"
            subtitle="Add one above"
          />
        ) : (
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, x: 40, height: 0 }}
                transition={{ duration: 0.25 }}
                style={styles.itemRow}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggle(item._id, 'reminder')}
                  style={styles.checkbox}
                />
                <span style={{ ...styles.itemText, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {item.text}
                </span>
                <button style={styles.delBtn} onClick={() => onDelete(item._id, 'reminder')}>
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', flex: '1', minWidth: '260px', maxHeight: '360px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' },
  badge: { fontSize: '0.7rem', fontWeight: 700, color: 'var(--bg-card)', background: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '10px' },
  inputRow: { display: 'flex', gap: '8px', marginBottom: '16px' },
  input: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' },
  addBtn: { width: '38px', height: '38px', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--accent-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 },
  itemRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', overflow: 'hidden' },
  checkbox: { width: '16px', height: '16px', accentColor: 'var(--accent-purple)', cursor: 'pointer', flexShrink: 0 },
  itemText: { flex: 1, fontSize: '0.9rem', wordBreak: 'break-word', transition: 'all 0.2s' },
  delBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', flexShrink: 0 },
};
