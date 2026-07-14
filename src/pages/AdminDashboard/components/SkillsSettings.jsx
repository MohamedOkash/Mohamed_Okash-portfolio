import React, { useState } from 'react';
import { Search, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { AdminInput, AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const SkillsSettings = React.memo(({ skillsData = [], t, updateField, lang }) => {
  const [localFilter, setLocalFilter] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleAccordion = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSkills = skillsData.filter(s => 
    s.category?.en?.toLowerCase().includes(localFilter.toLowerCase()) ||
    s.category?.ar?.toLowerCase().includes(localFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.skillsTitleLabel}</h3>
        <button 
          onClick={() => {
            const newId = `skill-${Date.now()}`;
            updateField((draft) => {
              draft.skills.push({ id: newId, category: { ar: '', en: '', ur: '' }, iconType: 'shield', items: [] });
            });
            setExpandedItems(prev => ({ ...prev, [newId]: true }));
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewSkillCategory || 'Add Category'}
        </button>
      </div>

      {/* Filter Input */}
      <div className="mb-4 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input 
          type="text" 
          value={localFilter} 
          onChange={(e) => setLocalFilter(e.target.value)} 
          placeholder={t.cms.searchSkillsPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div className="space-y-4">
        {filteredSkills.map((group) => {
          const isExpanded = !!expandedItems[group.id];
          const globalIndex = skillsData.findIndex(s => s.id === group.id);

          return (
            <div key={group.id} id={`item-${group.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
              <div 
                onClick={() => toggleAccordion(group.id)}
                className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      disabled={globalIndex === 0} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.skills;
                          [list[globalIndex - 1], list[globalIndex]] = [list[globalIndex], list[globalIndex - 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderUp || 'Move up'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button 
                      disabled={globalIndex === skillsData.length - 1} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.skills;
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
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{group.category?.[lang] || group.category?.en || t.cms.untitledGroup || 'Untitled Group'}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">{group.items?.length || 0} {t.cms.skillsInside}</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(t.cms.confirmDelete)) {
                      updateField((draft) => {
                        draft.skills = draft.skills.filter(s => s.id !== group.id);
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminMultiLangInput 
                      label={t.cms.skillCategory} 
                      valueObj={group.category} 
                      onChangeKey={(key, val) => {
                        updateField((draft) => {
                          draft.skills[globalIndex].category[key] = val;
                        });
                      }} 
                    />
                    <AdminInput 
                      label={t.cms.skillIcon} 
                      value={group.iconType} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.skills[globalIndex].iconType = val;
                        });
                      }} 
                    />
                  </div>

                  {/* Skill items list */}
                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
                    <h5 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.individualSkills}</h5>
                    <div className="space-y-3">
                      {(group.items || []).map((item, itemIdx) => (
                        <div key={itemIdx} className="p-3 border border-[var(--border-color)] rounded bg-[var(--card-bg)] flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <AdminMultiLangInput 
                              label={`${t.cms.skillLabel} #${itemIdx + 1}`} 
                              valueObj={item} 
                              onChangeKey={(key, val) => {
                                updateField((draft) => {
                                  draft.skills[globalIndex].items[itemIdx][key] = val;
                                });
                              }} 
                            />
                          </div>
                          <button 
                            onClick={() => {
                              updateField((draft) => {
                                draft.skills[globalIndex].items = draft.skills[globalIndex].items.filter((_, i) => i !== itemIdx);
                              });
                            }}
                            aria-label={t.cms?.ariaDelete || 'Delete'}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--status-red)] hover:bg-[var(--status-red-bg)] rounded cursor-pointer shrink-0 self-end mb-5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        updateField((draft) => {
                          if (!draft.skills[globalIndex].items) draft.skills[globalIndex].items = [];
                          draft.skills[globalIndex].items.push({ ar: '', en: '', ur: '' });
                        });
                      }}
                      className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.cms.addNewSkillItem}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
