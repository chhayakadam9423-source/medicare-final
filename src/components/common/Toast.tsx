import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icon =
            toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            );

          const borderColors =
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-950 dark:text-emerald-100'
              : toast.type === 'error'
              ? 'border-rose-500/30 bg-rose-50/95 dark:bg-rose-950/90 text-rose-950 dark:text-rose-100'
              : toast.type === 'warning'
              ? 'border-amber-500/30 bg-amber-50/95 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100'
              : 'border-blue-500/30 bg-blue-50/95 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border shadow-lg backdrop-blur-md text-sm font-medium ${borderColors}`}
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="text-xs sm:text-sm">{toast.message}</span>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
