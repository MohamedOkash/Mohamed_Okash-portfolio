import React, { useEffect, useRef } from 'react';
import { usePerformance, useTabVisibility, isPointerFine } from '../../utils/perf';
import { useBackgroundThemeStore } from '../../store/backgroundThemeStore';
import { useThemeStore } from '../../store/themeStore';

/**
 * Maps a section id (data-section-id on each <section>) to a visual "mode".
 * This is the single source of truth tying page content to background behaviour —
 * change it here if a section's meaning changes, nowhere else.
 */
const SECTION_MODE_MAP = {
  hero: 'grid',
  about: 'network',
  'why-me': 'circuit',
  story: 'ambient',
  skills: 'circuit',
  experience: 'scan',
  certifications: 'radar',
  achievements: 'network',
  contact: 'signal'
};

const PARTICLE_COUNTS = { grid: 60, network: 42, circuit: 28, ambient: 20, scan: 24, radar: 34, signal: 46 };

const modeForSection = (id) => SECTION_MODE_MAP[id] || 'grid';

/** Static, non-animated fallback for low-power devices / reduced-motion. */
const StaticFallback = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
    style={{
      background:
        'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent-color) 14%, transparent) 0%, transparent 38%), radial-gradient(circle at 12% 22%, color-mix(in srgb, var(--accent-color) 8%, transparent) 0%, transparent 30%)'
    }}
  >
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage:
          'linear-gradient(to right, var(--border-color) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)',
        backgroundSize: '96px 96px',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 78%, transparent 100%)'
      }}
    />
  </div>
);

// ---- per-mode particle seeding -------------------------------------------------

function seedParticles(mode, width, height, count) {
  if (mode === 'radar' || mode === 'signal') {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.max(width, height) * 0.42 + 20;
      return { angle, radius, baseRadius: radius, speed: (Math.random() - 0.5) * 0.15, life: Math.random(), r: Math.random() * 2.0 + 0.8 };
    });
  }
  if (mode === 'network') {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      r: Math.random() * 1.8 + 1.0
    }));
  }
  if (mode === 'circuit') {
    // particles glide along axis-aligned segments to mimic signal pulses on a board
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      horizontal: Math.random() > 0.5,
      speed: Math.random() * 0.6 + 0.35,
      offset: Math.random() * 1000,
      r: Math.random() * 1.8 + 0.8
    }));
  }
  if (mode === 'scan') {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.6,
      flicker: Math.random() * Math.PI * 2
    }));
  }
  // grid / ambient: rising embers
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2.2 + 0.6,
    vx: (Math.random() - 0.5) * 0.12,
    vy: -Math.random() * (mode === 'ambient' ? 0.08 : 0.18) - 0.03,
    life: Math.random()
  }));
}

// ---- per-mode frame renderers ---------------------------------------------------
// Each receives a shared context object so signatures stay small and consistent.

function drawGridLike(ctx, { width, height, t, gridColor, accentColor, particles, ambient, intensity }) {
  const spacing = 64;
  const pulse = ambient ? 0.03 : 0.05 + Math.sin(t * 0.6) * 0.025;
  ctx.strokeStyle = gridColor;
  ctx.globalAlpha = Math.max(pulse, 0.012) * intensity;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = -spacing; x < width + spacing; x += spacing) {
    const drift = ambient ? 0 : Math.sin(t * 0.25 + x * 0.01) * 4;
    ctx.moveTo(x + drift, 0);
    ctx.lineTo(x + drift, height);
  }
  for (let y = -spacing; y < height + spacing; y += spacing) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = accentColor;
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life += ambient ? 0.002 : 0.0035;
    if (particle.y < -10 || particle.life > 1) {
      particle.x = Math.random() * width;
      particle.y = height + 10;
      particle.life = 0;
    }
    const fade = Math.sin(particle.life * Math.PI);
    
    // Draw glowing halo
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r * (1 + 2.5 * intensity), 0, Math.PI * 2);
    ctx.globalAlpha = fade * (ambient ? 0.06 : 0.12) * intensity;
    ctx.fill();
    
    // Draw core
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.globalAlpha = fade * (ambient ? 0.25 : 0.45) * intensity;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // HUD Overlays for Surveying (تخصص مساحة)
  ctx.font = '9px monospace';
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.22 * intensity;
  
  if (!ambient) {
    ctx.fillText('SURVEYING FIELD DATUM: WGS84', 24, 80);
    ctx.fillText('ELEVATION READOUT: 104.22m', width - 200, 80);
    ctx.fillText('BEARING AZIMUTH: 290.4°N', 24, height - 40);
    ctx.fillText('TOPO GRID ZONE: 36N', width - 150, height - 40);
    
    // Draw crosshair at center
    const cx = width / 2;
    const cy = height * 0.42;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText('COORD CENTER', cx + 14, cy - 4);
  } else {
    ctx.fillText('FIELD TOPO MAP MODE', 24, 80);
  }
  ctx.globalAlpha = 1;
}

function drawNetwork(ctx, { width, height, gridColor, accentColor, particles, pointerPx, intensity }) {
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    if (pointerPx) {
      const dx = particle.x - pointerPx.x;
      const dy = particle.y - pointerPx.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        particle.x += (dx / dist) * 0.6;
        particle.y += (dy / dist) * 0.6;
      }
    }
  });

  const linkDistance = 130;
  ctx.lineWidth = 1;
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < linkDistance) {
        ctx.strokeStyle = gridColor;
        ctx.globalAlpha = (1 - dist / linkDistance) * 0.45 * intensity;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  
  ctx.fillStyle = accentColor;
  particles.forEach((particle) => {
    // Draw halo
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r * (1 + 2.5 * intensity), 0, Math.PI * 2);
    ctx.globalAlpha = 0.22 * intensity;
    ctx.fill();
    
    // Draw core
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.globalAlpha = 0.7 * intensity;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // HUD Overlays for IT (تخصص IT)
  ctx.font = '9px monospace';
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.22 * intensity;
  ctx.fillText('IT INFRASTRUCTURE ENGINE: ONLINE', 24, 80);
  ctx.fillText('FIBER BACKBONE STATUS: 10G STABLE', width - 240, 80);
  ctx.fillText('CCTV NET FEEDS: ACTIVE & MONITORING', 24, height - 40);
  ctx.fillText('GATEWAY IP: 192.168.1.1', width - 200, height - 40);

  // Draw node labels next to some particles
  ctx.globalAlpha = 0.25 * intensity;
  particles.slice(0, 4).forEach((p, idx) => {
    const labels = [
      '[CCTV_CAM_01: ONLINE]',
      '[SERVER_01_CORE: RUNNING]',
      '[SWITCH_02_WAN: ACTIVE]',
      '[AP_OUTDOOR_04: UP]'
    ];
    ctx.fillText(labels[idx], p.x + 8, p.y - 4);
  });
  ctx.globalAlpha = 1;
}

function drawCircuit(ctx, { width, height, t, gridColor, accentColor, particles, intensity }) {
  const spacing = 96;
  ctx.strokeStyle = gridColor;
  ctx.globalAlpha = 0.12 * intensity;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = spacing / 2; x < width; x += spacing) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = spacing / 2; y < height; y += spacing) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = accentColor;
  particles.forEach((particle) => {
    const progress = ((t * particle.speed * 40 + particle.offset) % spacing) / spacing;
    let px = particle.x;
    let py = particle.y;
    if (particle.horizontal) {
      px = Math.floor(particle.x / spacing) * spacing + progress * spacing;
    } else {
      py = Math.floor(particle.y / spacing) * spacing + progress * spacing;
    }
    
    // Draw halo
    ctx.beginPath();
    ctx.arc(px, py, particle.r * (1 + 2.5 * intensity), 0, Math.PI * 2);
    ctx.globalAlpha = 0.2 * intensity;
    ctx.fill();
    
    // Draw core
    ctx.beginPath();
    ctx.arc(px, py, particle.r, 0, Math.PI * 2);
    ctx.globalAlpha = 0.65 * intensity;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // HUD Overlays for Coding & AI Systems (مطور أنظمة)
  ctx.font = '9px monospace';
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.22 * intensity;
  ctx.fillText('AI SYSTEMS ENGINE: COMPILING', 24, 80);
  ctx.fillText('ZUSTAND DATAPIPE: SECURE', width - 180, 80);
  ctx.fillText('MODULE ACCURACY: 98.6%', 24, height - 40);
  ctx.fillText('SYS INTEGRITY: STABLE', width - 180, height - 40);

  // Draw a CPU outline in the center background
  const cx = width / 2;
  const cy = height * 0.42;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - 50, cy - 35, 100, 70);
  ctx.fillText('OKASH CORE v1.0', cx - 40, cy - 4);
  ctx.fillText('AI MODULE', cx - 25, cy + 12);
  ctx.globalAlpha = 1;
}

function drawScan(ctx, { width, height, t, gridColor, accentColor, particles, intensity }) {
  ctx.strokeStyle = gridColor;
  ctx.globalAlpha = 0.14 * intensity;
  ctx.lineWidth = 1;
  const rows = 8;
  for (let i = 1; i < rows; i += 1) {
    const y = (height / rows) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const cycle = 4.5;
  const progress = (t % cycle) / cycle;
  const beamY = progress * height * 1.2 - height * 0.1;
  const beam = ctx.createLinearGradient(0, beamY - 60, 0, beamY + 60);
  beam.addColorStop(0, 'transparent');
  beam.addColorStop(0.5, `color-mix(in srgb, ${accentColor} ${Math.round(18 * intensity)}%, transparent)`);
  beam.addColorStop(1, 'transparent');
  ctx.fillStyle = beam;
  ctx.fillRect(0, beamY - 60, width, 120);

  ctx.fillStyle = accentColor;
  particles.forEach((particle) => {
    const dist = Math.abs(particle.y - beamY);
    const boost = dist < 40 ? (1 - dist / 40) * 0.6 : 0;
    const alpha = (0.16 + boost) * intensity;
    
    // Draw halo
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r * (1 + 2.5 * intensity), 0, Math.PI * 2);
    ctx.globalAlpha = alpha * 0.3;
    ctx.fill();
    
    // Draw core
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.globalAlpha = alpha;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // HUD Overlays for HSE Safety Scan (تخصص أمن وسلامة)
  ctx.font = '9px monospace';
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.22 * intensity;
  ctx.fillText('HSE SAFETY SWEEP: ACTIVE', 24, 80);
  ctx.fillText('OSHA INSPECTION PROTOCOL: ON', width - 200, 80);
  ctx.globalAlpha = 0.4 * intensity;
  ctx.fillText('SAFETY FIELD MONITORING...', 24, beamY - 4);
  ctx.globalAlpha = 1;
}

function drawRadar(ctx, { width, height, t, gridColor, accentColor, particles, intensity }) {
  const cx = width / 2;
  const cy = height * 0.42;
  const maxRadius = Math.max(width, height) * 0.42;

  ctx.strokeStyle = gridColor;
  ctx.globalAlpha = 0.22 * intensity;
  ctx.lineWidth = 1;
  [0.25, 0.5, 0.75, 1].forEach((f, idx) => {
    ctx.beginPath();
    if (idx === 1 || idx === 3) {
      ctx.setLineDash([4, 8]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.arc(cx, cy, maxRadius * f, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  const sweepAngle = (t * 0.7) % (Math.PI * 2);
  const sweep = ctx.createConicGradient
    ? ctx.createConicGradient(sweepAngle, cx, cy)
    : null;

  if (sweep) {
    sweep.addColorStop(0, `color-mix(in srgb, ${accentColor} ${Math.round(28 * intensity)}%, transparent)`);
    sweep.addColorStop(0.06, `color-mix(in srgb, ${accentColor} ${Math.round(8 * intensity)}%, transparent)`);
    sweep.addColorStop(0.14, 'transparent');
    sweep.addColorStop(1, 'transparent');
    ctx.fillStyle = sweep;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = accentColor;
  particles.forEach((particle) => {
    const px = cx + Math.cos(particle.angle) * particle.radius;
    const py = cy + Math.sin(particle.angle) * particle.radius;
    let angleDiff = Math.abs(particle.angle - sweepAngle) % (Math.PI * 2);
    if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
    const blip = angleDiff < 0.35 ? (1 - angleDiff / 0.35) * 0.7 : 0;
    const alpha = (0.12 + blip) * intensity;
    
    // Draw halo
    ctx.beginPath();
    ctx.arc(px, py, particle.r * (1 + 2.5 * intensity), 0, Math.PI * 2);
    ctx.globalAlpha = alpha * 0.3;
    ctx.fill();
    
    // Draw core
    ctx.beginPath();
    ctx.arc(px, py, particle.r, 0, Math.PI * 2);
    ctx.globalAlpha = alpha;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // HUD Overlays for HSE (تخصص أمن وسلامة)
  ctx.font = '9px monospace';
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.22 * intensity;
  ctx.fillText('HSE TELEMETRY SCANNER: ON', 24, 80);
  ctx.fillText('HAZARD DETECTION ROUTINE: NOMINAL', width - 240, 80);
  ctx.fillText('IOSH SAFETY COMPLIANCE: 100%', 24, height - 40);
  ctx.fillText('OSHA AUDIT SECURE: ACTIVE', width - 200, height - 40);
  ctx.globalAlpha = 1;
}

function drawSignal(ctx, { width, height, t, accentColor, particles, intensity }) {
  const cx = width / 2;
  const cy = height * 0.42;

  [0, 1, 2].forEach((i) => {
    const progress = ((t * 0.35 + i / 3) % 1);
    const radius = progress * Math.max(width, height) * 0.4;
    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = (1 - progress) * 0.24 * intensity;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (i === 1) {
      ctx.setLineDash([6, 12]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  ctx.fillStyle = accentColor;
  particles.forEach((particle) => {
    particle.radius -= particle.speed;
    if (particle.radius < 4) {
      particle.radius = particle.baseRadius;
      particle.angle = Math.random() * Math.PI * 2;
    }
    const px = cx + Math.cos(particle.angle) * particle.radius;
    const py = cy + Math.sin(particle.angle) * particle.radius;
    const proximity = 1 - Math.min(particle.radius / particle.baseRadius, 1);
    const alpha = (0.2 + proximity * 0.5) * intensity;
    
    // Draw halo
    ctx.beginPath();
    ctx.arc(px, py, particle.r * (1 + 2.5 * intensity), 0, Math.PI * 2);
    ctx.globalAlpha = alpha * 0.3;
    ctx.fill();
    
    // Draw core
    ctx.beginPath();
    ctx.arc(px, py, particle.r, 0, Math.PI * 2);
    ctx.globalAlpha = alpha;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // HUD Overlays for HSE / Signals
  ctx.font = '9px monospace';
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.22 * intensity;
  ctx.fillText('SAFETY SIGNAL BROADCAST: STABLE', 24, 80);
  ctx.fillText('EMERGENCY CHANNEL: ARMED', width - 200, 80);
  ctx.globalAlpha = 1;
}

const RENDERERS = {
  grid: (ctx, params) => drawGridLike(ctx, { ...params, ambient: false }),
  ambient: (ctx, params) => drawGridLike(ctx, { ...params, ambient: true }),
  network: drawNetwork,
  circuit: drawCircuit,
  scan: drawScan,
  radar: drawRadar,
  signal: drawSignal
};

const CanvasBackground = ({ performanceMode }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.32, tx: 0.5, ty: 0.32 });
  const particlesRef = useRef([]);
  const modeRef = useRef('grid');
  const transitionRef = useRef(0);
  const tabHidden = useTabVisibility();
  const activeSectionId = useBackgroundThemeStore((s) => s.activeSectionId);
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const intensityRef = useRef(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const computed = getComputedStyle(canvas);
    const val = parseFloat(computed.getPropertyValue('--bg-fx-intensity'));
    intensityRef.current = isNaN(val) ? 1.0 : val;
  }, [activeTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = performanceMode === 'ultra' ? 1 : 0.6;

    const reseed = (mode) => {
      const target = Math.round((PARTICLE_COUNTS[mode] || 40) * count);
      particlesRef.current = seedParticles(mode, width, height, target);
      transitionRef.current = 1; // trigger a soft "recalibration" pulse
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      reseed(modeRef.current);
    };

    resize();
    window.addEventListener('resize', resize);

    const accent = () => getComputedStyle(canvas).getPropertyValue('--accent-color').trim() || '#ffffff';
    const border = () => getComputedStyle(canvas).getPropertyValue('--border-color').trim() || 'rgba(255,255,255,0.1)';

    const start = performance.now();

    const draw = (now) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const accentColor = accent();
      const gridColor = border();
      const intensity = intensityRef.current;

      const p = pointerRef.current;
      p.x += (p.tx - p.x) * 0.045;
      p.y += (p.ty - p.y) * 0.045;
      const pointerPx = { x: p.x * width, y: p.y * height };

      // pointer glow, present in every mode as a constant "you are here" cue
      const glow = ctx.createRadialGradient(pointerPx.x, pointerPx.y, 0, pointerPx.x, pointerPx.y, Math.max(width, height) * 0.35);
      const glowOpacity = Math.round(18 * intensity);
      glow.addColorStop(0, `color-mix(in srgb, ${accentColor} ${glowOpacity}%, transparent)`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const renderer = RENDERERS[modeRef.current] || RENDERERS.grid;
      renderer(ctx, { width, height, t, accentColor, gridColor, particles: particlesRef.current, pointerPx, intensity });

      // soft "recalibration" flash on section change
      if (transitionRef.current > 0) {
        const alpha = transitionRef.current * 0.5;
        const cx = width / 2;
        const cy = height * 0.4;
        const r = (1 - transitionRef.current) * Math.max(width, height) * 0.5;
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = alpha * 0.4 * intensity;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        transitionRef.current = Math.max(0, transitionRef.current - 0.02);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const handlePointerMove = (e) => {
      pointerRef.current.tx = e.clientX / window.innerWidth;
      pointerRef.current.ty = e.clientY / window.innerHeight;
    };

    if (isPointerFine()) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    if (!tabHidden) rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [performanceMode, tabHidden]);

  // react to section changes without tearing down the whole canvas/RAF loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const nextMode = modeForSection(activeSectionId);
    if (nextMode === modeRef.current) return;
    modeRef.current = nextMode;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const count = Math.round((PARTICLE_COUNTS[nextMode] || 40) * (performanceMode === 'ultra' ? 1 : 0.6));
    particlesRef.current = seedParticles(nextMode, width, height, count);
    transitionRef.current = 1;
  }, [activeSectionId, performanceMode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 w-full h-full"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 92%, transparent 100%)'
      }}
    />
  );
};

const GrainOverlay = () => (
  <div 
    aria-hidden="true" 
    className="fixed -inset-[10%] pointer-events-none select-none z-[1] opacity-[0.035] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      animation: 'noise-shift 0.4s steps(4) infinite',
      willChange: 'transform'
    }}
  />
);

export const CinematicBackground = React.memo(() => {
  const { mode, prefersReducedMotion } = usePerformance();

  if (mode === 'performance' || prefersReducedMotion) return <StaticFallback />;

  return (
    <>
      <CanvasBackground performanceMode={mode} />
      <GrainOverlay />
    </>
  );
});
