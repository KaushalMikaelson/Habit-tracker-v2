import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import HabitGrid from './pages/HabitGrid';
import Stats from './pages/Stats';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Pages that don't use the sidebar/topnav Layout
const AUTH_PAGES = [
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
];

// Pages that live inside the main Layout
const APP_PAGES = [
  { path: '/', element: <Dashboard /> },
  { path: '/habits', element: <HabitGrid /> },
  { path: '/stats', element: <Stats /> },
  { path: '/reports', element: <Reports /> },
  { path: '/settings', element: <Settings /> },
];

export default function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent-green)',
              secondary: '#0d1117',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0d1117',
            },
          },
        }}
      />

      <Routes>
        {/* Auth routes — no sidebar/topnav */}
        {AUTH_PAGES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* App routes — wrapped in Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                {APP_PAGES.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
                {/* Catch-all → Dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
