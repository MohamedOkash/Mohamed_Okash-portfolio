import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Server, HardHat, TrendingUp } from 'lucide-react';

export const About = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const aboutData = data?.about || {
    title: { en: "My Journey.", ar: "مسيرتي المهنية.", ur: "میرا سفر۔" },
    subtitle: { en: "From IT Infrastructure to Workplace Safety.", ar: "من تكنولوجيا المعلومات إلى أمن وسلامة بيئة العمل.", ur: "آئی ٹی سے لے کر کام کی جگہ کی حفاظت تک۔" },
    text: { en: "", ar: "", ur: "" }
  };

  const paragraphs = (aboutData.text[lang] || t.aboutText || "").split('\n\n');

  return (
    <section id="why-me" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3">
          {lang === 'ar' ? 'نبذة شخصية' : lang === 'ur' ? 'میرا تعارف' : 'BIOGRAPHY'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {aboutData.title[lang] || t.aboutTitle}
        </h2>
        <p className="text-lg md:text-xl opacity-60 max-w-3xl font-medium leading-relaxed">
          {aboutData.subtitle[lang] || t.aboutSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Storytelling Narrative Column (3/5 width) */}
        <div className="lg:col-span-3 space-y-6 text-base md:text-lg opacity-85 leading-relaxed font-light">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        {/* Visual Comparative Bridge Card (2/5 width) */}
        <div className="lg:col-span-2 space-y-6">
          <SpotlightCard className="border border-[var(--border)] bg-white/[0.03] backdrop-blur-2xl rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary)] rounded-full blur-[80px] opacity-10 pointer-events-none" />

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
              {data?.translations?.[lang]?.aboutBridgeTitle || t.aboutBridgeTitle || (lang === 'ar' ? 'التحول والتكامل المهني' : lang === 'ur' ? 'پیشہ ورانہ انضمام' : 'The Structural Bridge')}
            </h3>

            {/* Core comparative tracks */}
            <div className="space-y-6">
              {/* IT Track */}
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-1">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-white">
                    {data?.translations?.[lang]?.aboutITTitle || t.aboutITTitle || (lang === 'ar' ? 'البنية التحتية والشبكات (2016 - 2023)' : lang === 'ur' ? 'آئی ٹی انفراسٹرکچر' : 'IT Infrastructure Engineering (2016 - 2023)')}
                  </h4>
                  <p className="text-xs opacity-60 leading-relaxed text-zinc-300">
                    {data?.translations?.[lang]?.aboutITDesc || t.aboutITDesc || (lang === 'ar' ? 'تجهيز السيرفرات، الشبكات اللاسلكية المعقدة، الفايبر، وكاميرات المراقبة للشبكات الأمنية الضخمة.' : 'Servers, complex routing, fiber cabling, CCTV security nodes, access controls, and multi-endpoint software integration.')}
                  </p>
                </div>
              </div>

              {/* HSE Track */}
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-1">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-white">
                    {data?.translations?.[lang]?.aboutHSETitle || t.aboutHSETitle || (lang === 'ar' ? 'إدارة السلامة وهندسة الأمن (2023 - الآن)' : lang === 'ur' ? 'کام کی جگہ کی حفاظت' : 'HSE Workplace safety (2023 - Present)')}
                  </h4>
                  <p className="text-xs opacity-60 leading-relaxed text-zinc-300">
                    {data?.translations?.[lang]?.aboutHSEDesc || t.aboutHSEDesc || (lang === 'ar' ? 'رقمنة عمليات السلامة بالكامل، تتبع الامتثال، القضاء على الورقيات، وتحليل المخاطر الميدانية.' : 'OSHA compliance audits, risk mitigation structures, site-level incident protocols, and digitizing paper processes using custom software.')}
                  </p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
