import React, { useEffect } from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { CinematicBackground } from '../../components/ui/CinematicBackground';
import { CustomCursor } from '../../components/ui/CustomCursor';
import { useThemeStore } from '../../store/themeStore';
import { useSectionThemeObserver } from '../../hooks/useSectionThemeObserver';

export const RootLayout = ({ children }) => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const { activeTheme, setTheme } = useThemeStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  useSectionThemeObserver();

  const themeSettings = data?.themeSettings;
  const themeProfiles = data?.themeProfiles;
  const currentTheme = activeTheme || themeSettings?.defaultTheme || 'dark';
  const isLightTheme = currentTheme === 'platinum';
  const activeProfile = themeProfiles?.[currentTheme] || themeSettings || {};

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (!saved && themeSettings?.defaultTheme) {
      setTheme(themeSettings.defaultTheme);
    }
  }, [themeSettings?.defaultTheme, setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const themeStyles = {
    '--primary': activeProfile.accentColor || '#ffffff',
    '--accent': activeProfile.accentColor || '#ffffff',
    '--accent-text': isLightTheme ? '#ffffff' : (activeProfile.accentText || '#000000'),
    '--glass-opacity': activeProfile.glassOpacity !== undefined ? activeProfile.glassOpacity : 0.03,
    '--border-opacity': activeProfile.borderOpacity !== undefined ? activeProfile.borderOpacity : 0.06,
    '--blur-strength': `${activeProfile.blurStrength !== undefined ? activeProfile.blurStrength : 16}px`,
    '--glow-intensity': activeProfile.glowIntensity !== undefined ? activeProfile.glowIntensity : 0.2,
    '--bg-intensity': activeProfile.bgIntensity !== undefined ? activeProfile.bgIntensity : 0.1,
    '--font-family-setting': activeProfile.fontFamily ? `'${activeProfile.fontFamily}', var(--font-sans)` : 'var(--font-sans)',
    '--font-scale-setting': activeProfile.fontScale !== undefined ? activeProfile.fontScale : 1.0,
    '--heading-size-setting': `${activeProfile.headingSize || 48}px`,
    '--paragraph-size-setting': `${activeProfile.paragraphSize || 16}px`,
    '--heading-weight-setting': activeProfile.headingWeight || '800',
    '--body-weight-setting': activeProfile.bodyWeight || (isLightTheme ? '400' : '300'),
    '--font-color-setting': isLightTheme ? 'var(--text-primary)' : (activeProfile.fontColor || 'var(--text-primary)'),
    '--heading-color-setting': isLightTheme ? 'var(--text-primary)' : (activeProfile.headingColor || 'var(--text-primary)'),
    '--letter-spacing-setting': activeProfile.letterSpacing || 'normal',
    '--line-height-setting': activeProfile.lineHeight || '1.6',
    '--paragraph-width-setting': activeProfile.paragraphWidth || '65ch',
    '--button-text-color-setting': isLightTheme ? '#ffffff' : (activeProfile.buttonTextColor || 'var(--accent-text)'),
    '--button-background-color-setting': isLightTheme ? 'var(--accent-color)' : (activeProfile.buttonBackgroundColor || 'var(--accent)'),
    '--card-title-color-setting': isLightTheme ? 'var(--text-primary)' : (activeProfile.cardTitleColor || 'var(--heading-color-setting)'),
    '--card-description-color-setting': isLightTheme ? 'var(--text-secondary)' : (activeProfile.cardDescriptionColor || 'var(--muted)')
  };

  const copyrightName = lang === 'en'
    ? (data?.brandIdentity?.shortName?.en || 'Okash')
    : (data?.brandIdentity?.footerText?.[lang] || data?.brandIdentity?.brandName?.[lang] || t.name);
  const socialLinks = data?.general?.socialLinks || {};

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-x-hidden selection:bg-[var(--accent-color)] selection:text-[var(--accent-text)]"
      style={themeStyles}
    >
      <a href="#main-content" className="skip-to-content">
        {lang === 'ar' ? 'تخطى إلى المحتوى الرئيسي' : lang === 'ur' ? 'مرکزی مواد پر جائیں' : 'Skip to main content'}
      </a>

      <CinematicBackground />
      <CustomCursor />
      <Navbar />

      <main id="main-content" className="relative z-10 pt-24 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      <footer className="relative z-10 border-t border-[var(--border-color)] py-10 mt-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-6 text-center md:flex md:justify-between md:items-center gap-6">
          <p className="text-sm text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} {copyrightName}. {data?.translations?.[lang]?.allRightsReserved || t.allRightsReserved || 'All Rights Reserved.'}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 md:mt-0 text-sm text-[var(--text-secondary)]">
            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-[var(--accent-color)] transition-colors">GitHub</a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--accent-color)] transition-colors">LinkedIn</a>}
            {socialLinks.whatsapp && <a href={`https://wa.me/${socialLinks.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-[var(--accent-color)] transition-colors">WhatsApp</a>}
          </div>
        </div>
      </footer>
    </div>
  );
};
