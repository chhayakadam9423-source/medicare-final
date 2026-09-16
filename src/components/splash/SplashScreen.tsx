import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { MedicareLogo } from '../common/MedicareLogo';
import { useApp } from '../../context/AppContext';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { setHasSeenSplash } = useApp();

  const handleAdvance = () => {
    setHasSeenSplash(true);
    onFinish?.();
  };

  useEffect(() => {
    // Auto advance after 2.4 seconds
    const timer = setTimeout(() => {
      handleAdvance();
    }, 2400);
    return () => clearTimeout(timer);
  }, [setHasSeenSplash, onFinish]);

  return (
    <div
      id="medicare-splash-screen"
      onClick={handleAdvance}
      className="w-full h-full min-h-full flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#F5F9FC] via-[#EBF3FA] to-[#E1ECF7] dark:from-[#0F172A] dark:via-[#131F37] dark:to-[#0B1120] p-6 text-center cursor-pointer select-none relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-400/15 dark:bg-blue-600/10 blur-3xl pointer-events-none animate-pulse" />

      {/* 1 & 2: Medical Logo Fades in and scales */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 relative z-10"
      >
        <div className="relative">
          <MedicareLogo size="xl" animated={false} />
          {/* Subtle pulse ring */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-[32px] border-2 border-[#00897B] -z-10 pointer-events-none"
          />
        </div>
      </motion.div>

      {/* 3: Medicare text appears */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        className="font-outfit text-4xl font-extrabold tracking-wider text-[#1565C0] dark:text-blue-400 relative z-10 flex items-center justify-center gap-1.5"
      >
        MEDICARE
        <span className="w-2 h-2 rounded-full bg-[#00897B] inline-block" />
      </motion.h1>

      {/* 4: Tagline fades in */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
        className="text-base font-medium text-[#667085] dark:text-slate-400 mt-2 tracking-wide relative z-10"
      >
        Healthcare made simple.
      </motion.p>

      {/* 5: Loading indicator pill at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <div className="w-32 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-[#1565C0] to-[#00897B] rounded-full"
          />
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Tap anywhere to skip
        </span>
      </motion.div>
    </div>
  );
};
