import React from 'react';
import { useAdmin } from '../context/AdminContext';

interface LogoProps {
  variant?: 'blue' | 'white' | 'circle' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  customSrc?: string;
}

export default function BeliefLogo({
  variant = 'blue',
  size = 'md',
  className = '',
  showSubtitle = true,
  customSrc,
}: LogoProps) {
  // Try getting uploaded logo from AdminContext if not explicitly passed
  let uploadedLogo = customSrc;
  try {
    const admin = useAdmin();
    if (!uploadedLogo && admin.siteMedia) {
      if (variant === 'circle' && admin.siteMedia.customLogoCircle) {
        uploadedLogo = admin.siteMedia.customLogoCircle;
      } else if (variant === 'white' && admin.siteMedia.customLogoWhite) {
        uploadedLogo = admin.siteMedia.customLogoWhite;
      } else if (admin.siteMedia.customLogoBlue) {
        uploadedLogo = admin.siteMedia.customLogoBlue;
      }
    }
  } catch {
    // If used outside provider, fallback gracefully
  }

  // Dimensions
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base font-black',
    md: 'text-xl md:text-2xl font-black',
    lg: 'text-2xl md:text-3xl font-black',
    xl: 'text-3xl md:text-4xl font-black',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // Circular Badge version
  if (variant === 'circle') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        {uploadedLogo ? (
          <img
            src={uploadedLogo}
            alt="Belief English Emblem"
            className={`${iconSizes[size] || 'w-14 h-14'} rounded-full object-contain p-0.5 bg-white shadow-md border-2 border-orange-500`}
          />
        ) : (
          <svg
            viewBox="0 0 200 200"
            className={iconSizes[size] || 'w-14 h-14'}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Ring */}
            <circle cx="100" cy="100" r="95" stroke="#1e3a8a" strokeWidth="6" fill="#ffffff" />
            <circle cx="100" cy="100" r="87" stroke="#f97316" strokeWidth="2" strokeDasharray="4 3" />
            
            {/* Inner Badge Shield */}
            <path
              d="M100 28 L152 48 V104 C152 140 100 172 100 172 C100 172 48 140 48 104 V48 Z"
              fill="#1e3a8a"
            />
            <path
              d="M100 34 L146 52 V102 C146 134 100 164 100 164 C100 164 54 134 54 102 V52 Z"
              fill="#172554"
            />

            {/* Golden Torch & Star & Letter B */}
            <path d="M100 52 L105 64 H117 L107 72 L111 84 L100 76 L89 84 L93 72 L83 64 H95 Z" fill="#fbbf24" />
            
            <path
              d="M82 92 H106 C113 92 118 96 118 102 C118 106 115 109 110 111 C117 113 120 118 120 124 C120 132 113 137 104 137 H82 V92 Z"
              fill="#ffffff"
            />
            <path
              d="M92 100 H104 C107 100 109 102 109 105 C109 108 107 110 104 110 H92 V100 Z"
              fill="#1e3a8a"
            />
            <path
              d="M92 118 H106 C109 118 111 120 111 124 C111 128 109 130 106 130 H92 V118 Z"
              fill="#1e3a8a"
            />
            
            <path d="M60 115 Q68 145 100 162" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <path d="M140 115 Q132 145 100 162" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </div>
    );
  }

  // Icon only
  if (variant === 'icon-only') {
    return (
      <div
        className={`${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] p-1.5 flex items-center justify-center shadow-md shadow-blue-900/25 ${className}`}
      >
        {uploadedLogo ? (
          <img src={uploadedLogo} alt="Logo" className="w-full h-full object-contain" />
        ) : (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 10 L84 24 V58 C84 80 50 96 50 96 C50 96 16 80 16 58 V24 Z"
              fill="#1e3a8a"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            <path d="M50 20 L53 28 H61 L54 33 L57 41 L50 36 L43 41 L46 33 L39 28 H47 Z" fill="#f59e0b" />
            <text
              x="50%"
              y="72%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="34"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              B
            </text>
          </svg>
        )}
      </div>
    );
  }

  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon Badge */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-2xl ${
          isWhite
            ? 'bg-white/10 border border-white/20 text-white backdrop-blur-sm'
            : 'bg-gradient-to-br from-[#1e3a8a] via-[#1e3a8a] to-[#172554] text-white shadow-md shadow-blue-900/20'
        } p-1.5 flex items-center justify-center transition-transform hover:scale-105 duration-200 overflow-hidden`}
      >
        {uploadedLogo ? (
          <img src={uploadedLogo} alt="Logo" className="w-full h-full object-contain" />
        ) : (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 8 L88 24 V60 C88 82 50 96 50 96 C50 96 12 82 12 60 V24 Z"
              fill={isWhite ? '#ffffff' : '#1e3a8a'}
              stroke={isWhite ? '#fbbf24' : '#f97316'}
              strokeWidth="4"
            />
            <path d="M50 20 L53.5 28 H62 L55 33.5 L58 41.5 L50 36.5 L42 41.5 L45 33.5 L38 28 H46.5 Z" fill="#fbbf24" />
            <text
              x="50%"
              y="70%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill={isWhite ? '#1e3a8a' : '#ffffff'}
              fontSize="36"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              B
            </text>
          </svg>
        )}
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span
            className={`${titleSizes[size]} tracking-tight leading-none ${
              isWhite ? 'text-white' : 'text-[#1e3a8a]'
            }`}
          >
            Belief English
          </span>
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
        </div>
        {showSubtitle && (
          <span
            className={`${subtitleSizes[size]} font-bold tracking-wider uppercase mt-0.5 ${
              isWhite ? 'text-orange-300' : 'text-orange-600'
            }`}
          >
            Member of BELIS GROUP
          </span>
        )}
      </div>
    </div>
  );
}
