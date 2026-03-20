import { LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="page-placeholder">
      <div className="page-placeholder-icon">
        <LayoutDashboard size={32} />
      </div>
      <h2 className="text-gradient-green">Dashboard</h2>
      <p>Your habit overview, streaks, and today's progress will appear here.</p>
    </div>
  );
}
