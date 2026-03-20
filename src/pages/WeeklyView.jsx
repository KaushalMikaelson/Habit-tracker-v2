import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getWeeklyReport } from '../api/reports';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, addDays } from 'date-fns';
import Spinner from '../components/ui/Spinner';

export default function WeeklyView() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(d.setDate(diff));
    return mon;
  });

  useEffect(() => {
    const fetchIt = async () => {
      setLoading(true);
      try {
        const data = await getWeeklyReport(format(startDate, 'yyyy-MM-dd'));
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIt();
  }, [startDate]);

  const handlePrev = () => setStartDate(subDays(startDate, 7));
  const handleNext = () => setStartDate(addDays(startDate, 7));

  if (loading || !report) return <div style={{display:'flex', justifyContent:'center', padding:'40px'}}><Spinner size={32} color="var(--accent-green)" /></div>;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div style={styles.navRow}>
          <button style={styles.iconBtn} onClick={handlePrev}><ChevronLeft /></button>
          <h2 style={styles.weekTitle}>{report.weekRange}</h2>
          <button style={styles.iconBtn} onClick={handleNext}><ChevronRight /></button>
        </div>
      </div>

      <div style={styles.summaryRow}>
        <Card label="Total Completions" value={report.summary.totalCompletions} />
        <Card label="Best Day" value={report.summary.bestDay} />
        <Card label="Worst Day" value={report.summary.worstDay} />
        <Card label="Completion %" value={`${report.summary.completionPercent}%`} />
        <Card label="Perfect Habits" value={report.summary.perfectHabits.length} />
      </div>

      <div style={styles.gridCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Habit</th>
              <th style={styles.thC}>Mon</th>
              <th style={styles.thC}>Tue</th>
              <th style={styles.thC}>Wed</th>
              <th style={styles.thC}>Thu</th>
              <th style={styles.thC}>Fri</th>
              <th style={styles.thC}>Sat</th>
              <th style={styles.thC}>Sun</th>
              <th style={styles.thC}>Total</th>
              <th style={styles.thC}>%</th>
            </tr>
          </thead>
          <tbody>
            {report.habits.sort((a,b)=>b.total-a.total).map((h, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>{h.name}</td>
                <td style={styles.tdC}>{h.days.mon ? '✅' : '❌'}</td>
                <td style={styles.tdC}>{h.days.tue ? '✅' : '❌'}</td>
                <td style={styles.tdC}>{h.days.wed ? '✅' : '❌'}</td>
                <td style={styles.tdC}>{h.days.thu ? '✅' : '❌'}</td>
                <td style={styles.tdC}>{h.days.fri ? '✅' : '❌'}</td>
                <td style={styles.tdC}>{h.days.sat ? '✅' : '❌'}</td>
                <td style={styles.tdC}>{h.days.sun ? '✅' : '❌'}</td>
                <td style={styles.tdTotal}>{h.total}</td>
                <td style={styles.tdPct}>{h.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Daily Completion Velocity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={report.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="day" stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)' }} />
              <YAxis allowDecimals={false} stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip cursor={{ fill: 'var(--bg-secondary)' }} contentStyle={{background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff'}} />
              <Bar dataKey="count" fill="var(--accent-green)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.calloutCard}>
          <div style={styles.callout}>
            <span style={{fontSize:'1.6rem', marginRight: '16px'}}>🏆</span>
            <div>
              <strong style={{color: 'var(--text-primary)'}}>Perfect week:</strong> 
              <div style={styles.calllist}>{report.summary.perfectHabits.join(', ') || 'None this week.'}</div>
            </div>
          </div>
          <div style={styles.callout}>
            <span style={{fontSize:'1.6rem', marginRight: '16px'}}>⚠️</span>
            <div>
              <strong style={{color: 'var(--text-primary)'}}>Needs attention:</strong> 
              <div style={styles.calllist}>{report.summary.missedMostHabits.join(', ') || 'Doing great!'}</div>
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
  tr: { borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'default' },
  td: { padding: '16px 12px', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' },
  tdC: { padding: '12px', textAlign: 'center', fontSize: '1rem' },
  tdTotal: { padding: '12px', textAlign: 'center', fontWeight: 800, color: 'var(--text-primary)' },
  tdPct: { padding: '12px', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 800 },
  bottomRow: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  chartCard: { flex: 2, minWidth: '300px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' },
  chartTitle: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  calloutCard: { flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px' },
  callout: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'flex-start' },
  calllist: { marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }
};
