import React from 'react';
import { motion } from 'framer-motion';

export const SpotlightCard = React.memo(({ children, className = '', onClick, isCertificate = false }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ y: isCertificate ? -3 : -4, scale: isCertificate ? 1.005 : 1.002 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    className={`relative overflow-hidden border rounded-[1.5rem] p-6 md:p-8 cursor-default z-10 group ${className}`}
    style={{
      backgroundColor: 'var(--card-bg)',
      borderColor: 'var(--border-color)'
    }}
  >
    <div className="relative z-10 w-full h-full">
      {children}
    </div>
  </motion.div>
));
