import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CategoryDonut({ data }) {
  // data matches { health: {done: 45, total: 60}, learning: {done: 38, total: 60} }
  
  const chartData = Object.keys(data).map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: data[category].done
  })).filter(item => item.value > 0);

  const COLORS = ['#00ff88', '#00c9ff', '#a855f7', '#ec4899', '#f59e0b'];

  if (chartData.length === 0) return <div style={styles.empty}>No category data calculated</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Category Breakdown</h3>
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ fontWeight: 600 }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  container: { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' },
  header: { fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em', margin: '0 0 16px 0' },
  chartWrapper: { flex: 1, minHeight: '200px' },
  empty: { color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '40px' }
};
