import React from 'react';
import { AdminInput } from '../../../components/ui/AdminControls';

export const ThemeSettings = React.memo(({ themeSettingsData = {}, t, updateField, setTheme }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.themeSettingsTitle}</h3>
      
      <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.defaultVisualSettings}</h4>
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.defaultTheme}</label>
          <select 
            value={themeSettingsData.defaultTheme} 
            onChange={(e) => {
              const val = e.target.value;
              updateField((draft) => {
                draft.themeSettings.defaultTheme = val;
              });
              setTheme(val);
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="dark">{t.cms.themeDark || 'Dark Obsidian'}</option>
            <option value="ocean">{t.cms.themeOcean || 'Ocean Blue'}</option>
            <option value="aurora">{t.cms.themeAurora || 'Aurora Green'}</option>
            <option value="platinum">{t.cms.themePlatinum || 'Platinum Silver'}</option>
            <option value="midnight">{t.cms.themeMidnight || 'Midnight Purple'}</option>
          </select>
        </div>
      </div>

      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.themeBuilderTitle}</h4>
        <p className="text-xs text-[var(--text-secondary)]">{t.cms.themeBuilderDesc}</p>
        
        {/* Accent Color picker */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <AdminInput 
              label={t.cms.accentColor} 
              value={themeSettingsData.accentColor || ''} 
              onChange={(e) => {
                const val = e.target.value;
                updateField((draft) => {
                  draft.themeSettings.accentColor = val;
                });
              }} 
            />
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">{t.cms.picker}</span>
            <input 
              type="color" 
              value={themeSettingsData.accentColor || '#ffffff'} 
              onChange={(e) => {
                const val = e.target.value;
                updateField((draft) => {
                  draft.themeSettings.accentColor = val;
                });
              }} 
              className="w-12 h-12 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" 
            />
          </div>
        </div>

        {/* Glass opacity slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.glassOpacity}</span>
            <span className="text-[var(--primary)]">{themeSettingsData.glassOpacity}</span>
          </div>
          <input 
            type="range" 
            min="0.0" 
            max="0.3" 
            step="0.01" 
            value={themeSettingsData.glassOpacity || 0.03} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.themeSettings.glassOpacity = val;
              });
            }} 
            className="w-full accent-[var(--primary)]" 
          />
        </div>

        {/* Glass blur strength */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.backdropBlur}</span>
            <span className="text-[var(--primary)]">{themeSettingsData.blurStrength}px</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="40" 
            step="1" 
            value={themeSettingsData.blurStrength || 16} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.themeSettings.blurStrength = val;
              });
            }} 
            className="w-full accent-[var(--primary)]" 
          />
        </div>

        {/* Glass border opacity */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.borderOpacity}</span>
            <span className="text-[var(--primary)]">{themeSettingsData.borderOpacity}</span>
          </div>
          <input 
            type="range" 
            min="0.0" 
            max="0.2" 
            step="0.01" 
            value={themeSettingsData.borderOpacity || 0.06} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.themeSettings.borderOpacity = val;
              });
            }} 
            className="w-full accent-[var(--primary)]" 
          />
        </div>

        {/* Mouse Glow intensity */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.cursorGlow}</span>
            <span className="text-[var(--primary)]">{themeSettingsData.glowIntensity}</span>
          </div>
          <input 
            type="range" 
            min="0.0" 
            max="1.0" 
            step="0.05" 
            value={themeSettingsData.glowIntensity || 0.2} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.themeSettings.glowIntensity = val;
              });
            }} 
            className="w-full accent-[var(--primary)]" 
          />
        </div>

        {/* Background ambient blobs intensity */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.ambientBlob}</span>
            <span className="text-[var(--primary)]">{themeSettingsData.bgIntensity}</span>
          </div>
          <input 
            type="range" 
            min="0.0" 
            max="0.5" 
            step="0.01" 
            value={themeSettingsData.bgIntensity || 0.1} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.themeSettings.bgIntensity = val;
              });
            }} 
            className="w-full accent-[var(--primary)]" 
          />
        </div>
      </div>

      {/* Typography settings controls */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.typographySettingsTitle}</h4>
        
        {/* Font Family */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.fontFamily}</label>
          <select 
            value={themeSettingsData.fontFamily || 'Inter'} 
            onChange={(e) => {
              const val = e.target.value;
              updateField((draft) => {
                draft.themeSettings.fontFamily = val;
              });
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="Inter">Inter</option>
            <option value="Cairo">Cairo</option>
            <option value="Tajawal">Tajawal</option>
            <option value="IBM Plex Sans">IBM Plex Sans</option>
            <option value="Poppins">Poppins</option>
          </select>
        </div>

        {/* Font Scale slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.fontScale}</span>
            <span className="text-[var(--primary)]">{themeSettingsData.fontScale || 1.0}x</span>
          </div>
          <input 
            type="range" 
            min="0.8" 
            max="1.5" 
            step="0.05" 
            value={themeSettingsData.fontScale || 1.0} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.themeSettings.fontScale = val;
              });
            }} 
            className="w-full accent-[var(--primary)]" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms.headingSize}</span>
              <span className="text-[var(--primary)]">{themeSettingsData.headingSize || 48}px</span>
            </div>
            <input 
              type="range" 
              min="32" 
              max="88" 
              step="2" 
              value={themeSettingsData.headingSize || 48} 
              onChange={(e) => {
                const val = Number(e.target.value);
                updateField((draft) => {
                  draft.themeSettings.headingSize = val;
                });
              }} 
              className="w-full accent-[var(--primary)]" 
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms.paragraphSize}</span>
              <span className="text-[var(--primary)]">{themeSettingsData.paragraphSize || 16}px</span>
            </div>
            <input 
              type="range" 
              min="12" 
              max="24" 
              step="1" 
              value={themeSettingsData.paragraphSize || 16} 
              onChange={(e) => {
                const val = Number(e.target.value);
                updateField((draft) => {
                  draft.themeSettings.paragraphSize = val;
                });
              }} 
              className="w-full accent-[var(--primary)]" 
            />
          </div>
        </div>

        {/* Heading Weight selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.headingWeight}</label>
          <select 
            value={themeSettingsData.headingWeight || '800'} 
            onChange={(e) => {
              const val = e.target.value;
              updateField((draft) => {
                draft.themeSettings.headingWeight = val;
              });
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="400">400 ({t.cms.weightRegular || 'Regular'})</option>
            <option value="500">500 ({t.cms.weightMedium || 'Medium'})</option>
            <option value="600">600 ({t.cms.weightSemibold || 'Semibold'})</option>
            <option value="700">700 ({t.cms.weightBold || 'Bold'})</option>
            <option value="800">800 ({t.cms.weightExtraBold || 'Extra Bold'})</option>
          </select>
        </div>

        {/* Body Weight selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.bodyWeight}</label>
          <select 
            value={themeSettingsData.bodyWeight || '300'} 
            onChange={(e) => {
              const val = e.target.value;
              updateField((draft) => {
                draft.themeSettings.bodyWeight = val;
              });
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="300">300 ({t.cms.weightLight || 'Light'})</option>
            <option value="400">400 ({t.cms.weightRegular || 'Regular'})</option>
            <option value="500">500 ({t.cms.weightMedium || 'Medium'})</option>
          </select>
        </div>

        {/* Letter Spacing selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.letterSpacing || 'Letter Spacing'}</label>
          <select 
            value={themeSettingsData.letterSpacing || '0px'} 
            onChange={(e) => {
              const val = e.target.value;
              updateField((draft) => {
                draft.themeSettings.letterSpacing = val;
              });
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="-0.05em">-0.05em</option>
            <option value="-0.02em">-0.02em</option>
            <option value="0px">0px (Normal)</option>
            <option value="0.02em">0.02em</option>
            <option value="0.05em">0.05em</option>
            <option value="0.1em">0.1em</option>
            <option value="0.15em">0.15em</option>
            <option value="0.2em">0.2em</option>
          </select>
        </div>

        {/* Line Height slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.lineHeight || 'Line Height'}</span>
            <span className="text-[var(--primary)]">{themeSettingsData.lineHeight || 1.6}</span>
          </div>
          <input 
            type="range" 
            min="1.0" 
            max="2.2" 
            step="0.1" 
            value={themeSettingsData.lineHeight || 1.6} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.themeSettings.lineHeight = val;
              });
            }} 
            className="w-full accent-[var(--primary)]" 
          />
        </div>

        {/* Paragraph Max Width slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.paragraphWidth || 'Paragraph Max Width'}</span>
            <span className="text-[var(--primary)]">{themeSettingsData.paragraphWidth || '65ch'}</span>
          </div>
          <input 
            type="range" 
            min="40" 
            max="95" 
            step="5" 
            value={parseInt(themeSettingsData.paragraphWidth, 10) || 65} 
            onChange={(e) => {
              const val = `${e.target.value}ch`;
              updateField((draft) => {
                draft.themeSettings.paragraphWidth = val;
              });
            }} 
            className="w-full accent-[var(--primary)]" 
          />
        </div>

        {/* Font Color picker */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <AdminInput 
              label={t.cms.fontColor} 
              value={themeSettingsData.fontColor || '#fafafa'} 
              onChange={(e) => {
                const val = e.target.value;
                updateField((draft) => {
                  draft.themeSettings.fontColor = val;
                });
              }} 
            />
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">{t.cms.picker}</span>
            <input 
              type="color" 
              value={themeSettingsData.fontColor || '#fafafa'} 
              onChange={(e) => {
                const val = e.target.value;
                updateField((draft) => {
                  draft.themeSettings.fontColor = val;
                });
              }} 
              className="w-12 h-12 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" 
            />
          </div>
        </div>

        {/* Heading Color picker */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <AdminInput 
              label={t.cms.headingColor} 
              value={themeSettingsData.headingColor || '#fafafa'} 
              onChange={(e) => {
                const val = e.target.value;
                updateField((draft) => {
                  draft.themeSettings.headingColor = val;
                });
              }} 
            />
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">{t.cms.picker}</span>
            <input 
              type="color" 
              value={themeSettingsData.headingColor || '#fafafa'} 
              onChange={(e) => {
                const val = e.target.value;
                updateField((draft) => {
                  draft.themeSettings.headingColor = val;
                });
              }} 
              className="w-12 h-12 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['buttonTextColor', 'Button Text Color'],
            ['buttonBackgroundColor', 'Button Background Color'],
            ['cardTitleColor', 'Card Title Color'],
            ['cardDescriptionColor', 'Card Description Color']
          ].map(([key, label]) => (
            <div key={key} className="flex items-end gap-3">
              <div className="flex-1">
                <AdminInput 
                  label={label} 
                  value={themeSettingsData[key] || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((draft) => {
                      draft.themeSettings[key] = val;
                    });
                  }} 
                />
              </div>
              <input 
                type="color" 
                value={themeSettingsData[key] || '#ffffff'} 
                onChange={(e) => {
                  const val = e.target.value;
                  updateField((draft) => {
                    draft.themeSettings[key] = val;
                  });
                }} 
                className="w-12 h-12 mb-4 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
