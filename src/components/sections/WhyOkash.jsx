import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Cpu, Sparkles } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { SpotlightCard } from '../ui/SpotlightCard';

export const WhyOkash = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  const pillars = [
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: data?.translations?.[lang]?.whyMePillar1Title || t.whyMePillar1Title || (lang === 'ar' ? "قيادة السلامة الميدانية (HSE)" : "Field-Tested HSE Leadership"),
      subtitle: data?.translations?.[lang]?.whyMePillar1Sub || t.whyMePillar1Sub || (lang === 'ar' ? "هندسة سلامة نشطة وحية" : "Active Safety Engineering"),
      desc: data?.translations?.[lang]?.whyMePillar1Desc || t.whyMePillar1Desc || (lang === 'ar' ? "خبرة عملية في الإشراف على السلامة المهنية بالمواقع الإنشائية، تطبيق تقييمات المخاطر، التحقيق في الحوادث، والامتثال الكامل لمعايير أوشا وإيوش العالمية." : "Over 3 years of active onsite HSE supervision, implementing rigorous risk assessments, incident management, and ensuring strict compliance with OSHA & IOSH international regulations.")
    },
    {
      icon: <Server className="w-8 h-8 text-cyan-400" />,
      title: data?.translations?.[lang]?.whyMePillar2Title || t.whyMePillar2Title || (lang === 'ar' ? "خبرة البنية التحتية والشبكات (IT)" : "IT Infrastructure Expertise"),
      subtitle: data?.translations?.[lang]?.whyMePillar2Sub || t.whyMePillar2Sub || (lang === 'ar' ? "7 سنوات في النظم المؤسسية" : "7 Years of Enterprise Systems"),
      desc: data?.translations?.[lang]?.whyMePillar2Desc || t.whyMePillar2Desc || (lang === 'ar' ? "أساس تقني صلب في تركيب السيرفرات وإدارة الشبكات السلكية واللاسلكية، تمديد الفايبر وكاميرات المراقبة. أبني العمود الفقري الرقمي لضمان استمرارية التشغيل." : "A solid foundation in networking, server setup, fiber optics, CCTV, and hardware troubleshooting. I build the digital backbone that keeps complex, large-scale facilities operational.")
    },
    {
      icon: <Cpu className="w-8 h-8 text-purple-400" />,
      title: data?.translations?.[lang]?.whyMePillar3Title || t.whyMePillar3Title || (lang === 'ar' ? "مطور أنظمة مدعوم بالذكاء الاصطناعي" : "AI-Powered Systems Builder"),
      subtitle: data?.translations?.[lang]?.whyMePillar3Sub || t.whyMePillar3Sub || (lang === 'ar' ? "رقمنة سريعة للعمليات (Vibe Coding)" : "Rapid Digitization (Vibe Coding)"),
      desc: data?.translations?.[lang]?.whyMePillar3Desc || t.whyMePillar3Desc || (lang === 'ar' ? "أربط بين مخاطر الموقع والحلول التقنية المبتكرة. عبر تسخير الذكاء الاصطناعي، أبني لوحات تحكم وتطبيقات تقضي تماماً على المعاملات الورقية التقليدية." : "I bridge the gap between field hazards and technical solutions. By leveraging AI-assisted coding, I build real-world dashboards and systems that eliminate outdated paper workflows.")
    }
  ];

  return (
    <section id="why-me" className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-[var(--border-color)]">
      {/* Header */}
      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3 flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
          {data?.translations?.[lang]?.whyMeTitle || t.whyMeTitle}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
          {data?.translations?.[lang]?.whyMeSubtitle || t.whyMeSubtitle}
        </h2>
      </div>

      {/* Pillars Grid */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {pillars.map((item, idx) => (
          <motion.div 
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(4px)' },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                filter: 'blur(0px)',
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
              }
            }}
            className="h-full"
          >
            <SpotlightCard className="flex flex-col justify-between h-full bg-[var(--surface-hover)] hover:bg-[var(--surface-hover)] transition-colors border border-[var(--border)] rounded-[2rem] p-8">
              <div className="space-y-6">
                {/* Icon */}
                <div className="p-4 w-fit rounded-2xl bg-[var(--surface-hover)] border border-[var(--border-color)] shadow-inner">
                  {item.icon}
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold tracking-wider text-[var(--primary)] opacity-60 uppercase block">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base opacity-70 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Comparison Hook / Storytelling Banner */}
      <div className="mt-12 p-8 md:p-10 rounded-[2rem] border border-[var(--border)] bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-radial-gradient from-[var(--primary)]/5 to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <h4 className="text-lg md:text-xl font-bold tracking-tight">
            {data?.translations?.[lang]?.whyMeBannerTitle || t.whyMeBannerTitle || (
              lang === 'ar' 
                ? 'الرقمنة الميدانية: الفارق الحقيقي' 
                : lang === 'ur'
                ? 'فیلڈ ڈیجیٹلائزیشن: اصل فرق'
                : 'Field Digitization: The Real Difference'
            )}
          </h4>
          <p className="text-xs md:text-sm opacity-70 leading-relaxed font-light">
            {data?.translations?.[lang]?.whyMeBannerDesc || t.whyMeBannerDesc || (
              lang === 'ar'
                ? 'معظم مهندسي السلامة يتبعون الطرق التقليدية والأوراق. بينما يبني مهندسو البرمجيات تطبيقات دون فهم واقع الموقع ومخاطره. تواجدي في المنتصف يسمح لي ببناء أنظمة برمجية تفهم تماماً واقع العمل الميداني وتفاصيله لتسهل مهام الفرق التشغيلية.'
                : lang === 'ur'
                ? 'زیادہ تر حفاظتی انجینئرز روایتی کاغذی طریقوں پر عمل کرتے ہیں۔ دوسری طرف، سافٹ ویئر انجینئرز سائٹ کی حقیقتوں کو سمجھے بغیر ایپس بناتے ہیں۔ میرا منفرد تجربہ مجھے ایسے سسٹمز بنانے کی اجازت دیتا ہے جو دونوں دنیاؤں کو بہترین طریقے سے جوڑتے ہیں۔'
                : 'Most safety engineers rely on traditional paper sheets, while traditional software engineers build systems without understanding actual onsite risks. My unique position allows me to code systems that natively understand field operations, making digitized compliance effortless for site teams.'
            )}
          </p>
        </div>

        <div className="shrink-0 relative z-10">
          <div className="px-5 py-2.5 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)] font-semibold text-xs tracking-wider uppercase">
            {data?.translations?.[lang]?.whyMeBannerBadge || t.whyMeBannerBadge || (
              lang === 'ar' ? 'اندماج الكفاءات' : lang === 'ur' ? 'مہارتوں کا ملاپ' : 'Convergence of Skills'
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
