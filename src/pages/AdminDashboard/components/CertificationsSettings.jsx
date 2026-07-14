import React, { useState } from 'react';
import { Search, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { AdminInput, AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const CertificationsSettings = React.memo(({ certificationsData = [], t, updateField, lang }) => {
  const [localFilter, setLocalFilter] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleAccordion = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCerts = certificationsData.filter(c => {
    const name = c.name?.en || c.en || '';
    return name.toLowerCase().includes(localFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.certsTitleLabel}</h3>
        <button 
          onClick={() => {
            const newId = `cert-${Date.now()}`;
            updateField((draft) => {
              draft.certifications.push({
                id: newId,
                en: 'New Certificate',
                ar: 'شهادة جديدة',
                ur: 'نئی سند',
                name: { en: 'New Certificate', ar: 'شهادة جديدة', ur: 'نئی سند' },
                provider: { en: '', ar: '', ur: '' },
                date: { en: '', ar: '', ur: '' }
              });
            });
            setExpandedItems(prev => ({ ...prev, [newId]: true }));
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewCert}
        </button>
      </div>

      {/* Filter Input */}
      <div className="mb-4 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input 
          type="text" 
          value={localFilter} 
          onChange={(e) => setLocalFilter(e.target.value)} 
          placeholder={t.cms.searchCertsPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div className="space-y-4">
        {filteredCerts.map((cert) => {
          const isExpanded = !!expandedItems[cert.id];
          const globalIndex = certificationsData.findIndex(c => c.id === cert.id);
          const name = cert.name?.[lang] || cert[lang] || t.cms.untitledCert;

          return (
            <div key={cert.id} id={`item-${cert.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
              <div 
                onClick={() => toggleAccordion(cert.id)}
                className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      disabled={globalIndex === 0} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.certifications;
                          [list[globalIndex - 1], list[globalIndex]] = [list[globalIndex], list[globalIndex - 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderUp || 'Move up'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button 
                      disabled={globalIndex === certificationsData.length - 1} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.certifications;
                          [list[globalIndex + 1], list[globalIndex]] = [list[globalIndex], list[globalIndex + 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderDown || 'Move down'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{name}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">{t.cms.providerLabel}: {cert.provider?.[lang] || cert.provider?.en || 'N/A'}</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(t.cms.confirmDelete)) {
                      updateField((draft) => {
                        draft.certifications = draft.certifications.filter(c => c.id !== cert.id);
                      });
                    }
                  }}
                  aria-label={t.cms?.ariaDelete || 'Delete'} className="p-2 text-[var(--text-secondary)] hover:text-[var(--status-red)] hover:bg-[var(--status-red-bg)] rounded transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-[var(--border-color)] bg-[var(--card-bg)] space-y-6">
                  <AdminInput 
                    label={t.cms.certIdLabel} 
                    value={cert.id} 
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField((draft) => {
                        draft.certifications[globalIndex].id = val;
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.certName} 
                    valueObj={cert.name || { ar: cert.ar || '', en: cert.en || '', ur: cert.ur || '' }} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        if (!draft.certifications[globalIndex].name) {
                          draft.certifications[globalIndex].name = { 
                            ar: draft.certifications[globalIndex].ar || '', 
                            en: draft.certifications[globalIndex].en || '', 
                            ur: draft.certifications[globalIndex].ur || '' 
                          };
                        }
                        draft.certifications[globalIndex].name[key] = val;
                        draft.certifications[globalIndex][key] = val; // Maintain flat keys
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.certProvider} 
                    valueObj={cert.provider || { ar: '', en: '', ur: '' }} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        if (!draft.certifications[globalIndex].provider) {
                          draft.certifications[globalIndex].provider = { ar: '', en: '', ur: '' };
                        }
                        draft.certifications[globalIndex].provider[key] = val;
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.certDate} 
                    valueObj={cert.date || { ar: '', en: '', ur: '' }} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        if (!draft.certifications[globalIndex].date) {
                          draft.certifications[globalIndex].date = { ar: '', en: '', ur: '' };
                        }
                        draft.certifications[globalIndex].date[key] = val;
                      });
                    }} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
