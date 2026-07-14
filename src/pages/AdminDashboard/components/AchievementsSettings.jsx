import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { AdminInput, AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const AchievementsSettings = React.memo(({ achievementsData = [], t, updateField, lang }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleAccordion = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.achievementsTitleLabel}</h3>
        <button 
          onClick={() => {
            const newId = `stat-${Date.now()}`;
            updateField((draft) => {
              draft.achievements.push({
                id: newId,
                value: 0,
                suffix: '+',
                label: { ar: '', en: '', ur: '' }
              });
            });
            setExpandedItems(prev => ({ ...prev, [newId]: true }));
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewAch}
        </button>
      </div>

      <div className="space-y-4">
        {achievementsData.map((ach, idx) => {
          const isExpanded = !!expandedItems[ach.id];
          return (
            <div key={ach.id} id={`item-${ach.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
              <div 
                onClick={() => toggleAccordion(ach.id)}
                className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      disabled={idx === 0} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.achievements;
                          [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderUp || 'Move up'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button 
                      disabled={idx === achievementsData.length - 1} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.achievements;
                          [list[idx + 1], list[idx]] = [list[idx], list[idx + 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderDown || 'Move down'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">
                      {ach.value}{ach.suffix} {ach.label?.[lang] || ach.label?.en || t.cms.untitled}
                    </h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">{t.cms.achIdLabel}: {ach.id}</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(t.cms.confirmDelete)) {
                      updateField((draft) => {
                        draft.achievements = draft.achievements.filter(a => a.id !== ach.id);
                      });
                    }
                  }}
                  aria-label={t.cms?.ariaDelete || 'Delete'} className="p-2 text-[var(--text-secondary)] hover:text-[var(--status-red)] hover:bg-[var(--status-red-bg)] rounded transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-[var(--border-color)] bg-[var(--card-bg)] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput 
                      label={t.cms.achValue} 
                      type="number" 
                      value={ach.value} 
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateField((draft) => {
                          draft.achievements[idx].value = val;
                        });
                      }} 
                    />
                    <AdminInput 
                      label={t.cms.achSuffix} 
                      value={ach.suffix} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.achievements[idx].suffix = val;
                        });
                      }} 
                    />
                  </div>
                  <AdminMultiLangInput 
                    label={t.cms.achLabel} 
                    valueObj={ach.label} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.achievements[idx].label[key] = val;
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
