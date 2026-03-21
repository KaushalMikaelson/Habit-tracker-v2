import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/authStore';
import { HabitsProvider } from './hooks/useHabits';
import { GamificationProvider } from './store/GamificationContext';
import { ThemeProvider } from './store/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import HabitGrid from './pages/HabitGrid';
import Stats from './pages/Stats';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import WeeklyView from './pages/WeeklyView';
import MonthlyView from './pages/MonthlyView';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected app pages — all require auth
const APP_ROUTES = [
  { path: '/',         element: <Dashboard /> },
  { path: '/habits',   element: <HabitGrid /> },
  { path: '/stats',    element: <Stats /> },
  { path: '/reports',  element: <Reports /> },
  { path: '/weekly',   element: <WeeklyView /> },
  { path: '/monthly',  element: <MonthlyView /> },
  { path: '/settings', element: <Settings /> },
];

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b22',
              color: '#e6edf3',
              border: '1px solid #30363d',
              borderRadius: '10px',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#00ff88', secondary: '#0d1117' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0d1117' },
            },
          }}
        />

        <Routes>
          {/* ── Public Routes ─────────────────────────── */}
          <Route path="/login"  element={<Login />}  />
          <Route path="/signup" element={<Signup />} />

          {/* ── Protected Routes (wrapped in Layout) ─── */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <HabitsProvider>
                  <GamificationProvider>
                    <Layout>
                      <Routes>
                      {APP_ROUTES.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                      ))}
                      {/* Catch-all → Dashboard */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    </Layout>
                  </GamificationProvider>
                </HabitsProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
  );
}
