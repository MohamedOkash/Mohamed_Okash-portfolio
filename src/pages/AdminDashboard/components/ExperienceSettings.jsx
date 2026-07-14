import React, { useState } from 'react';
import { Search, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const ExperienceSettings = React.memo(({ experienceData = [], t, updateField, lang }) => {
  const [localFilter, setLocalFilter] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleAccordion = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredExp = experienceData.filter(e => 
    e.company?.en?.toLowerCase().includes(localFilter.toLowerCase()) ||
    e.role?.en?.toLowerCase().includes(localFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.experienceTitleLabel}</h3>
        <button 
          onClick={() => {
            const newId = `exp-${Date.now()}`;
            updateField((draft) => {
              draft.experience.push({
                id: newId,
                role: { ar: '', en: '', ur: '' },
                company: { ar: '', en: '', ur: '' },
                period: { ar: '', en: '', ur: '' },
                description: { ar: '', en: '', ur: '' }
              });
            });
            setExpandedItems(prev => ({ ...prev, [newId]: true }));
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewExp}
        </button>
      </div>

      {/* Filter Input */}
      <div className="mb-4 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input 
          type="text" 
          value={localFilter} 
          onChange={(e) => setLocalFilter(e.target.value)} 
          placeholder={t.cms.searchExperiencePlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div className="space-y-4">
        {filteredExp.map((exp) => {
          const isExpanded = !!expandedItems[exp.id];
          const globalIndex = experienceData.findIndex(e => e.id === exp.id);

          return (
            <div key={exp.id} id={`item-${exp.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
              <div 
                onClick={() => toggleAccordion(exp.id)}
                className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      disabled={globalIndex === 0} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.experience;
                          [list[globalIndex - 1], list[globalIndex]] = [list[globalIndex], list[globalIndex - 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderUp || 'Move up'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button 
                      disabled={globalIndex === experienceData.length - 1} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.experience;
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
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{exp.role?.[lang] || exp.role?.en || t.cms.untitledJob}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">{exp.company?.[lang] || exp.company?.en} • {exp.period?.[lang] || exp.period?.en}</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(t.cms.confirmDelete)) {
                      updateField((draft) => {
                        draft.experience = draft.experience.filter(e => e.id !== exp.id);
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
                  <AdminMultiLangInput 
                    label={t.cms.roleTitle} 
                    valueObj={exp.role} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.experience[globalIndex].role[key] = val;
                      });
                    }} 
                  />
                  <AdminMultiLangInput 
                    label={t.cms.companyName} 
                    valueObj={exp.company} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.experience[globalIndex].company[key] = val;
                      });
                    }} 
                  />
                  <AdminMultiLangInput 
                    label={t.cms.periodDates} 
                    valueObj={exp.period} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.experience[globalIndex].period[key] = val;
                      });
                    }} 
                  />
                  <AdminMultiLangInput 
                    label={t.cms.responsibilities} 
                    textarea 
                    valueObj={exp.description} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.experience[globalIndex].description[key] = val;
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
