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

const LinkedinIcon = (props) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Contact = React.memo(() => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const contactData = data?.contact || {
    email: "mohamed.okash1998@gmail.com",
    github: "https://github.com/MohamedOkash",
    whatsapp: "201014128610",
    linkedin: "https://linkedin.com/in/mohamed-okash"
  };

  const contactMethods = data?.contactMethods || [
    { id: "method-1", type: "email", label: "Email", value: contactData.email, visible: true },
    { id: "method-2", type: "whatsapp", label: "WhatsApp", value: contactData.whatsapp, visible: true },
    { id: "method-3", type: "linkedin", label: "LinkedIn", value: contactData.linkedin, visible: true },
    { id: "method-4", type: "github", label: "GitHub", value: contactData.github, visible: true }
  ];

  const visibleMethods = contactMethods.filter(m => m.visible !== false);

  const [copiedType, setCopiedType] = useState(null);

  const handleCopy = (text, type) => {
    handleCopyToClipboard(text)
      .then(() => {
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2500);
      })
      .catch((err) => console.error(err));
  };

  const getContactIcon = (type, className) => {
    switch (type) {
      case 'email':
        return <Mail className={className} />;
      case 'whatsapp':
        return <MessageSquare className={className} />;
      case 'linkedin':
        return <LinkedinIcon className={className} />;
      case 'github':
        return <GithubIcon className={className} />;
      default:
        // Try resolving other Lucide icons dynamically if possible, or fallback to Link
        return <ArrowUpRight className={className} />;
    }
  };

  const getDisplayValue = (val) => {
    if (!val) return '';
    try {
      if (val.startsWith('http')) {
        const urlObj = new URL(val);
        return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
      }
    } catch (e) {
      // Ignored
    }
    return val;
  };

  const renderActionArea = (method) => {
    if (method.type === 'email') {
      return (
        <div className="flex gap-2 mt-auto pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={() => handleCopy(method.value, method.id)}
            className="flex-1 py-4 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-hover)] transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer text-[var(--text-secondary)]"
          >
            {copiedType === method.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">{data?.translations?.[lang]?.copied || t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                {data?.translations?.[lang]?.clickToCopy || t.clickToCopy}
              </>
            )}
          </button>
          <a
            href={`mailto:${method.value}`}
            className="p-3.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer text-[var(--text-primary)] flex items-center justify-center"
            title="Compose Email"
            aria-label="Compose Email"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      );
    }

    if (method.type === 'whatsapp') {
      const displayVal = method.value.startsWith('+') ? method.value : `+${method.value}`;
      return (
        <div className="pt-4 border-t border-[var(--border-color)] mt-auto">
          <a
            href={getWhatsAppLink(method.value)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
          >
            {data?.translations?.[lang]?.sendWhatsApp || t.sendWhatsApp || (lang === 'ar' ? 'بدء محادثة واتساب' : 'Send WhatsApp')}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      );
    }

    // Default for linkedin, github, custom links
    let btnColorClass = "bg-[var(--surface-hover)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]";
    if (method.type === 'linkedin') {
      btnColorClass = "bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20";
    }

    return (
      <div className="pt-4 border-t border-[var(--border-color)] mt-auto">
        <a
          href={method.value.startsWith('http') ? method.value : `https://${method.value}`}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${btnColorClass}`}
        >
          {lang === 'ar' ? 'زيارة الرابط' : lang === 'ur' ? 'رابط کھولیں' : 'Visit Profile'}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
    </div>
  );
};

  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3 animate-pulse">
          {data?.translations?.[lang]?.contactTitle || t.contactTitle}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {lang === 'ar' ? 'دعنا نبني شيئاً معاً.' : lang === 'ur' ? 'آئیں مل کر کام کریں۔' : "Let's connect."}
        </h2>
        <p className="text-lg opacity-60 leading-relaxed">
          {data?.translations?.[lang]?.contactSubtitle || t.contactSubtitle}
        </p>
      </div>

      {/* Grid of Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {visibleMethods.map((method) => (
          <SpotlightCard key={method.id} className="flex flex-col h-full hover:border-[var(--primary)]/20 transition-all duration-300">
            <div className="p-3.5 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--primary)] w-fit mb-6">
              {getContactIcon(method.type, "w-6 h-6")}
            </div>

            <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">
              {method.label}
            </h3>

            <p className="text-sm opacity-60 mb-6 truncate max-w-full font-light">
              {getDisplayValue(method.value)}
            </p>

            {renderActionArea(method)}
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
});
