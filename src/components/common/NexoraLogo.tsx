import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const pixelMap = {
    sm: { px: 28, text: 'text-base', badge: 'text-[9px]' },
    md: { px: 36, text: 'text-lg', badge: 'text-[10px]' },
    lg: { px: 44, text: 'text-xl', badge: 'text-xs' },
    xl: { px: 56, text: 'text-2xl', badge: 'text-xs' }
  };

  const current = pixelMap[size] || pixelMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div 
        style={{ width: `${current.px}px`, height: `${current.px}px` }}
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-900/80 via-slate-900 to-slate-950 p-1.5 border border-blue-500/30 shadow-lg shadow-blue-500/10 shrink-0"
      >
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          style={{ width: '100%', height: '100%' }}
          className="transform -rotate-12 transition-transform duration-300 hover:rotate-0"
        >
          <path
            d="M7 24L16 5L25 24L16 19.5L7 24Z"
            fill="url(#logo-grad)"
            stroke="#93c5fd"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="14" r="2.2" fill="#ffffff" />
          <defs>
            <linearGradient id="logo-grad" x1="16" y1="5" x2="16" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="0.5" stopColor="#2563eb" />
              <stop offset="1" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-white ${current.text}`}>
              NEXORA
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              AI NAVIGATOR
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
