import { Grid3X3 } from 'lucide-react';

export default function HabitGrid() {
  return (
    <div className="page-placeholder">
      <div className="page-placeholder-icon">
        <Grid3X3 size={32} />
      </div>
      <h2 className="text-gradient-green">Habit Grid</h2>
      <p>Your GitHub-style habit completion grid will be displayed here.</p>
    </div>
  );
}
