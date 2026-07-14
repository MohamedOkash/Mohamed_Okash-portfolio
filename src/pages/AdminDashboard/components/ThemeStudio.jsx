import React from 'react';
import { CheckCircle2, Download, Upload } from 'lucide-react';
import { AdminInput } from '../../../components/ui/AdminControls';
import { THEME_PROFILES_DEFAULTS } from '../../../data/constants';
import { validateContrasts, calculateHealthScore, getHealthScoreColor, getHealthScoreLabel, getSectionScores, autoFixTheme } from '../../../utils/themeValidator';

export const ThemeStudio = React.memo(({ themeProfilesData = {}, t, updateField, showStatus, selectedTheme = 'dark', setSelectedTheme }) => {
  const themeStudioSelectedTheme = selectedTheme;
  const setThemeStudioSelectedTheme = setSelectedTheme || (() => {});

  const themeNames = ['dark', 'ocean', 'aurora', 'platinum', 'midnight'];
  const themeLabels = { 
    dark: t.cms?.themeDark || 'Dark Obsidian', 
    ocean: t.cms?.themeOcean || 'Ocean Blue', 
    aurora: t.cms?.themeAurora || 'Aurora Green', 
    platinum: t.cms?.themePlatinum || 'Platinum Silver', 
    midnight: t.cms?.themeMidnight || 'Midnight Purple' 
  };

  const getActiveProfile = () => {
    return themeProfilesData[themeStudioSelectedTheme] || THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] || {};
  };

  const updateThemeProfileKey = (key, value) => {
    updateField((draft) => {
      if (!draft.themeProfiles) {
        draft.themeProfiles = JSON.parse(JSON.stringify(THEME_PROFILES_DEFAULTS));
      }
      if (!draft.themeProfiles[themeStudioSelectedTheme]) {
        draft.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] };
      }
      draft.themeProfiles[themeStudioSelectedTheme][key] = value;
    });
  };

  const profile = getActiveProfile();

  const handleResetTheme = () => {
    if (window.confirm(`Reset "${themeLabels[themeStudioSelectedTheme]}" to defaults?`)) {
      updateField((draft) => {
        if (!draft.themeProfiles) draft.themeProfiles = {};
        draft.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] };
      });
      showStatus('success', `Reset "${themeLabels[themeStudioSelectedTheme]}" to default settings.`);
    }
  };

  const handleExportTheme = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `${themeStudioSelectedTheme}-theme.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportTheme = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        
        // Schema validation: Ensure it has key variables
        const requiredKeys = ['accentColor', 'fontColor', 'headingColor'];
        const missingKeys = requiredKeys.filter(k => !parsed.hasOwnProperty(k));
        if (missingKeys.length > 0) {
          throw new Error(`Invalid theme schema: Missing key properties (${missingKeys.join(', ')}).`);
        }

        // Verify contrast health score of parsed theme
        const validations = validateContrasts(parsed, THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], themeStudioSelectedTheme);
        const score = calculateHealthScore(validations);
        if (score < 40) {
          throw new Error(`Import rejected: Theme contrast health score is too low (${score}/100). The colors are not readable.`);
        }

        updateField((draft) => {
          if (!draft.themeProfiles) draft.themeProfiles = {};
          draft.themeProfiles[themeStudioSelectedTheme] = { 
            ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], 
            ...parsed 
          };
        });
        showStatus('success', `Theme "${themeLabels[themeStudioSelectedTheme]}" imported successfully! (Health: ${score}/100)`);
      } catch (err) {
        showStatus('error', err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const allValidations = validateContrasts(profile, THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], themeStudioSelectedTheme);
  const healthScore = calculateHealthScore(allValidations);
  const sectionScores = getSectionScores(allValidations);
  const failedChecks = allValidations.filter(v => !v.pass);

  const handleAutoFix = () => {
    const fixed = autoFixTheme(profile, THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], themeStudioSelectedTheme);
    updateField((draft) => {
      if (!draft.themeProfiles) draft.themeProfiles = {};
      draft.themeProfiles[themeStudioSelectedTheme] = { 
        ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], 
        ...fixed 
      };
    });
    showStatus('success', `Optimized theme colors automatically.`);
  };

  return (
    <div className="space-y-6">
      {/* Theme Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-3 mb-4">
        {themeNames.map(tKey => (
          <button
            key={tKey}
            onClick={() => setThemeStudioSelectedTheme(tKey)}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer ${
              themeStudioSelectedTheme === tKey
                ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            {themeLabels[tKey]}
          </button>
        ))}
      </div>

      {/* Theme Health Score */}
      <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">Theme Health Score</h4>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black" style={{ color: getHealthScoreColor(healthScore) }}>{healthScore}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: getHealthScoreColor(healthScore) + '20', color: getHealthScoreColor(healthScore) }}>{getHealthScoreLabel(healthScore)}</span>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${healthScore}%`, backgroundColor: getHealthScoreColor(healthScore) }} />
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          {Object.entries(sectionScores).map(([key, { score }]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getHealthScoreColor(score) }} />
              <span className="text-[10px] font-bold text-[var(--text-secondary)]">{key}: {score}</span>
            </div>
          ))}
        </div>
        {failedChecks.length > 0 && (
          <div className="p-3 rounded-lg bg-[var(--status-red-bg)] border border-[var(--status-red-border)] space-y-1">
            {failedChecks.map(check => (
              <p key={check.key} className="text-[10px] text-[var(--status-red)] font-medium">
                {check.label}: {check.ratio}:1 (needs {check.threshold}:1)
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Theme Action Bar */}
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <button onClick={handleResetTheme} className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer flex items-center gap-1">
          <Undo className="w-3.5 h-3.5" /> {t.cms?.reset || 'Reset'} {themeLabels[themeStudioSelectedTheme]}
        </button>
        <button onClick={handleAutoFix} className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--status-amber)] hover:bg-[var(--status-amber-bg)] cursor-pointer flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Auto Fix Theme
        </button>
        <button onClick={handleExportTheme} className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer flex items-center gap-1">
          <Download className="w-3.5 h-3.5" /> {t.cms?.exportTheme || 'Export Theme'}
        </button>
        <label className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer flex items-center gap-1">
          <Upload className="w-3.5 h-3.5" /> {t.cms?.importTheme || 'Import Theme'}
          <input type="file" accept=".json" onChange={handleImportTheme} className="hidden" />
        </label>
      </div>

      {/* Colors Section */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.colorsLabel || 'Colors'}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['accentColor', t.cms?.accentColor || 'Accent Color'],
            ['accentText', t.cms?.accentText || 'Accent Text Color'],
            ['fontColor', t.cms?.bodyFontColor || 'Body Font Color'],
            ['headingColor', t.cms?.headingColorLabel || 'Heading Color'],
            ['cardBackground', t.cms?.cardBackground || 'Card Background'],
            ['inputBackground', t.cms?.inputBackground || 'Input Background'],
            ['borderColor', t.cms?.borderColorLabel || 'Border Color'],
          ].map(([key, label]) => {
            const checkMap = { fontColor: 'bgBodyText', headingColor: 'bgHeadingText', accentText: 'accentAccentText', cardBackground: 'cardBodyText', inputBackground: 'inputInputText' };
            const fail = checkMap[key] ? allValidations.find(v => v.key === checkMap[key]) : null;
            return (
              <div key={key} className="flex items-end gap-3">
                <div className="flex-1">
                  <AdminInput label={label} value={profile[key] || ''} onChange={(e) => updateThemeProfileKey(key, e.target.value)} />
                </div>
                <div className="flex flex-col items-center gap-1 mb-4">
                  <input type="color" value={profile[key] || '#ffffff'} onChange={(e) => updateThemeProfileKey(key, e.target.value)} className="w-10 h-10 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" />
                  {fail && !fail.pass && <span className="text-[8px] font-bold text-[var(--status-red)]" title={`${fail.label}: ${fail.ratio}:1`}>⚠</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Glass Section */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.glassLabel || 'Glass'}</h4>
        {[
          ['glassOpacity', t.cms?.glassOpacity || 'Glass Opacity', 0, 0.3, 0.01],
          ['blurStrength', t.cms?.backdropBlur || 'Blur Strength', 0, 40, 1],
          ['borderOpacity', t.cms?.borderOpacity || 'Border Opacity', 0, 0.2, 0.01],
        ].map(([key, label, min, max, step]) => (
          <div key={key}>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{label}</span>
              <span className="text-[var(--primary)]">{key === 'blurStrength' ? `${profile[key]}px` : profile[key]}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={profile[key] !== undefined ? profile[key] : THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme]?.[key]} onChange={(e) => updateThemeProfileKey(key, Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
        ))}
      </div>

      {/* Effects Section */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.effectsLabel || 'Effects'}</h4>
        {[
          ['glowIntensity', t.cms?.glowIntensity || 'Glow Intensity', 0, 1, 0.05],
          ['bgIntensity', t.cms?.backgroundIntensity || 'Background Intensity', 0, 0.5, 0.01],
        ].map(([key, label, min, max, step]) => (
          <div key={key}>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{label}</span>
              <span className="text-[var(--primary)]">{profile[key]}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={profile[key] !== undefined ? profile[key] : THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme]?.[key]} onChange={(e) => updateThemeProfileKey(key, Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
        ))}
      </div>

      {/* Typography Section */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.typographyLabel || 'Typography'}</h4>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms?.fontFamily || 'Font Family'}</label>
          <select value={profile.fontFamily || 'Inter'} onChange={(e) => updateThemeProfileKey('fontFamily', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm">
            <option value="Inter">Inter</option>
            <option value="Cairo">Cairo</option>
            <option value="Tajawal">Tajawal</option>
            <option value="IBM Plex Sans">IBM Plex Sans</option>
            <option value="Poppins">Poppins</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms?.fontScale || 'Font Scale'}</span>
            <span className="text-[var(--primary)]">{profile.fontScale || 1.0}x</span>
          </div>
          <input type="range" min="0.8" max="1.5" step="0.05" value={profile.fontScale || 1.0} onChange={(e) => updateThemeProfileKey('fontScale', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms?.headingSize || 'Heading Size'}</span>
              <span className="text-[var(--primary)]">{profile.headingSize || 48}px</span>
            </div>
            <input type="range" min="32" max="88" step="2" value={profile.headingSize || 48} onChange={(e) => updateThemeProfileKey('headingSize', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms?.paragraphSize || 'Paragraph Size'}</span>
              <span className="text-[var(--primary)]">{profile.paragraphSize || 16}px</span>
            </div>
            <input type="range" min="12" max="24" step="1" value={profile.paragraphSize || 16} onChange={(e) => updateThemeProfileKey('paragraphSize', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms?.headingWeight || 'Heading Weight'}</label>
          <select value={profile.headingWeight || '800'} onChange={(e) => updateThemeProfileKey('headingWeight', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm">
            <option value="400">{t.cms?.weightRegular || 'Regular'}</option>
            <option value="500">{t.cms?.weightMedium || 'Medium'}</option>
            <option value="600">{t.cms?.weightSemibold || 'Semibold'}</option>
            <option value="700">{t.cms?.weightBold || 'Bold'}</option>
            <option value="800">{t.cms?.weightExtraBold || 'Extra Bold'}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms?.bodyWeight || 'Body Weight'}</label>
          <select value={profile.bodyWeight || '300'} onChange={(e) => updateThemeProfileKey('bodyWeight', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm">
            <option value="300">{t.cms?.weightLight || 'Light'}</option>
            <option value="400">{t.cms?.weightRegular || 'Regular'}</option>
            <option value="500">{t.cms?.weightMedium || 'Medium'}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms?.letterSpacing || 'Letter Spacing'}</label>
          <select value={profile.letterSpacing || '0px'} onChange={(e) => updateThemeProfileKey('letterSpacing', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm">
            <option value="-0.05em">{t.cms?.spacingTighter || '-0.05em'}</option>
            <option value="-0.02em">{t.cms?.spacingTight || '-0.02em'}</option>
            <option value="0px">{t.cms?.spacingNormal || '0px (Normal)'}</option>
            <option value="0.02em">0.02em</option>
            <option value="0.05em">0.05em</option>
            <option value="0.1em">0.1em</option>
            <option value="0.15em">0.15em</option>
            <option value="0.2em">0.2em</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms?.lineHeight || 'Line Height'}</span>
            <span className="text-[var(--primary)]">{profile.lineHeight || 1.6}</span>
          </div>
          <input type="range" min="1.0" max="2.2" step="0.1" value={profile.lineHeight || 1.6} onChange={(e) => updateThemeProfileKey('lineHeight', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
        </div>
      </div>

      {/* Radius Section */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.radiusLabel || 'Radius'}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms?.cardRadius || 'Card Radius'}</span>
              <span className="text-[var(--primary)]">{profile.cardRadius || 16}px</span>
            </div>
            <input type="range" min="4" max="32" step="2" value={profile.cardRadius || 16} onChange={(e) => updateThemeProfileKey('cardRadius', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms?.buttonRadius || 'Button Radius'}</span>
              <span className="text-[var(--primary)]">{profile.buttonRadius || 8}px</span>
            </div>
            <input type="range" min="2" max="24" step="2" value={profile.buttonRadius || 8} onChange={(e) => updateThemeProfileKey('buttonRadius', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
        </div>
      </div>
    </div>
  );
});
