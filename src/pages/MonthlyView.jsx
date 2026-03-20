import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthlyReport } from '../api/reports';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Spinner from '../components/ui/Spinner';
import CategoryDonut from '../components/stats/CategoryDonut';

export default function MonthlyView() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // Force to month start
    return d;
  });

  useEffect(() => {
    const fetchIt = async () => {
      setLoading(true);
      try {
        const data = await getMonthlyReport(currentDate.getFullYear(), currentDate.getMonth() + 1);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIt();
  }, [currentDate]);

  const handlePrev = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };
  
  const handleNext = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  if (loading || !report) return <div style={{display:'flex', justifyContent:'center', padding:'40px'}}><Spinner size={32} color="var(--accent-blue)" /></div>;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div style={styles.navRow}>
          <button style={styles.iconBtn} onClick={handlePrev}><ChevronLeft /></button>
          <h2 style={styles.weekTitle}>{report.monthName}</h2>
          <button style={styles.iconBtn} onClick={handleNext}><ChevronRight /></button>
        </div>
      </div>

      <div style={styles.summaryRow}>
        <Card label="Total Completions" value={report.summary.totalCompletions} />
        <Card label="Best Week" value={report.summary.bestWeek} />
        <Card label="Most Consistent" value={report.summary.mostConsistentHabit} />
        <Card label="Monthly %" value={`${report.summary.completionPercent}%`} />
        <Card label="Coins Earned" value={`${report.summary.coinsEarned} 🪙`} />
      </div>

      <div style={styles.gridCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Habit</th>
              <th style={styles.thC}>Done</th>
              <th style={styles.thC}>Target</th>
              <th style={styles.thC}>%</th>
              <th style={styles.thC}>Streak</th>
              <th style={styles.thC}>Status</th>
            </tr>
          </thead>
          <tbody>
            {report.habits.sort((a,b)=>b.percent-a.percent).map((h, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>{h.name}</td>
                <td style={styles.tdC}>{h.doneCount}</td>
                <td style={styles.tdC}>{h.targetCount}</td>
                <td style={styles.tdPct}>{h.percent}%</td>
                <td style={styles.tdC}>{h.streak} 🔥</td>
                <td style={styles.tdC}>
                  <StatusBadge status={h.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Monthly Completion Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={report.dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)' }} />
              <YAxis allowDecimals={false} stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip cursor={{ fill: 'var(--bg-secondary)' }} contentStyle={{background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff'}} />
              <Line type="monotone" dataKey="count" stroke="var(--accent-blue)" strokeWidth={3} dot={{r: 4, fill: 'var(--bg-card)', strokeWidth: 2}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div style={styles.sideCol}>
          <CategoryDonut data={report.summary.categoryBreakdown} />
          
          <div style={styles.medalsCard}>
             <h3 style={styles.chartTitle}>Top 3 Habits</h3>
             <div style={styles.medalList}>
               {report.topHabits.map((h, idx) => {
                 const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                 return (
                   <div key={idx} style={styles.medalRow}>
                     <span style={styles.medalEmoji}>{medal}</span>
                     <span style={styles.medalName}>#{h.rank} {h.name}</span>
                     <span style={styles.medalPct}>{h.percent}%</span>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statVal}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  let bg = '#333', color = '#fff';
  if (status === 'On Fire') { bg = '#fdba74'; color = '#ea580c'; }
  else if (status === 'On Track') { bg = '#86efac'; color = '#15803d'; }
  else if (status === 'Needs Work') { bg = '#fde047'; color = '#854d0e'; }
  else { bg = '#fca5a5'; color = '#b91c1c'; }
  
  return (
    <span style={{ background: bg, color: color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
      {status}
    </span>
  );
}

const styles = {
  page: { paddingBottom: '40px' },
  headerRow: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
  navRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  iconBtn: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' },
  weekTitle: { fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 },
  summaryRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' },
  statCard: { flex: 1, minWidth: '150px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  statVal: { fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' },
  statLabel: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' },
  gridCard: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', overflowX: 'auto', marginBottom: '24px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' },
  thC: { padding: '12px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'center' },
  tr: { borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' },
  td: { padding: '16px 12px', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' },
  tdC: { padding: '12px', textAlign: 'center', fontSize: '1rem' },
  tdPct: { padding: '12px', textAlign: 'center', color: 'var(--accent-blue)', fontWeight: 800 },
  bottomRow: { display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' },
  chartCard: { flex: 2, minWidth: '400px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' },
  chartTitle: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  sideCol: { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' },
  medalsCard: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', flex: 1 },
  medalList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  medalRow: { display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: '12px', border: '1px dashed var(--border-color)' },
  medalEmoji: { fontSize: '1.5rem', marginRight: '12px' },
  medalName: { flex: 1, color: 'var(--text-primary)', fontWeight: 600 },
  medalPct: { fontWeight: 800, color: 'var(--text-primary)' }
};
