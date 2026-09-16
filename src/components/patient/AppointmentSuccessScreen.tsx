import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle,
  Calendar,
  Clock,
  Building2,
  UserCheck,
  FileCheck2,
  Home,
  CalendarCheck,
} from 'lucide-react';

export const AppointmentSuccessScreen: React.FC = () => {
  const { confirmedAppointment, setConfirmedAppointment, setPatientTab } = useApp();

  useEffect(() => {
    // Fire confetti bursts
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1565C0', '#00897B', '#26A69A', '#F9A825'],
      });
    } catch (e) {
      // ignore in headless test
    }
  }, []);

  if (!confirmedAppointment) return null;

  const handleGoToAppointments = () => {
    setConfirmedAppointment(null);
    setPatientTab('appointments');
  };

  const handleGoHome = () => {
    setConfirmedAppointment(null);
    setPatientTab('home');
  };

  return (
    <div
      id="appointment-success-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col items-center text-center text-[#172B4D] dark:text-slate-100"
      >
        {/* Animated Checkmark Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 120, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-inner"
        >
          <CheckCircle className="w-10 h-10" strokeWidth={2.5} />
        </motion.div>

        <h2 className="font-outfit text-xl font-extrabold text-[#172B4D] dark:text-white">
          Appointment Confirmed!
        </h2>
        <p className="text-xs text-[#667085] dark:text-slate-400 mt-1 font-medium">
          Your consultation has been successfully booked with the hospital.
        </p>

        {/* Appointment ID Pill */}
        <div className="my-3 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-xs font-bold text-[#1565C0] dark:text-blue-300">
          ID: {confirmedAppointment.id}
        </div>

        {/* Details Card */}
        <div className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 text-left space-y-2.5 my-2">
          <div className="flex items-center gap-2 text-xs">
            <UserCheck className="w-4 h-4 text-[#00897B] shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-800 dark:text-white block truncate">
                {confirmedAppointment.doctorName}
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                {confirmedAppointment.doctorSpecialization || (confirmedAppointment as any).doctorSpecialty}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Building2 className="w-4 h-4 text-[#1565C0] shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 truncate">
              {confirmedAppointment.hospitalName}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {confirmedAppointment.date}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-[#00897B]">
              <Clock className="w-3.5 h-3.5" />
              <span>{confirmedAppointment.time}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2 mt-4">
          <button
            id="success-view-appointment-btn"
            onClick={handleGoToAppointments}
            className="w-full py-3 px-4 rounded-xl bg-[#1565C0] hover:bg-blue-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>View in Appointments</span>
          </button>

          <button
            id="success-back-home-btn"
            onClick={handleGoHome}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
