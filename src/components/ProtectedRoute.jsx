import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from './ui/Spinner';

/**
 * ProtectedRoute — guards any route that requires authentication.
 *
 * States:
 *  1. isLoading → show full-screen spinner (session being restored from localStorage)
 *  2. isAuthenticated → render children
 *  3. not authenticated → redirect to /login
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          gap: 16,
        }}
      >
        <Spinner size={40} />
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          Restoring session…
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
