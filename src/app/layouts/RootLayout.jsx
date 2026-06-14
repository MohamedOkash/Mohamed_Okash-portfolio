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
  const configuredTheme = themeSettings?.defaultTheme || activeTheme || 'dark';

  useEffect(() => {
    setTheme(configuredTheme);
  }, [configuredTheme, setTheme]);

  const themeStyles = themeSettings ? {
    '--primary': themeSettings.accentColor || '#ffffff',
    '--accent': themeSettings.accentColor || '#ffffff',
    '--accent-text': '#000000',
    '--glass-opacity': themeSettings.glassOpacity !== undefined ? themeSettings.glassOpacity : 0.03,
    '--border-opacity': themeSettings.borderOpacity !== undefined ? themeSettings.borderOpacity : 0.06,
    '--blur-strength': `${themeSettings.blurStrength !== undefined ? themeSettings.blurStrength : 16}px`,
    '--glow-intensity': themeSettings.glowIntensity !== undefined ? themeSettings.glowIntensity : 0.2,
    '--bg-intensity': themeSettings.bgIntensity !== undefined ? themeSettings.bgIntensity : 0.1,
    
    // Typography controls
    '--font-family-setting': themeSettings.fontFamily ? `'${themeSettings.fontFamily}', var(--font-sans)` : 'var(--font-sans)',
    '--font-scale-setting': themeSettings.fontScale !== undefined ? themeSettings.fontScale : 1.0,
    '--heading-size-setting': `${themeSettings.headingSize || 48}px`,
    '--paragraph-size-setting': `${themeSettings.paragraphSize || 16}px`,
    '--heading-weight-setting': themeSettings.headingWeight || '800',
    '--body-weight-setting': themeSettings.bodyWeight || '300',
    '--font-color-setting': themeSettings.fontColor || '#fafafa',
    '--heading-color-setting': themeSettings.headingColor || '#fafafa',
    '--letter-spacing-setting': themeSettings.letterSpacing || 'normal',
    '--line-height-setting': themeSettings.lineHeight || '1.6',
    '--paragraph-width-setting': themeSettings.paragraphWidth || '65ch',
    '--button-text-color-setting': themeSettings.buttonTextColor || 'var(--accent-text)',
    '--button-background-color-setting': themeSettings.buttonBackgroundColor || 'var(--accent)',
    '--card-title-color-setting': themeSettings.cardTitleColor || 'var(--heading-color-setting)',
    '--card-description-color-setting': themeSettings.cardDescriptionColor || 'var(--muted)'
  } : {};

  const blobOpacity = themeSettings?.bgIntensity !== undefined ? themeSettings.bgIntensity : 0.45;
  const copyrightName = data?.brandIdentity?.footerText?.[lang] || (lang === 'ar' ? 'محمد عكاش' : lang === 'ur' ? 'محمد عکاش' : 'Mohamed Okash');
  const footerTextVal = data?.translations?.[lang]?.footerText || t.footerText;

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative min-h-screen overflow-x-hidden selection:bg-[var(--primary)] selection:text-[var(--accent-text)]"
      style={themeStyles}
    >
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
      <main className="relative z-10 pt-24 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] py-8 mt-20 bg-black/20 backdrop-blur-md">
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
