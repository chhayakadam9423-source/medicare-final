import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCircle2,
  CalendarCheck,
  FileText,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const { isNotificationOpen, setIsNotificationOpen, notifications, markAllNotificationsRead } = useApp();

  if (!isNotificationOpen) return null;

  return (
    <div
      id="medicare-notifications-modal"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden mt-6 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#1565C0] dark:text-blue-400" />
            <h3 className="font-outfit font-bold text-base text-slate-900 dark:text-white">
              Notifications
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-[#1565C0] dark:text-blue-400 hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.map((notif) => {
            const icon =
              notif.type === 'appointment' ? (
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
              ) : notif.type === 'prescription' ? (
                <FileText className="w-4 h-4 text-blue-500" />
              ) : notif.type === 'ad' ? (
                <Megaphone className="w-4 h-4 text-amber-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#00897B]" />
              );

            return (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  !notif.isRead
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm shrink-0">
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-outfit font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
