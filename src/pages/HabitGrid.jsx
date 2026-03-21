import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import { useLogs } from '../hooks/useLogs';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, X, BarChart2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkeletonHabitRow } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function SortableHabitRow({ habit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: habit._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={{ ...styles.habitRow, ...style }}>
      <button {...attributes} {...listeners} style={styles.dragBtn}>
        <GripVertical size={14} />
      </button>
      <span style={styles.habitIcon}>{habit.icon}</span>
      <span style={styles.habitName} title={habit.name}>
        <span className="hidden-mobile">{habit.name}</span>
        <span className="visible-mobile-only">{truncate(habit.name, 8)}</span>
      </span>
    </div>
  );
}

function ProgressSheet({ habits, logs, daysInMonth, streaks, onClose }) {
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>📊 Progress</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        {habits.map((habit, idx) => {
          const habitLogs = logs[habit._id] || [];
          const doneCount = habitLogs.length;
          const maxDays = daysInMonth.length;
          const ratio = Math.min(100, Math.round((doneCount / maxDays) * 100));
          const currentStreak = streaks[habit._id]?.current || 0;
          return (
            <div key={habit._id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{habit.icon} {habit.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {doneCount}/{maxDays} · {currentStreak > 0 ? `🔥 ${currentStreak}` : '—'}
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-primary)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: 4, background: habit.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${ratio}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HabitGrid() {
  const { habits, loading: habitsLoading, reorderHabits } = useHabits();
  const { logs, streaks, isLoading: logsLoading, fetchMonthLogs, fetchStreaks, toggleLog } = useLogs();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'week' | 'month'
  const [showProgress, setShowProgress] = useState(false);
  const [clickedCell, setClickedCell] = useState(null);

  // Detect mobile
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) setViewMode('week');
  }, []);

  useEffect(() => {
    fetchMonthLogs(currentDate.getFullYear(), currentDate.getMonth() + 1);
    fetchStreaks();
  }, [currentDate, fetchMonthLogs, fetchStreaks]);

  const activeHabits = habits.filter(h => !h.isArchived).sort((a, b) => a.order - b.order);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const daysInMonth = viewMode === 'week' ? weekDays : monthDays;

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = activeHabits.findIndex(h => h._id === active.id);
      const newIndex = activeHabits.findIndex(h => h._id === over.id);
      const newHabits = [...activeHabits];
      const [moved] = newHabits.splice(oldIndex, 1);
      newHabits.splice(newIndex, 0, moved);
      const orderedIds = newHabits.map((h, i) => ({ id: h._id, order: i }));
      reorderHabits(orderedIds);
    }
  };

  const handleCellClick = async (habitId, dateStr) => {
    const cellKey = `${habitId}-${dateStr}`;
    setClickedCell(cellKey);
    setTimeout(() => setClickedCell(null), 350);
    await toggleLog(habitId, dateStr);
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  if (habitsLoading) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" style={{ padding: 20 }}>
        {[0, 1, 2, 3, 4].map(i => <SkeletonHabitRow key={i} />)}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={styles.pageContainer}
    >
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.monthNav}>
          {viewMode === 'month' && (
            <>
              <button onClick={handlePrevMonth} style={styles.iconBtn}><ChevronLeft size={20} /></button>
              <h2 style={styles.monthTitle}>{format(currentDate, 'MMMM yyyy').toUpperCase()}</h2>
              <button onClick={handleNextMonth} style={styles.iconBtn}><ChevronRight size={20} /></button>
            </>
          )}
          {viewMode === 'week' && (
            <h2 style={styles.monthTitle}>CURRENT WEEK</h2>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Week / Month Toggle */}
          <div style={styles.viewToggle}>
            <button
              style={{ ...styles.toggleBtn, ...(viewMode === 'week' ? styles.toggleActive : {}) }}
              onClick={() => setViewMode('week')}
            >Week</button>
            <button
              style={{ ...styles.toggleBtn, ...(viewMode === 'month' ? styles.toggleActive : {}) }}
              onClick={() => setViewMode('month')}
            >Month</button>
          </div>

          {/* Progress button — mobile only shows sheet, desktop switches */}
          <button style={styles.progressBtn} onClick={() => setShowProgress(true)}>
            <BarChart2 size={16} />
            <span className="hidden-mobile">Progress</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {activeHabits.length === 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 20 }}>
          <EmptyState
            emoji="🌱"
            title="No habits yet"
            subtitle="Add your first habit to start tracking your journey"
            actionLabel="Add Habit"
            onAction={() => toast('Use the + button in the top bar to add a habit')}
          />
        </div>
      )}

      <div style={styles.mainWrapper}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {/* LEFT: HABITS LIST */}
          <div style={styles.leftSidebar}>
            <div style={styles.listHeader}>HABIT</div>
            <SortableContext items={activeHabits.map(h => h._id)} strategy={verticalListSortingStrategy}>
              {activeHabits.map(habit => (
                <SortableHabitRow key={habit._id} habit={habit} />
              ))}
            </SortableContext>
          </div>

          {/* CENTER: CALENDAR GRID */}
          <div style={styles.calendarArea}>
            <div style={styles.datesHeader}>
              {daysInMonth.map((day, idx) => {
                const isTodayDate = isToday(day);
                return (
                  <div key={idx} style={styles.dateCol}>
                    <div style={styles.dayStr}>{format(day, 'eeeee')}</div>
                    <div style={{ ...styles.dateNum, ...(isTodayDate ? styles.todayBadge : {}) }}>
                      {format(day, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.gridRows}>
              {activeHabits.map(habit => (
                <div key={habit._id} style={styles.gridRow}>
                  {daysInMonth.map((day, idx) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = logs[habit._id]?.includes(dateStr);
                    const cellKey = `${habit._id}-${dateStr}`;

                    if (logsLoading) return <div key={idx} style={{ ...styles.cell, background: 'var(--bg-card)' }} />;

                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleCellClick(habit._id, dateStr)}
                        whileTap={{ scale: 0.85 }}
                        animate={clickedCell === cellKey ? { scale: [1, 0.85, 1.1, 1] } : { scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        style={{
                          ...styles.cell,
                          background: isCompleted ? habit.color : 'var(--bg-card)',
                          color: isCompleted ? '#222' : 'transparent',
                          border: isCompleted ? 'none' : '1px solid var(--border-color)',
                          boxShadow: isCompleted ? `0 0 8px ${habit.color}88` : 'none',
                        }}
                      >
                        {isCompleted && '✓'}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </DndContext>

        {/* RIGHT: PROGRESS TABLE (desktop) */}
        <div style={styles.rightSidebar} className="hidden-mobile">
          <div style={styles.progressHeader}>PROGRESS</div>
          <div style={styles.progressTable}>
            <div style={styles.thRow}>
              <span style={styles.thColNo}>NO.</span>
              <span style={styles.thColDone}>DONE</span>
              <span style={styles.thColProg}>PROGRESS</span>
              <span style={styles.thColPct}>%</span>
              <span style={styles.thColStr}>STREAK</span>
            </div>
            {activeHabits.map((habit, idx) => {
              const habitLogs = logs[habit._id] || [];
              const doneCount = habitLogs.length;
              const maxDays = daysInMonth.length;
              const ratio = Math.min(100, Math.round((doneCount / maxDays) * 100));
              const currentStreak = streaks[habit._id]?.current || 0;

              return (
                <div key={habit._id} style={styles.prRow}>
                  <div style={styles.thColNo}>{String(idx + 1).padStart(2, '0')}</div>
                  <div style={styles.thColDone}>{doneCount}/{maxDays}</div>
                  <div style={styles.thColProg}>
                    <div style={styles.barTrack}>
                      <motion.div
                        style={{ ...styles.barFill, background: habit.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${ratio}%` }}
                        transition={{ duration: 0.7, delay: idx * 0.05, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <div style={styles.thColPct}>{ratio}%</div>
                  <div style={styles.thColStr}>{currentStreak > 0 ? `🔥 ${currentStreak}` : '—'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE PROGRESS BOTTOM SHEET */}
      <AnimatePresence>
        {showProgress && (
          <ProgressSheet
            habits={activeHabits}
            logs={logs}
            daysInMonth={daysInMonth}
            streaks={streaks}
            onClose={() => setShowProgress(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const styles = {
  pageContainer: { display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', color: 'var(--text-primary)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: 8 },
  monthNav: { display: 'flex', alignItems: 'center', gap: '16px' },
  iconBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' },
  monthTitle: { fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em', margin: 0 },
  viewToggle: { display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' },
  toggleBtn: { padding: '6px 12px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' },
  toggleActive: { background: 'rgba(0,255,136,0.12)', color: 'var(--accent-green)' },
  progressBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 },

  mainWrapper: { display: 'flex', flex: 1, gap: '20px', minHeight: '0', paddingBottom: '20px', overflowX: 'auto' },

  leftSidebar: { width: '200px', minWidth: '120px', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  listHeader: { height: '56px', display: 'flex', alignItems: 'flex-end', paddingBottom: '16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' },
  habitRow: { height: '36px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', background: 'var(--bg-card)', borderRadius: '8px', padding: '0 8px', border: '1px solid var(--border-color)' },
  dragBtn: { background: 'none', border: 'none', cursor: 'grab', color: 'var(--text-muted)', display: 'flex', padding: 0, flexShrink: 0 },
  habitIcon: { fontSize: '1rem', flexShrink: 0 },
  habitName: { fontSize: '0.85rem', fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },

  calendarArea: { flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'auto', paddingBottom: '10px', minWidth: 0 },
  datesHeader: { height: '56px', display: 'flex', alignItems: 'flex-end', paddingBottom: '12px', gap: '6px' },
  dateCol: { width: '36px', minWidth: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  dayStr: { fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' },
  dateNum: { width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, borderRadius: '50%' },
  todayBadge: { background: 'var(--accent-blue)', color: '#fff' },

  gridRows: { display: 'flex', flexDirection: 'column' },
  gridRow: { height: '36px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
  cell: { width: '36px', height: '36px', minWidth: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', padding: 0, outline: 'none' },

  rightSidebar: { width: '320px', display: 'flex', flexDirection: 'column', flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px' },
  progressHeader: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px', letterSpacing: '0.05em' },
  progressTable: { display: 'flex', flexDirection: 'column' },
  thRow: { display: 'flex', alignItems: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' },
  prRow: { height: '36px', display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 600 },

  thColNo: { width: '32px', color: 'var(--text-muted)' },
  thColDone: { width: '52px' },
  thColProg: { flex: 1, paddingRight: '12px' },
  thColPct: { width: '36px', textAlign: 'right', paddingRight: '12px' },
  thColStr: { width: '52px', textAlign: 'right' },

  barTrack: { height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px' },
};
