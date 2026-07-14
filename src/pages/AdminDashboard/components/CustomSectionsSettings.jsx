import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { AdminInput, AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const CustomSectionsSettings = React.memo(({ customSectionsData = [], t, updateField, lang }) => {
  const [localFilter, setLocalFilter] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleAccordion = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSections = customSectionsData.filter(s => 
    (s.title?.[lang] || s.title?.en || '').toLowerCase().includes(localFilter.toLowerCase()) ||
    (s.layoutType || '').toLowerCase().includes(localFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.customSectionsTitleLabel || 'Custom Sections'}</h3>
        <button 
          type="button"
          onClick={() => {
            const newId = `custom-${Date.now()}`;
            const newSect = { 
              id: newId, 
              title: { ar: 'قسم مخصص جديد', en: 'New Custom Section', ur: 'نیا کسٹم سیکشن' }, 
              subtitle: { ar: '', en: '', ur: '' }, 
              content: { ar: '', en: '', ur: '' }, 
              icon: 'sparkles', 
              layoutType: 'glassCard', 
              visible: true 
            };

            updateField((draft) => {
              if (!draft.customSections) draft.customSections = [];
              draft.customSections.push(newSect);
              
              if (!draft.websiteStructure) draft.websiteStructure = { sections: [] };
              if (!draft.websiteStructure.sections) draft.websiteStructure.sections = [];
              draft.websiteStructure.sections.push({
                id: newId,
                visible: true,
                title: { ...newSect.title }
              });
            });
            setExpandedItems(prev => ({ ...prev, [newId]: true }));
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewCustomSection || 'Add Section'}
        </button>
      </div>

      {/* Filter Input */}
      <div className="mb-4 relative">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input 
          type="text" 
          value={localFilter} 
          onChange={(e) => setLocalFilter(e.target.value)} 
          placeholder={t.cms.searchCustomSectionsPlaceholder || 'Search custom sections...'}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div className="space-y-4">
        {filteredSections.map((section) => {
          const isExpanded = !!expandedItems[section.id];
          const globalIndex = customSectionsData.findIndex(s => s.id === section.id);
          const titleText = section.title?.[lang] || section.title?.en || t.cms.untitledCustomSection || 'Untitled Section';

          return (
            <div key={section.id} id={`item-${section.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
              <div 
                onClick={() => toggleAccordion(section.id)}
                className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      disabled={globalIndex === 0} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.customSections;
                          [list[globalIndex - 1], list[globalIndex]] = [list[globalIndex], list[globalIndex - 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderUp || 'Move up'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button 
                      disabled={globalIndex === customSectionsData.length - 1} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.customSections;
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
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{titleText}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] capitalize">{section.layoutType} • {section.visible ? (t.cms.visible || 'Visible') : (t.cms.hidden || 'Hidden')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateField((draft) => {
                        const nextVal = !draft.customSections[globalIndex].visible;
                        draft.customSections[globalIndex].visible = nextVal;
                        if (draft.websiteStructure?.sections) {
                          const sIdx = draft.websiteStructure.sections.findIndex(s => s.id === section.id);
                          if (sIdx !== -1) {
                            draft.websiteStructure.sections[sIdx].visible = nextVal;
                          }
                        }
                      });
                    }}
                    aria-label={t.cms?.ariaToggleVisibility || 'Toggle visibility'}
                    className={`p-1.5 rounded hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer ${section.visible ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}
                  >
                    {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t.cms.confirmDelete || 'Are you sure you want to delete this item?')) {
                        updateField((draft) => {
                          draft.customSections.splice(globalIndex, 1);
                          if (draft.websiteStructure?.sections) {
                            const sIdx = draft.websiteStructure.sections.findIndex(s => s.id === section.id);
                            if (sIdx !== -1) {
                              draft.websiteStructure.sections.splice(sIdx, 1);
                            }
                          }
                        });
                      }
                    }}
                    aria-label={t.cms?.ariaDelete || 'Delete'}
                    className="p-1.5 rounded hover:bg-[var(--status-red-bg)] text-[var(--status-red)] hover:text-[var(--status-red)] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="text-[var(--text-secondary)]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 bg-[var(--card-bg)] border-t border-[var(--border-color)] space-y-4">
                  <AdminMultiLangInput 
                    label={t.cms.customSectionTitle || 'Section Title'} 
                    valueObj={section.title} 
                    onChangeKey={(langKey, val) => {
                      updateField((draft) => {
                        draft.customSections[globalIndex].title[langKey] = val;
                        if (draft.websiteStructure?.sections) {
                          const sIdx = draft.websiteStructure.sections.findIndex(s => s.id === section.id);
                          if (sIdx !== -1) {
                            if (!draft.websiteStructure.sections[sIdx].title) {
                              draft.websiteStructure.sections[sIdx].title = { ar: '', en: '', ur: '' };
                            }
                            draft.websiteStructure.sections[sIdx].title[langKey] = val;
                          }
                        }
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.customSectionSubtitle || 'Subtitle'} 
                    valueObj={section.subtitle} 
                    onChangeKey={(langKey, val) => {
                      updateField((draft) => {
                        draft.customSections[globalIndex].subtitle[langKey] = val;
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.sectionRichTextContent || 'Content Narrative'} 
                    textarea 
                    valueObj={section.content} 
                    onChangeKey={(langKey, val) => {
                      updateField((draft) => {
                        draft.customSections[globalIndex].content[langKey] = val;
                      });
                    }} 
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.layoutTypeLabel || 'Layout Type'}</label>
                      <select 
                        value={section.layoutType} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateField((draft) => {
                            draft.customSections[globalIndex].layoutType = val;
                          });
                        }}
                        className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
                      >
                        <option value="heroBanner">{t.cms?.layoutHeroBanner || 'Hero Banner'}</option>
                        <option value="cardsGrid">{t.cms?.layoutCardsGrid || 'Cards Grid'}</option>
                        <option value="featureGrid">{t.cms?.layoutFeatureGrid || 'Features'}</option>
                        <option value="timeline">{t.cms?.layoutTimeline || 'Timeline'}</option>
                        <option value="textBlock">{t.cms?.layoutTextBlock || 'Text Block'}</option>
                        <option value="ctaBlock">{t.cms?.layoutCtaBlock || 'CTA Block'}</option>
                        <option value="statisticsBlock">{t.cms?.layoutStats || 'Stats'}</option>
                        <option value="richContent">{t.cms?.layoutRichContent || 'Rich Content'}</option>
                        <option value="quoteBlock">{t.cms?.layoutQuote || 'Quote'}</option>
                        <option value="glassCard">{t.cms?.layoutGlassCard || 'Glass Card (Deprecated)'}</option>
                        <option value="contactBlock">{t.cms?.layoutContactBlock || 'Contact Block (Deprecated)'}</option>
                        <option value="highlightBanner">{t.cms?.layoutHighlightBanner || 'Highlight Banner (Deprecated)'}</option>
                      </select>
                    </div>

                    <AdminInput 
                      label={t.cms.sectionIcon || 'Section Icon (Lucide)'} 
                      value={section.icon} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.customSections[globalIndex].icon = val;
                        });
                      }} 
                    />
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

// Simple local fallback search icon if Lucide isn't fully bound
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
