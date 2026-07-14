import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const TranslationsSettings = React.memo(({ translationsData = { ar: {}, en: {}, ur: {} }, t, updateField }) => {
  const [localFilter, setLocalFilter] = useState('');

  const keys = Object.keys(translationsData.en || {});
  const filteredKeys = keys.filter(key => 
    key.toLowerCase().includes(localFilter.toLowerCase()) || 
    (translationsData.en[key] || '').toLowerCase().includes(localFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.translationsTitle}</h3>
      <p className="text-xs text-[var(--text-secondary)]">{t.cms.translationsDesc}</p>
      
      {/* Filter Bar */}
      <div className="mb-4 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input 
          type="text" 
          value={localFilter} 
          onChange={(e) => setLocalFilter(e.target.value)} 
          placeholder={t.cms.searchTranslationsPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
        {filteredKeys.map(key => (
          <div key={key} id={`item-${key}`} className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-3">
            <span className="text-xs font-bold text-[var(--primary)] font-mono block border-b border-[var(--border-color)] pb-1.5">{t.cms.transKey}: {key}</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mb-0.5 block">{t.cms.arabicLabel}</span>
                <input 
                  type="text" 
                  dir="rtl" 
                  value={translationsData.ar?.[key] || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((draft) => {
                      if (!draft.translations.ar) draft.translations.ar = {};
                      draft.translations.ar[key] = val;
                    });
                  }} 
                  className="w-full p-2 bg-[var(--card-bg)] border border-[var(--border-color)] text-xs rounded text-[var(--text-primary)] outline-none focus:border-[var(--primary)]" 
                />
              </div>
              <div>
                <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mb-0.5 block">{t.cms.englishLabel}</span>
                <input 
                  type="text" 
                  dir="ltr" 
                  value={translationsData.en?.[key] || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((draft) => {
                      if (!draft.translations.en) draft.translations.en = {};
                      draft.translations.en[key] = val;
                    });
                  }} 
                  className="w-full p-2 bg-[var(--card-bg)] border border-[var(--border-color)] text-xs rounded text-[var(--text-primary)] outline-none focus:border-[var(--primary)]" 
                />
              </div>
              <div>
                <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mb-0.5 block">{t.cms.urduLabel}</span>
                <input 
                  type="text" 
                  dir="rtl" 
                  value={translationsData.ur?.[key] || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((draft) => {
                      if (!draft.translations.ur) draft.translations.ur = {};
                      draft.translations.ur[key] = val;
                    });
                  }} 
                  className="w-full p-2 bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] rounded outline-none focus:border-[var(--primary)]" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
