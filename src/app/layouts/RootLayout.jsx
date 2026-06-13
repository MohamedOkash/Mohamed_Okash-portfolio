import React from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

export const RootLayout = ({ children }) => {
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[var(--primary)] selection:text-[var(--accent-text)]">
      {/* Premium Ambient Floating Blobs for Liquid Glass Aesthetics */}
      <div className="absolute top-0 inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] md:blur-[160px] opacity-45 mix-blend-screen animate-float-1 bg-[var(--blob1)]" />
        <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] md:blur-[160px] opacity-45 mix-blend-screen animate-float-2 bg-[var(--blob2)]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[120px] md:blur-[160px] opacity-45 mix-blend-screen animate-float-3 bg-[var(--blob3)]" />
      </div>

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
            &copy; {new Date().getFullYear()} {t.name}. All Rights Reserved.
          </p>
          <p className="text-sm opacity-40 mt-2 md:mt-0 font-light">
            {t.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
};
