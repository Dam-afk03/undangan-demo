import React from 'react';

// Delicate vintage floral corner flourish in Silver / Platinum
export const FloralCornerOrnament: React.FC<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ className = 'w-16 h-16 text-slate-300/40', position = 'top-left' }) => {
  let transform = '';
  let positionClass = '';

  switch (position) {
    case 'top-left':
      positionClass = 'top-3 left-3';
      transform = 'rotate(0deg)';
      break;
    case 'top-right':
      positionClass = 'top-3 right-3';
      transform = 'scaleX(-1)';
      break;
    case 'bottom-left':
      positionClass = 'bottom-3 left-3';
      transform = 'scaleY(-1)';
      break;
    case 'bottom-right':
      positionClass = 'bottom-3 right-3';
      transform = 'scale(-1, -1)';
      break;
  }

  return (
    <div className={`absolute ${positionClass} pointer-events-none z-10 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-80"
        style={{ transform }}
      >
        <path
          d="M4 4 L4 38 M4 4 L38 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 8 L8 28 M8 8 L28 8"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <circle cx="4" cy="4" r="2.5" fill="currentColor" />
        <circle cx="38" cy="4" r="1.5" fill="currentColor" />
        <circle cx="4" cy="38" r="1.5" fill="currentColor" />
        {/* Delicate vine curves */}
        <path
          d="M10 10 C 22 14, 28 24, 34 34 C 24 28, 14 22, 10 10 Z"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <path
          d="M10 10 C 14 22, 18 36, 12 48"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M10 10 C 22 14, 36 18, 48 12"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Flower / petal buds */}
        <circle cx="24" cy="18" r="2" fill="currentColor" fillOpacity="0.7" />
        <circle cx="18" cy="24" r="2" fill="currentColor" fillOpacity="0.7" />
        <circle cx="32" cy="14" r="1.5" fill="currentColor" fillOpacity="0.5" />
        <circle cx="14" cy="32" r="1.5" fill="currentColor" fillOpacity="0.5" />
      </svg>
    </div>
  );
};

// Symmetrical luxury divider with floral crest & diamond center in Silver
export const FloralDivider: React.FC<{
  className?: string;
  withStar?: boolean;
}> = ({ className = 'my-6', withStar = true }) => {
  return (
    <div className={`flex items-center justify-center gap-3 text-slate-300/60 ${className}`}>
      <div className="h-px flex-1 max-w-[80px] sm:max-w-[120px] bg-gradient-to-r from-transparent via-slate-400/50 to-slate-200" />
      <svg
        className="w-10 h-6 shrink-0 text-slate-300/80 fill-current"
        viewBox="0 0 64 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M32 3 C30 8, 22 10, 16 9 C 22 12, 28 14, 32 21 C 36 14, 42 12, 48 9 C 42 10, 34 8, 32 3 Z" />
        <circle cx="32" cy="12" r="2.5" fill="#f1f5f9" />
        <circle cx="20" cy="11" r="1.2" />
        <circle cx="44" cy="11" r="1.2" />
      </svg>
      {withStar && (
        <span className="text-slate-200 text-xs font-serif select-none">✦</span>
      )}
      <div className="h-px flex-1 max-w-[80px] sm:max-w-[120px] bg-gradient-to-l from-transparent via-slate-400/50 to-slate-200" />
    </div>
  );
};

// Botanical Laurel Wreath for Monogram / Portraits in Silver
export const BotanicalLaurel: React.FC<{ className?: string }> = ({
  className = 'w-32 h-32 text-slate-300/50',
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      {/* Left branch */}
      <path
        d="M 60 110 C 35 110, 18 90, 18 60 C 18 35, 35 18, 55 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Leaves on left */}
      <path d="M 28 85 C 20 85, 18 78, 24 75 C 27 79, 29 82, 28 85 Z" fill="currentColor" />
      <path d="M 20 68 C 12 65, 14 58, 20 58 C 22 62, 21 66, 20 68 Z" fill="currentColor" />
      <path d="M 20 50 C 14 45, 18 38, 24 40 C 24 45, 22 48, 20 50 Z" fill="currentColor" />
      <path d="M 27 34 C 23 27, 30 22, 35 26 C 33 30, 30 33, 27 34 Z" fill="currentColor" />
      <path d="M 40 22 C 38 15, 46 12, 50 17 C 47 20, 43 21, 40 22 Z" fill="currentColor" />

      {/* Right branch */}
      <path
        d="M 60 110 C 85 110, 102 90, 102 60 C 102 35, 85 18, 65 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Leaves on right */}
      <path d="M 92 85 C 100 85, 102 78, 96 75 C 93 79, 91 82, 92 85 Z" fill="currentColor" />
      <path d="M 100 68 C 108 65, 106 58, 100 58 C 98 62, 99 66, 100 68 Z" fill="currentColor" />
      <path d="M 100 50 C 106 45, 102 38, 96 40 C 96 45, 98 48, 100 50 Z" fill="currentColor" />
      <path d="M 93 34 C 97 27, 90 22, 85 26 C 87 30, 90 33, 93 34 Z" fill="currentColor" />
      <path d="M 80 22 C 82 15, 74 12, 70 17 C 73 20, 77 21, 80 22 Z" fill="currentColor" />

      {/* Ribbon at base */}
      <path
        d="M 52 110 Q 60 114 68 110 Q 64 107 52 110 Z"
        fill="currentColor"
      />
    </svg>
  );
};

// Elegant Islamic Bismillah Calligraphy SVG
export const BismillahEmblem: React.FC<{ className?: string }> = ({
  className = 'w-56 h-14 text-slate-200/90 mx-auto',
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      {/* Stylized Arabic Bismillah text representation */}
      <span className="font-serif text-2xl sm:text-3xl tracking-widest text-slate-200/90 select-none drop-shadow">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </span>
    </div>
  );
};
