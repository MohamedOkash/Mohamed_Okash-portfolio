import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { ArrowDown, Mail, ArrowUpRight } from 'lucide-react';

const Counter = ({ target, duration = 1200 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end) || start === end) {
      setCount(target);
      return;
    }
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
};

export const Hero = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const heroNameVal = data?.brandIdentity?.heroName?.[lang] || (lang === 'ar' ? 'محمد عكاش' : lang === 'ur' ? 'محمد عکاش' : 'Mohamed Okash');
  const identity = data?.hero?.identity || {};
  const displayName = identity.displayName?.[lang] || heroNameVal;
  const availabilityLabel = identity.availabilityLabel?.[lang] || data?.translations?.[lang]?.available || t.available;
  const statusLabel = identity.statusLabel?.[lang] || availabilityLabel;

  return (
    <section id="hero" className="min-h-[75vh] flex flex-col justify-center items-center text-center relative px-6 py-12 overflow-hidden">
      {/* Background elegant gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full blur-[120px] opacity-25 pointer-events-none bg-[var(--blob1)]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-20 pointer-events-none bg-[var(--blob2)]" />
      
      {/* Soft radial glow behind Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] rounded-full blur-[160px] opacity-30 pointer-events-none bg-[var(--primary)]" />

      {/* Brand Availability Status Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase mb-5 shadow-sm backdrop-blur-md"
        style={{
          background: identity.badgeBackground || 'rgba(255,255,255,0.02)',
          borderColor: identity.badgeBorder || 'var(--border)',
          color: identity.badgeTextColor || 'var(--text)'
        }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: identity.statusDotColor || '#10b981' }} />
        <span className="opacity-95">{displayName}</span>
        <span className="opacity-30 select-none">•</span>
        <span className="opacity-60">{statusLabel}</span>
      </motion.div>

      {/* Main Title (HSE & IT Engineering) */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-3 leading-[1.05]"
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
        className="text-sm sm:text-base md:text-lg opacity-60 max-w-2xl leading-relaxed mb-6 px-4 font-light"
      >
        {data?.translations?.[lang]?.tagline || t.tagline}
      </motion.p>

      {/* Elegant Animated Statistics Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-3 gap-6 sm:gap-12 md:gap-16 max-w-2xl mx-auto mb-7 text-center z-20"
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight font-mono">
            <Counter target={data?.hero?.statistics?.projectsBuilt || 8} />+
          </span>
          <span className="text-[9px] sm:text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">
            {lang === 'ar' ? 'مشاريع منفذة' : lang === 'ur' ? 'منصوبے' : 'Projects Built'}
          </span>
        </div>
        <div className="flex flex-col items-center border-x border-[var(--border-color)] px-4 sm:px-8 md:px-12">
          <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight font-mono">
            <Counter target={4} />
          </span>
          <span className="text-[9px] sm:text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">
            {lang === 'ar' ? 'قطاعات صناعية' : lang === 'ur' ? 'صنعتیں' : 'Industries'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight font-mono">
            <Counter target={data?.hero?.statistics?.experienceYears || 7} />+
          </span>
          <span className="text-[9px] sm:text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">
            {lang === 'ar' ? 'سنوات الخبرة' : lang === 'ur' ? 'سال کا تجربہ' : 'Years Exp'}
          </span>
        </div>
      </motion.div>

      {/* Call to action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap gap-4 justify-center mb-6 z-20"
      >
        <button
          onClick={() => handleScrollTo('projects')}
          className="px-8 py-3.5 rounded-xl font-bold text-sm bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-95 shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          {data?.translations?.[lang]?.viewProjects || t.viewProjects}
          <ArrowUpRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleScrollTo('contact')}
          className="px-8 py-3.5 rounded-xl font-bold text-sm border border-[var(--border)] bg-[var(--surface-hover)] hover:bg-[var(--surface-hover)] transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
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
        className="absolute bottom-6 cursor-pointer opacity-45 hover:opacity-100 transition-opacity"
      >
        <ArrowDown className="w-5 h-5 text-[var(--primary)]" />
      </motion.div>
    </section>
  );
};
