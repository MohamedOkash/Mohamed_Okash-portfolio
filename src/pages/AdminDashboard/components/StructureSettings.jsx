import React from 'react';
import { ArrowUp, ArrowDown, CheckSquare, Square } from 'lucide-react';

export const StructureSettings = React.memo(({ websiteStructure, t, updateField, lang }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.tabStructure}</h3>
      
      <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div>
          <h5 className="font-bold text-sm text-[var(--text-primary)] mb-0.5">{t.cms.showNavbar}</h5>
          <p className="text-xs text-[var(--text-secondary)]">{t.cms.showNavbarDesc}</p>
        </div>
        <button 
          onClick={() => {
            updateField((draft) => {
              draft.websiteStructure.navbarVisible = !draft.websiteStructure.navbarVisible;
            });
          }}
          aria-label={t.cms?.ariaToggleNavbar || 'Toggle navbar'}
          className={`p-2.5 rounded-lg border transition-all ${
            websiteStructure.navbarVisible 
              ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]' 
              : 'border-[var(--border-color)] text-[var(--text-secondary)]'
          }`}
        >
          {websiteStructure.navbarVisible ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.homepageSections}</h4>
        <p className="text-xs text-[var(--text-secondary)]">{t.cms.sectionsDesc}</p>
        
        <div className="space-y-3">
          {websiteStructure.sections.map((sect, idx) => (
            <div key={sect.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  disabled={idx === 0}
                  onClick={() => {
                    updateField((draft) => {
                      const list = [...draft.websiteStructure.sections];
                      const temp = list[idx];
                      list[idx] = list[idx - 1];
                      list[idx - 1] = temp;
                      draft.websiteStructure.sections = list;
                    });
                  }}
                  aria-label={t.cms?.ariaReorderUp || 'Move up'}
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
                <button
                  disabled={idx === websiteStructure.sections.length - 1}
                  onClick={() => {
                    updateField((draft) => {
                      const list = [...draft.websiteStructure.sections];
                      const temp = list[idx];
                      list[idx] = list[idx + 1];
                      list[idx + 1] = temp;
                      draft.websiteStructure.sections = list;
                    });
                  }}
                  aria-label={t.cms?.ariaReorderDown || 'Move down'}
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
                <div>
                  <h5 className="font-bold text-sm text-[var(--text-primary)] capitalize">{sect.id.replace('-', ' ')}</h5>
                  <p className="text-[10px] text-[var(--text-secondary)]">{t.cms.projectId || 'ID'}: #{sect.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    updateField((draft) => {
                      const list = [...draft.websiteStructure.sections];
                      const nextVal = !list[idx].visible;
                      list[idx].visible = nextVal;
                      draft.websiteStructure.sections = list;
                      
                      if (sect.id.startsWith('custom-')) {
                        const cIdx = draft.customSections?.findIndex(cs => cs.id === sect.id);
                        if (cIdx !== undefined && cIdx !== -1) {
                          draft.customSections[cIdx].visible = nextVal;
                        }
                      }
                      if (sect.id === 'story') {
                        draft.storySection = {
                          ...draft.storySection,
                          enabled: nextVal
                        };
                      }
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    sect.visible 
                      ? 'bg-[var(--status-green-bg)] border-[var(--status-green-border)] text-[var(--status-green)]' 
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  {sect.visible ? t.cms.visible : t.cms.hidden}
                </button>

                <div className="flex-1 sm:w-44 text-right">
                  <input 
                    type="text" 
                    value={sect.title[lang] || sect.title.en || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField((draft) => {
                        const list = [...draft.websiteStructure.sections];
                        list[idx].title[lang] = val;
                        draft.websiteStructure.sections = list;
                        
                        if (sect.id.startsWith('custom-')) {
                          const cIdx = draft.customSections?.findIndex(cs => cs.id === sect.id);
                          if (cIdx !== undefined && cIdx !== -1) {
                            if (!draft.customSections[cIdx].title) {
                              draft.customSections[cIdx].title = { ar: '', en: '', ur: '' };
                            }
                            draft.customSections[cIdx].title[lang] = val;
                          }
                        }
                        if (sect.id === 'story') {
                          draft.storySection = {
                            ...draft.storySection,
                            title: {
                              ...draft.storySection?.title,
                              [lang]: val
                            }
                          };
                        }
                      });
                    }}
                    placeholder={t.cms.sectionTitlePlaceholder}
                    className="p-2 w-full rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
