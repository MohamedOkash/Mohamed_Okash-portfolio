import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { DEFAULT_PORTFOLIO_DATA } from '../../data/constants';
import { translations } from '../../data/translations';
import { Shield, Languages, SunMoon, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLanguage } = useLanguageStore();
  const { activeTheme, setTheme } = useThemeStore();
  const { user, logout, setLoginModalOpen } = useAuthStore();
  const { data } = usePortfolioStore();
  
  const [scrolled, setScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const langTimeoutRef = useRef(null);
  const themeTimeoutRef = useRef(null);
  const langRef = useRef(null);
  const themeRef = useRef(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    setCanHover(mediaQuery.matches);
    const handler = (e) => setCanHover(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync theme with document class/attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // Handle Logo triple click to trigger admin login modal
  const handleLogoClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setLoginModalOpen(true);
        return 0;
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  // Click outside & Escape key handlers
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
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
      if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
      if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
    };
  }, []);

  // Hover delay triggers
  const handleLangEnter = () => {
    if (!canHover) return;
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    setIsLangOpen(true);
  };
  const handleLangLeave = () => {
    if (!canHover) return;
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    langTimeoutRef.current = setTimeout(() => {
      setIsLangOpen(false);
    }, 400); // 400ms grace period to cross the gap
  };

  const handleThemeEnter = () => {
    if (!canHover) return;
    if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
    setIsThemeOpen(true);
  };
  const handleThemeLeave = () => {
    if (!canHover) return;
    if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
    themeTimeoutRef.current = setTimeout(() => {
      setIsThemeOpen(false);
    }, 400); // 400ms grace period to cross the gap
  };

  const toggleLang = (e) => {
    e.stopPropagation();
    setIsLangOpen((prev) => !prev);
    setIsThemeOpen(false);
  };

  const toggleTheme = (e) => {
    e.stopPropagation();
    setIsThemeOpen((prev) => !prev);
    setIsLangOpen(false);
  };

  const handleScrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (data?.websiteStructure && data.websiteStructure.navbarVisible === false) {
    return null;
  }

  const sectionsList = data?.websiteStructure?.sections || DEFAULT_PORTFOLIO_DATA.websiteStructure.sections;
  const logoTextVal = data?.brandIdentity?.logoText?.[lang] || (lang === 'ar' ? 'محمد عكاش' : lang === 'ur' ? 'محمد عکاش' : 'Mohamed Okash');

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-4 bg-[var(--bg)]/70 border-b border-[var(--border)] backdrop-blur-xl shadow-lg' 
        : 'py-6 bg-transparent'
    }`}>
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300" style={{
        width: scrolled ? '100%' : '0%'
      }} />

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand Name */}
        <div 
          onClick={() => {
            navigate('/');
            handleLogoClick();
          }} 
          className="cursor-pointer font-extrabold text-xl md:text-2xl tracking-tight text-gradient select-none"
        >
          {logoTextVal}
        </div>

        {/* Section Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
          {sectionsList
            .filter(sect => sect.visible && sect.id !== 'contact' && sect.id !== 'hero')
            .map(sect => (
              <button 
                key={sect.id} 
                onClick={() => handleScrollToSection(sect.id)} 
                className="hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                {sect.title?.[lang] || sect.title?.en}
              </button>
            ))
          }
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div 
            ref={langRef}
            className="relative lang-selector-container"
            onMouseEnter={handleLangEnter}
            onMouseLeave={handleLangLeave}
          >
            <button 
              onClick={toggleLang}
              aria-haspopup="true"
              aria-expanded={isLangOpen}
              className="p-3 rounded-xl border border-[var(--border)] bg-white/[0.02] hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
              title="Change Language"
            >
              <Languages className="w-5 h-5 text-white/80" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <div className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} pt-2 z-50`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#050505]/95 backdrop-blur-xl border border-[var(--border)] rounded-xl py-2 px-1.5 min-w-[140px] shadow-2xl flex flex-col gap-0.5"
                  >
                    <button 
                      onClick={() => { setLanguage('ar'); setIsLangOpen(false); }} 
                      className={`w-full text-right px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${lang === 'ar' ? 'text-[var(--primary)] font-bold bg-white/[0.04]' : 'text-white/70'}`}
                    >
                      <span>العربية</span>
                      {lang === 'ar' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </button>
                    <button 
                      onClick={() => { setLanguage('en'); setIsLangOpen(false); }} 
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${lang === 'en' ? 'text-[var(--primary)] font-bold bg-white/[0.04]' : 'text-white/70'}`}
                    >
                      <span>English</span>
                      {lang === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </button>
                    <button 
                      onClick={() => { setLanguage('ur'); setIsLangOpen(false); }} 
                      className={`w-full text-right px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${lang === 'ur' ? 'text-[var(--primary)] font-bold bg-white/[0.04]' : 'text-white/70'}`}
                    >
                      <span>اردو</span>
                      {lang === 'ur' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Selector */}
          <div 
            ref={themeRef}
            className="relative theme-selector-container"
            onMouseEnter={handleThemeEnter}
            onMouseLeave={handleThemeLeave}
          >
            <button 
              onClick={toggleTheme}
              aria-haspopup="true"
              aria-expanded={isThemeOpen}
              className="p-3 rounded-xl border border-[var(--border)] bg-white/[0.02] hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
              title="Change Theme"
            >
              <SunMoon className="w-5 h-5 text-white/80" />
            </button>
            <AnimatePresence>
              {isThemeOpen && (
                <div className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} pt-2 z-50`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#050505]/95 backdrop-blur-xl border border-[var(--border)] rounded-xl py-2 px-1.5 min-w-[190px] shadow-2xl flex flex-col gap-0.5"
                  >
                    <button 
                      onClick={() => { setTheme('dark'); setIsThemeOpen(false); }} 
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${activeTheme === 'dark' ? 'text-[var(--primary)] font-bold bg-white/[0.04]' : 'text-white/70'}`}
                    >
                      <span>Obsidian Liquid</span>
                      {activeTheme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </button>
                    <button 
                      onClick={() => { setTheme('ocean'); setIsThemeOpen(false); }} 
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${activeTheme === 'ocean' ? 'text-[var(--primary)] font-bold bg-white/[0.04]' : 'text-white/70'}`}
                    >
                      <span>Deep Ocean</span>
                      {activeTheme === 'ocean' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </button>
                    <button 
                      onClick={() => { setTheme('aurora'); setIsThemeOpen(false); }} 
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${activeTheme === 'aurora' ? 'text-[var(--primary)] font-bold bg-white/[0.04]' : 'text-white/70'}`}
                    >
                      <span>Aurora Green</span>
                      {activeTheme === 'aurora' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </button>
                    <button
                      onClick={() => { setTheme('platinum'); setIsThemeOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${activeTheme === 'platinum' ? 'text-[var(--primary)] font-bold bg-white/[0.04]' : 'text-white/70'}`}
                    >
                      <span>Platinum White</span>
                      {activeTheme === 'platinum' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </button>
                    <button
                      onClick={() => { setTheme('midnight'); setIsThemeOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${activeTheme === 'midnight' ? 'text-[var(--primary)] font-bold bg-white/[0.04]' : 'text-white/70'}`}
                    >
                      <span>Midnight Purple</span>
                      {activeTheme === 'midnight' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Panel Access / Logout */}
          {user && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="p-2.5 rounded-xl border border-[var(--border)] bg-white/[0.02] hover:bg-white/[0.08] text-[var(--primary)] cursor-pointer flex items-center justify-center"
                title="CMS Dashboard"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={() => logout()} 
                className="p-2.5 rounded-xl border border-[var(--border)] bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer flex items-center justify-center"
                title="Log Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
