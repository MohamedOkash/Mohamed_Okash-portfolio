import { create } from 'zustand';
import { translations } from '../data/translations';

export const useLanguageStore = create((set) => ({
  lang: localStorage.getItem('portfolio-lang') || 'ar',
  setLanguage: (lang) => {
    localStorage.setItem('portfolio-lang', lang);
    const dir = translations[lang]?.dir || 'rtl';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    set({ lang });
  },
}));
