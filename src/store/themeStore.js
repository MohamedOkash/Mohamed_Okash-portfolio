import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  activeTheme: localStorage.getItem('portfolio-theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('portfolio-theme', theme);
    set({ activeTheme: theme });
  },
}));
