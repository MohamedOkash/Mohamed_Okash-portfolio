import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { ArrowDown, Mail, ArrowUpRight } from 'lucide-react';

export const Hero = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

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
        <span className="opacity-95 text-white">{data?.translations?.[lang]?.name || t.name}</span>
        <span className="opacity-30 select-none">•</span>
        <span className="opacity-60">{data?.translations?.[lang]?.available || t.available}</span>
      </motion.div>

      {/* Main Title (HSE & IT Engineering) */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tight mb-6 leading-[1.05]"
      >
        <span className="opacity-95 select-none block">
          {data?.translations?.[lang]?.heroTitle1 || t.heroTitle1}
        </span>
        <span className="opacity-95 select-none block text-[var(--accent)] mt-2">
          {data?.translations?.[lang]?.heroTitle2 || t.heroTitle2}
        </span>
      </motion.h1>

      {/* Brand Bio description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-sm sm:text-base md:text-lg opacity-60 max-w-2xl leading-relaxed mb-12 px-4 font-light"
      >
        {data?.translations?.[lang]?.tagline || t.tagline}
      </motion.p>

      {/* Call to action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap gap-4 justify-center mb-16 z-20"
      >
        <button
          onClick={() => handleScrollTo('projects')}
          className="px-8 py-4 rounded-xl font-bold text-sm bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-95 shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          {data?.translations?.[lang]?.viewProjects || t.viewProjects}
          <ArrowUpRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleScrollTo('contact')}
          className="px-8 py-4 rounded-xl font-bold text-sm border border-[var(--border)] bg-white/[0.01] hover:bg-white/[0.06] transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          <Mail className="w-4 h-4" />
          {data?.translations?.[lang]?.contactMe || t.contactMe}
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
