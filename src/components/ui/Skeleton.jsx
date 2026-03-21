import { useEffect, useRef } from 'react';

export default function Skeleton({ width = '100%', height = '20px', rounded = false, className = '', style = {} }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded ? '999px' : '8px',
        ...style,
      }}
    />
  );
}

// Compound helpers
export function SkeletonCard({ children, style = {} }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', ...style }}>
      {children}
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <SkeletonCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, minWidth: '140px' }}>
      <Skeleton width="80px" height="80px" style={{ borderRadius: '50%' }} />
      <Skeleton width="60px" height="12px" rounded />
      <Skeleton width="40px" height="10px" rounded />
    </SkeletonCard>
  );
}

export function SkeletonChartArea() {
  return (
    <SkeletonCard style={{ flex: 2 }}>
      <Skeleton width="120px" height="14px" rounded style={{ marginBottom: '16px' }} />
      <Skeleton width="100%" height="160px" style={{ borderRadius: '12px' }} />
    </SkeletonCard>
  );
}

export function SkeletonHabitRow() {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
      <Skeleton width="200px" height="36px" style={{ flexShrink: 0 }} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} width="32px" height="32px" style={{ borderRadius: '7px', flexShrink: 0 }} />
      ))}
    </div>
  );
}

export function SkeletonHeatmap() {
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {Array.from({ length: 84 }).map((_, i) => (
        <Skeleton key={i} width="14px" height="14px" style={{ borderRadius: '3px', flexShrink: 0 }} />
      ))}
    </div>
  );
}

export function SkeletonTopHabitBar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Skeleton width="24px" height="20px" rounded />
        <Skeleton width="120px" height="16px" rounded />
        <Skeleton width="60px" height="12px" rounded style={{ marginLeft: 'auto' }} />
      </div>
      <Skeleton width="100%" height="8px" rounded />
    </div>
  );
}
