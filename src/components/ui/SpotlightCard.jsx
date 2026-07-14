import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { isPointerFine } from '../../utils/perf';

export const SpotlightCard = React.memo(({ children, className = '', onClick, isCertificate = false }) => {
  const spotRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!spotRef.current || !isPointerFine()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    spotRef.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    spotRef.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    spotRef.current.style.opacity = '1';
  };

  const handlePointerLeave = () => {
    if (spotRef.current) spotRef.current.style.opacity = '0';
  };

  return (
    <motion.div
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={{ y: isCertificate ? -3 : -4, scale: isCertificate ? 1.005 : 1.002 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden border rounded-[1.5rem] p-6 md:p-8 cursor-default z-10 group ${className}`}
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--accent-color) 12%, transparent), transparent 70%)'
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
});
