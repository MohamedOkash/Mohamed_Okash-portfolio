import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { ArrowLeft } from 'lucide-react';
import { CinematicBackground } from '../../components/ui/CinematicBackground';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const childVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function NotFound() {
  const navigate = useNavigate();
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.en;

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-6 relative transition-theme bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <CinematicBackground />

      <motion.div
        className="relative z-10 text-center max-w-lg w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter select-none"
          variants={childVariants}
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-md mx-auto mt-4"
          variants={childVariants}
        >
          {lang === 'ar'
            ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
            : 'The page you\'re looking for doesn\'t exist or has been moved.'}
        </motion.p>

        <motion.div variants={childVariants} className="mt-10">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 shadow-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToHome}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
