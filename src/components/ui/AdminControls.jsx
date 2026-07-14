import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

export const AdminInput = React.memo(({ label, value, onChange, type = "text", textarea = false, dir = "auto", min, max, step }) => (
  <div className="mb-4 w-full min-w-0">
    {label && <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{label}</label>}
    {textarea ? (
      <textarea rows="4" dir={dir} value={value ?? ''} onChange={onChange} className="block w-full min-w-0 max-w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
    ) : (
      <input type={type} min={min} max={max} step={step} dir={dir} value={value ?? ''} onChange={onChange} className="block w-full min-w-0 max-w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
    )}
  </div>
));

export const AdminMultiLangInput = React.memo(({ label, valueObj = { ar: '', en: '', ur: '' }, onChangeKey, textarea = false }) => {
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;
  return (
    <div className="mb-5 p-3 sm:p-4 min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-extrabold">{label}</label>}
      <div className="space-y-3 pl-3 border-l border-[var(--border-color)]">
        <div>
          <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block mb-1">{t.cms?.arabic || 'العربية (Arabic)'}</span>
          {textarea ? (
            <textarea rows="3" dir="rtl" value={valueObj.ar || ""} onChange={(e) => onChangeKey('ar', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="rtl" value={valueObj.ar || ""} onChange={(e) => onChangeKey('ar', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          )}
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block mb-1">{t.cms?.english || 'English'}</span>
          {textarea ? (
            <textarea rows="3" dir="ltr" value={valueObj.en || ""} onChange={(e) => onChangeKey('en', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="ltr" value={valueObj.en || ""} onChange={(e) => onChangeKey('en', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          )}
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block mb-1">{t.cms?.urdu || 'اردو (Urdu)'}</span>
          {textarea ? (
            <textarea rows="3" dir="rtl" value={valueObj.ur || ""} onChange={(e) => onChangeKey('ur', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="rtl" value={valueObj.ur || ""} onChange={(e) => onChangeKey('ur', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          )}
        </div>
      </div>
    </div>
  );
});
