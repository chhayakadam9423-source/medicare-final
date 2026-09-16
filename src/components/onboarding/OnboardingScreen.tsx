import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, UserCheck, CalendarCheck, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OnboardingScreenProps {
  onFinish?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const { setHasCompletedOnboarding, setShowWelcome } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Find Trusted Hospitals',
      description: 'Discover hospitals and healthcare services easily with accredited ratings, facilities and departments.',
      icon: Building2,
      gradient: 'from-blue-600 to-cyan-600',
      badge: 'Accredited Centers',
    },
    {
      id: 2,
      title: 'Connect With Doctors',
      description: 'Explore experienced doctors and their specialties across cardiology, orthopedics, pediatrics, and more.',
      icon: UserCheck,
      gradient: 'from-teal-600 to-emerald-600',
      badge: 'Verified Specialists',
    },
    {
      id: 3,
      title: 'Book Appointments Easily',
      description: 'Choose your doctor, date and time in just a few steps with instant digital confirmation.',
      icon: CalendarCheck,
      gradient: 'from-indigo-600 to-blue-600',
      badge: 'Instant Scheduling',
    },
  ];

  const handleFinish = () => {
    localStorage.setItem('medicare_onboarding_done', 'true');
    setHasCompletedOnboarding(true);
    setShowWelcome(true);
    onFinish?.();
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const currentSlide = slides[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div
      id="medicare-onboarding-screen"
      className="w-full h-full flex flex-col justify-between p-6 bg-[#F5F9FC] dark:bg-[#0F172A] text-[#172B4D] dark:text-slate-100 relative select-none"
    >
      {/* Top Header: Skip */}
      <div className="w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#1565C0] to-[#00897B] flex items-center justify-center text-white font-bold text-xs">
            M
          </div>
          <span className="font-outfit font-bold text-xs text-[#1565C0] dark:text-blue-400">
            MEDICARE
          </span>
        </div>

        {currentIndex < slides.length - 1 ? (
          <button
            id="onboarding-skip-btn"
            onClick={handleFinish}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-3 py-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            Skip
          </button>
        ) : (
          <span className="w-10" />
        )}
      </div>

      {/* Middle Animated Card */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center max-w-xs"
          >
            {/* Visual Medical Illustration Container */}
            <div className="relative mb-8">
              <div
                className={`w-44 h-44 rounded-3xl bg-gradient-to-tr ${currentSlide.gradient} flex items-center justify-center text-white shadow-xl shadow-blue-600/15 relative overflow-hidden`}
              >
                {/* Decorative background grid rings */}
                <div className="absolute inset-0 bg-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                <div className="w-32 h-32 rounded-full border border-white/20 absolute" />
                <div className="w-24 h-24 rounded-full border border-white/30 absolute" />

                <IconComponent className="w-20 h-20 text-white drop-shadow-md relative z-10" strokeWidth={1.75} />
              </div>

              {/* Floating Pill Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-bold shadow-md border border-slate-200 dark:border-slate-700"
              >
                {currentSlide.badge}
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="font-outfit text-2xl font-bold tracking-tight text-[#172B4D] dark:text-white mb-3">
              {currentSlide.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-[#667085] dark:text-slate-400 leading-relaxed font-medium">
              {currentSlide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex flex-col items-center gap-6 pb-4">
        {/* Page Dots Indicator */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? 'w-7 bg-[#1565C0] dark:bg-blue-400'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Action Button: Next or Get Started */}
        <div className="w-full">
          {currentIndex === slides.length - 1 ? (
            <button
              id="onboarding-get-started-btn"
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1565C0] to-[#00897B] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="onboarding-next-btn"
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1565C0] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
