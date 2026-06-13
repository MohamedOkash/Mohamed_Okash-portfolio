import React, { useState } from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { handleCopyToClipboard, getWhatsAppLink } from '../../utils/helpers';
import { Mail, MessageSquare, Copy, Check, ArrowUpRight } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';

const GithubIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Contact = () => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const contactData = data?.contact || {
    email: "mohamed.okash1998@gmail.com",
    github: "https://github.com/MohamedOkash",
    whatsapp: "201014128610"
  };

  const [copiedType, setCopiedType] = useState(null);

  const handleCopy = (text, type) => {
    handleCopyToClipboard(text)
      .then(() => {
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2500);
      })
      .catch((err) => console.error(err));
  };

  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3">
          {t.contactTitle}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {lang === 'ar' ? 'دعنا نبني شيئاً معاً.' : lang === 'ur' ? 'آئیں مل کر کام کریں۔' : "Let's connect."}
        </h2>
        <p className="text-lg opacity-60 leading-relaxed">
          {data?.translations?.[lang]?.contactSubtitle || t.contactSubtitle}
        </p>
      </div>

      {/* Grid of Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Email Card */}
        <SpotlightCard className="flex flex-col h-full hover:border-[var(--primary)]/20 transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[var(--primary)] w-fit mb-6">
            <Mail className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold mb-1 text-white">
            {t.emailLabel}
          </h3>

          <p className="text-sm opacity-60 mb-6 truncate max-w-full font-light">
            {contactData.email}
          </p>

          <div className="flex gap-2 mt-auto pt-4 border-t border-white/[0.04]">
            <button
              onClick={() => handleCopy(contactData.email, 'email')}
              className="flex-1 py-3 rounded-xl border border-white/[0.08] hover:bg-white/5 transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedType === 'email' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  {t.clickToCopy}
                </>
              )}
            </button>
            <a
              href={`mailto:${contactData.email}`}
              className="p-3 rounded-xl border border-white/[0.08] hover:bg-white/5 transition-all cursor-pointer text-white"
              title="Compose Email"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </SpotlightCard>

        {/* GitHub Card */}
        <SpotlightCard className="flex flex-col h-full hover:border-[var(--primary)]/20 transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[var(--primary)] w-fit mb-6">
            <GithubIcon className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold mb-1 text-white">
            {t.githubLabel}
          </h3>

          <p className="text-sm opacity-60 mb-6 truncate max-w-full font-light">
            github.com/MohamedOkash
          </p>

          <div className="pt-4 border-t border-white/[0.04] mt-auto">
            <a
              href={contactData.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-xs bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'زيارة الحساب الشخصي' : lang === 'ur' ? 'گٹ ہب کھولیں' : 'Visit Profile'}
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </SpotlightCard>

        {/* WhatsApp Card */}
        <SpotlightCard className="flex flex-col h-full hover:border-[var(--primary)]/20 transition-all duration-300">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[var(--primary)] w-fit mb-6">
            <MessageSquare className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold mb-1 text-white">
            {t.whatsappLabel}
          </h3>

          <p className="text-sm opacity-60 mb-6 truncate max-w-full font-light">
            +{contactData.whatsapp}
          </p>

          <div className="pt-4 border-t border-white/[0.04] mt-auto">
            <a
              href={getWhatsAppLink(contactData.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'بدء محادثة واتساب' : lang === 'ur' ? 'واٹس ایپ چیٹ' : 'Send WhatsApp Message'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
