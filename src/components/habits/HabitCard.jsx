import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';

export default function HabitCard({ habit, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={{ ...styles.card, ...style }}>
      <button {...attributes} {...listeners} style={styles.dragHandle}>
        <GripVertical size={16} />
      </button>

      <div style={styles.iconBox}>
        {habit.icon}
      </div>

      <div style={styles.info}>
        <div style={styles.name}>{habit.name}</div>
        <div style={styles.badges}>
          <span style={{...styles.category, color: habit.color}}>{habit.category}</span>
          <span style={{...styles.colorDot, backgroundColor: habit.color}} />
        </div>
      </div>

      <div style={styles.actions}>
        <button onClick={() => onEdit(habit)} style={styles.actionBtn}>
          <Edit2 size={16} />
        </button>
        <button onClick={() => {
          if (window.confirm('Are you sure you want to delete this habit?')) {
            onDelete(habit._id);
          }
        }} style={{ ...styles.actionBtn, color: '#ef4444' }}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { display: 'flex', alignItems: 'center', padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', marginBottom: '8px', gap: '12px', position: 'relative' },
  dragHandle: { background: 'none', border: 'none', cursor: 'grab', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '4px' },
  iconBox: { fontSize: '1.4rem' },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  name: { fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' },
  badges: { display: 'flex', alignItems: 'center', gap: '8px' },
  category: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 },
  colorDot: { width: '8px', height: '8px', borderRadius: '50%' },
  actions: { display: 'flex', gap: '8px' },
  actionBtn: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }
};
