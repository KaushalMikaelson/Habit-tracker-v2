import { motion, AnimatePresence } from 'framer-motion';

export default function CoinAnimation({ amount }) {
  if (!amount) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.8 }}
        animate={{ opacity: 1, y: -25, scale: 1.1 }}
        exit={{ opacity: 0, y: -40, filter: 'blur(2px)' }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '-20px',
          background: 'rgba(168, 85, 247, 0.2)',
          color: 'var(--accent-purple)',
          padding: '4px 8px',
          borderRadius: '8px',
          fontWeight: 800,
          border: '1px solid rgba(168, 85, 247, 0.4)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 100
        }}
      >
        +{amount} 🪙
      </motion.div>
    </AnimatePresence>
  );
}
