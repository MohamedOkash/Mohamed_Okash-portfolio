import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, CheckSquare, Square } from 'lucide-react';
import { AdminMultiLangInput } from '../../../components/ui/AdminControls';
import { DEFAULT_PORTFOLIO_DATA } from '../../../data/constants';

export const StorySettings = React.memo(({ storyData, t, updateField, lang }) => {
  const title = storyData?.title || { ar: '', en: '', ur: '' };
  const content = storyData?.content || { ar: [], en: [], ur: [] };
  const selectedLines = content[lang] || [];

  const updateStorySection = (updater) => {
    updateField((draft) => {
      if (!draft.storySection) {
        draft.storySection = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA.storySection));
      }
      draft.storySection.title = {
        ...DEFAULT_PORTFOLIO_DATA.storySection.title,
        ...(draft.storySection.title || {})
      };
      draft.storySection.content = {
        ...DEFAULT_PORTFOLIO_DATA.storySection.content,
        ...(draft.storySection.content || {})
      };
      ['ar', 'en', 'ur'].forEach((languageKey) => {
        if (!Array.isArray(draft.storySection.content[languageKey])) {
          draft.storySection.content[languageKey] = [];
        }
      });
      updater(draft.storySection, draft);

      // Keep websiteStructure sync
      const structureIndex = draft.websiteStructure?.sections?.findIndex((section) => section.id === 'story');
      if (structureIndex !== undefined && structureIndex !== -1) {
        draft.websiteStructure.sections[structureIndex] = {
          ...draft.websiteStructure.sections[structureIndex],
          visible: draft.storySection.enabled !== false,
          title: {
            ...draft.websiteStructure.sections[structureIndex].title,
            ...draft.storySection.title
          }
        };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.storySectionTitle}</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1">{t.cms.storySectionDesc}</p>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div>
          <h5 className="font-bold text-sm text-[var(--text-primary)] mb-0.5">{t.cms.storySectionEnable}</h5>
          <p className="text-xs text-[var(--text-secondary)]">{t.cms.storySectionEnableDesc}</p>
        </div>
        <button
          type="button"
          onClick={() => updateStorySection((section) => {
            section.enabled = section.enabled === false;
          })}
          aria-label={t.cms.storySectionEnable}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
            storyData?.enabled !== false
              ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]'
              : 'border-[var(--border-color)] text-[var(--text-secondary)]'
          }`}
        >
          {storyData?.enabled !== false ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>
      </div>

      <AdminMultiLangInput
        label={t.cms.storySectionCmsTitle}
        valueObj={title}
        onChangeKey={(key, val) => updateStorySection((section) => {
          section.title[key] = val;
        })}
      />

      <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.storySectionLines}</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{t.cms.storySectionLinesDesc}</p>
          </div>
          <button
            type="button"
            onClick={() => updateStorySection((section) => {
              section.content[lang] = [...(section.content[lang] || []), ''];
            })}
            className="px-3.5 py-2 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--surface-hover)] border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t.cms.storySectionAddLine}
          </button>
        </div>

        <div className="space-y-3">
          {selectedLines.map((line, index) => (
            <div key={index} className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                  {t.cms.storySectionLine} {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => updateStorySection((section) => {
                      const lines = [...section.content[lang]];
                      [lines[index - 1], lines[index]] = [lines[index], lines[index - 1]];
                      section.content[lang] = lines;
                    })}
                    aria-label={t.cms?.ariaReorderUp || 'Move up'}
                    className="p-1.5 rounded hover:bg-[var(--surface-hover)] disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === selectedLines.length - 1}
                    onClick={() => updateStorySection((section) => {
                      const lines = [...section.content[lang]];
                      [lines[index + 1], lines[index]] = [lines[index], lines[index + 1]];
                      section.content[lang] = lines;
                    })}
                    aria-label={t.cms?.ariaReorderDown || 'Move down'}
                    className="p-1.5 rounded hover:bg-[var(--surface-hover)] disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStorySection((section) => {
                      section.content[lang] = section.content[lang].filter((_, lineIndex) => lineIndex !== index);
                    })}
                    aria-label={t.cms?.ariaDelete || 'Delete'}
                    className="p-1.5 rounded text-[var(--status-red)] hover:bg-[var(--status-red-bg)] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                rows="3"
                dir={lang === 'en' ? 'ltr' : 'rtl'}
                value={line}
                onChange={(e) => {
                  const val = e.target.value;
                  updateStorySection((section) => {
                    section.content[lang][index] = val;
                  });
                }}
                className="block w-full min-w-0 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm p-3"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
