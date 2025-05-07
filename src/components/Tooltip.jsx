import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Tooltip({ 
  children, 
  content, 
  position = "top", 
  delay = 600,
  offset = 8
}) {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId = null;

  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: offset },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: offset },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: offset },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: offset },
  };

  return (
    <div className="relative inline-block" 
      onMouseEnter={() => { timeoutId = setTimeout(() => setIsVisible(true), delay); }}
      onMouseLeave={() => { clearTimeout(timeoutId); setIsVisible(false); }}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}
            className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-surface-800 dark:bg-surface-900 rounded whitespace-nowrap shadow-lg pointer-events-none" style={positionStyles[position]}>
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tooltip;