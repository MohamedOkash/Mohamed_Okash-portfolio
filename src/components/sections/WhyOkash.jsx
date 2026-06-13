import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Cpu, Sparkles } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { SpotlightCard } from '../ui/SpotlightCard';

export const WhyOkash = () => {
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  const pillars = {
    en: [
      {
        icon: <Shield className="w-8 h-8 text-blue-400" />,
        title: "Field-Tested HSE Leadership",
        subtitle: "Active Safety Engineering",
        desc: "Over 3 years of active onsite HSE supervision, implementing rigorous risk assessments, incident management, and ensuring strict compliance with OSHA & IOSH international regulations."
      },
      {
        icon: <Server className="w-8 h-8 text-cyan-400" />,
        title: "IT Infrastructure Expertise",
        subtitle: "7 Years of Enterprise Systems",
        desc: "A solid foundation in networking, server setup, fiber optics, CCTV, and hardware troubleshooting. I build the digital backbone that keeps complex, large-scale facilities operational."
      },
      {
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        title: "AI-Powered Systems Builder",
        subtitle: "Rapid Digitization (Vibe Coding)",
        desc: "I bridge the gap between field hazards and technical solutions. By leveraging AI-assisted coding, I build real-world dashboards and systems that eliminate outdated paper workflows."
      }
    ],
    ar: [
      {
        icon: <Shield className="w-8 h-8 text-blue-400" />,
        title: "قيادة السلامة الميدانية (HSE)",
        subtitle: "هندسة سلامة نشطة وحية",
        desc: "خبرة عملية في الإشراف على السلامة المهنية بالمواقع الإنشائية، تطبيق تقييمات المخاطر، التحقيق في الحوادث، والامتثال الكامل لمعايير أوشا وإيوش العالمية."
      },
      {
        icon: <Server className="w-8 h-8 text-cyan-400" />,
        title: "خبرة البنية التحتية والشبكات (IT)",
        subtitle: "7 سنوات في النظم المؤسسية",
        desc: "أساس تقني صلب في تركيب السيرفرات وإدارة الشبكات السلكية واللاسلكية، تمديد الفايبر وكاميرات المراقبة. أبني العمود الفقري الرقمي لضمان استمرارية التشغيل."
      },
      {
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        title: "مطور أنظمة مدعوم بالذكاء الاصطناعي",
        subtitle: "رقمنة سريعة للعمليات (Vibe Coding)",
        desc: "أربط بين مخاطر الموقع والحلول التقنية المبتكرة. عبر تسخير الذكاء الاصطناعي، أبني لوحات تحكم وتطبيقات تقضي تماماً على المعاملات الورقية التقليدية."
      }
    ],
    ur: [
      {
        icon: <Shield className="w-8 h-8 text-blue-400" />,
        title: "فیلڈ ایچ ایس ای لیڈرشپ",
        subtitle: "فعال حفاظتی انجینئرنگ",
        desc: "سائٹ پر 3 سال سے زیادہ کا ایچ ایس ای تجربہ، حادثات کی روک تھام اور OSHA اور IOSH بین الاقوامی قوانین کی تعمیل کو یقینی بنانا۔"
      },
      {
        icon: <Server className="w-8 h-8 text-cyan-400" />,
        title: "آئی ٹی انفراسٹرکچر مہارت",
        subtitle: "7 سالہ نیٹ ورک اور سرور تجربہ",
        desc: "سرورز، فائبر آپٹکس، سی سی ٹی وی نیٹ ورکس، اور سیکیورٹی سسٹمز کی تنصیب اور دیکھ بھال کا وسیع تجربہ۔"
      },
      {
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        title: "اے آئی سسٹمز بلڈر",
        subtitle: "وائب کوڈنگ اور فوری ڈیجیٹلائزیشن",
        desc: "فیلڈ کے مسائل اور جدید ٹیکنالوجی کے درمیان خلیج کو کم کرنا۔ اے آئی کی مدد سے ایسے سافٹ ویئر بنانا جو کاغذی کام کا خاتمہ کریں۔"
      }
    ]
  };

  const currentPillars = pillars[lang] || pillars.en;

  return (
    <section id="why-me" className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/[0.04]">
      {/* Header */}
      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
          {t.whyMeTitle}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
          {t.whyMeSubtitle}
        </h2>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {currentPillars.map((item, idx) => (
          <SpotlightCard key={idx} className="flex flex-col justify-between h-full bg-white/[0.01] hover:bg-white/[0.03] transition-colors border border-[var(--border)] rounded-[2rem] p-8">
            <div className="space-y-6">
              {/* Icon */}
              <div className="p-4 w-fit rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner">
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
        ))}
      </div>

      {/* Comparison Hook / Storytelling Banner */}
      <div className="mt-12 p-8 md:p-10 rounded-[2rem] border border-[var(--border)] bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-radial-gradient from-[var(--primary)]/5 to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <h4 className="text-lg md:text-xl font-bold tracking-tight">
            {lang === 'ar' 
              ? 'الرقمنة الميدانية: الفارق الحقيقي' 
              : lang === 'ur'
              ? 'فیلڈ ڈیجیٹلائزیشن: اصل فرق'
              : 'Field Digitization: The Real Difference'}
          </h4>
          <p className="text-xs md:text-sm opacity-70 leading-relaxed font-light">
            {lang === 'ar'
              ? 'معظم مهندسي السلامة يتبعون الطرق التقليدية والأوراق. بينما يبني مهندسو البرمجيات تطبيقات دون فهم واقع الموقع ومخاطره. تواجدي في المنتصف يسمح لي ببناء أنظمة برمجية تفهم تماماً واقع العمل الميداني وتفاصيله لتسهل مهام الفرق التشغيلية.'
              : lang === 'ur'
              ? 'زیادہ تر حفاظتی انجینئرز روایتی کاغذی طریقوں پر عمل کرتے ہیں۔ دوسری طرف، سافٹ ویئر انجینئرز سائٹ کی حقیقتوں کو سمجھے بغیر ایپس بناتے ہیں۔ میرا منفرد تجربہ مجھے ایسے سسٹمز بنانے کی اجازت دیتا ہے جو دونوں دنیاؤں کو بہترین طریقے سے جوڑتے ہیں۔'
              : 'Most safety engineers rely on traditional paper sheets, while traditional software engineers build systems without understanding actual onsite risks. My unique position allows me to code systems that natively understand field operations, making digitized compliance effortless for site teams.'}
          </p>
        </div>

        <div className="shrink-0 relative z-10">
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 font-semibold text-xs tracking-wider uppercase">
            {lang === 'ar' ? 'اندماج الكفاءات' : lang === 'ur' ? 'مہارتوں کا ملاپ' : 'Convergence of Skills'}
          </div>
        </div>
      </div>
    </section>
  );
};
