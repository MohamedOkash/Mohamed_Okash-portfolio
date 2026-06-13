import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SpotlightCard = ({ children, className = '', onClick, isCertificate = false }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    // Calculate 3D tilt relative to card center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // Up to 6 degrees
    const rotateY = ((x - centerX) / centerX) * 6;  // Up to 6 degrees
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      whileHover={{ 
        scale: isCertificate ? 1.03 : 1.015, 
        y: -6,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.6 }}
      className={`relative overflow-hidden border border-[var(--border)] bg-white/[0.02] backdrop-blur-2xl transition-theme duration-500 rounded-[1.5rem] p-6 md:p-8 cursor-default z-10 group ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 ease-in-out z-0"
        style={{ 
          opacity, 
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--spotlight), transparent 45%)`,
          transform: 'translateZ(10px)'
        }}
      />
      <div className="relative z-10 w-full h-full" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
};
