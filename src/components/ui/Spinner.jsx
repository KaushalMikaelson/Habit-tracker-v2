export default function Spinner({ size = 24, color = 'var(--accent-green)' }) {
  return (
    <div className="spinner">
      <div
        className="spinner-ring"
        style={{
          width: size,
          height: size,
          borderTopColor: color,
        }}
      />
    </div>
  );
}
