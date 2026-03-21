export default function EmptyState({ emoji = '🌱', title, subtitle, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-emoji">{emoji}</div>
      <h3 className="empty-state-title">{title}</h3>
      {subtitle && <p className="empty-state-subtitle">{subtitle}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm empty-state-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
