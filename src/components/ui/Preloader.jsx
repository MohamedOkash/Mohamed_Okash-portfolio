import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Preloader = ({ finishLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds loading simulation
    const interval = 15; // update progress every 15ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            finishLoading();
          }, 300); // Wait briefly at 100%
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [finishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: 'blur(10px)',
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center select-none"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow behind monogram */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.15 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute w-40 h-40 rounded-full bg-white blur-[40px] pointer-events-none"
        />

        {/* Monogram MO container */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md overflow-hidden">
          {/* Glass light sweep animation */}
          <motion.div 
            initial={{ x: '-100%', y: '-100%' }}
            animate={{ x: '100%', y: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"
          />

          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white text-3xl font-extrabold tracking-widest font-sans"
          >
            MO
          </motion.span>
        </div>

        {/* Loading Progress */}
        <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        <motion.span 
          className="text-[10px] tracking-[0.3em] font-medium text-white/50 uppercase"
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </motion.div>
  );
};
