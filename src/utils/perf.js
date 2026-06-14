import { useState, useEffect, useRef, useCallback } from 'react';

export const useRAFCounter = (target, { duration = 1200, enabled = true } = {}) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const startValRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const end = parseInt(target, 10);
    if (isNaN(end) || end <= 0) {
      setCount(end || 0);
      return;
    }

    startRef.current = null;
    startValRef.current = 0;

    const animate = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * end);
      setCount(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setCount(end);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, enabled]);

  return count;
};

export const usePerformance = () => {
  const [mode, setMode] = useState('balanced');
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReducedMotion(reducedMotion);

    const memory = navigator.deviceMemory;
    const cores = navigator.hardwareConcurrency;
    const lowEnd = reducedMotion || (touch && (!cores || cores <= 4)) || (memory && memory <= 4);
    setIsLowEnd(lowEnd);

    if (reducedMotion) setMode('performance');
    else if (lowEnd) setMode('balanced');
    else setMode('ultra');

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    reducedMotionQuery.addEventListener('change', handler);
    return () => reducedMotionQuery.removeEventListener('change', handler);
  }, []);

  return { mode, isLowEnd, isTouch, prefersReducedMotion };
};

export const isPointerFine = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
};

export const useTabVisibility = () => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const handler = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  return hidden;
};
