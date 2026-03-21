import { useState, useRef, useEffect } from 'react';
import { Flame, Plus, LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGamification } from '../../store/GamificationContext';
import { useTheme } from '../../store/ThemeContext';
import LevelBadge from '../gamification/LevelBadge';
import CoinAnimation from '../gamification/CoinAnimation';

function getInitials(name = '') {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

export default function TopNav({ onAddHabit }) {
  const { user, logout } = useAuth();
  const { gameData, recentCoins } = useGamification();
  const { theme, toggleTheme } = useTheme();

  const streak = 0;
  const coins = gameData?.coins ?? user?.coins ?? 0;
  const level = gameData?.level ?? user?.level ?? 1;
  const totalXP = gameData?.totalXP ?? user?.totalXP ?? 0;

  const initials = getInitials(user?.name);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="topnav">
      {/* Left: Title */}
      <div className="topnav-left">
        <span className="topnav-title">Habit Tracker</span>
        <span className="topnav-subtitle hidden-mobile">Track your consistency</span>
      </div>

      {/* Right */}
      <div className="topnav-right">
        {/* Level Badge — hidden on mobile */}
        <div className="hidden-mobile">
          <LevelBadge level={level} xp={totalXP} />
        </div>

        {/* Streak — hidden on mobile */}
        <div className="stat-badge stat-badge-streak hidden-mobile" title="Current streak">
          <Flame size={14} strokeWidth={2.5} />
          <span>{streak}</span>
          <span style={{ fontWeight: 400, opacity: 0.75, fontSize: '0.7rem' }}>days</span>
        </div>

        {/* Coins */}
        <div className="stat-badge stat-badge-coins" title="Coins earned" style={{ position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 6v2m0 8v2M9.5 9.5C9.5 8.7 10.6 8 12 8s2.5.7 2.5 1.5S13.4 11 12 11s-2.5.7-2.5 1.5S10.6 14 12 14s2.5-.7 2.5-1.5" />
          </svg>
          <span className="coin-flip" key={coins}>{coins}</span>
          <CoinAnimation amount={recentCoins} />
        </div>

        {/* Theme Toggle */}
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Add Habit Button */}
        <button id="topnav-add-habit-btn" className="add-habit-btn" onClick={onAddHabit}>
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden-mobile">Add Habit</span>
        </button>

        {/* User Avatar + Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            id="topnav-user-avatar"
            className="user-avatar"
            title={user?.name ?? 'User'}
            onClick={() => setDropdownOpen((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, width: 'auto', padding: '0 10px', borderRadius: 20 }}
          >
            <span>{initials}</span>
            <ChevronDown
              size={12}
              style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {dropdownOpen && (
            <div style={dropdownStyles.menu}>
              <div style={dropdownStyles.userInfo}>
                <div style={dropdownStyles.avatar}>{initials}</div>
                <div>
                  <div style={dropdownStyles.userName}>{user?.name ?? 'User'}</div>
                  <div style={dropdownStyles.userEmail}>{user?.email ?? ''}</div>
                </div>
              </div>

              <div style={dropdownStyles.divider} />

              <button style={dropdownStyles.item} onClick={() => setDropdownOpen(false)}>
                <User size={14} />
                <span>Profile</span>
              </button>

              <button style={dropdownStyles.item} onClick={() => { toggleTheme(); setDropdownOpen(false); }}>
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <div style={dropdownStyles.divider} />

              <button
                id="topnav-logout-btn"
                style={{ ...dropdownStyles.item, color: '#ef4444' }}
                onClick={() => { logout(); setDropdownOpen(false); }}
              >
                <LogOut size={14} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const dropdownStyles = {
  menu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    minWidth: 220,
    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
    zIndex: 200,
    padding: '8px 0',
    animation: 'fadeIn 0.15s ease',
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 12px' },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-purple), #ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 800, color: 'white', flexShrink: 0,
  },
  userName: { fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' },
  userEmail: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 },
  divider: { height: 1, background: 'var(--border-subtle)', margin: '4px 0' },
  item: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 14px', background: 'none', border: 'none',
    color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer',
    textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.15s, color 0.15s',
  },
};
