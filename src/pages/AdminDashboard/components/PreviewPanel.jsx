import React from 'react';
import { Award, Eye } from 'lucide-react';
import { THEME_PROFILES_DEFAULTS } from '../../../data/constants';

export const PreviewPanel = React.memo(({ formData, activeTab, themeStudioSelectedTheme, lang, t }) => {
  if (!formData) return null;

  const isThemeStudio = activeTab === 'themeStudio' || activeTab === 'backgroundBuilder';
  const previewProfile = isThemeStudio 
    ? (formData.themeProfiles?.[themeStudioSelectedTheme] || THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] || {}) 
    : (formData.themeProfiles?.[formData.themeSettings?.defaultTheme || 'dark'] || formData.themeSettings || {});
  
  const p = previewProfile;
  const isLight = (themeStudioSelectedTheme || formData.themeSettings?.defaultTheme) === 'platinum';

  // Compute preview-safe text colors derived from profile for guaranteed readability
  const previewTextColor = isLight ? '#0f172a' : (p.fontColor && p.fontColor !== '#000000' ? p.fontColor : '#f1f5f9');
  const previewCardText = isLight ? '#334155' : (p.cardDescriptionColor && p.cardDescriptionColor !== '#000000' ? p.cardDescriptionColor : '#cbd5e1');
  const previewInputText = isLight ? '#0f172a' : (p.fontColor && p.fontColor !== '#000000' ? p.fontColor : '#e2e8f0');

  return (
    <div 
      className="w-full h-full p-6 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[300px]"
      style={{
        '--accent-color': p.accentColor || '#ffffff',
        '--primary': p.accentColor || '#ffffff',
        '--glass-opacity': p.glassOpacity !== undefined ? p.glassOpacity : 0.03,
        '--border-opacity': p.borderOpacity !== undefined ? p.borderOpacity : 0.06,
        '--blur-strength': `${p.blurStrength !== undefined ? p.blurStrength : 16}px`,
        '--font-family-setting': p.fontFamily ? `'${p.fontFamily}', var(--font-sans)` : 'var(--font-sans)',
        '--font-scale-setting': p.fontScale !== undefined ? p.fontScale : 1.0,
        '--heading-size-setting': `${p.headingSize || 48}px`,
        '--paragraph-size-setting': `${p.paragraphSize || 16}px`,
        '--heading-weight-setting': p.headingWeight || '800',
        '--body-weight-setting': p.bodyWeight || '300',
        '--font-color-setting': previewTextColor,
        '--heading-color-setting': isLight ? 'var(--text-primary)' : previewTextColor,
        '--letter-spacing-setting': p.letterSpacing || 'normal',
        '--line-height-setting': p.lineHeight || '1.6',
        '--paragraph-width-setting': p.paragraphWidth || '65ch',
        '--button-text-color-setting': isLight ? 'var(--accent-text)' : (p.buttonTextColor || 'var(--accent-text)'),
        '--button-background-color-setting': isLight ? 'var(--accent-color)' : (p.buttonBackgroundColor || 'var(--accent)'),
        '--card-title-color-setting': isLight ? 'var(--text-primary)' : (p.cardTitleColor || 'var(--heading-color-setting)'),
        '--card-description-color-setting': isLight ? 'var(--text-secondary)' : (p.cardDescriptionColor || 'var(--muted)'),
        'fontFamily': p.fontFamily ? `'${p.fontFamily}', sans-serif` : 'sans-serif',
        'fontSize': `calc(100% * ${p.fontScale || 1.0})`,
        'letterSpacing': p.letterSpacing || 'normal',
        'lineHeight': p.lineHeight || '1.6',
        '--heading-weight': p.headingWeight || '800',
        '--body-weight': p.bodyWeight || '300',
        '--font-color': isLight ? 'var(--text-primary)' : (p.fontColor || 'var(--text-primary)'),
        '--heading-color': isLight ? 'var(--text-primary)' : (p.headingColor || 'var(--text-primary)')
      }}
    >
      {/* Glow ambient spot */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-300" 
        style={{
          background: p.accentColor || '#ffffff',
          opacity: (p.glowIntensity !== undefined ? p.glowIntensity : 0.2) * 0.4
        }}
      />

      <div className="relative z-10 space-y-4" style={{ color: 'var(--font-color)' }}>
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
          <span>{t.cms?.previewCardTitle}</span>
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {t.cms?.realtime}</span>
        </div>

        {activeTab === 'general' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-2">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms?.previewLogo}</span>
            <div className="text-lg font-black text-[var(--text-primary)]" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.general?.logoText?.[lang] || formData.general?.logoText?.en}</div>
            <div className="text-xs text-[var(--text-secondary)]" style={{ fontWeight: 'var(--body-weight)' }}>{formData.general?.brandIdentity?.[lang] || formData.general?.brandIdentity?.en}</div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms?.previewFlow}</span>
            <div className="space-y-1.5">
              {(formData.websiteStructure?.sections || []).map(s => (
                <div key={s.id} className={`p-2 rounded text-[10px] font-bold border flex items-center justify-between ${
                  s.visible ? 'bg-[var(--accent-color)]/5 border-[var(--accent-color)]/20 text-[var(--text-primary)]' : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-secondary)]'
                }`}>
                  <span className="capitalize">{s.id}</span>
                  <span>{s.visible ? t.cms.on : t.cms.off}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--status-green-bg)] border border-[var(--status-green-border)] text-[8px] font-bold text-[var(--status-green)] uppercase">{t.cms.availableBadge}</div>
            <h4 className="text-xl font-black text-[var(--text-primary)] leading-tight" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>
              {formData.hero?.title1?.[lang] || formData.hero?.title1?.en}<br />
              <span style={{ color: formData.themeSettings?.accentColor }}>{formData.hero?.title2?.[lang] || formData.hero?.title2?.en}</span>
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light line-clamp-3" style={{ fontWeight: 'var(--body-weight)' }}>
              {formData.hero?.tagline?.[lang] || formData.hero?.tagline?.en}
            </p>
            <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pt-2">
              {t.cms.statsLabel}: {formData.hero?.statistics?.experienceYears} {t.yearsExp} • {formData.hero?.statistics?.projectsBuilt} {t.projectsBuilt}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
            <h4 className="text-base font-bold text-[var(--text-primary)]" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.about?.title?.[lang] || formData.about?.title?.en}</h4>
            <p className="text-[11px] text-[var(--accent-color)] font-medium">{formData.about?.subtitle?.[lang] || formData.about?.subtitle?.en}</p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light line-clamp-5 whitespace-pre-line" style={{ fontWeight: 'var(--body-weight)' }}>
              {formData.about?.text?.[lang] || formData.about?.text?.en}
            </p>
          </div>
        )}

        {activeTab === 'projects' && (
          <div 
            className="p-5 rounded-2xl border bg-[var(--surface-hover)] backdrop-blur-[var(--blur-strength)] space-y-4"
            style={{ borderColor: `rgba(255,255,255,var(--border-opacity))` }}
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-secondary)]">
              <span>{formData.projects?.[0]?.category?.[lang] || t.cms.projectPlaceholderCategory}</span>
              <span className="text-[var(--accent-color)]">{t.cms.previewLabel || 'Preview'}</span>
            </div>
            <h4 className="text-base font-extrabold text-[var(--text-primary)]" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.projects?.[0]?.title || 'Safety System'}</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light line-clamp-3" style={{ fontWeight: 'var(--body-weight)' }}>
              {formData.projects?.[0]?.description?.[lang] || formData.projects?.[0]?.description?.en}
            </p>
            <div className="flex flex-wrap gap-1">
              {(formData.projects?.[0]?.tech || []).slice(0, 3).map((tItem, i) => {
                const label = typeof tItem === 'string' ? tItem : tItem[lang] || tItem.en;
                return <span key={i} className="text-[8px] font-bold bg-[var(--surface-hover)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-primary)]/75">{label}</span>;
              })}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
            <h4 className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider">{formData.skills?.[0]?.category?.[lang] || formData.skills?.[0]?.category?.en || t.cms.sidebarSkills}</h4>
            <div className="flex flex-wrap gap-1.5">
              {(formData.skills?.[0]?.items || []).slice(0, 5).map((item, i) => (
                <span key={i} className="text-[10px] font-medium bg-[var(--surface-hover)] border border-[var(--border-color)] px-2.5 py-1 rounded-lg text-[var(--text-primary)]/80">{item[lang] || item.en}</span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms.previewTimeline}</span>
            <div className="border-l border-[var(--border-color)] pl-3 space-y-3">
              {(formData.experience || []).slice(0, 2).map((exp) => (
                <div key={exp.id} className="text-xs">
                  <h5 className="font-bold text-[var(--text-primary)]">{exp.role?.[lang] || exp.role?.en}</h5>
                  <p className="text-[10px] text-[var(--text-secondary)] mb-1">{exp.company?.[lang] || exp.company?.en} • {exp.period?.[lang] || exp.period?.en}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div 
            className="p-4 rounded-xl border bg-[var(--surface-hover)] backdrop-blur-[var(--blur-strength)] text-center relative"
            style={{ borderColor: `rgba(255,255,255,var(--border-opacity))` }}
          >
            <div className="mx-auto w-10 h-10 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 flex items-center justify-center text-[var(--accent-color)] mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-[var(--text-primary)] text-xs px-2 leading-snug">
              {formData.certifications?.[0]?.name?.[lang] || formData.certifications?.[0]?.[lang] || t.cms.certPlaceholderName}
            </h5>
            <p className="text-[9px] text-[var(--text-secondary)] mt-1">{formData.certifications?.[0]?.provider?.[lang] || t.cms.certPlaceholderProvider}</p>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 gap-3">
            {(formData.achievements || []).slice(0, 2).map((ach) => (
              <div key={ach.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-center">
                <div className="text-2xl font-black text-[var(--text-primary)]" style={{ color: formData.themeSettings?.accentColor }}>{ach.value}{ach.suffix}</div>
                <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1">{ach.label?.[lang] || ach.label?.en}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-2 gap-2">
            {formData.contact?.email && <div className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded text-center text-[10px] text-[var(--text-primary)]">{t.emailLabel}</div>}
            {formData.contact?.whatsapp && <div className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded text-center text-[10px] text-[var(--brand-whatsapp-text)]">{t.whatsappLabel}</div>}
            {formData.contact?.github && <div className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded text-center text-[10px] text-[var(--text-secondary)]">{t.githubLabel}</div>}
            {formData.contact?.linkedin && <div className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded text-center text-[10px] text-[var(--brand-linkedin-text)]">LinkedIn</div>}
          </div>
        )}

        {activeTab === 'theme' && (
          <div 
            className="p-6 rounded-2xl border text-center relative overflow-hidden transition-all duration-300"
            style={{
              background: `rgba(255,255,255,var(--glass-opacity))`,
              borderColor: `rgba(255,255,255,var(--border-opacity))`,
              backdropFilter: `blur(var(--blur-strength))`
            }}
          >
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${formData.themeSettings?.accentColor}, transparent)`,
                opacity: (formData.themeSettings?.glowIntensity || 0) * 0.15
              }}
            />
            <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: formData.themeSettings?.accentColor }}>{t.cms.previewMockup}</span>
            <p className="text-xs text-[var(--text-primary)]/70 mt-3 font-light leading-relaxed">
              {t.cms.previewThemeDesc}
            </p>
          </div>
        )}

        {activeTab === 'themeStudio' && (() => {
          const tp = formData.themeProfiles?.[themeStudioSelectedTheme] || THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] || {};
          const themeLabels = { dark: t.cms?.themeDark || 'Dark Obsidian', ocean: t.cms?.themeOcean || 'Ocean Blue', aurora: t.cms?.themeAurora || 'Aurora Green', platinum: t.cms?.themePlatinum || 'Platinum Silver', midnight: t.cms?.themeMidnight || 'Midnight Purple' };
          return (
            <div className="space-y-4" style={{ fontFamily: tp.fontFamily ? `'${tp.fontFamily}', sans-serif` : undefined }}>
              <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[var(--text-secondary)] tracking-wider">
                <span>{t.cms?.themeStudioPreview || 'Theme Studio Preview'}</span>
                <span className="text-[var(--primary)]">{themeLabels[themeStudioSelectedTheme]}</span>
              </div>
              {/* Navbar preview */}
              <div className="p-3 rounded-xl border flex items-center gap-3 text-xs" style={{ borderColor: tp.borderColor, background: tp.cardBackground, borderRadius: tp.cardRadius }}>
                <div className="w-6 h-6 rounded-full" style={{ background: tp.accentColor }} />
                <span className="font-bold flex-1" style={{ color: tp.headingColor }}>{formData.brandIdentity?.logoText?.en || 'Okash'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: tp.accentColor + '20', color: tp.accentColor }}>Work</span>
              </div>
              {/* Hero title preview */}
              <h3 className="text-lg font-black leading-tight" style={{ color: tp.headingColor, fontWeight: tp.headingWeight, fontSize: tp.headingSize ? `${tp.headingSize * 0.5}px` : undefined }}>
                HSE & <span style={{ color: tp.accentColor }}>Engineering</span>
              </h3>
              {/* Paragraph preview */}
              <p className="text-xs leading-relaxed" style={{ color: previewCardText, fontWeight: tp.bodyWeight, lineHeight: tp.lineHeight, letterSpacing: tp.letterSpacing }}>
                Bridging 7 years of IT infrastructure experience with modern Health & Safety engineering to build practical applications.
              </p>
              {/* Button preview */}
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: tp.buttonBackgroundColor || tp.accentColor, color: tp.buttonTextColor || (tp.accentText || '#000'), borderRadius: tp.buttonRadius }}>
                  View Projects
                </div>
                <div className="px-4 py-2 rounded-lg text-xs font-bold border" style={{ borderColor: tp.borderColor, color: previewTextColor, borderRadius: tp.buttonRadius }}>
                  Contact Me
                </div>
              </div>
              {/* Card preview */}
              <div className="p-4 rounded-xl border space-y-2" style={{ borderColor: tp.borderColor, background: `rgba(255,255,255,${tp.glassOpacity || 0.03})`, backdropFilter: `blur(${tp.blurStrength || 16}px)`, borderRadius: tp.cardRadius }}>
                <h5 className="text-xs font-bold" style={{ color: previewTextColor }}>Project Card</h5>
                <p className="text-[10px]" style={{ color: previewCardText }}>Safety management system built with React and Firestore.</p>
              </div>
              {/* Input preview */}
              <input placeholder="Email address" readOnly className="w-full p-3 rounded-lg text-xs border outline-none" style={{ borderColor: tp.borderColor, background: tp.inputBackground || 'rgba(0,0,0,0.3)', color: previewInputText, borderRadius: tp.buttonRadius }} />
            </div>
          );
        })()}

        {activeTab === 'backgroundBuilder' && (() => {
          const tp = formData.themeProfiles?.[themeStudioSelectedTheme] || THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] || {};
          const layerNames = ['grid', 'itNetwork', 'aiNodes', 'safetyGeometry', 'blueprint', 'lightRays'];
          const layerLabels = { grid: 'Engineering Grid', itNetwork: 'IT Network', aiNodes: 'AI Nodes', safetyGeometry: 'Safety Geometry', blueprint: 'Blueprint', lightRays: 'Light Rays' };
          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[var(--text-secondary)] tracking-wider">
                <span>{t.cms?.backgroundPreview || 'Background Preview'}</span>
                <span className={tp.backgroundEnabled !== false ? 'text-[var(--status-green)]' : 'text-[var(--status-red)]'}>{tp.backgroundEnabled !== false ? 'ON' : 'OFF'}</span>
              </div>
              <div className="p-4 rounded-xl border min-h-[160px] relative overflow-hidden flex items-center justify-center" style={{ borderColor: tp.borderColor, background: tp.cardBackground }}>
                <div className="absolute inset-0 opacity-[0.08]" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />
                <div className="relative z-10 text-center">
                  <div className="text-[18px] font-black uppercase tracking-widest" style={{ color: tp.accentColor }}>LIVE</div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-1">{layerLabels[layerNames[0]]}: ×{(tp.layerOpacities?.grid ?? 0.08).toFixed(2)}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{layerLabels[layerNames[1]]}: ×{(tp.layerOpacities?.itNetwork ?? 0.12).toFixed(2)}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{layerLabels[layerNames[2]]}: ×{(tp.layerOpacities?.aiNodes ?? 0.1).toFixed(2)}</div>
                </div>
              </div>
            </div>
          );
        })()}

        {activeTab === 'translations' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-2">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms.previewTranslation}</span>
            <div className="text-xs text-[var(--text-primary)]"><span className="opacity-55">workTitle:</span> "{formData.translations?.[lang]?.workTitle || ''}"</div>
            <div className="text-xs text-[var(--text-primary)]"><span className="opacity-55">footerText:</span> "{formData.translations?.[lang]?.footerText || ''}"</div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-center space-y-2">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms.previewBranding}</span>
            <div className="text-xl font-bold tracking-widest text-[var(--text-primary)] animate-pulse uppercase">{formData.mediaBranding?.preloaderLogo || formData.brandIdentity?.preloaderText?.en || 'OKASH'}</div>
          </div>
        )}

        {activeTab === 'brandIdentity' && (
          <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-left space-y-2 text-xs">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block text-center border-b border-[var(--border-color)] pb-1 mb-2">
              {t.cms?.sidebarBrandIdentity || 'Brand Identity'}
            </span>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityArabicName}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.brandName?.ar || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityEnglishName}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.brandName?.en || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityUrduName}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.brandName?.ur || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityShortName}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.shortName?.[lang] || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentitySubtitle}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.subtitle?.[lang] || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityNavbarLogo}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.logoText?.[lang] || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityHeroDisplay}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.heroName?.[lang] || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityFooterText}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.footerText?.[lang] || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityPreloaderText}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.preloaderText?.[lang] || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityBrowserTitle}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.browserTitle?.[lang] || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentitySeoTitle}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.seoTitle?.[lang] || 'N/A'}</span></div>
            <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentitySeoDescription}</strong> <span className="text-[var(--text-primary)] font-light block mt-1">{formData.brandIdentity?.seoDescription?.[lang] || 'N/A'}</span></div>
          </div>
        )}

      </div>
    </div>
  );
});
