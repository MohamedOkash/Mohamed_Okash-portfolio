import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { ArrowDown, Mail, ArrowUpRight } from 'lucide-react';

export const Hero = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  const roles = [
    lang === 'ar' ? 'مهندس أمن وسلامة مهنية (HSE)' : lang === 'ur' ? 'ایچ ایس ای انجینئر' : 'HSE Engineer',
    lang === 'ar' ? 'مهندس بنية تحتية وشبكات (IT)' : lang === 'ur' ? 'آئی ٹی نیٹ ورک انجینئر' : 'IT Infrastructure Engineer',
    lang === 'ar' ? 'مطور ومصمم أنظمة رقمية' : lang === 'ur' ? 'ڈیجیٹل سسٹمز بلڈر' : 'System Builder',
    lang === 'ar' ? 'مبتكر تطبيقات بالذكاء الاصطناعي' : lang === 'ur' ? 'مصنوعی ذہانت خالق' : 'AI-Powered Product Creator'
  ];

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [roles.length]);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = data?.hero?.statistics || {
    experienceYears: 7,
    projectsBuilt: 5,
    certificationsCount: 4
  };

  return (
    <section id="hero" className="min-h-[90vh] flex flex-col justify-center items-center text-center relative px-6 py-12 md:py-24">
      {/* Brand Availability Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full border border-[var(--border)] bg-white/[0.02] text-xs font-semibold tracking-wider uppercase mb-8 shadow-sm backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {t.available}
      </motion.div>

      {/* Primary Apple-level Typography */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]"
      >
        <span className="opacity-90 block">{data?.hero?.title1?.[lang] || t.heroTitle1}</span>
        <span className="text-gradient block">{data?.hero?.title2?.[lang] || t.heroTitle2}</span>
      </motion.h1>

      {/* Dynamic Animated Role switching */}
      <div className="h-12 md:h-16 flex items-center justify-center mb-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={roleIndex}
            initial={{ y: 25, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 0.9, filter: 'blur(0px)' }}
            exit={{ y: -25, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-3xl font-extrabold text-[var(--primary)] uppercase tracking-wide"
          >
            {roles[roleIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-base sm:text-lg md:text-xl opacity-65 max-w-3xl leading-relaxed mb-12"
      >
        {data?.hero?.tagline?.[lang] || t.tagline}
      </motion.p>

      {/* Stripe-like CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap gap-4 justify-center mb-20 z-20"
      >
        <button
          onClick={() => handleScrollTo('projects')}
          className="px-8 py-4.5 rounded-xl font-bold text-sm bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-95 shadow-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {t.viewProjects}
          <ArrowUpRight className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={() => handleScrollTo('contact')}
          className="px-8 py-4.5 rounded-xl font-bold text-sm border border-[var(--border)] bg-white/[0.01] hover:bg-white/[0.06] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Mail className="w-4.5 h-4.5" />
          {t.contactMe}
        </button>
      </motion.div>

      {/* Grid of Brand Statistics Counters */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-3 gap-6 md:gap-16 max-w-4xl w-full border border-[var(--border)] bg-white/[0.01] backdrop-blur-md rounded-2xl p-6 md:p-8"
      >
        <div className="text-center">
          <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--primary)] mb-1">
            +{stats.experienceYears}
          </div>
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-55">
            {t.yearsExp}
          </div>
        </div>

        <div className="text-center border-x border-[var(--border)] px-4">
          <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--primary)] mb-1">
            +{stats.projectsBuilt}
          </div>
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-55">
            {t.projectsBuilt}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--primary)] mb-1">
            +{stats.certificationsCount}
          </div>
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-55">
            {t.certsCount}
          </div>
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => handleScrollTo('why-me')}
        className="absolute bottom-6 cursor-pointer opacity-45 hover:opacity-100 transition-opacity"
      >
        <ArrowDown className="w-5 h-5 text-[var(--primary)]" />
      </motion.div>
    </section>
  );
};
