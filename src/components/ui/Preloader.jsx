import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRAFCounter } from '../../utils/perf';

export const Preloader = React.memo(({ finishLoading, preloaderText }) => {
  const progress = useRAFCounter(100, { duration: 780 });

  useEffect(() => {
    const timer = window.setTimeout(finishLoading, 900);
    return () => window.clearTimeout(timer);
  }, [finishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[9999] flex items-center justify-center select-none overflow-hidden"
    >
      {/* faint boot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border-color) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />

      {/* scanning line sweep */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--accent-color) 10%, transparent), transparent)' }}
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 1.1, ease: 'linear', repeat: Infinity }}
      />

      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-24 rounded-[2rem] border flex items-center justify-center relative"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
        >
          <span
            className="w-2 h-2 rounded-full absolute top-3 right-3 animate-pulse"
            style={{ backgroundColor: 'var(--accent-color)' }}
          />
          <span className="text-[var(--text-primary)] text-xl font-black tracking-[0.22em] uppercase">
            {preloaderText || 'OK'}
          </span>
        </motion.div>

        <div className="flex flex-col items-center gap-3">
          <div
            className="text-[11px] font-medium tracking-[0.3em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}
          >
            {String(progress).padStart(3, '0')}%
          </div>
          <div className="w-40 h-px overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
            <motion.div
              className="h-full"
              style={{ backgroundColor: 'var(--accent-color)' }}
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              animate={{ scaleX: progress / 100 }}
              transition={{ ease: 'linear', duration: 0.05 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
