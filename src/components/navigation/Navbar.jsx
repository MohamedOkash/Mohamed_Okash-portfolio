import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { DEFAULT_PORTFOLIO_DATA } from '../../data/constants';
import { translations } from '../../data/translations';
import { Languages, SunMoon, LogOut, LayoutDashboard } from 'lucide-react';

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
  const [clickCount, setClickCount] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const langRef = useRef(null);
  const themeRef = useRef(null);

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
    <nav className="fixed top-4 inset-x-0 z-50 px-4" aria-label="Primary navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] flex justify-between items-center">
        <button
          onClick={() => {
            navigate('/');
            handleLogoClick();
          }}
          className="cursor-pointer font-black text-lg md:text-xl tracking-[-0.04em] text-[var(--text-primary)] select-none"
          aria-label={logoTextVal}
        >
          {logoTextVal}
        </button>

        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-[var(--text-secondary)]">
          {sectionsList
            .filter((sect) => sect.visible && sect.id !== 'contact' && sect.id !== 'hero')
            .slice(0, 6)
            .map((sect) => (
              <button
                key={sect.id}
                onClick={() => handleScrollToSection(sect.id)}
                className="hover:text-[var(--accent-color)] transition-colors cursor-pointer"
              >
                {sect.title?.[lang] || sect.title?.en}
              </button>
            ))}
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
              className="p-3 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)] hover:text-[var(--accent-color)] active:scale-95 transition-all cursor-pointer"
            >
              <Languages className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <div className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} pt-2 z-50`}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-2 px-1.5 min-w-[140px] flex flex-col gap-0.5"
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
                        className={`w-full px-4 py-3 text-sm rounded-xl hover:bg-[var(--surface-hover)] transition-colors cursor-pointer flex items-center justify-between ${lang === code ? 'text-[var(--accent-color)] font-bold bg-[var(--surface-hover)]' : 'text-[var(--text-secondary)]'}`}
                      >
                        <span>{label}</span>
                        {lang === code && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />}
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
              className="p-3 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)] hover:text-[var(--accent-color)] active:scale-95 transition-all cursor-pointer"
            >
              <SunMoon className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {isThemeOpen && (
                <div className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} pt-2 z-50`}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-2 px-1.5 min-w-[170px] flex flex-col gap-0.5"
                  >
                    {THEMES.map(([theme, label]) => (
                      <button
                        key={theme}
                        onClick={() => {
                          setTheme(theme);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-sm rounded-xl hover:bg-[var(--surface-hover)] transition-colors cursor-pointer flex items-center justify-between ${activeTheme === theme ? 'text-[var(--accent-color)] font-bold bg-[var(--surface-hover)]' : 'text-[var(--text-secondary)]'}`}
                      >
                        <span>{label}</span>
                        {activeTheme === theme && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />}
                      </button>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/admin/dashboard')}
                aria-label={t.cms?.ariaOpenDashboard || 'Open Dashboard'}
                className="p-3 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--accent-color)] cursor-pointer"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => logout()}
                aria-label={t.cms?.logOut || 'Log Out'}
                className="p-3 rounded-full border border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});
