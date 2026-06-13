import React, { useEffect, useState } from 'react';

export const CinematicBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Graceful delayed fade-in after 1 second to create a premium cinematic entering effect
    const timer = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none transition-opacity duration-[4000ms] ease-in-out"
      style={{ opacity: mounted ? 0.35 : 0 }}
    >
      {/* Layer 1: Very Soft Animated Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] md:opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'gridMove 120s linear infinite',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
        }}
      />

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Layer 2: Extremely Low-Opacity Blueprint Lines & Technical Indicators */}
        <g className="opacity-[0.03]" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5">
          {/* Vertical Rulers */}
          <line x1="5%" y1="0" x2="5%" y2="100%" strokeDasharray="3 9" />
          <line x1="95%" y1="0" x2="95%" y2="100%" strokeDasharray="3 9" />
          
          {/* Horizontal guidelines */}
          <line x1="0" y1="15%" x2="100%" y2="15%" strokeDasharray="5 15" />
          <line x1="0" y1="85%" x2="100%" y2="85%" strokeDasharray="5 15" />

          {/* Technical crosshairs & coordinate markers */}
          <circle cx="5%" cy="15%" r="6" fill="none" />
          <line x1="5%" y1="15%" x2="5%" y2="17%" />
          <line x1="5%" y1="15%" x2="7%" y2="15%" />

          <circle cx="95%" cy="85%" r="6" fill="none" />
          <line x1="95%" y1="85%" x2="95%" y2="83%" />
          <line x1="95%" y1="85%" x2="93%" y2="85%" />

          {/* Coordinate text tags in corners (HSE-IT schematic vibe) */}
          <text x="6%" y="14%" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace" letterSpacing="1">SYS_MONITOR: ACTIVE</text>
          <text x="6%" y="16%" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">X: 892.41 // Y: 104.93</text>
          <text x="88%" y="87%" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">HSE_FLOW: SECURE</text>
        </g>

        {/* Layer 3: Subtle Network Topology Nodes (IT Infrastructure Vibe) */}
        <g className="opacity-[0.04]" stroke="var(--primary)" strokeWidth="0.75" fill="none">
          {/* Main node connections (dashed lines) */}
          <path d="M 150 180 L 300 120 L 250 320 Z M 250 320 L 450 250 M 300 120 L 450 250" strokeDasharray="4 4" />
          <path d="M 800 600 L 950 520 L 900 720 Z M 900 720 L 1100 650 M 950 520 L 1100 650" strokeDasharray="4 4" />

          {/* Topology nodes */}
          <circle cx="150" cy="180" r="4" fill="var(--primary)" className="animate-pulse" style={{ animationDuration: '3s' }} />
          <circle cx="300" cy="120" r="4.5" fill="var(--primary)" className="animate-pulse" style={{ animationDuration: '4s' }} />
          <circle cx="250" cy="320" r="5" fill="var(--primary)" className="animate-pulse" style={{ animationDuration: '5s' }} />
          <circle cx="450" cy="250" r="4" fill="var(--primary)" />
          
          <circle cx="800" cy="600" r="4.5" fill="var(--primary)" className="animate-pulse" style={{ animationDuration: '4.5s' }} />
          <circle cx="950" cy="520" r="4" fill="var(--primary)" className="animate-pulse" style={{ animationDuration: '3.5s' }} />
          <circle cx="900" cy="720" r="5.5" fill="var(--primary)" className="animate-pulse" style={{ animationDuration: '6s' }} />
          <circle cx="1100" cy="650" r="4" fill="var(--primary)" />
        </g>

        {/* Layer 4: Soft Safety Engineering Geometry (HSE Vibe) */}
        <g className="opacity-[0.035]" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.75" fill="none">
          {/* Subtle hazard stripes pattern in top-right */}
          <line x1="90%" y1="5%" x2="95%" y2="10%" />
          <line x1="91%" y1="5%" x2="96%" y2="10%" />
          <line x1="92%" y1="5%" x2="97%" y2="10%" />
          <line x1="93%" y1="5%" x2="98%" y2="10%" />
          <line x1="94%" y1="5%" x2="99%" y2="10%" />
          
          {/* Minimal HSE circular compliance shield in left center */}
          <circle cx="8%" cy="50%" r="20" strokeDasharray="6 4" />
          <circle cx="8%" cy="50%" r="12" />
          <line x1="8%" y1="46%" x2="8%" y2="54%" />
          <line x1="4%" y1="50%" x2="12%" y2="50%" />

          {/* Safety Warning Triangle in bottom-left */}
          <polygon points="120,780 145,825 95,825" strokeWidth="0.8" />
          <line x1="120" y1="795" x2="120" y2="812" strokeWidth="1.5" />
          <circle cx="120" cy="819" r="1" fill="white" />
        </g>

        {/* Layer 5: AI Neural-Flow Particles */}
        <g className="opacity-[0.08]" fill="var(--primary)">
          {/* Slowly drifting neural signal dots */}
          <circle cx="200" cy="200" r="2.5" className="animate-drift-1" />
          <circle cx="850" cy="550" r="2" className="animate-drift-2" />
          <circle cx="600" cy="300" r="1.8" className="animate-drift-3" />
          <circle cx="400" cy="700" r="2.2" className="animate-drift-4" />
          <circle cx="1000" cy="250" r="1.5" className="animate-drift-5" />
        </g>

        {/* Layer 6: Vibe Coding & Code Flow */}
        <g className="opacity-[0.025]" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5">
          {/* Subtle floating brackets and terminal codes */}
          <text x="75%" y="20%" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace" letterSpacing="0.5">const build = (safety, tech) =&gt; &#123;</text>
          <text x="77%" y="22%" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace">  return vibeCoding(safety + tech);</text>
          <text x="75%" y="24%" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">&#125;;</text>

          {/* Floating code symbols / tags */}
          <text x="12%" y="75%" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">&lt;HsePro /&gt;</text>
          <text x="12%" y="77%" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace">STATUS: 200 OK</text>
          
          <text x="82%" y="45%" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">await aiSystems.compile();</text>
          <text x="82%" y="47%" fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="monospace">sys.safetyRank === "A+"</text>
        </g>
      </svg>

      {/* Adding custom keyframes dynamically */}
      <style>{`
        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 80px 160px;
          }
        }
        .animate-drift-1 {
          animation: drift1 20s infinite ease-in-out;
        }
        .animate-drift-2 {
          animation: drift2 25s infinite ease-in-out;
        }
        .animate-drift-3 {
          animation: drift3 22s infinite ease-in-out;
        }
        .animate-drift-4 {
          animation: drift4 28s infinite ease-in-out;
        }
        .animate-drift-5 {
          animation: drift5 18s infinite ease-in-out;
        }

        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(60px, -40px); opacity: 1; }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.1; }
          50% { transform: translate(-80px, 60px); opacity: 0.9; }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(50px, 70px); opacity: 1; }
        }
        @keyframes drift4 {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(-50px, -50px); opacity: 0.8; }
        }
        @keyframes drift5 {
          0%, 100% { transform: translate(0, 0); opacity: 0.1; }
          50% { transform: translate(70px, 30px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
