import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MonthlyTrendChart({ data }) {
  const chartData = Object.keys(data).map(month => ({
    month: month.split(' ')[0], 
    ThisHabit: data[month],
    AllHabitsAverage: Math.max(1, Math.round(data[month] * 0.8)) // Dummy calc for visual contrast comparison
  }));

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Monthly Trend</h3>
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="month" stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis stroke="var(--border-color)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 'dataMax + 1']} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="ThisHabit" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="AllHabitsAverage" fill="var(--bg-secondary)" radius={[4, 4, 0, 0]} />
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
