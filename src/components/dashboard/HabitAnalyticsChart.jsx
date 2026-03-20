import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HabitAnalyticsChart({ data = [] }) {
  // Format data specifically for chart if needed, 
  // 'data' already matches { date: "YYYY-MM-DD", dayNumber: 1, count: 5 }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>HABIT ANALYTICS</span>
        <span style={styles.subtitle}>DAILY PROGRESS</span>
      </div>

      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="dayNumber" stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} allowDecimals={false} />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--accent-green)', fontWeight: 600 }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="count" stroke="var(--accent-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, fill: '#00c9ff', stroke: 'var(--bg-card)', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', flex: '1.5', minWidth: '400px'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' },
  subtitle: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' },
  chartWrapper: { flex: 1, minHeight: '220px', width: '100%' }
};
