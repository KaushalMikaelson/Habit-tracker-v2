export default function Card({
  children,
  className = '',
  glowColor = null, // 'green' | 'purple' | null
  onClick,
  style,
  ...props
}) {
  const glowClass =
    glowColor === 'green'
      ? ' card-glow-green'
      : glowColor === 'purple'
      ? ' card-glow-purple'
      : '';

  return (
    <div
      className={`card${glowClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
