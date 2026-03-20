import { BarChart3 } from 'lucide-react';

export default function Stats() {
  return (
    <div className="page-placeholder">
      <div className="page-placeholder-icon">
        <BarChart3 size={32} />
      </div>
      <h2 className="text-gradient-green">Statistics</h2>
      <p>Charts and analytics about your habit performance will appear here.</p>
    </div>
  );
}
