import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import AddHabitModal from '../habits/AddHabitModal';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function Layout({ children }) {
  const [addHabitOpen, setAddHabitOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <TopNav onAddHabit={() => setAddHabitOpen(true)} />

        <main className="page-content animate-fade-in">
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <BottomNav />

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={addHabitOpen}
        onClose={() => setAddHabitOpen(false)}
      />
    </div>
  );
}
