import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SpotlightCard = ({ children, className = '', onClick, isCertificate = false }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ 
        scale: isCertificate ? 1.03 : 1.015, 
        y: -6,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className={`relative overflow-hidden border border-[var(--border)] bg-white/[0.02] backdrop-blur-2xl transition-theme duration-500 rounded-[1.5rem] p-6 md:p-8 cursor-default z-10 group ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 ease-in-out z-0"
        style={{ 
          opacity, 
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--spotlight), transparent 45%)` 
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};
