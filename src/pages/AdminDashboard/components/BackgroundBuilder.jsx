import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { THEME_PROFILES_DEFAULTS } from '../../../data/constants';

export const BackgroundBuilder = React.memo(({ themeProfilesData = {}, themeStudioSelectedTheme, t, updateField }) => {
  const getActiveProfile = () => themeProfilesData[themeStudioSelectedTheme] || THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] || {};
  const profile = getActiveProfile();

  const layers = ['grid', 'itNetwork', 'aiNodes', 'safetyGeometry', 'blueprint', 'lightRays'];
  const layerLabels = { 
    grid: 'Layer 1 — Engineering Grid', 
    itNetwork: 'Layer 2 — IT Network', 
    aiNodes: 'Layer 3 — AI Nodes', 
    safetyGeometry: 'Layer 4 — Safety Geometry', 
    blueprint: 'Layer 5 — Blueprint', 
    lightRays: 'Layer 6 — Ambient Light Rays' 
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms?.backgroundBuilderTitle || 'Background Builder'}</h3>

      <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.enableBackground || 'Visibility'}</h4>
        <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div>
            <h5 className="font-bold text-sm text-[var(--text-primary)] mb-0.5">{t.cms?.enableBackground || 'Enable Background'}</h5>
            <p className="text-xs text-[var(--text-secondary)]">{t.cms?.backgroundBuilderTitle ? 'Toggle the full cinematic background' : 'Toggle the full cinematic background'}</p>
          </div>
          <button 
            onClick={() => {
              const nextVal = !profile.backgroundEnabled;
              updateField((draft) => {
                if (!draft.themeProfiles) draft.themeProfiles = {};
                if (!draft.themeProfiles[themeStudioSelectedTheme]) draft.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] };
                draft.themeProfiles[themeStudioSelectedTheme].backgroundEnabled = nextVal;
              });
            }}
            aria-label={t.cms?.ariaToggleVisibility || 'Toggle visibility'}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
              profile.backgroundEnabled !== false 
                ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]' 
                : 'border-[var(--border-color)] text-[var(--text-secondary)]'
            }`}
          >
            {profile.backgroundEnabled !== false ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.layerControls || 'Layer Controls'}</h4>
        {layers.map(layer => (
          <div key={layer}>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{layerLabels[layer]}</span>
              <span className="text-[var(--primary)]">{(profile.layerOpacities?.[layer] ?? THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme]?.layerOpacities?.[layer])?.toFixed(3)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="0.25" 
              step="0.005" 
              value={profile.layerOpacities?.[layer] ?? THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme]?.layerOpacities?.[layer] ?? 0.08} 
              onChange={(e) => {
                const val = Number(e.target.value);
                updateField((draft) => {
                  if (!draft.themeProfiles) draft.themeProfiles = {};
                  if (!draft.themeProfiles[themeStudioSelectedTheme]) draft.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] };
                  if (!draft.themeProfiles[themeStudioSelectedTheme].layerOpacities) {
                    draft.themeProfiles[themeStudioSelectedTheme].layerOpacities = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme].layerOpacities };
                  }
                  draft.themeProfiles[themeStudioSelectedTheme].layerOpacities[layer] = val;
                });
              }} 
              className="w-full accent-[var(--primary)]" 
            />
          </div>
        ))}
      </div>
    </div>
  );
});
