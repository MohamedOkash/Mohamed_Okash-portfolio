import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { Mail, ArrowUpRight } from 'lucide-react';

export const Hero = React.memo(() => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const handleScrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const displayName = lang === 'en'
    ? (data?.brandIdentity?.shortName?.en || 'Okash')
    : (data?.brandIdentity?.heroName?.[lang] || data?.brandIdentity?.brandName?.[lang] || t.name);
  const identity = data?.hero?.identity || {};
  const availabilityLabel = identity.availabilityLabel?.[lang] || data?.translations?.[lang]?.available || t.available;
  const statusLabel = identity.statusLabel?.[lang] || availabilityLabel;

  return (
    <section
      id="hero"
      data-section-id="hero"
      className="relative min-h-[82vh] overflow-hidden px-6 py-20 flex flex-col items-center justify-center text-center"
      aria-label={data?.translations?.[lang]?.heroTitle1 || t.heroTitle1}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="font-mono-label inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[11px] font-medium mb-8"
        style={{
          background: identity.badgeBackground || 'var(--card-bg)',
          borderColor: identity.badgeBorder || 'var(--border-color)',
          color: identity.badgeTextColor || 'var(--text-primary)'
        }}
      >
        <span className="relative flex w-2 h-2">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
            style={{ backgroundColor: identity.statusDotColor || '#10b981' }}
          />
          <span className="relative inline-flex rounded-full w-2 h-2" style={{ backgroundColor: identity.statusDotColor || '#10b981' }} />
        </span>
        <span>{displayName}</span>
        <span className="text-[var(--muted)] select-none">/</span>
        <span className="text-[var(--text-secondary)]">{statusLabel}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 32, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl text-[clamp(3.5rem,13vw,10.5rem)] font-black tracking-[-0.085em] leading-[0.88] mb-7 text-[var(--text-primary)]"
      >
        <span className="block">{data?.translations?.[lang]?.heroTitle1 || t.heroTitle1}</span>
        <span
          className="block mt-4"
          style={{
            backgroundImage: 'linear-gradient(90deg, var(--accent-color), color-mix(in srgb, var(--accent-color) 40%, var(--text-primary)))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          {data?.translations?.[lang]?.heroTitle2 || t.heroTitle2}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl text-base sm:text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 font-light"
      >
        {data?.translations?.[lang]?.tagline || t.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-3 gap-5 sm:gap-10 md:gap-16 max-w-2xl mx-auto mb-10 text-center"
      >
        <div>
          <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight">
            {data?.hero?.statistics?.projectsBuilt || 8}+
          </span>
          <span className="font-mono-label block text-[9px] sm:text-xs text-[var(--text-secondary)] font-bold mt-1">
            {lang === 'ar' ? 'مشاريع منفذة' : lang === 'ur' ? 'منصوبے' : 'Projects'}
          </span>
        </div>
        <div className="border-x border-[var(--border-color)] px-4 sm:px-8">
          <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight">4</span>
          <span className="font-mono-label block text-[9px] sm:text-xs text-[var(--text-secondary)] font-bold mt-1">
            {lang === 'ar' ? 'قطاعات' : lang === 'ur' ? 'صنعتیں' : 'Industries'}
          </span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight">
            {data?.hero?.statistics?.experienceYears || 7}+
          </span>
          <span className="font-mono-label block text-[9px] sm:text-xs text-[var(--text-secondary)] font-bold mt-1">
            {lang === 'ar' ? 'سنوات خبرة' : lang === 'ur' ? 'سال تجربہ' : 'Years'}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <button
          onClick={() => handleScrollTo('projects')}
          className="px-8 py-4 rounded-full font-bold text-sm bg-[var(--accent-color)] text-[var(--accent-text)] hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          {data?.translations?.[lang]?.viewProjects || t.viewProjects}
          <ArrowUpRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleScrollTo('contact')}
          className="px-8 py-4 rounded-full font-bold text-sm border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 text-[var(--text-primary)]"
        >
          <Mail className="w-4 h-4" />
          {data?.translations?.[lang]?.contactMe || t.contactMe}
        </button>
      </motion.div>
    </section>
  );
});
