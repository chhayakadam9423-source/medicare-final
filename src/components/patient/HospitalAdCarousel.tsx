import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Advertisement } from '../../types';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

interface HospitalAdCarouselProps {
  onExploreAd?: (ad: Advertisement) => void;
}

export const HospitalAdCarousel: React.FC<HospitalAdCarouselProps> = ({ onExploreAd }) => {
  const { advertisements, hospitals, setSelectedHospital, startBooking } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter active ads
  const activeAds = advertisements.filter((ad) => ad.status === 'active');

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    if (isPaused || activeAds.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, activeAds.length]);

  if (activeAds.length === 0) return null;

  const currentAd = activeAds[currentIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  const handleAdClick = () => {
    if (onExploreAd) {
      onExploreAd(currentAd);
      return;
    }
    // If ad is tied to a hospital, open that hospital
    if (currentAd.hospitalId) {
      const targetHosp = hospitals.find((h) => h.id === currentAd.hospitalId);
      if (targetHosp) {
        setSelectedHospital(targetHosp);
        return;
      }
    }
    // Fallback: start booking
    startBooking();
  };

  return (
    <section
      id="hospital-advertisement-carousel"
      className="w-full relative px-4 my-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        onClick={handleAdClick}
        className="relative w-full h-44 sm:h-48 rounded-3xl overflow-hidden shadow-lg shadow-blue-950/10 cursor-pointer group select-none border border-slate-200/80 dark:border-slate-800"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Dark Vignette Gradient */}
            <img
              src={currentAd.bannerImage}
              alt={currentAd.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/20" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10 text-white">
              {/* Top Row: SPONSORED Badge + Discount Pill */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    id="ad-sponsored-badge"
                    className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    SPONSORED
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300 truncate max-w-[170px] sm:max-w-xs">
                    {currentAd.hospitalName}
                  </span>
                </div>

                {currentAd.discountBadge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                    <Tag className="w-2.5 h-2.5" />
                    {currentAd.discountBadge}
                  </span>
                )}
              </div>

              {/* Middle: Title & Offer Description */}
              <div className="my-auto pr-8">
                <h3 className="font-outfit text-lg sm:text-xl font-extrabold text-white leading-tight drop-shadow-sm line-clamp-1">
                  {currentAd.title}
                </h3>
                <p className="text-xs text-amber-200 font-bold mt-0.5 line-clamp-1">
                  {currentAd.offer}
                </p>
                <p className="text-[11px] text-slate-200/90 mt-1 line-clamp-1 hidden sm:block max-w-sm">
                  {currentAd.description}
                </p>
              </div>

              {/* Bottom: CTA Button & Hospital Link */}
              <div className="flex items-center justify-between pt-1">
                <button
                  id="ad-cta-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdClick();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#1565C0] font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>{currentAd.ctaText || 'Explore Now →'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] text-slate-300 font-medium">
                  {currentIndex + 1} of {activeAds.length}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Prev/Next subtle arrow controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous advertisement"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next advertisement"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {activeAds.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-6 bg-[#1565C0] dark:bg-blue-400'
                : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
