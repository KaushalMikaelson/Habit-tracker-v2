import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = 480 }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="modal-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-box"
            style={{ maxWidth }}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              <button
                className="btn-icon"
                onClick={onClose}
                id="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">{children}</div>

            {/* Footer (optional) */}
            {footer && <div className="modal-footer">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
