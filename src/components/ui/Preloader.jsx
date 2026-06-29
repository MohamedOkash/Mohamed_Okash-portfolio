import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Preloader = React.memo(({ finishLoading, preloaderText }) => {
  useEffect(() => {
    const timer = window.setTimeout(finishLoading, 650);
    return () => window.clearTimeout(timer);
  }, [finishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-[9999] flex items-center justify-center select-none"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="w-24 h-24 rounded-[2rem] border border-[var(--border-color)] bg-[var(--card-bg)] flex items-center justify-center">
          <span className="text-[var(--text-primary)] text-xl font-black tracking-[0.22em] uppercase">
            {preloaderText || 'OK'}
          </span>
        </div>
        <div className="w-36 h-px bg-[var(--border-color)] overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent-color)]"
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
});
