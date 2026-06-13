import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { translations } from '../../data/translations';
import { Shield, Languages, SunMoon, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLanguage } = useLanguageStore();
  const { activeTheme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-4 bg-black/40 border-b border-[var(--border)] backdrop-blur-xl' 
        : 'py-6 bg-transparent'
    }`}>
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300" style={{
        width: scrolled ? '100%' : '0%'
      }} />

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand Name */}
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer font-extrabold text-xl md:text-2xl tracking-tight text-gradient"
        >
          {t.name}
        </div>

        {/* Section Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
          <button onClick={() => handleScrollToSection('hero')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">{lang === 'ar' ? 'الرئيسية' : lang === 'ur' ? 'ہوم' : 'Home'}</button>
          <button onClick={() => handleScrollToSection('why-me')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">{lang === 'ar' ? 'لماذا أنا' : lang === 'ur' ? 'میرا انتخاب کیوں' : 'Why Me'}</button>
          <button onClick={() => handleScrollToSection('projects')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">{lang === 'ar' ? 'مشاريعي' : lang === 'ur' ? 'پروڈکٹس' : 'Projects'}</button>
          <button onClick={() => handleScrollToSection('experience')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">{lang === 'ar' ? 'الخبرات' : lang === 'ur' ? 'تجربہ' : 'Experience'}</button>
          <button onClick={() => handleScrollToSection('certifications')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">{lang === 'ar' ? 'الشهادات' : lang === 'ur' ? 'سندیں' : 'Credentials'}</button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative group">
            <button className="p-2.5 rounded-xl border border-[var(--border)] bg-white/[0.02] hover:bg-white/[0.08] transition-all cursor-pointer">
              <Languages className="w-4.5 h-4.5" />
            </button>
            <div className={`absolute top-full mt-2 ${isRtl ? 'left-0' : 'right-0'} hidden group-hover:block bg-black/90 border border-[var(--border)] rounded-xl py-2 px-1 min-w-[120px] shadow-2xl`}>
              <button onClick={() => setLanguage('ar')} className={`w-full text-right px-4 py-2 text-xs rounded-lg hover:bg-white/10 ${lang === 'ar' ? 'text-[var(--primary)] font-bold' : ''}`}>العربية</button>
              <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-white/10 ${lang === 'en' ? 'text-[var(--primary)] font-bold' : ''}`}>English</button>
              <button onClick={() => setLanguage('ur')} className={`w-full text-right px-4 py-2 text-xs rounded-lg hover:bg-white/10 ${lang === 'ur' ? 'text-[var(--primary)] font-bold' : ''}`}>اردو</button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="relative group">
            <button className="p-2.5 rounded-xl border border-[var(--border)] bg-white/[0.02] hover:bg-white/[0.08] transition-all cursor-pointer">
              <SunMoon className="w-4.5 h-4.5" />
            </button>
            <div className={`absolute top-full mt-2 ${isRtl ? 'left-0' : 'right-0'} hidden group-hover:block bg-black/90 border border-[var(--border)] rounded-xl py-2 px-1 min-w-[150px] shadow-2xl`}>
              <button onClick={() => setTheme('dark')} className={`w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-white/10 ${activeTheme === 'dark' ? 'text-[var(--primary)] font-bold' : ''}`}>Obsidian Liquid</button>
              <button onClick={() => setTheme('ocean')} className={`w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-white/10 ${activeTheme === 'ocean' ? 'text-[var(--primary)] font-bold' : ''}`}>Deep Ocean</button>
              <button onClick={() => setTheme('aurora')} className={`w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-white/10 ${activeTheme === 'aurora' ? 'text-[var(--primary)] font-bold' : ''}`}>Neon Aurora</button>
            </div>
          </div>

          {/* Admin Panel Access / Logout */}
          {user ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="p-2.5 rounded-xl border border-[var(--border)] bg-white/[0.02] hover:bg-white/[0.08] text-[var(--primary)] cursor-pointer"
                title="CMS Dashboard"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={() => logout()} 
                className="p-2.5 rounded-xl border border-[var(--border)] bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/admin/login')} 
              className="p-2.5 rounded-xl border border-[var(--border)] bg-white/[0.02] hover:bg-white/[0.08] opacity-60 hover:opacity-100 cursor-pointer"
              title="Admin Login"
            >
              <Shield className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
