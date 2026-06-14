import React, { useEffect, useState } from 'react';
import { usePerformance, useTabVisibility } from '../../utils/perf';

export const CinematicBackground = () => {
  const [mounted, setMounted] = useState(false);
  const { mode, isLowEnd, prefersReducedMotion } = usePerformance();
  const tabHidden = useTabVisibility();
  const paused = tabHidden || prefersReducedMotion;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || mode === 'performance') {
    if (mode === 'performance') return <div className="fixed inset-0 z-0 bg-[var(--bg-primary)]" />;
    return null;
  }

  const layerOpacity = isLowEnd ? 0.04 : 0.08;
  const svgOpacity = isLowEnd ? 0.06 : 0.12;
  const showSVGLayers = mode !== 'balanced';

  return (
    <div 
      className="cinematic-background fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
      style={{ 
        opacity: mounted ? 1.0 : 0, 
        transform: 'translateZ(0)', 
        contain: 'strict',
        transition: 'opacity 3000ms ease-in-out'
      }}
    >
      {/* Soft Radial Ambient Glows */}
      <div 
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[85vw] h-[55vh] rounded-full blur-[140px] pointer-events-none"
        style={{ opacity: isLowEnd ? 0.15 : 0.3, background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', animation: paused ? 'none' : undefined }}
      />
      <div 
        className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vh] rounded-full blur-[160px] pointer-events-none"
        style={{ opacity: isLowEnd ? 0.08 : 0.15, background: 'var(--accent)' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vh] rounded-full blur-[150px] pointer-events-none"
        style={{ opacity: isLowEnd ? 0.06 : 0.12, background: 'var(--primary)' }}
      />

      {/* Layer 1: Engineering Blueprint Grid */}
      <div 
        className="absolute inset-0"
        style={{
          opacity: layerOpacity,
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.18) 1px, transparent 1px)',
          backgroundSize: isLowEnd ? '80px 80px' : '60px 60px',
          animation: paused ? 'none' : 'gridScroll 180s linear infinite',
          maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 95%)',
          willChange: paused ? 'auto' : 'background-position'
        }}
      />

      {/* Light Rays - skip on balanced */}
      {!isLowEnd && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lightRay1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lightRay2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M -100 -100 L 800 800 L 700 850 L -200 50 Z" fill="url(#lightRay1)" />
          <path d="M 1200 -200 L 400 900 L 300 850 L 1100 -300 Z" fill="url(#lightRay2)" />
        </svg>
      )}

      {/* SVG Canvas - skip on balanced */}
      {showSVGLayers && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: paused ? 0.01 : undefined }}>
          <g style={{ opacity: svgOpacity }} stroke="var(--primary)" strokeWidth="1" fill="none">
            <path d="M 120 180 H 380 V 320 H 550" strokeDasharray="5 5" className={paused ? '' : 'animate-dash'} />
            <path d="M 850 120 H 1050 V 280 H 900 V 450" strokeDasharray="6 4" className={paused ? '' : 'animate-dash'} style={{ animationDirection: 'reverse' }} />
            <path d="M 100 650 H 320 V 500 H 450" strokeDasharray="4 6" className={paused ? '' : 'animate-dash'} />
            <path d="M 750 780 H 980 V 620 H 1150" strokeDasharray="8 4" className={paused ? '' : 'animate-dash'} />
            <line x1="380" y1="200" x2="850" y2="120" stroke="var(--accent)" strokeDasharray="2 8" />
            <line x1="320" y1="500" x2="750" y2="780" stroke="var(--accent)" strokeDasharray="3 9" />
            <circle cx="120" cy="180" r="16" strokeWidth="1.5" />
            <path d="M 110 180 H 130 M 120 170 V 190" strokeWidth="1" />
            <circle cx="120" cy="180" r="6" fill="var(--primary)" />
            <circle cx="1050" cy="280" r="16" strokeWidth="1.5" stroke="var(--accent)" />
            <path d="M 1040 280 H 1060 M 1050 270 V 290" stroke="var(--accent)" strokeWidth="1" />
            <circle cx="1050" cy="280" r="6" fill="var(--accent)" />
            <rect x="350" y="305" width="60" height="30" rx="4" strokeWidth="1.5" fill="rgba(0,0,0,0.4)" />
            <rect x="950" y="605" width="60" height="30" rx="4" strokeWidth="1.5" fill="rgba(0,0,0,0.4)" stroke="var(--accent)" />
          </g>
        </svg>
      )}

      {/* Floating Glass Particles - skip on low end */}
      {!isLowEnd && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ opacity: paused ? 0 : undefined }}>
          <div className="absolute top-[20%] left-[15%] w-12 h-16 rounded-lg bg-[var(--surface-hover)] border border-[var(--border-color)] backdrop-blur-[2px] shadow-sm" style={{ animation: paused ? 'none' : 'driftSlow1 28s infinite ease-in-out' }} />
          <div className="absolute top-[65%] right-[12%] w-16 h-20 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] backdrop-blur-[3px] shadow-sm" style={{ animation: paused ? 'none' : 'driftSlow2 32s infinite ease-in-out' }} />
          <div className="absolute bottom-[20%] left-[25%] w-10 h-10 rounded bg-[var(--surface-hover)] border border-[var(--border-color)] backdrop-blur-[1px] shadow-sm" style={{ animation: paused ? 'none' : 'driftSlow3 24s infinite ease-in-out' }} />
          <div className="absolute top-[10%] right-[30%] w-8 h-12 rounded-lg bg-[var(--surface-hover)] border border-[var(--border-color)] backdrop-blur-[2px] shadow-sm" style={{ animation: paused ? 'none' : 'driftSlow4 36s infinite ease-in-out' }} />
        </div>
      )}

      {/* Dynamic Keyframes Injection */}
      <style>{`
        @keyframes gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 360px 720px; }
        }
        .animate-dash {
          stroke-dasharray: 8;
          animation: dashMove 20s linear infinite;
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -1000; }
        }
        @keyframes driftSlow1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          50% { transform: translate(40px, -60px) rotate(15deg); opacity: 0.8; }
        }
        @keyframes driftSlow2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; }
          50% { transform: translate(-70px, 40px) rotate(-10deg); opacity: 0.7; }
        }
        @keyframes driftSlow3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
          50% { transform: translate(50px, 50px) rotate(20deg); opacity: 0.9; }
        }
        @keyframes driftSlow4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          50% { transform: translate(-30px, -40px) rotate(-25deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
