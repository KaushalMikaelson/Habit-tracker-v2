import { Flame, Coins, Plus, Bell } from 'lucide-react';

export default function TopNav({ onAddHabit }) {
  // Hardcoded values — wired to real data in later stages
  const streak = 0;
  const coins = 0;
  const initials = 'HF'; // placeholder user initials

  return (
    <header className="topnav">
      {/* Left: Title */}
      <div className="topnav-left">
        <span className="topnav-title">Habit Tracker</span>
        <span className="topnav-subtitle">Track your consistency</span>
      </div>

      {/* Right: Badges + Actions */}
      <div className="topnav-right">
        {/* Streak Badge */}
        <div className="stat-badge stat-badge-streak" title="Current streak">
          <Flame size={14} strokeWidth={2.5} />
          <span>{streak}</span>
          <span style={{ fontWeight: 400, opacity: 0.75, fontSize: '0.7rem' }}>days</span>
        </div>

        {/* Coins Badge */}
        <div className="stat-badge stat-badge-coins" title="Coins earned">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="8" />
            <path d="M12 6v2m0 8v2M9.5 9.5C9.5 8.7 10.6 8 12 8s2.5.7 2.5 1.5S13.4 11 12 11s-2.5.7-2.5 1.5S10.6 14 12 14s2.5-.7 2.5-1.5" />
          </svg>
          <span>{coins}</span>
          <span style={{ fontWeight: 400, opacity: 0.75, fontSize: '0.7rem' }}>coins</span>
        </div>

        {/* Notifications (placeholder) */}
        <button className="btn-icon" title="Notifications" id="topnav-notifications-btn">
          <Bell size={18} />
        </button>

        {/* Add Habit Button */}
        <button
          id="topnav-add-habit-btn"
          className="add-habit-btn"
          onClick={onAddHabit}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Habit
        </button>

        {/* User Avatar */}
        <div className="user-avatar" title="User profile" id="topnav-user-avatar">
          {initials}
        </div>
      </div>
    </header>
  );
}
