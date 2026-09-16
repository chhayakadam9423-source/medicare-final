import React from 'react';
import { motion } from 'motion/react';
import { Activity, Plus } from 'lucide-react';

interface MedicareLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  animated?: boolean;
}

export const MedicareLogo: React.FC<MedicareLogoProps> = ({
  size = 'md',
  showText = false,
  showTagline = false,
  animated = false,
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4', text: 'text-lg', sub: 'text-[10px]' },
    md: { box: 'w-11 h-11 rounded-2xl', icon: 'w-6 h-6', text: 'text-xl', sub: 'text-xs' },
    lg: { box: 'w-16 h-16 rounded-3xl', icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-sm' },
    xl: { box: 'w-24 h-24 rounded-[32px]', icon: 'w-14 h-14', text: 'text-4xl', sub: 'text-base' },
  };

  const config = sizeMap[size];

  const logoIcon = (
    <div
      id="medicare-logo-icon"
      className={`relative ${config.box} bg-gradient-to-tr from-[#1565C0] via-[#0D47A1] to-[#00897B] flex items-center justify-center shadow-lg shadow-blue-900/20 text-white overflow-hidden`}
    >
      {/* Subtle medical cross watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15">
        <Plus className="w-full h-full text-white" strokeWidth={3} />
      </div>

      {/* Pulse and cross icon */}
      <div className="relative z-10 flex items-center justify-center">
        <Activity className={`${config.icon} text-emerald-300 drop-shadow-sm`} strokeWidth={2.5} />
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-3">
      {animated ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {logoIcon}
        </motion.div>
      ) : (
        logoIcon
      )}

      {showText && (
        <div className="flex flex-col">
          <span className={`font-outfit font-extrabold tracking-wider ${config.text} text-[#1565C0] dark:text-blue-400 flex items-center gap-1`}>
            MEDICARE
            <span className="w-1.5 h-1.5 rounded-full bg-[#00897B] inline-block animate-pulse" />
          </span>
          {showTagline && (
            <span className={`font-medium text-[#667085] dark:text-slate-400 ${config.sub}`}>
              Healthcare made simple.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
