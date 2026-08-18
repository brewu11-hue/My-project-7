import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true, theme = 'dark' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-sm font-extrabold tracking-tight',
    md: 'text-lg font-black tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const isLight = theme === 'light';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Official B-in Charge Emblem (Professional Polish: #FBBD23 rounded badge) */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-[#FBBD23] p-1 shadow-sm flex-shrink-0`}
      >
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 fill-slate-900" aria-label="B-in Charge Logo">
          {/* Prongs */}
          <rect x="36" y="10" width="8" height="18" rx="2" fill="#0F172A" />
          <rect x="56" y="10" width="8" height="18" rx="2" fill="#0F172A" />
          {/* Main Plug Body */}
          <path
            d="M25 28 C25 24, 75 24, 75 28 L75 52 C75 66, 58 72, 58 84 L42 84 C42 72, 25 66, 25 52 Z"
            fill="#0F172A"
          />
          {/* Cord base */}
          <rect x="44" y="84" width="12" height="8" rx="1" fill="#0F172A" />
          {/* Lightning bolt cutout inside plug */}
          <path
            d="M52 35 L40 50 L48 50 L46 65 L58 48 L50 48 Z"
            fill="#FBBD23"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span
            className={`${titleSizes[size]} font-heading font-black uppercase leading-none ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            B-IN CHARGE
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`${subtitleSizes[size]} font-bold tracking-widest text-[#FBBD23] uppercase mt-1 leading-none`}
          >
            South Africa • Mobile Stations
          </span>
        )}
      </div>
    </div>
  );
};
