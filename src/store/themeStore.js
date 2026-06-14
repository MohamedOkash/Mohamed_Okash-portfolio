import { create } from 'zustand';

export const SUPPORTED_THEMES = ['dark', 'ocean', 'aurora', 'platinum', 'midnight'];

const normalizeTheme = (theme) => SUPPORTED_THEMES.includes(theme) ? theme : 'dark';
const savedTheme = normalizeTheme(localStorage.getItem('portfolio-theme'));

export const useThemeStore = create((set) => ({
  activeTheme: savedTheme,
  setTheme: (theme) => {
    const normalizedTheme = normalizeTheme(theme);
    localStorage.setItem('portfolio-theme', normalizedTheme);
    document.documentElement.dataset.theme = normalizedTheme;
    console.log('Current Theme:', normalizedTheme);
    console.log('Saved Theme:', localStorage.getItem('portfolio-theme'));
    console.log('Applied Theme:', document.documentElement.dataset.theme);
    set({ activeTheme: normalizedTheme });
  },
}));
