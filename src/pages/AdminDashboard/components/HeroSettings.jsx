import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { AdminInput, AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const HeroSettings = React.memo(({ heroData, t, updateField }) => {
  const identity = heroData.identity || { displayName: {}, availabilityLabel: {}, statusLabel: {} };
  const roles = heroData.roles || [];
  const statistics = heroData.statistics || { experienceYears: 0, projectsBuilt: 0, certificationsCount: 0 };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.sidebarHero}</h3>
      
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">Hero Identity</h4>
        <AdminMultiLangInput 
          label={t.cms.heroIdentityDisplayName} 
          valueObj={identity.displayName} 
          onChangeKey={(key, val) => {
            updateField((draft) => {
              if (!draft.hero.identity) draft.hero.identity = {};
              if (!draft.hero.identity.displayName) draft.hero.identity.displayName = {};
              draft.hero.identity.displayName[key] = val;
            });
          }} 
        />
        <AdminMultiLangInput 
          label={t.cms.heroIdentityAvailabilityLabel} 
          valueObj={identity.availabilityLabel} 
          onChangeKey={(key, val) => {
            updateField((draft) => {
              if (!draft.hero.identity) draft.hero.identity = {};
              if (!draft.hero.identity.availabilityLabel) draft.hero.identity.availabilityLabel = {};
              draft.hero.identity.availabilityLabel[key] = val;
            });
          }} 
        />
        <AdminMultiLangInput 
          label={t.cms.heroIdentityStatusLabel} 
          valueObj={identity.statusLabel} 
          onChangeKey={(key, val) => {
            updateField((draft) => {
              if (!draft.hero.identity) draft.hero.identity = {};
              if (!draft.hero.identity.statusLabel) draft.hero.identity.statusLabel = {};
              draft.hero.identity.statusLabel[key] = val;
            });
          }} 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['statusDotColor', t.cms.heroIdentityStatusDotColor],
            ['badgeBackground', t.cms.heroIdentityBadgeBackground],
            ['badgeBorder', t.cms.heroIdentityBadgeBorder],
            ['badgeTextColor', t.cms.heroIdentityBadgeTextColor]
          ].map(([key, label]) => (
            <AdminInput 
              key={key} 
              label={label} 
              value={identity[key] || ''} 
              onChange={(e) => {
                const val = e.target.value;
                updateField((draft) => {
                  if (!draft.hero.identity) draft.hero.identity = {};
                  draft.hero.identity[key] = val;
                });
              }} 
            />
          ))}
        </div>
      </div>

      <AdminMultiLangInput 
        label={t.cms.heroTitle1} 
        valueObj={heroData.title1} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            draft.hero.title1[key] = val;
          });
        }} 
      />
      <AdminMultiLangInput 
        label={t.cms.heroTitle2} 
        valueObj={heroData.title2} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            draft.hero.title2[key] = val;
          });
        }} 
      />
      <AdminMultiLangInput 
        label={t.cms.heroTagline} 
        textarea 
        valueObj={heroData.tagline} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            draft.hero.tagline[key] = val;
          });
        }} 
      />

      {/* Roles List */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.animatedRoles}</h4>
        <div className="space-y-3">
          {roles.map((role, idx) => (
            <div key={idx} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button 
                  disabled={idx === 0} 
                  onClick={() => {
                    updateField((draft) => {
                      const list = [...draft.hero.roles];
                      const temp = list[idx];
                      list[idx] = list[idx - 1];
                      list[idx - 1] = temp;
                      draft.hero.roles = list;
                    });
                  }} 
                  aria-label={t.cms?.ariaReorderUp || 'Move up'} 
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
                <button 
                  disabled={idx === roles.length - 1} 
                  onClick={() => {
                    updateField((draft) => {
                      const list = [...draft.hero.roles];
                      const temp = list[idx];
                      list[idx] = list[idx + 1];
                      list[idx + 1] = temp;
                      draft.hero.roles = list;
                    });
                  }} 
                  aria-label={t.cms?.ariaReorderDown || 'Move down'} 
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input 
                  type="text" 
                  value={role.ar || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((draft) => {
                      draft.hero.roles[idx].ar = val;
                    });
                  }} 
                  placeholder={t.cms.arabic} 
                  className="p-2 text-xs rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" 
                />
                <input 
                  type="text" 
                  value={role.en || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((draft) => {
                      draft.hero.roles[idx].en = val;
                    });
                  }} 
                  placeholder={t.cms.english} 
                  className="p-2 text-xs rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" 
                />
                <input 
                  type="text" 
                  value={role.ur || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField((draft) => {
                      draft.hero.roles[idx].ur = val;
                    });
                  }} 
                  placeholder={t.cms.urdu} 
                  className="p-2 text-xs rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" 
                />
              </div>

              <button 
                onClick={() => {
                  updateField((draft) => {
                    draft.hero.roles = draft.hero.roles.filter((_, i) => i !== idx);
                  });
                }} 
                aria-label={t.cms?.ariaDelete || 'Delete'}
                className="p-2 text-[var(--status-red)] hover:bg-[var(--status-red-bg)] rounded cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={() => {
            updateField((draft) => {
              draft.hero.roles = [...draft.hero.roles, { ar: '', en: '', ur: '' }];
            });
          }}
          className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewRole}
        </button>
      </div>

      {/* Hero statistics */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.heroStats}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminInput 
            label={t.cms.yearsExpLabel} 
            type="number" 
            value={statistics.experienceYears} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.hero.statistics.experienceYears = val;
              });
            }} 
          />
          <AdminInput 
            label={t.cms.projectsBuiltLabel} 
            type="number" 
            value={statistics.projectsBuilt} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.hero.statistics.projectsBuilt = val;
              });
            }} 
          />
          <AdminInput 
            label={t.cms.certsCountLabel} 
            type="number" 
            value={statistics.certificationsCount} 
            onChange={(e) => {
              const val = Number(e.target.value);
              updateField((draft) => {
                draft.hero.statistics.certificationsCount = val;
              });
            }} 
          />
        </div>
      </div>
    </div>
  );
});
