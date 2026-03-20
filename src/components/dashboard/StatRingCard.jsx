import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatRingCard({ label, percent = 0, delta = 0, color = '#00ff88' }) {
  const radius = 38;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    // Animate to percent
    const targetOffset = circumference - (percent / 100) * circumference;
    setOffset(targetOffset);
  }, [percent, circumference]);

  const isPositive = delta >= 0;

  return (
    <div style={styles.card}>
      <div style={styles.ringWrapper}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={styles.svg}>
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="var(--bg-secondary)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div style={styles.absoluteCenter}>
          <span style={styles.percentText}>{percent}%</span>
        </div>
      </div>
      
      <div style={styles.infoArea}>
        <span style={{ ...styles.deltaBox, color: isPositive ? 'var(--accent-green)' : '#ef4444' }}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(delta)}%
        </span>
        <span style={styles.label}>{label}</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: '0'
  },
  ringWrapper: { position: 'relative', width: 100, height: 100 },
  svg: { position: 'absolute', top: 0, left: 0 },
  absoluteCenter: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  percentText: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' },
  infoArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  deltaBox: { display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.85rem', fontWeight: 700 },
  label: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }
};
