import React, { useEffect, useRef, useState } from 'react';
import { Pointer } from 'lucide-react';
import { isPointerFine } from '../../utils/perf';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]';

/**
 * Hand-pointer cursor: follows the mouse with a light spring lag, tilts a few
 * degrees based on movement direction, glows behind interactive elements, and
 * "presses" (scales down) on click. Desktop-only (pointer: fine) and skipped
 * entirely under prefers-reduced-motion.
 */
export const CustomCursor = React.memo(() => {
  const [enabled, setEnabled] = useState(false);
  const wrapRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const angleRef = useRef(-28);
  const hoveringRef = useRef(false);
  const scaleRef = useRef(1);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isPointerFine() || reducedMotion) return undefined;
    setEnabled(true);

    const handleMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const handleOver = (e) => {
      hoveringRef.current = Boolean(e.target.closest(INTERACTIVE_SELECTOR));
    };

    const handleDown = () => wrapRef.current?.classList.add('hand-cursor--press');
    const handleUp = () => wrapRef.current?.classList.remove('hand-cursor--press');

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;

      const dx = pos.current.x - lastPos.current.x;
      const dy = pos.current.y - lastPos.current.y;
      const speed = Math.hypot(dx, dy);
      if (speed > 0.6) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;
        angleRef.current += (targetAngle - angleRef.current) * 0.18;
      }
      lastPos.current.x = pos.current.x;
      lastPos.current.y = pos.current.y;

      const targetScale = hoveringRef.current ? 1.3 : 1;
      scaleRef.current += (targetScale - scaleRef.current) * 0.18;

      if (wrapRef.current) {
        wrapRef.current.style.transform =
          `translate3d(${pos.current.x - 4}px, ${pos.current.y - 4}px, 0) rotate(${angleRef.current}deg) scale(${scaleRef.current})`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x - 26}px, ${pos.current.y - 26}px, 0)`;
        glowRef.current.style.opacity = hoveringRef.current ? '0.5' : '0.22';
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerover', handleOver, { passive: true });
    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup', handleUp);
    rafRef.current = requestAnimationFrame(animate);
    document.documentElement.classList.add('has-custom-cursor');

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-13 h-13 rounded-full pointer-events-none z-[9997] blur-md transition-opacity duration-200"
        style={{ width: 52, height: 52, backgroundColor: 'var(--accent-color)', opacity: 0.22, willChange: 'transform' }}
      />
      <div
        ref={wrapRef}
        aria-hidden="true"
        className="hand-cursor fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ willChange: 'transform' }}
      >
        <Pointer
          className="w-5 h-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
          style={{ color: 'var(--accent-color)' }}
          strokeWidth={2.25}
          fill="var(--bg-primary)"
          fillOpacity={0.35}
        />
      </div>
    </>
  );
});
