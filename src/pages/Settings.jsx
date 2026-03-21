import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Plus, Archive } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useHabits } from '../hooks/useHabits';
import { useGamification } from '../store/GamificationContext';
import HabitCard from '../components/habits/HabitCard';
import LevelBadge from '../components/gamification/LevelBadge';
import { Lock, Unlock, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import AddHabitModal from '../components/habits/AddHabitModal';
import EditHabitModal from '../components/habits/EditHabitModal';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Settings() {
  const { habits, loading, deleteHabit, reorderHabits } = useHabits();
  const { gameData } = useGamification();
  const [addOpen, setAddOpen] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const activeHabits = habits.filter(h => !h.isArchived).sort((a,b) => a.order - b.order);
      const oldIndex = activeHabits.findIndex(h => h._id === active.id);
      const newIndex = activeHabits.findIndex(h => h._id === over.id);

      const newHabits = [...activeHabits];
      const [moved] = newHabits.splice(oldIndex, 1);
      newHabits.splice(newIndex, 0, moved);

      const orderedIds = newHabits.map((h, i) => ({ id: h._id, order: i }));
      reorderHabits(orderedIds);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <SettingsIcon size={28} className="text-gradient-green" style={{ color: 'var(--accent-green)' }} />
        <h2 className="text-gradient-green">Manage Habits</h2>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spinner size={32} color="var(--accent-green)" />
        </div>
      ) : (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={habits.filter(h => !h.isArchived).map(h => h._id)} strategy={verticalListSortingStrategy}>
              {habits.filter(h => !h.isArchived).sort((a,b) => a.order - b.order).map(habit => (
                <HabitCard key={habit._id} habit={habit} onEdit={setEditHabit} onDelete={deleteHabit} />
              ))}
            </SortableContext>
          </DndContext>

          <button onClick={() => setAddOpen(true)} style={styles.addBtn}>
            <Plus size={18} /> Add New Habit
          </button>
        </>
      )}

      {/* Archived Section Stub */}
      <div style={{ marginTop: '40px' }}>
        <button 
          onClick={() => setShowArchived(!showArchived)} 
          style={styles.archiveHeaderBtn}
        >
          <Archive size={16} /> {showArchived ? 'Hide' : 'View'} Archived Habits
        </button>
        {showArchived && (
          <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', border: '1px solid var(--border-color)', borderRadius: '12px', marginTop: '12px' }}>
            No archived habits (Stage 3 API only returns active habits for now).
          </div>
        )}
      </div>

      <AddHabitModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
      <EditHabitModal isOpen={!!editHabit} onClose={() => setEditHabit(null)} habit={editHabit} />

      {/* Gamification Profile Section */}
      {gameData && (
        <div style={{ marginTop: '60px', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Trophy size={28} style={{ color: 'var(--accent-purple)' }} />
            <h2 className="text-gradient-purple" style={{ margin: 0 }}>Gamification Profile</h2>
          </div>

          <div style={styles.heroCard}>
            <div style={styles.heroLeft}>
              <div style={styles.levelRingWrap}>
                <LevelBadge level={gameData.level} xp={gameData.totalXP} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.xpRow}>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Level {gameData.level}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{gameData.totalXP} / {gameData.level * 500} XP</span>
                </div>
                <div style={styles.xpTrack}>
                  <div style={{...styles.xpFill, width: `${Math.min(100, ((gameData.totalXP - (gameData.level-1)*500) / 500) * 100)}%`}} />
                </div>
              </div>
            </div>

            <div style={styles.coinsBox}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{gameData.coins} 🪙</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Total Balance</div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>
            Achievements <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>({gameData.achievements.length}/{gameData.ACHIEVEMENTS_LIST.length} Unlocked)</span>
          </h3>

          {gameData.achievements.length === 0 && (
            <EmptyState
              emoji="🏆"
              title="No achievements yet"
              subtitle="Complete habits to earn achievements and unlock badges"
            />
          )}

          <div style={styles.grid}>
            {gameData.ACHIEVEMENTS_LIST.map(ach => {
              const unlockedObj = gameData.achievements.find(a => a.id === ach.id);
              const isUnlocked = !!unlockedObj;

              return (
                <div key={ach.id} style={{ ...styles.achCard, ...(isUnlocked ? styles.unlockedStyle : styles.lockedStyle) }}>
                  <div style={{ ...styles.emojiBox, filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(0.5)' }}>
                    {ach.emoji}
                  </div>
                  <div style={styles.achText}>
                    <div style={{ ...styles.achTitle, color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {ach.name}
                    </div>
                    <div style={styles.achDesc}>{ach.desc}</div>
                    {isUnlocked && (
                      <div style={styles.dateLabel}>
                        Unlocked on {format(new Date(unlockedObj.unlockedAt), 'MMM dd')}
                      </div>
                    )}
                  </div>
                  <div style={styles.iconCorner}>
                    {isUnlocked ? <Unlock size={14} color="var(--accent-purple)" /> : <Lock size={14} color="var(--text-muted)" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

const styles = {
  addBtn: { width: '100%', padding: '12px', marginTop: '16px', borderRadius: '12px', border: '2px dashed var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'border-color 0.2s', },
  archiveHeaderBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 },
  heroCard: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' },
  heroLeft: { display: 'flex', gap: '20px', alignItems: 'center', flex: 1, minWidth: '200px' },
  levelRingWrap: { transform: 'scale(1.2)' },
  xpRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' },
  xpTrack: { height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' },
  xpFill: { height: '100%', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-green))', transition: 'width 0.4s ease' },
  coinsBox: { padding: '16px 24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px dashed var(--accent-purple)', textAlign: 'center' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: 800, margin: '0 0 20px 0', letterSpacing: '0.05em' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px' },
  achCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' },
  unlockedStyle: { background: 'var(--bg-card)', border: '1px solid var(--accent-purple)', boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)' },
  lockedStyle: { background: 'var(--bg-secondary)', border: '1px dashed var(--border-color)', opacity: 0.7 },
  emojiBox: { width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 },
  achText: { display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '20px' },
  achTitle: { fontSize: '0.95rem', fontWeight: 800 },
  achDesc: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  dateLabel: { fontSize: '0.65rem', color: 'var(--accent-purple)', marginTop: '4px', fontWeight: 600 },
  iconCorner: { position: 'absolute', top: '16px', right: '16px' }
};
