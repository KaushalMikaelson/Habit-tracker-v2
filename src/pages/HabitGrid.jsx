import { useState, useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import { useLogs } from '../hooks/useLogs';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Moon, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Spinner from '../components/ui/Spinner';

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
      <span style={styles.habitName} title={habit.name}>{habit.name}</span>
    </div>
  );
}

export default function HabitGrid() {
  const { habits, loading: habitsLoading, reorderHabits } = useHabits();
  const { logs, streaks, isLoading: logsLoading, fetchMonthLogs, fetchStreaks, toggleLog } = useLogs();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchMonthLogs(currentDate.getFullYear(), currentDate.getMonth() + 1);
    fetchStreaks();
  }, [currentDate, fetchMonthLogs, fetchStreaks]);

  const activeHabits = habits.filter(h => !h.isArchived).sort((a,b) => a.order - b.order);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

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

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  if (habitsLoading) return <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><Spinner size={32} color="var(--accent-green)" /></div>;

  return (
    <div style={styles.pageContainer}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.monthNav}>
          <button onClick={handlePrevMonth} style={styles.iconBtn}><ChevronLeft size={20} /></button>
          <h2 style={styles.monthTitle}>{format(currentDate, 'MMMM yyyy').toUpperCase()}</h2>
          <button onClick={handleNextMonth} style={styles.iconBtn}><ChevronRight size={20} /></button>
        </div>
        <button style={styles.themeBtn}><Moon size={18} /></button>
      </div>

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
                    <div style={{...styles.dateNum, ...(isTodayDate ? styles.todayBadge : {})}}>
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
                    
                    if (logsLoading) return <div key={idx} style={{...styles.cell, background: 'var(--bg-card)'}} />;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleLog(habit._id, dateStr)}
                        style={{
                          ...styles.cell,
                          background: isCompleted ? habit.color : 'var(--bg-card)',
                          color: isCompleted ? '#222' : 'transparent',
                          border: isCompleted ? 'calc(1px solid transparent)' : '1px solid var(--border-color)',
                          boxShadow: isCompleted ? `0 0 8px ${habit.color}88` : 'none',
                        }}
                      >
                        {isCompleted && '✓'}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          
        </DndContext>

        {/* RIGHT: PROGRESS BAR */}
        <div style={styles.rightSidebar}>
          <div style={styles.progressHeader}>PROGRESS BAR</div>
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
                  <div style={styles.thColNo}>{String(idx+1).padStart(2, '0')}</div>
                  <div style={styles.thColDone}>{doneCount}/{maxDays}</div>
                  <div style={styles.thColProg}>
                    <div style={styles.barTrack}>
                      <div style={{...styles.barFill, width: `${ratio}%`, background: habit.color}} />
                    </div>
                  </div>
                  <div style={styles.thColPct}>{ratio}%</div>
                  <div style={styles.thColStr}>
                    {currentStreak > 0 ? `🔥 ${currentStreak}` : '—'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageContainer: { display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', color: 'var(--text-primary)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  monthNav: { display: 'flex', alignItems: 'center', gap: '16px' },
  iconBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' },
  monthTitle: { fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', margin: 0 },
  themeBtn: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' },
  
  mainWrapper: { display: 'flex', flex: 1, gap: '20px', minHeight: '0', paddingBottom: '20px', overflow: 'hidden' },
  
  leftSidebar: { width: '240px', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  listHeader: { height: '56px', display: 'flex', alignItems: 'flex-end', paddingBottom: '16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' },
  habitRow: { height: '36px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', background: 'var(--bg-card)', borderRadius: '8px', padding: '0 8px', border: '1px solid var(--border-color)' },
  dragBtn: { background: 'none', border: 'none', cursor: 'grab', color: 'var(--text-muted)', display: 'flex', padding: 0 },
  habitIcon: { fontSize: '1.1rem' },
  habitName: { fontSize: '0.9rem', fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },

  calendarArea: { flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'auto', paddingBottom: '10px' },
  datesHeader: { height: '56px', display: 'flex', alignItems: 'flex-end', paddingBottom: '12px', gap: '6px' },
  dateCol: { width: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  dayStr: { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' },
  dateNum: { width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, borderRadius: '50%' },
  todayBadge: { background: 'var(--accent-blue)', color: '#fff' },
  
  gridRows: { display: 'flex', flexDirection: 'column' },
  gridRow: { height: '36px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
  cell: { width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.2s', padding: 0 },
  
  rightSidebar: { width: '340px', display: 'flex', flexDirection: 'column', flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px' },
  progressHeader: { fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '24px', letterSpacing: '0.05em' },
  progressTable: { display: 'flex', flexDirection: 'column' },
  thRow: { display: 'flex', alignItems: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px' },
  prRow: { height: '36px', display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 },
  
  thColNo: { width: '36px', color: 'var(--text-muted)' },
  thColDone: { width: '60px' },
  thColProg: { flex: 1, paddingRight: '16px' },
  thColPct: { width: '40px', textAlign: 'right', paddingRight: '16px' },
  thColStr: { width: '60px', textAlign: 'right' },
  
  barTrack: { height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 0.4s ease, background 0.4s ease' },
};
