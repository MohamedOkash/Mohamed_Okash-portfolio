import React from 'react';
import { usePerformance } from '../../utils/perf';

export const CinematicBackground = React.memo(() => {
  const { mode } = usePerformance();

  if (mode === 'performance') return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{
        contain: 'strict',
        transform: 'translateZ(0)',
        background:
          'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent-color) 14%, transparent) 0%, transparent 38%), radial-gradient(circle at 12% 22%, color-mix(in srgb, var(--accent-color) 8%, transparent) 0%, transparent 30%), radial-gradient(circle at 88% 72%, color-mix(in srgb, var(--text-primary) 6%, transparent) 0%, transparent 32%)'
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border-color) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 78%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 78%, transparent 100%)'
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[52vh] opacity-[0.06]"
        style={{
          background:
            'linear-gradient(115deg, transparent 0%, var(--accent-color) 38%, transparent 70%)',
          transform: 'translate3d(0,0,0)'
        }}
      />
    </div>
  );
});
