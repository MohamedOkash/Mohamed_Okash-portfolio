import React, { useEffect, useState } from 'react';

export const CinematicBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delayed fade-in for premium entrance
    const timer = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="cinematic-background fixed inset-0 overflow-hidden pointer-events-none z-0 select-none transition-opacity duration-[3000ms] ease-in-out"
      style={{ opacity: mounted ? 1.0 : 0, transform: 'translateZ(0)', contain: 'strict' }}
    >
      {/* Soft Radial Ambient Glows */}
      {/* 1. Behind Hero Section */}
      <div 
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[85vw] h-[55vh] rounded-full blur-[140px] pointer-events-none opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`
        }}
      />
      {/* 2. Middle Page Accent */}
      <div 
        className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vh] rounded-full blur-[160px] pointer-events-none opacity-[0.15] bg-[var(--accent)]"
      />
      {/* 3. Footer Accent */}
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vh] rounded-full blur-[150px] pointer-events-none opacity-[0.12] bg-[var(--primary)]"
      />

      {/* Layer 1: Engineering Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.06] transition-all"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridScroll 180s linear infinite',
          maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 95%)'
        }}
      />

      {/* Layer 5: Ambient Premium Light Rays & Glow Trails */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lightRay1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lightRay2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Soft Diagonal Light Rays */}
        <path d="M -100 -100 L 800 800 L 700 850 L -200 50 Z" fill="url(#lightRay1)" />
        <path d="M 1200 -200 L 400 900 L 300 850 L 1100 -300 Z" fill="url(#lightRay2)" />
      </svg>

      {/* SVG Canvas for IT, AI, HSE Topology & Blueprint Elements */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* Layer 2: IT Infrastructure Topology */}
        {/* Router, Switches, Servers, Fiber Links & Connections */}
        <g className="opacity-[0.075]" stroke="var(--primary)" strokeWidth="1" fill="none">
          {/* Fiber Links (Glowing/Dashed Paths) */}
          <path d="M 120 180 H 380 V 320 H 550" strokeDasharray="5 5" className="animate-dash" />
          <path d="M 850 120 H 1050 V 280 H 900 V 450" strokeDasharray="6 4" className="animate-dash" style={{ animationDirection: 'reverse' }} />
          <path d="M 100 650 H 320 V 500 H 450" strokeDasharray="4 6" className="animate-dash" />
          <path d="M 750 780 H 980 V 620 H 1150" strokeDasharray="8 4" className="animate-dash" />
          
          {/* Fiber link crossover lines */}
          <line x1="380" y1="200" x2="850" y2="120" stroke="var(--accent)" strokeDasharray="2 8" />
          <line x1="320" y1="500" x2="750" y2="780" stroke="var(--accent)" strokeDasharray="3 9" />

          {/* Routers & Switch Node Graphics */}
          {/* Router 1 */}
          <circle cx="120" cy="180" r="16" strokeWidth="1.5" />
          <path d="M 110 180 H 130 M 120 170 V 190" strokeWidth="1" />
          <circle cx="120" cy="180" r="6" fill="var(--primary)" className="animate-pulse" />

          {/* Router 2 */}
          <circle cx="1050" cy="280" r="16" strokeWidth="1.5" stroke="var(--accent)" />
          <path d="M 1040 280 H 1060 M 1050 270 V 290" stroke="var(--accent)" strokeWidth="1" />
          <circle cx="1050" cy="280" r="6" fill="var(--accent)" className="animate-pulse" />

          {/* Switch 1 (with ports) */}
          <rect x="350" y="305" width="60" height="30" rx="4" strokeWidth="1.5" fill="rgba(0,0,0,0.4)" />
          <circle cx="362" cy="320" r="2" fill="var(--primary)" />
          <circle cx="372" cy="320" r="2" fill="var(--primary)" />
          <circle cx="382" cy="320" r="2" fill="var(--accent)" />
          <circle cx="392" cy="320" r="2" fill="var(--primary)" />
          <circle cx="402" cy="320" r="2" fill="red" className="animate-pulse" />

          {/* Switch 2 */}
          <rect x="950" y="605" width="60" height="30" rx="4" strokeWidth="1.5" fill="rgba(0,0,0,0.4)" stroke="var(--accent)" />
          <circle cx="962" cy="620" r="2" fill="var(--accent)" />
          <circle cx="972" cy="620" r="2" fill="var(--primary)" />
          <circle cx="982" cy="620" r="2" fill="var(--accent)" />
          <circle cx="992" cy="620" r="2" fill="var(--accent)" />

          {/* Server Stacks */}
          {/* Server 1 */}
          <g transform="translate(550, 300)">
            <rect x="0" y="0" width="70" height="15" rx="2" fill="rgba(0,0,0,0.5)" />
            <rect x="0" y="18" width="70" height="15" rx="2" fill="rgba(0,0,0,0.5)" />
            <rect x="0" y="36" width="70" height="15" rx="2" fill="rgba(0,0,0,0.5)" />
            <circle cx="8" cy="7.5" r="1.5" fill="#10B981" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="8" cy="25.5" r="1.5" fill="#10B981" />
            <circle cx="8" cy="43.5" r="1.5" fill="#10B981" />
            <line x1="20" y1="7.5" x2="60" y2="7.5" stroke="var(--primary)" strokeWidth="0.5" />
            <line x1="20" y1="25.5" x2="60" y2="25.5" stroke="var(--primary)" strokeWidth="0.5" />
            <line x1="20" y1="43.5" x2="60" y2="43.5" stroke="var(--primary)" strokeWidth="0.5" />
          </g>

          {/* Server 2 */}
          <g transform="translate(450, 480)">
            <rect x="0" y="0" width="70" height="15" rx="2" fill="rgba(0,0,0,0.5)" stroke="var(--accent)" />
            <rect x="0" y="18" width="70" height="15" rx="2" fill="rgba(0,0,0,0.5)" stroke="var(--accent)" />
            <circle cx="8" cy="7.5" r="1.5" fill="var(--accent)" />
            <circle cx="8" cy="25.5" r="1.5" fill="var(--accent)" className="animate-ping" style={{ animationDuration: '2s' }} />
            <line x1="20" y1="7.5" x2="60" y2="7.5" stroke="var(--accent)" strokeWidth="0.5" />
            <line x1="20" y1="25.5" x2="60" y2="25.5" stroke="var(--accent)" strokeWidth="0.5" />
          </g>
        </g>

        {/* Layer 3: AI & Vibe Coding Layer */}
        {/* Neural Pathways, Flow Diagrams, Logic Nodes, Code Streams */}
        <g className="opacity-[0.065]">
          {/* Neural pathways & Flow diagrams */}
          <g stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" fill="none">
            {/* Logic Node / Decision Diamond */}
            <polygon points="500,100 540,120 500,140 460,120" stroke="var(--primary)" />
            <circle cx="500" cy="120" r="3" fill="var(--primary)" />
            <path d="M 500 140 V 200 L 480 220" />
            <path d="M 500 120 H 620 V 150" strokeDasharray="3 3" />
            <rect x="585" y="150" width="70" height="25" rx="3" stroke="var(--accent)" fill="rgba(0,0,0,0.2)" />
            <circle cx="620" cy="162" r="2.5" fill="var(--accent)" />
            
            {/* Logic Connectors */}
            <path d="M 250 500 L 220 540 H 180" />
            <circle cx="180" cy="540" r="3" fill="white" />
            <path d="M 980 620 H 920 V 550" />
          </g>

          {/* Code streams, Digital particles and symbols */}
          <g fill="rgba(255, 255, 255, 0.45)" fontSize="9.5" fontFamily="monospace" letterSpacing="0.5">
            {/* Floating technical syntax tags */}
            <text x="80%" y="12%" fill="var(--primary)" opacity="0.8">const AI = async () =&gt; &#123;</text>
            <text x="81.5%" y="14%" opacity="0.5">  await safetyShield.verify();</text>
            <text x="81.5%" y="16%" opacity="0.5">  return api.deploy("production");</text>
            <text x="80%" y="18%" fill="var(--primary)" opacity="0.8">&#125;;</text>
            
            <text x="5%" y="45%" opacity="0.7">&lt;SafetyHSE /&gt; [STABLE]</text>
            <text x="5%" y="47%" opacity="0.3">sys_score = 99.8% // API_OK</text>
            
            <text x="75%" y="55%" opacity="0.6">while (vibeCoding) &#123;</text>
            <text x="76.5%" y="57.5%" opacity="0.4">  optimize(performance);</text>
            <text x="75%" y="60%" opacity="0.6">&#125;</text>

            <text x="45%" y="82%" fill="var(--accent)" opacity="0.6">&lt;LiquidGlass /&gt; [] &#123;&#125;</text>
            <text x="45%" y="84%" opacity="0.3">const async API AI &lt;&gt;</text>

            {/* Random scattered coding symbols */}
            <text x="18%" y="28%" fill="var(--primary)" opacity="0.7">&lt;&gt;</text>
            <text x="42%" y="15%" opacity="0.4">&#123;&#125;</text>
            <text x="88%" y="38%" opacity="0.5">[]</text>
            <text x="64%" y="48%" fill="var(--accent)" opacity="0.6">const</text>
            <text x="32%" y="62%" opacity="0.5">async</text>
            <text x="8%" y="78%" fill="var(--primary)" opacity="0.4">API</text>
            <text x="87%" y="72%" fill="var(--accent)" opacity="0.8">AI</text>
            <text x="58%" y="71%" opacity="0.3">&lt;/&gt;</text>
          </g>
        </g>

        {/* Layer 4: HSE (Health, Safety & Environment) Layer */}
        {/* Safety Geometry, Hazard Triangles, Compliance Indicators, Inspection Markers */}
        <g className="opacity-[0.07]" stroke="white" strokeWidth="0.8" fill="none">
          {/* Construction planning / Grid guidelines */}
          <line x1="0" y1="8%" x2="100%" y2="8%" strokeDasharray="10 20" />
          <line x1="0" y1="92%" x2="100%" y2="92%" strokeDasharray="10 20" />
          <line x1="8%" y1="0" x2="8%" y2="100%" strokeDasharray="5 15" />
          <line x1="92%" y1="0" x2="92%" y2="100%" strokeDasharray="5 15" />

          {/* Hazard Warning Triangles */}
          {/* Triangle 1 */}
          <g transform="translate(150, 420)">
            <polygon points="15,0 30,26 0,26" stroke="var(--accent)" strokeWidth="1.2" />
            <line x1="15" y1="9" x2="15" y2="18" stroke="var(--accent)" strokeWidth="1.5" />
            <circle cx="15" cy="22" r="1" fill="var(--accent)" stroke="none" />
          </g>
          {/* Triangle 2 */}
          <g transform="translate(860, 720)">
            <polygon points="15,0 30,26 0,26" stroke="var(--primary)" strokeWidth="1.2" />
            <line x1="15" y1="9" x2="15" y2="18" stroke="var(--primary)" strokeWidth="1.5" />
            <circle cx="15" cy="22" r="1" fill="var(--primary)" stroke="none" />
          </g>

          {/* Compliance circular indicator shield */}
          <g transform="translate(680, 220)">
            <circle cx="20" cy="20" r="18" strokeDasharray="6 4" stroke="var(--primary)" />
            <circle cx="20" cy="20" r="12" stroke="var(--primary)" />
            <path d="M 20 10 V 30 M 10 20 H 30" stroke="var(--primary)" strokeWidth="0.5" />
            <path d="M 15 20 L 19 24 L 26 16" stroke="var(--primary)" strokeWidth="1" />
          </g>

          {/* Inspection crosshairs / Target markers */}
          <g transform="translate(940, 80)">
            <circle cx="15" cy="15" r="12" />
            <line x1="15" y1="0" x2="15" y2="30" strokeDasharray="3 3" />
            <line x1="0" y1="15" x2="30" y2="15" strokeDasharray="3 3" />
            <text x="22" y="10" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" stroke="none">HSE_MARK: 02</text>
          </g>

          {/* Diagonal Hazard safety warning stripes */}
          <g transform="translate(40, 25)" stroke="var(--primary)" strokeWidth="1" opacity="0.7">
            <line x1="0" y1="10" x2="10" y2="0" />
            <line x1="10" y1="10" x2="20" y2="0" />
            <line x1="20" y1="10" x2="30" y2="0" />
            <line x1="30" y1="10" x2="40" y2="0" />
            <line x1="40" y1="10" x2="50" y2="0" />
          </g>
        </g>
      </svg>

      {/* Layer 5: Ambient Floating Glass Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[15%] w-12 h-16 rounded-lg bg-white/[0.01] border border-white/[0.05] backdrop-blur-[2px] shadow-sm animate-drift-slow-1" />
        <div className="absolute top-[65%] right-[12%] w-16 h-20 rounded-xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-[3px] shadow-sm animate-drift-slow-2" />
        <div className="absolute bottom-[20%] left-[25%] w-10 h-10 rounded bg-white/[0.01] border border-white/[0.06] backdrop-blur-[1px] shadow-sm animate-drift-slow-3" />
        <div className="absolute top-[10%] right-[30%] w-8 h-12 rounded-lg bg-white/[0.01] border border-white/[0.05] backdrop-blur-[2px] shadow-sm animate-drift-slow-4" />
      </div>

      {/* Dynamic Keyframes Injection */}
      <style>{`
        @keyframes gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 360px 720px; }
        }
        .animate-dash {
          stroke-dasharray: 8;
          animation: dashMove 20s linear infinite;
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -1000; }
        }
        .animate-drift-slow-1 {
          animation: driftSlow1 28s infinite ease-in-out;
        }
        .animate-drift-slow-2 {
          animation: driftSlow2 32s infinite ease-in-out;
        }
        .animate-drift-slow-3 {
          animation: driftSlow3 24s infinite ease-in-out;
        }
        .animate-drift-slow-4 {
          animation: driftSlow4 36s infinite ease-in-out;
        }

        @keyframes driftSlow1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          50% { transform: translate(40px, -60px) rotate(15deg); opacity: 0.8; }
        }
        @keyframes driftSlow2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; }
          50% { transform: translate(-70px, 40px) rotate(-10deg); opacity: 0.7; }
        }
        @keyframes driftSlow3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
          50% { transform: translate(50px, 50px) rotate(20deg); opacity: 0.9; }
        }
        @keyframes driftSlow4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          50% { transform: translate(-30px, -40px) rotate(-25deg); opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cinematic-background *,
          .cinematic-background *::before,
          .cinematic-background *::after {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
