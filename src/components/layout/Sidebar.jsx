import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid3X3,
  BarChart3,
  FileText,
  Settings,
  Sparkles,
  Trophy,
  Zap,
  CalendarDays,
  CalendarRange
} from 'lucide-react';

const NAV_ITEMS = [
  {
    section: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/habits', label: 'Habit Grid', icon: Grid3X3 },
      { to: '/stats', label: 'Stats', icon: BarChart3 },
      { to: '/weekly', label: 'Weekly View', icon: CalendarDays },
      { to: '/monthly', label: 'Monthly View', icon: CalendarRange },
      { to: '/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    section: 'Account',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar animate-slide-in-left">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-green), #00c9ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={18} color="#0d1117" strokeWidth={2.5} />
          </div>
          <div>
            <div className="sidebar-logo-title">Habit Tracker</div>
            <div className="sidebar-logo-sub">Track your journey</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((section) => (
          <div key={section.section}>
            <div className="sidebar-nav-section">{section.section}</div>
            {section.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
              >
                <Icon size={18} className="nav-icon" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {/* Achievements teaser */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.08))',
            border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Trophy size={14} color="var(--accent-purple)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
              Achievements
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Complete habits to unlock badges
          </div>
        </div>

        {/* App version */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 2px',
          }}
        >
          <Sparkles size={12} color="var(--text-muted)" />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Habit Tracker v1.0
          </span>
        </div>
      </div>
    </aside>
  );
}
