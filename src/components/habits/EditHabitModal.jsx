import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useHabits } from '../../hooks/useHabits';
import Spinner from '../ui/Spinner';

const EMOJIS = ['⭐', '🔥', '💧', '🏃', '📚', '🧘', '🍎', '🥦', '💪', '🧠', '💰', '💻', '🎨', '🎵', '🌿', '🌱', '☀️', '🌙', '🍔', '🍺'];
const COLORS = ['#00ff88', '#ec4899', '#a855f7', '#3b82f6', '#f59e0b', '#ef4444', '#14b8a6', '#6366f1'];
const CATEGORIES = ['Health', 'Learning', 'Productivity', 'Mindfulness', 'Fitness', 'Custom'];

export default function EditHabitModal({ isOpen, onClose, habit }) {
  const { updateHabit } = useHabits();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'custom',
    icon: '⭐',
    color: '#00ff88',
    frequency: 'daily',
    targetDays: [],
  });

  useEffect(() => {
    if (habit) {
      setForm({
        name: habit.name,
        category: habit.category,
        icon: habit.icon,
        color: habit.color,
        frequency: habit.frequency,
        targetDays: habit.targetDays || [],
      });
    }
  }, [habit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habit) return;
    setSubmitting(true);
    const res = await updateHabit(habit._id, form);
    setSubmitting(false);
    if (res.success) {
      onClose();
    }
  };

  const toggleDay = (dayIndex) => {
    setForm(prev => {
      const isSelected = prev.targetDays.includes(dayIndex);
      return {
        ...prev,
        targetDays: isSelected
          ? prev.targetDays.filter(d => d !== dayIndex)
          : [...prev.targetDays, dayIndex]
      };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Habit">
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            required
            maxLength={50}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="E.g., Drink water"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <select
            style={styles.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Icon</label>
          <div style={styles.emojiGrid}>
            {EMOJIS.map(emoji => (
              <button
                type="button"
                key={emoji}
                style={{
                  ...styles.emojiBtn,
                  background: form.icon === emoji ? 'var(--bg-secondary)' : 'transparent',
                  borderColor: form.icon === emoji ? form.color : 'transparent'
                }}
                onClick={() => setForm({ ...form, icon: emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Color</label>
          <div style={styles.colorRow}>
            {COLORS.map(c => (
              <button
                type="button"
                key={c}
                style={{
                  ...styles.colorBtn,
                  backgroundColor: c,
                  border: form.color === c ? '3px solid white' : '3px solid transparent'
                }}
                onClick={() => setForm({ ...form, color: c })}
              />
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Frequency</label>
          <select
            style={styles.input}
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom Days</option>
          </select>
        </div>

        {form.frequency === 'custom' && (
          <div style={styles.field}>
            <label style={styles.label}>Target Days</label>
            <div style={styles.daysRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <button
                  type="button"
                  key={day}
                  style={{
                    ...styles.dayBtn,
                    background: form.targetDays.includes(i) ? form.color : 'var(--bg-secondary)',
                    color: form.targetDays.includes(i) ? '#0d1117' : 'var(--text-primary)'
                  }}
                  onClick={() => toggleDay(i)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button type="submit" disabled={submitting} style={{...styles.submitBtn, background: form.color}}>
            {submitting ? <Spinner size={16} color="#0d1117" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 },
  input: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem'
  },
  emojiGrid: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  emojiBtn: {
    fontSize: '1.2rem', padding: '6px', borderRadius: '8px', border: '1px solid transparent', cursor: 'pointer', transition: '0.2s'
  },
  colorRow: { display: 'flex', gap: '10px' },
  colorBtn: {
    width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', transition: '0.2s'
  },
  daysRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  dayBtn: {
    padding: '6px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: '0.2s'
  },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
  cancelBtn: { padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' },
  submitBtn: { padding: '10px 16px', borderRadius: '10px', border: 'none', color: '#0d1117', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }
};
