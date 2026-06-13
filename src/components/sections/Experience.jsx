import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { Briefcase, Calendar, Building2 } from 'lucide-react';

export const Experience = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  const experienceList = data?.experience || [];

  return (
    <section id="experience" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3">
          {t.journeyTitle}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {lang === 'ar' ? 'المسار المهني والخبرات.' : lang === 'ur' ? 'تجربے کا سفر۔' : 'Career Journey.'}
        </h2>
        <p className="text-lg opacity-60 max-w-3xl leading-relaxed">
          {data?.translations?.[lang]?.journeySubtitle || t.journeySubtitle}
        </p>
      </div>

      {/* Timeline Container - Logical start border (border-s-2) */}
      <div className="relative border-s-2 border-white/[0.06] ms-4 md:ms-8 space-y-12">
        {experienceList.map((exp) => (
          <div key={exp.id} className="relative ps-8 md:ps-10 group">
            {/* Dot indicator aligned with logical start border */}
            <div className={`absolute top-1.5 -start-[11px] w-5 h-5 rounded-full bg-[#0a0a0c] border-2 border-white/20 group-hover:border-[var(--primary)] transition-colors duration-300 flex items-center justify-center z-10`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-[var(--primary)] transition-all duration-300" />
            </div>

            {/* Experience Card */}
            <div className="p-6 md:p-8 border border-[var(--border)] bg-white/[0.015] hover:bg-white/[0.03] transition-all duration-300 rounded-2xl relative overflow-hidden group-hover:border-[var(--primary)]/20 shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] rounded-full blur-[80px] opacity-5 pointer-events-none" />

              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  {/* Role title */}
                  <h3 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
                    <Briefcase className="w-4.5 h-4.5 text-[var(--primary)] shrink-0" />
                    {exp.role[lang] || exp.role.en}
                  </h3>
                  
                  {/* Company */}
                  <div className="flex items-center gap-2 text-sm opacity-65 font-medium">
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>{exp.company[lang] || exp.company.en}</span>
                  </div>
                </div>

                {/* Period badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-[var(--border)] bg-white/[0.02] text-xs font-semibold text-[var(--primary)] shrink-0 h-fit self-start md:self-auto shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.period[lang] || exp.period.en}
                </div>
              </div>

              {/* Description body */}
              <p className="text-sm md:text-base opacity-70 leading-relaxed whitespace-pre-line font-light">
                {exp.description[lang] || exp.description.en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
