import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WeeklyBarChart({ data }) {
  const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    completed: data[day] || 0
  }));
  
  const avg = chartData.reduce((a, b) => a + b.completed, 0) / 7;

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Weekly Pattern</h3>
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="day" stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 'dataMax + 1']} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ fontWeight: 600, color: 'var(--accent-green)' }}
              cursor={{ fill: 'var(--bg-secondary)' }}
            />
            <ReferenceLine y={avg} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'top', value: 'Avg', fill: '#ef4444', fontSize: 10 }} />
            <Bar dataKey="completed" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  container: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' },
  header: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em', margin: '0 0 16px 0' },
  chartWrapper: { flex: 1, minHeight: '220px', width: '100%' }
};
