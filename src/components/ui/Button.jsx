import Spinner from './Spinner';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',         // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  id,
  className = '',
  style,
  ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant] || 'btn-primary';

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size] || '';

  return (
    <button
      id={id}
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={16} />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
