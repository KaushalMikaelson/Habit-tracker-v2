import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Modal from '../ui/Modal';

export default function Layout({ children }) {
  const [addHabitOpen, setAddHabitOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <TopNav onAddHabit={() => setAddHabitOpen(true)} />

        <main className="page-content animate-fade-in">
          {children}
        </main>
      </div>

      {/* Add Habit Modal — wired in Stage 2 */}
      <Modal
        isOpen={addHabitOpen}
        onClose={() => setAddHabitOpen(false)}
        title="Add New Habit"
      >
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Habit creation form coming in Stage 2 🚀
        </div>
      </Modal>
    </div>
  );
}
