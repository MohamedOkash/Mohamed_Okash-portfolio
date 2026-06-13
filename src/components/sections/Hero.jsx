import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { ArrowDown, Mail, ArrowUpRight, Shield, Server, Cpu } from 'lucide-react';

export const Hero = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  const roles = [
    lang === 'ar' ? 'مهندس أمن وسلامة مهنية (HSE)' : lang === 'ur' ? 'ایچ ایس ای انجینئر' : 'HSE Engineer',
    lang === 'ar' ? 'مهندس بنية تحتية وشبكات (IT)' : lang === 'ur' ? 'آئی ٹی نیٹ ورک انجینئر' : 'IT Infrastructure Engineer',
    lang === 'ar' ? 'مطور ومصمم أنظمة رقمية' : lang === 'ur' ? 'ڈیجیٹل سسٹمز بلڈر' : 'System Builder',
    lang === 'ar' ? 'مبتكر تطبيقات بالذكاء الاصطناعي' : lang === 'ur' ? 'مصنوعی ذہانت خالق' : 'AI-Powered System Builder'
  ];

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles.length]);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center relative px-6 py-20 overflow-hidden">
      {/* Background elegant gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full blur-[120px] opacity-25 pointer-events-none bg-[var(--blob1)]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-20 pointer-events-none bg-[var(--blob2)]" />

      {/* Brand Availability Status Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full border border-[var(--border)] bg-white/[0.02] text-xs font-semibold tracking-wider uppercase mb-8 shadow-sm backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {t.available}
      </motion.div>

      {/* Main Name */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tight mb-2 leading-[0.95]"
      >
        <span className="opacity-95 select-none">{data?.translations?.[lang]?.name || t.name}</span>
      </motion.h1>

      {/* Structured Subtitle mapping the 3 key dimensions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm font-semibold tracking-widest uppercase opacity-75 mb-6 text-[var(--primary)] max-w-2xl px-4"
      >
        <span>HSE Engineer</span>
        <span className="opacity-40 select-none">•</span>
        <span>IT Infrastructure</span>
        <span className="opacity-40 select-none">•</span>
        <span>Systems Builder</span>
      </motion.div>

      {/* Dynamic Animated Role description */}
      <div className="h-12 md:h-16 flex items-center justify-center mb-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={roleIndex}
            initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-3xl font-extrabold text-[var(--accent)] uppercase tracking-widest px-4"
          >
            {roles[roleIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Brand Bio description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-sm sm:text-base md:text-lg opacity-60 max-w-2xl leading-relaxed mb-12 px-4 font-light"
      >
        {data?.translations?.[lang]?.tagline || t.tagline}
      </motion.p>

      {/* Call to action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap gap-4 justify-center mb-16 z-20"
      >
        <button
          onClick={() => handleScrollTo('projects')}
          className="px-8 py-4 rounded-xl font-bold text-sm bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-95 shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          {t.viewProjects}
          <ArrowUpRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleScrollTo('contact')}
          className="px-8 py-4 rounded-xl font-bold text-sm border border-[var(--border)] bg-white/[0.01] hover:bg-white/[0.06] transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          <Mail className="w-4 h-4" />
          {t.contactMe}
        </button>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => handleScrollTo('why-me')}
        className="absolute bottom-8 cursor-pointer opacity-45 hover:opacity-100 transition-opacity"
      >
        <ArrowDown className="w-5 h-5 text-[var(--primary)]" />
      </motion.div>
    </section>
  );
};
