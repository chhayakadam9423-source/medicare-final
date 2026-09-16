import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Maximize2,
  Moon,
  Sun,
  Code2,
  Wifi,
  Signal,
  BatteryCharging,
  UserCheck,
  Stethoscope,
  ShieldAlert,
} from 'lucide-react';
import { ToastContainer } from './Toast';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    theme,
    toggleTheme,
    deviceFrame,
    toggleDeviceFrame,
    currentRole,
    loginAs,
    setIsFlutterCodeOpen,
  } = useApp();

  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-start text-[#172B4D] dark:text-slate-100 transition-colors duration-300">
      <ToastContainer />

      {/* Top Universal Control Strip */}
      <header
        id="medicare-device-control-bar"
        className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between z-40 sticky top-0"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1565C0] to-[#00897B] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            M
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-outfit font-bold text-sm tracking-wide text-[#1565C0] dark:text-blue-400">
              MEDICARE
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Android Studio Ready • Flutter & Dart
            </span>
          </div>
        </div>

        {/* Demo Role Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-full border border-slate-200 dark:border-slate-700/60 shadow-inner">
          <button
            id="role-btn-patient"
            onClick={() => loginAs('patient')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              currentRole === 'patient'
                ? 'bg-[#1565C0] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Patient</span>
          </button>
          <button
            id="role-btn-doctor"
            onClick={() => loginAs('doctor')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              currentRole === 'doctor'
                ? 'bg-[#00897B] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor</span>
          </button>
          <button
            id="role-btn-admin"
            onClick={() => loginAs('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              currentRole === 'admin'
                ? 'bg-slate-800 dark:bg-slate-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="flutter-code-btn"
            onClick={() => setIsFlutterCodeOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-[#00897B] dark:text-emerald-300 hover:bg-emerald-100 transition-colors border border-emerald-200/50 dark:border-emerald-800/40"
            title="View full Flutter & Dart source files"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Flutter Code</span>
          </button>

          <button
            id="toggle-frame-btn"
            onClick={toggleDeviceFrame}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            title={deviceFrame === 'phone' ? 'Switch to Full Screen Viewport' : 'Switch to Android Pixel Frame'}
          >
            {deviceFrame === 'phone' ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{deviceFrame === 'phone' ? 'Expand' : 'Phone'}</span>
          </button>

          <button
            id="toggle-theme-btn"
            onClick={toggleTheme}
            className="p-1.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 lg:p-6 overflow-hidden">
        {deviceFrame === 'phone' ? (
          /* Android Pixel 8 Device Frame */
          <div
            id="android-device-frame"
            className="relative w-full max-w-[420px] h-[890px] max-h-[95vh] bg-black rounded-[48px] p-3 shadow-2xl shadow-blue-900/10 border-[6px] border-slate-800 dark:border-slate-700 flex flex-col overflow-hidden transition-all duration-300"
          >
            {/* Screen Inner Bezel */}
            <div className="relative w-full h-full bg-[#F5F9FC] dark:bg-[#0F172A] rounded-[38px] flex flex-col overflow-hidden shadow-inner">
              {/* Android Status Bar */}
              <div
                id="android-status-bar"
                className="w-full h-8 px-6 pt-1.5 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 select-none z-30 shrink-0 bg-transparent"
              >
                <span>{currentTime}</span>

                {/* Camera Punch Hole */}
                <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner border border-slate-900/50" />

                <div className="flex items-center gap-1.5">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-bold">98%</span>
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* Android Gesture Navigation Pill */}
              <div
                id="android-nav-bar"
                className="w-full h-5 flex items-center justify-center bg-transparent shrink-0 z-30 pointer-events-none"
              >
                <div className="w-28 h-1 bg-slate-400/60 dark:bg-slate-600/80 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Responsive Viewport */
          <div
            id="responsive-viewport-container"
            className="w-full max-w-5xl h-[90vh] bg-[#F5F9FC] dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col"
          >
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
