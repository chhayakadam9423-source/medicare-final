import React from 'react';
import { motion } from 'motion/react';
import { MedicareLogo } from '../common/MedicareLogo';
import { ShieldCheck, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectLogin: () => void;
  onSelectRegister: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectLogin,
  onSelectRegister,
}) => {
  return (
    <div
      id="medicare-welcome-screen"
      className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#F5F9FC] via-white to-[#F0F6FC] dark:from-[#0F172A] dark:via-[#131E35] dark:to-[#0B1120] text-[#172B4D] dark:text-slate-100 select-none"
    >
      {/* Top Banner / Trust Badge */}
      <div className="pt-2 flex justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold text-[#1565C0] dark:text-blue-300 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00897B]" />
          <span>NABH Accredited Healthcare Network</span>
        </div>
      </div>

      {/* Hero Branding Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center my-auto"
      >
        <div className="mb-6 relative">
          <MedicareLogo size="xl" />
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center shadow-md text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
        </div>

        <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-[#1565C0] dark:text-blue-400 mb-2">
          MEDICARE
        </h1>
        <p className="text-base font-semibold text-[#172B4D] dark:text-slate-200">
          Healthcare made simple.
        </p>
        <p className="text-xs text-[#667085] dark:text-slate-400 max-w-xs mt-2 leading-relaxed">
          Access verified doctors, trusted hospitals, seamless appointments, and encrypted digital medical records in one tap.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full flex flex-col gap-3 pb-4"
      >
        <button
          id="welcome-login-btn"
          onClick={onSelectLogin}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#1565C0] hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>LOGIN</span>
        </button>

        <button
          id="welcome-register-btn"
          onClick={onSelectRegister}
          className="w-full py-3.5 px-6 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-[#1565C0] dark:text-blue-400 font-bold text-sm tracking-wide border border-blue-200 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>CREATE ACCOUNT</span>
        </button>

        <div className="text-center mt-2">
          <span className="text-[11px] text-[#667085] dark:text-slate-400">
            Offline Demo Mode • No external backend required
          </span>
        </div>
      </motion.div>
    </div>
  );
};
