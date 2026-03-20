import { UserPlus } from 'lucide-react';

export default function Signup() {
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
          <UserPlus size={32} />
        </div>
        <h2 className="text-gradient-green">Sign Up</h2>
        <p>Registration form coming in Stage 2.</p>
      </div>
    </div>
  );
}
