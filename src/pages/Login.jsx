import { LogIn } from 'lucide-react';

export default function Login() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="page-placeholder">
        <div className="page-placeholder-icon">
          <LogIn size={32} />
        </div>
        <h2 className="text-gradient-green">Login</h2>
        <p>Authentication form coming in Stage 2.</p>
      </div>
    </div>
  );
}
