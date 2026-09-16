import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Droplet,
  AlertTriangle,
  HeartPulse,
  CalendarCheck,
  FileText,
  Bookmark,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const PatientProfileScreen: React.FC = () => {
  const {
    currentUser,
    logout,
    theme,
    toggleTheme,
    appointments,
    medicalRecords,
    savedHospitalIds,
    setPatientTab,
  } = useApp();

  const upcomingCount = appointments.filter((a) => a.status === 'upcoming').length;

  return (
    <div id="patient-profile-screen" className="w-full flex flex-col pb-24 select-none">
      {/* Header */}
      <div className="px-5 pt-3 pb-2">
        <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#172B4D] dark:text-white">
          Patient Profile
        </h2>
        <p className="text-xs text-[#667085] dark:text-slate-400 font-medium">
          Personal demographics & health credentials
        </p>
      </div>

      <div className="px-5 flex flex-col gap-4 mt-2">
        {/* User Identity Hero */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1565C0]/30 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-outfit font-extrabold text-base text-[#172B4D] dark:text-white truncate">
              {currentUser.name}
            </h3>
            <p className="text-xs text-[#667085] dark:text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              {currentUser.email}
            </p>
            <p className="text-xs text-[#667085] dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              {currentUser.phone || '+91 98765 43210'}
            </p>
          </div>
        </div>

        {/* Quick Health Stats Counters */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setPatientTab('appointments')}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col items-center text-center hover:border-[#1565C0] transition-colors"
          >
            <CalendarCheck className="w-5 h-5 text-[#1565C0] mb-1" />
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {upcomingCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Upcoming Visits</span>
          </button>

          <button
            onClick={() => setPatientTab('records')}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col items-center text-center hover:border-[#00897B] transition-colors"
          >
            <FileText className="w-5 h-5 text-[#00897B] mb-1" />
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {medicalRecords.length}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Medical Records</span>
          </button>

          <button
            onClick={() => setPatientTab('hospitals')}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col items-center text-center hover:border-amber-500 transition-colors"
          >
            <Bookmark className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {savedHospitalIds.length}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Saved Hospitals</span>
          </button>
        </div>

        {/* Medical Information Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
            <h4 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Medical Information</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center gap-2.5">
              <Droplet className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">BLOOD GROUP</span>
                <strong className="text-xs">O Positive (O+)</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#1565C0] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">AGE & GENDER</span>
                <strong className="text-xs">32 Yrs • Male</strong>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs">
            <span className="text-[10px] text-slate-400 block font-semibold mb-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              ALLERGIES
            </span>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Penicillin, Sulfa drugs, Peanuts
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs">
            <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">
              CHRONIC CONDITIONS
            </span>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Mild Hypertension (Controlled)
            </p>
          </div>
        </div>

        {/* Preferences & Settings */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-2">
          <h4 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white mb-1">
            Preferences & Settings
          </h4>

          <div
            onClick={toggleTheme}
            className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
              <span>Dark Mode Theme</span>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">
              {theme}
            </span>
          </div>

          <div
            onClick={logout}
            className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <LogOut className="w-4 h-4" />
              <span>Log Out of MEDICARE</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
