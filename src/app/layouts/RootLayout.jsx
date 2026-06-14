import React, { useEffect } from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { CinematicBackground } from '../../components/ui/CinematicBackground';
import { useThemeStore } from '../../store/themeStore';

export const RootLayout = ({ children }) => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const { activeTheme, setTheme } = useThemeStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  const themeSettings = data?.themeSettings;
  const themeProfiles = data?.themeProfiles;
  const configuredTheme = themeSettings?.defaultTheme || activeTheme || 'dark';
  const isLightTheme = configuredTheme === 'platinum';

  useEffect(() => {
    setTheme(configuredTheme);
  }, [configuredTheme, setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  // Use per-theme profile if available, fall back to shared themeSettings
  const activeProfile = themeProfiles?.[configuredTheme] || themeSettings || {};

  const themeStyles = {
    '--primary': activeProfile.accentColor || '#ffffff',
    '--accent': activeProfile.accentColor || '#ffffff',
    '--accent-text': isLightTheme ? '#0f172a' : '#000000',
    '--glass-opacity': activeProfile.glassOpacity !== undefined ? activeProfile.glassOpacity : 0.03,
    '--border-opacity': activeProfile.borderOpacity !== undefined ? activeProfile.borderOpacity : 0.06,
    '--blur-strength': `${activeProfile.blurStrength !== undefined ? activeProfile.blurStrength : 16}px`,
    '--glow-intensity': activeProfile.glowIntensity !== undefined ? activeProfile.glowIntensity : 0.2,
    '--bg-intensity': activeProfile.bgIntensity !== undefined ? activeProfile.bgIntensity : 0.1,
    
    // Typography controls
    '--font-family-setting': activeProfile.fontFamily ? `'${activeProfile.fontFamily}', var(--font-sans)` : 'var(--font-sans)',
    '--font-scale-setting': activeProfile.fontScale !== undefined ? activeProfile.fontScale : 1.0,
    '--heading-size-setting': `${activeProfile.headingSize || 48}px`,
    '--paragraph-size-setting': `${activeProfile.paragraphSize || 16}px`,
    '--heading-weight-setting': activeProfile.headingWeight || '800',
    '--body-weight-setting': activeProfile.bodyWeight || '300',
    '--font-color-setting': isLightTheme ? 'var(--text-primary)' : (activeProfile.fontColor || 'var(--text-primary)'),
    '--heading-color-setting': isLightTheme ? 'var(--text-primary)' : (activeProfile.headingColor || 'var(--text-primary)'),
    '--letter-spacing-setting': activeProfile.letterSpacing || 'normal',
    '--line-height-setting': activeProfile.lineHeight || '1.6',
    '--paragraph-width-setting': activeProfile.paragraphWidth || '65ch',
    '--button-text-color-setting': isLightTheme ? 'var(--accent-text)' : (activeProfile.buttonTextColor || 'var(--accent-text)'),
    '--button-background-color-setting': isLightTheme ? 'var(--accent-color)' : (activeProfile.buttonBackgroundColor || 'var(--accent)'),
    '--card-title-color-setting': isLightTheme ? 'var(--text-primary)' : (activeProfile.cardTitleColor || 'var(--heading-color-setting)'),
    '--card-description-color-setting': isLightTheme ? 'var(--text-secondary)' : (activeProfile.cardDescriptionColor || 'var(--muted)')
  };

  const blobOpacity = activeProfile?.bgIntensity !== undefined ? activeProfile.bgIntensity : 0.45;
  const copyrightName = data?.brandIdentity?.footerText?.[lang] || (lang === 'ar' ? 'محمد عكاش' : lang === 'ur' ? 'محمد عکاش' : 'Mohamed Okash');
  const footerTextVal = data?.translations?.[lang]?.footerText || t.footerText;

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-x-hidden selection:bg-[var(--primary)] selection:text-[var(--accent-text)]"
      style={themeStyles}
    >
      {/* Skip-to-content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        {lang === 'ar' ? 'تخطى إلى المحتوى الرئيسي' : lang === 'ur' ? 'مرکزی مواد پر جائیں' : 'Skip to main content'}
      </a>
      {/* Premium Ambient Floating Blobs for Liquid Glass Aesthetics */}
      <div className="absolute top-0 inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] md:blur-[160px] mix-blend-screen animate-float-1 bg-[var(--blob1)]" style={{ opacity: blobOpacity }} />
        <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] md:blur-[160px] mix-blend-screen animate-float-2 bg-[var(--blob2)]" style={{ opacity: blobOpacity }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[120px] md:blur-[160px] mix-blend-screen animate-float-3 bg-[var(--blob3)]" style={{ opacity: blobOpacity }} />
      </div>

      {/* Cinematic Advanced Background Layer */}
      <CinematicBackground />

      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="relative z-10 pt-24 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] py-8 mt-20 bg-[var(--card-bg)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 text-center md:flex md:justify-between md:items-center">
          <p className="text-sm opacity-60">
            &copy; {new Date().getFullYear()} {copyrightName}. {data?.translations?.[lang]?.allRightsReserved || t.allRightsReserved || 'All Rights Reserved.'}
          </p>
          <p className="text-sm opacity-40 mt-2 md:mt-0 font-light">
            {footerTextVal}
          </p>
        </div>
      </footer>
    </div>
  );
};
