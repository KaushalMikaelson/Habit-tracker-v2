import { useMemo } from 'react';

export default function Heatmap({ data = {} }) {
  // data matches { "YYYY-MM-DD": true }
  const weeksCount = 53;
  const daysInWeek = 7;
  const cellSize = 12;
  const cellGap = 4;
  
  const today = new Date();
  
  const cells = useMemo(() => {
    const arr = [];
    // Start generating dates from exactly 53 weeks ago (approx 371 days)
    for (let w = 0; w < weeksCount; w++) {
      const col = [];
      for (let d = 0; d < daysInWeek; d++) {
        const daysAgo = (weeksCount - 1 - w) * 7 + (7 - 1 - d);
        const dateObj = new Date();
        dateObj.setDate(today.getDate() - daysAgo);
        
        const dateStr = dateObj.toISOString().split('T')[0];
        const isDone = Boolean(data[dateStr]);
        
        col.push({ dateStr, isDone, x: w * (cellSize + cellGap), y: d * (cellSize + cellGap) });
      }
      arr.push(col);
    }
    return arr;
  }, [data]); // Only recompute if data object reference changes

  return (
    <div style={styles.wrapper}>
      <svg width={(cellSize + cellGap) * weeksCount} height={(cellSize + cellGap) * daysInWeek} style={styles.svg}>
        {cells.map((col, wIdx) => (
          <g key={wIdx}>
            {col.map((cell, dIdx) => (
              <rect
                key={dIdx}
                x={cell.x}
                y={cell.y}
                width={cellSize}
                height={cellSize}
                rx={3}
                fill={cell.isDone ? 'var(--accent-green)' : 'var(--bg-secondary)'}
                data-tooltip={`${cell.dateStr} — ${cell.isDone ? 'Completed' : 'Missed'}`}
                style={styles.rect}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

// Minimal styling mapped strictly
const styles = {
  wrapper: {
    padding: '16px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflowX: 'auto',
    marginBottom: '20px'
  },
  svg: {
    display: 'block',
    margin: '0 auto'
  },
  rect: {
    transition: 'fill 0.2s',
    cursor: 'pointer'
  }
};
