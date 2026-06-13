import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Award, ShieldCheck, HeartPulse, FlameKindling, HardHat } from 'lucide-react';

const getCertIcon = (id, className) => {
  switch (id) {
    case 'osha': return <ShieldCheck className={className} />;
    case 'iosh': return <HardHat className={className} />;
    case 'firstaid': return <HeartPulse className={className} />;
    case 'fire': return <FlameKindling className={className} />;
    default: return <Award className={className} />;
  }
};

export const Certifications = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const certsList = data?.certifications || [];

  return (
    <section id="certifications" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3">
          {t.certsTitle}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {lang === 'ar' ? 'الشهادات والاعتمادات الدولية.' : lang === 'ur' ? 'سرٹیفکیٹ اور لائسنس۔' : 'Accreditations & Licenses.'}
        </h2>
        <p className="text-lg opacity-60 max-w-3xl leading-relaxed">
          {data?.translations?.[lang]?.certsSubtitle || t.certsSubtitle}
        </p>
      </div>

      {/* Certs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {certsList.map((cert) => (
          <SpotlightCard
            key={cert.id}
            isCertificate={true}
            className="flex flex-col justify-between h-full hover:border-[var(--primary)]/30 transition-all duration-300 min-h-[200px]"
          >
            <div className="p-2 w-fit rounded-xl bg-white/[0.02] border border-white/[0.06] text-[var(--primary)] mb-6">
              {getCertIcon(cert.id, "w-6 h-6")}
            </div>

            <h3 className="text-base md:text-lg font-bold leading-snug text-white tracking-tight">
              {cert.name?.[lang] || cert[lang] || cert.en}
            </h3>

            {(cert.provider || cert.date) && (
              <div className="text-xs text-zinc-400 mt-2 flex flex-col gap-0.5">
                {cert.provider && <span>{cert.provider[lang] || cert.provider.en}</span>}
                {cert.date && <span className="text-[10px] text-zinc-500">{cert.date[lang] || cert.date.en}</span>}
              </div>
            )}

            <div className="text-[10px] md:text-xs font-semibold uppercase tracking-widest opacity-40 mt-6 pt-4 border-t border-white/[0.04]">
              {data?.translations?.[lang]?.verifiedAccreditation || (lang === 'ar' ? 'اعتماد دولي معتمد' : lang === 'ur' ? 'تصدیق شدہ سند' : 'Verified Accreditation')}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};
