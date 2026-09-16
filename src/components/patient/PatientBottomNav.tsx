import React from 'react';
import { useApp } from '../../context/AppContext';
import { PatientTab } from '../../types';
import {
  Home,
  Building2,
  UserCheck,
  CalendarCheck,
  FileText,
  User,
} from 'lucide-react';

export const PatientBottomNav: React.FC = () => {
  const { patientTab, setPatientTab, appointments } = useApp();

  const upcomingCount = appointments.filter((a) => a.status === 'upcoming').length;

  const tabs: { id: PatientTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'doctors', label: 'Doctors', icon: UserCheck },
    { id: 'appointments', label: 'Bookings', icon: CalendarCheck },
    { id: 'records', label: 'Records', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="patient-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-40 px-3 py-2 flex items-center justify-around"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = patientTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => setPatientTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all relative ${
              isActive
                ? 'text-[#1565C0] dark:text-blue-400 font-bold scale-105'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />

              {tab.id === 'appointments' && upcomingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </div>

            <span className="text-[10px] mt-0.5 tracking-tight">
              {tab.label}
            </span>

            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] dark:bg-blue-400 absolute -bottom-1" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
