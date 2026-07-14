import { create } from 'zustand';

/**
 * Holds which section is currently dominant in the viewport.
 * CinematicBackground reads this to pick a visual "mode" (grid/circuit/radar/etc).
 * Kept separate from themeStore (color theme) because this concerns motion/shape, not palette.
 */
export const useBackgroundThemeStore = create((set) => ({
  activeSectionId: 'hero',
  setActiveSection: (id) => set((state) => (state.activeSectionId === id ? state : { activeSectionId: id })),
}));
