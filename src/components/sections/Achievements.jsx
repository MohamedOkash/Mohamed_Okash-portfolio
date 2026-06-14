import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { Trophy } from 'lucide-react';
import { useRAFCounter } from '../../utils/perf';

const StatCounter = React.memo(({ value, label, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const current = useRAFCounter(value, { duration: 1500, enabled: isInView });

  return (
    <div ref={ref} className="text-center p-8 md:p-10 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-hover)] hover:bg-[var(--surface-hover)] transition-all duration-300 relative group flex flex-col items-center justify-center">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-[var(--primary)]/5 to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <span className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gradient block mb-3 font-mono">
        {current}{suffix}
      </span>
      <span className="text-xs md:text-sm uppercase tracking-widest font-bold opacity-60">
        {label}
      </span>
    </div>
  );
});

export const Achievements = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const stats = data?.hero?.statistics || {
    experienceYears: 7,
    projectsBuilt: 5,
    certificationsCount: 4
  };

  const achievementsData = [
    {
      value: stats.experienceYears,
      suffix: "+",
      label: t.yearsExp
    },
    {
      value: stats.projectsBuilt,
      suffix: "+",
      label: t.projectsBuilt
    },
    {
      value: stats.certificationsCount,
      suffix: "+",
      label: t.certsCount
    }
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-6 relative z-10 border-t border-[var(--border-color)]">
      {/* Title */}
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-2 flex items-center gap-1.5 justify-center md:justify-start">
            <Trophy className="w-4 h-4 text-[var(--primary)]" />
            {lang === 'ar' ? 'الإنجازات والمقاييس' : lang === 'ur' ? 'کامیابیاں اور میٹرکس' : 'Achievements & Milestones'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {lang === 'ar' ? 'مسيرة مهنية بالأرقام.' : lang === 'ur' ? 'عدد و شمار میں میرا سفر۔' : 'Track Record in Numbers.'}
          </h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {achievementsData.map((stat, idx) => (
          <StatCounter 
            key={idx}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
};
