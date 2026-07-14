import { useEffect } from 'react';
import { useBackgroundThemeStore } from '../store/backgroundThemeStore';

/**
 * Watches every element carrying [data-section-id] and reports whichever one
 * has the greatest intersection with a horizontal band around viewport center.
 * Runs once at the app root — one observer for the whole page, not per-section,
 * to keep this cheap regardless of how many sections exist.
 */
export const useSectionThemeObserver = () => {
  const setActiveSection = useBackgroundThemeStore((s) => s.setActiveSection);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('[data-section-id]'));
    if (targets.length === 0) return undefined;

    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.getAttribute('data-section-id'), entry.intersectionRatio);
        });

        let bestId = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) setActiveSection(bestId);
      },
      {
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
        rootMargin: '-35% 0px -35% 0px'
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [setActiveSection]);
};
