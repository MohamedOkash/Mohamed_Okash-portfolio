import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { DEFAULT_PORTFOLIO_DATA } from '../../data/constants';
import { translations } from '../../data/translations';
import { Languages, SunMoon, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useBackgroundThemeStore } from '../../store/backgroundThemeStore';

const THEMES = [
  ['dark', 'Obsidian'],
  ['ocean', 'Ocean'],
  ['aurora', 'Aurora'],
  ['platinum', 'Platinum'],
  ['midnight', 'Midnight']
];

export const Navbar = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLanguage } = useLanguageStore();
  const { activeTheme, setTheme } = useThemeStore();
  const { user, logout, setLoginModalOpen } = useAuthStore();
  const { data } = usePortfolioStore();
  const activeSectionId = useBackgroundThemeStore((s) => s.activeSectionId);
  const [clickCount, setClickCount] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langRef = useRef(null);
  const themeRef = useRef(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    if (clickCount === 0) return undefined;
    const timer = window.setTimeout(() => setClickCount(0), 1000);
    return () => window.clearTimeout(timer);
  }, [clickCount]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setIsLangOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setIsThemeOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLangOpen(false);
        setIsThemeOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogoClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next === 3) {
        setLoginModalOpen(true);
        return 0;
      }
      return next;
    });
  };

  const handleScrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(scroll, 80);
      return;
    }
    scroll();
  };

  if (data?.websiteStructure && data.websiteStructure.navbarVisible === false) return null;

  const sectionsList = data?.websiteStructure?.sections || DEFAULT_PORTFOLIO_DATA.websiteStructure.sections;
  const logoTextVal = lang === 'en'
    ? (data?.brandIdentity?.shortName?.en || 'Okash')
    : (data?.brandIdentity?.logoText?.[lang] || data?.brandIdentity?.brandName?.[lang] || t.name);

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 md:px-6" aria-label="Primary navigation">
      <div className="nav-glass max-w-5xl mx-auto px-6 py-2.5 rounded-full border border-[var(--border-color)]/30 flex justify-between items-center transition-all duration-300">
        <button
          onClick={() => {
            navigate('/');
            handleLogoClick();
          }}
          className="cursor-pointer flex items-center gap-2 font-black text-lg md:text-xl tracking-[-0.04em] text-[var(--text-primary)] select-none group"
          aria-label={logoTextVal}
        >
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: 'var(--accent-color)' }} />
            <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ backgroundColor: 'var(--accent-color)' }} />
          </span>
          {logoTextVal}
        </button>

        <div className="hidden lg:flex items-center gap-7 text-sm font-bold text-[var(--text-secondary)]">
          {sectionsList
            .filter((sect) => sect.visible && sect.id !== 'contact' && sect.id !== 'hero')
            .slice(0, 6)
            .map((sect) => {
              const isActive = activeSectionId === sect.id;
              return (
                <button
                  key={sect.id}
                  onClick={() => handleScrollToSection(sect.id)}
                  className={`relative py-1 cursor-pointer transition-colors duration-300 ${
                    isActive ? 'text-[var(--accent-color)] font-extrabold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="relative z-10">{sect.title?.[lang] || sect.title?.en}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-[var(--accent-color)] shadow-[0_0_8px_var(--accent-color)] rounded-full z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
        </div>

        <div className="flex items-center gap-2">
          <div ref={langRef} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLangOpen((prev) => !prev);
                setIsThemeOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={isLangOpen}
              aria-label={t.cms?.ariaChangeLanguage || 'Change Language'}
              className="p-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)]/40 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/50 active:scale-95 transition-all cursor-pointer text-[var(--text-secondary)]"
            >
              <Languages className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <div className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} pt-2 z-50`}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-1.5 px-1 min-w-[130px] flex flex-col gap-0.5 shadow-lg backdrop-blur-xl"
                  >
                    {[
                      ['ar', 'العربية'],
                      ['en', 'English'],
                      ['ur', 'اردو']
                    ].map(([code, label]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-xs rounded-xl hover:bg-[var(--surface-hover)] transition-colors cursor-pointer flex items-center justify-between ${lang === code ? 'text-[var(--accent-color)] font-bold bg-[var(--surface-hover)]' : 'text-[var(--text-secondary)]'}`}
                      >
                        <span>{label}</span>
                        {lang === code && <span className="w-1 h-1 rounded-full bg-[var(--accent-color)]" />}
                      </button>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div ref={themeRef} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsThemeOpen((prev) => !prev);
                setIsLangOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={isThemeOpen}
              aria-label={t.cms?.ariaChangeTheme || 'Change Theme'}
              className="p-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)]/40 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/50 active:scale-95 transition-all cursor-pointer text-[var(--text-secondary)]"
            >
              <SunMoon className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isThemeOpen && (
                <div className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} pt-2 z-50`}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-1.5 px-1 min-w-[150px] flex flex-col gap-0.5 shadow-lg backdrop-blur-xl"
                  >
                    {THEMES.map(([theme, label]) => (
                      <button
                        key={theme}
                        onClick={() => {
                          setTheme(theme);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-xs rounded-xl hover:bg-[var(--surface-hover)] transition-colors cursor-pointer flex items-center justify-between ${activeTheme === theme ? 'text-[var(--accent-color)] font-bold bg-[var(--surface-hover)]' : 'text-[var(--text-secondary)]'}`}
                      >
                        <span>{label}</span>
                        {activeTheme === theme && <span className="w-1 h-1 rounded-full bg-[var(--accent-color)]" />}
                      </button>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {user && (
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => navigate('/admin/dashboard')}
                aria-label={t.cms?.ariaOpenDashboard || 'Open Dashboard'}
                className="p-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)]/40 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/50 active:scale-95 transition-all cursor-pointer text-[var(--text-secondary)]"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
              <button
                onClick={() => logout()}
                aria-label={t.cms?.logOut || 'Log Out'}
                className="p-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)]/40 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/50 active:scale-95 transition-all cursor-pointer text-[var(--text-secondary)]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen
              ? (lang === 'ar' ? 'إغلاق القائمة' : lang === 'ur' ? 'مینو بند کریں' : 'Close menu')
              : (lang === 'ar' ? 'فتح القائمة' : lang === 'ur' ? 'مینو کھولیں' : 'Open menu')}
            className="lg:hidden p-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)]/40 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/50 active:scale-95 transition-all cursor-pointer text-[var(--text-primary)]"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden w-full max-w-5xl mx-auto mt-2 rounded-3xl border border-[var(--border-color)]/30 bg-[var(--bg-primary)]/90 backdrop-blur-xl overflow-hidden shadow-lg"
          >
            <div className="p-4 flex flex-col gap-1.5">
              {sectionsList
                .filter((sect) => sect.visible && sect.id !== 'contact' && sect.id !== 'hero')
                .map((sect) => (
                  <button
                    key={sect.id}
                    onClick={() => handleScrollToSection(sect.id)}
                    className="w-full text-start px-4 py-3 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                  >
                    {sect.title?.[lang] || sect.title?.en}
                  </button>
                ))}
              <button
                onClick={() => handleScrollToSection('contact')}
                className="w-full text-start px-4 py-3 rounded-xl text-sm font-bold text-[var(--accent-color)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                {data?.translations?.[lang]?.contactMe || t.contactMe}
              </button>

              {user && (
                <div className="flex items-center gap-2 pt-2 mt-1 border-t border-[var(--border-color)]/25">
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/admin/dashboard'); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-[var(--accent-color)] bg-[var(--surface-hover)] cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t.cms?.ariaOpenDashboard || 'Dashboard'}
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-[var(--text-secondary)] bg-[var(--surface-hover)] cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.cms?.logOut || 'Log Out'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});
