import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import AddHabitModal from '../habits/AddHabitModal';

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

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={addHabitOpen}
        onClose={() => setAddHabitOpen(false)}
      />
    </div>
  );
}
