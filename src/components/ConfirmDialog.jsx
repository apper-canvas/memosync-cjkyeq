import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger" // danger, warning, info
}) {
  const AlertIcon = getIcon(variant === "danger" ? "AlertTriangle" : variant === "warning" ? "AlertCircle" : "Info");
  const dialogRef = useRef(null);

  // Close on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Trap focus inside dialog
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  const variantClasses = {
    danger: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    info: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          ref={dialogRef}
          tabIndex={-1}
          className="relative bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className={`p-4 rounded-t-xl flex items-center gap-3 ${variantClasses[variant]}`}>
            <AlertIcon size={20} />
            <h3 className="font-medium text-lg">{title}</h3>
          </div>
          <div className="p-5">{message}</div>
          <div className="flex justify-end gap-3 p-4 border-t border-surface-200 dark:border-surface-700">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
              {cancelText}
            </button>
            <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ConfirmDialog;