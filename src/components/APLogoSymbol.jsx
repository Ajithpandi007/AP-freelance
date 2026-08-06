import React from 'react';

export const APLogoSymbol = ({ size = 'md', className = '', showGlow = true, variant = 'cyber' }) => {
  // Size presets
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const containerSize = sizeClasses[size] || className || 'w-11 h-11';

  return (
    <div className={`relative group inline-flex items-center justify-center ${containerSize} ${className}`}>
      {/* Background ambient glow effect */}
      {showGlow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-tilt"></div>
      )}

      {/* Outer gradient badge container */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-pink-500 p-[1.5px] shadow-xl shadow-cyan-500/20">
        <div className="w-full h-full bg-slate-950/95 rounded-[14px] flex items-center justify-center p-2 backdrop-blur-md overflow-hidden">
          
          {/* New Sleek Geometric Monogram SVG for AP */}
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transform transition-transform duration-300 group-hover:scale-110"
          >
            <defs>
              {/* Primary Vibrant Gradient for AP */}
              <linearGradient id="apNewGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan 500 */}
                <stop offset="45%" stopColor="#6366f1" /> {/* Indigo 500 */}
                <stop offset="100%" stopColor="#ec4899" /> {/* Pink 500 */}
              </linearGradient>

              {/* Secondary Bright Accent Gradient */}
              <linearGradient id="apNewGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" /> {/* Sky 400 */}
                <stop offset="100%" stopColor="#a855f7" /> {/* Purple 500 */}
              </linearGradient>

              {/* Radial glow fill */}
              <radialGradient id="apCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>

              {/* Neon Glow Filter */}
              <filter id="apNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Core Glow Circle */}
            <circle cx="50" cy="50" r="40" fill="url(#apCoreGlow)" />

            {/* Outer Hexagonal Tech Crest */}
            <polygon
              points="50,6 88,27 88,73 50,94 12,73 12,27"
              stroke="url(#apNewGradient2)"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.4"
            />

            {/* LETTER 'A' - Apex Futuristic Triangle Stroke */}
            <path
              d="M 22 78 L 50 18 L 78 78"
              stroke="url(#apNewGradient1)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#apNeonGlow)"
            />

            {/* LETTER 'A' Crossbar - Glowing Cyan Bar */}
            <path
              d="M 33 56 H 67"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* LETTER 'P' - Dynamic Interlocking Upper Loop attached to the right side of 'A' */}
            <path
              d="M 50 18 C 76 18 84 38 68 50 C 58 58 48 56 42 56"
              stroke="url(#apNewGradient2)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#apNeonGlow)"
            />

            {/* Glowing Tech Intersection Nodes */}
            <circle cx="50" cy="18" r="4" fill="#38bdf8" className="animate-pulse" />
            <circle cx="22" cy="78" r="3.5" fill="#06b6d4" />
            <circle cx="78" cy="78" r="3.5" fill="#ec4899" />
            <circle cx="68" cy="50" r="3" fill="#a855f7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
