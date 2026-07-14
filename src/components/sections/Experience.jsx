import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Briefcase, Calendar, Building2 } from 'lucide-react';

export const Experience = React.memo(() => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const experienceList = data?.experience || [];

  return (
    <section id="experience" data-section-id="experience" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3">
          {t.journeyTitle}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {lang === 'ar' ? 'المسار المهني والخبرات.' : lang === 'ur' ? 'تجربے کا سفر۔' : 'Career Journey.'}
        </h2>
        <p className="text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          {data?.translations?.[lang]?.journeySubtitle || t.journeySubtitle}
        </p>
      </div>

      {/* Timeline Container - Logical start border (border-s-2) */}
      <div className="relative border-s-2 border-[var(--border-color)] ms-4 md:ms-8 space-y-12">
        {experienceList.map((exp) => (
          <motion.div 
            key={exp.id} 
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative ps-8 md:ps-10 group"
          >
            {/* Dot indicator aligned with logical start border */}
            <div className="absolute top-1.5 -start-[11px] w-5 h-5 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--border-color)] group-hover:border-[var(--primary)] transition-colors duration-300 flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]/40 group-hover:bg-[var(--primary)] transition-all duration-300" />
            </div>

            {/* Experience Card */}
            <SpotlightCard className="p-6 md:p-8 hover:border-[var(--primary)]/20 transition-all duration-300 shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] rounded-full blur-[80px] opacity-5 pointer-events-none" />

              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  {/* Role title */}
                  <h3 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2 flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    {exp.role[lang] || exp.role.en}
                  </h3>
                  
                  {/* Company */}
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-bold">
                    <Building2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    <span>{exp.company[lang] || exp.company.en}</span>
                  </div>
                </div>

                {/* Period badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs font-extrabold text-[var(--accent-color)] shrink-0 h-fit self-start md:self-auto shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  {exp.period[lang] || exp.period.en}
                </div>
              </div>

              {/* Description body */}
              <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-light">
                {exp.description[lang] || exp.description.en}
              </p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
