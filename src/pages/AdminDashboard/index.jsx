import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { validatePortfolioData } from '../../utils/validators';
import { 
  User, Star, Award, Briefcase, Plus, Trash2, Save, 
  Loader2, Languages, Mail, Settings, ShieldAlert, Cpu, 
  HardHat, Monitor, LogOut, ArrowLeft, CheckCircle2,
  Search, ArrowUp, ArrowDown, Upload, Download, Undo, Eye,
  Globe, Palette, Image, ShieldCheck, HeartPulse, FlameKindling,
  Server, Copy, Check, ArrowUpRight, CheckSquare, Square
} from 'lucide-react';

// Form Input UI Helpers
const AdminInput = ({ label, value, onChange, type="text", textarea=false, dir="auto", min, max, step }) => (
  <div className="mb-4 w-full">
    {label && <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-400">{label}</label>}
    {textarea ? (
      <textarea rows="4" dir={dir} value={value} onChange={onChange} className="w-full p-3 rounded-lg bg-black/60 border border-zinc-800 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
    ) : (
      <input type={type} min={min} max={max} step={step} dir={dir} value={value} onChange={onChange} className="w-full p-3 rounded-lg bg-black/60 border border-zinc-800 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
    )}
  </div>
);

const AdminMultiLangInput = ({ label, valueObj = { ar: '', en: '', ur: '' }, onChangeKey, textarea=false }) => {
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;
  return (
    <div className="mb-5 p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 space-y-3">
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-extrabold">{label}</label>}
      <div className="space-y-3 pl-3 border-l border-zinc-800">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">{t.cms?.arabic || 'العربية (Arabic)'}</span>
          {textarea ? (
            <textarea rows="3" dir="rtl" value={valueObj.ar || ""} onChange={(e) => onChangeKey('ar', e.target.value)} className="w-full p-3 rounded-lg bg-black/60 border border-zinc-800 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="rtl" value={valueObj.ar || ""} onChange={(e) => onChangeKey('ar', e.target.value)} className="w-full p-3 rounded-lg bg-black/60 border border-zinc-800 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          )}
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">{t.cms?.english || 'English'}</span>
          {textarea ? (
            <textarea rows="3" dir="ltr" value={valueObj.en || ""} onChange={(e) => onChangeKey('en', e.target.value)} className="w-full p-3 rounded-lg bg-black/60 border border-zinc-800 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="ltr" value={valueObj.en || ""} onChange={(e) => onChangeKey('en', e.target.value)} className="w-full p-3 rounded-lg bg-black/60 border border-zinc-800 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          )}
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">{t.cms?.urdu || 'اردو (Urdu)'}</span>
          {textarea ? (
            <textarea rows="3" dir="rtl" value={valueObj.ur || ""} onChange={(e) => onChangeKey('ur', e.target.value)} className="w-full p-3 rounded-lg bg-black/60 border border-zinc-800 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="rtl" value={valueObj.ur || ""} onChange={(e) => onChangeKey('ur', e.target.value)} className="w-full p-3 rounded-lg bg-black/60 border border-zinc-800 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { data, loadPortfolio, savePortfolio } = usePortfolioStore();
  const { lang, setLanguage } = useLanguageStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  // Local state for full CMS form
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  // CMS UX states
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [localListFilter, setLocalListFilter] = useState('');
  const fileInputRef = useRef(null);

  // Sync form state on store load
  useEffect(() => {
    if (data) {
      setFormData(JSON.parse(JSON.stringify(data)));
    }
  }, [data]);

  // Load portfolio from firestore on mount
  useEffect(() => {
    loadPortfolio(user);
  }, [loadPortfolio, user]);

  // isDirty flag
  const isDirty = formData && data && JSON.stringify(formData) !== JSON.stringify(data);

  // beforeunload protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = (t.cms?.unsavedTitle || 'Unsaved Changes') + '. ' + (t.cms?.unsavedSubtitle || 'Press Save Changes to publish.');
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, t]);

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
  };

  // Safe navigation alert
  const handleTabChange = (newTab) => {
    if (isDirty) {
      if (!window.confirm(t.cms?.tabDirtyConfirm || 'You have unsaved changes in this tab. Switch tabs anyway?')) {
        return;
      }
    }
    setActiveTab(newTab);
    setLocalListFilter('');
  };

  // Firestore Save with Safety Snapshot
  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const updated = { ...formData };
      const userEmail = user?.email || 'mohamed.okash1998@gmail.com';
      const lastSavedAt = new Date().toISOString();
      const currentVersion = (data?.settings?.version || 0) + 1;

      // Copy current Firestore document state (if loaded) to backup field
      updated.settings = {
        ...updated.settings,
        lastSavedAt,
        lastSavedBy: userEmail,
        version: currentVersion,
        backup: data ? JSON.parse(JSON.stringify(data)) : null
      };

      // Validate schema
      validatePortfolioData(updated);
      // Save to Firestore
      await savePortfolio(updated);
      showStatus('success', (t.cms?.saveSuccess || 'Saved successfully! Snapshot version #{version} created.').replace('{version}', currentVersion));
    } catch (err) {
      showStatus('error', (t.cms?.saveError || 'Save Error: {error}').replace('{error}', err.message));
    }
    setIsSaving(false);
  };

  // Safety Rollback
  const handleRollback = () => {
    if (!data?.settings?.backup) {
      showStatus('error', t.cms?.noBackupCloud || 'No backup snapshot found in cloud database.');
      return;
    }
    const backupVer = data.settings.backup.settings?.version || 'N/A';
    const backupTime = new Date(data.settings.backup.settings?.lastSavedAt).toLocaleString();
    if (window.confirm((t.cms?.restoreConfirm || 'Are you sure you want to restore?').replace('{version}', backupVer).replace('{time}', backupTime))) {
      setFormData(JSON.parse(JSON.stringify(data.settings.backup)));
      showStatus('success', t.cms?.restoreSuccess || 'Restored previous snapshot in editor. Press "Save Changes" to publish.');
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    if (!formData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio_backup_v${formData.settings?.version || 1}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showStatus('success', (t.cms?.exportBackup || 'Backup file exported successfully.') + ' ' + (t.cms?.savedSuccess || ''));
  };

  // Import JSON
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.general || !parsed.hero || !parsed.about || !parsed.projects || !parsed.skills || !parsed.experience) {
          showStatus('error', t.cms?.invalidJson || 'Invalid JSON file: Missing core portfolio properties.');
          return;
        }
        setFormData(parsed);
        showStatus('success', t.cms?.importSuccess || 'JSON backup parsed successfully into editor. Press "Save Changes" to apply.');
      } catch (err) {
        showStatus('error', (t.cms?.importError || 'Failed to parse backup JSON file: {error}').replace('{error}', err.message));
      }
    };
    fileReader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  // Reordering controls
  const moveItem = (listKey, index, direction) => {
    const list = [...formData[listKey]];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    
    // Swap
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    setFormData({ ...formData, [listKey]: list });
  };

  const toggleAccordion = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Global Search Engine
  const getSearchResults = () => {
    if (!searchQuery || !formData) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    // Projects
    formData.projects?.forEach(proj => {
      if (proj.title?.toLowerCase().includes(q) || 
          proj.description?.en?.toLowerCase().includes(q) || 
          proj.description?.ar?.toLowerCase().includes(q)) {
        results.push({ tab: 'projects', id: proj.id, name: `Project: ${proj.title}`, desc: proj.category?.en });
      }
    });

    // Skills
    formData.skills?.forEach(group => {
      if (group.category?.en?.toLowerCase().includes(q) || group.category?.ar?.toLowerCase().includes(q)) {
        results.push({ tab: 'skills', id: group.id, name: `Skills Category: ${group.category?.en}`, desc: `${group.items?.length || 0} items` });
      }
      group.items?.forEach(item => {
        if (item.en?.toLowerCase().includes(q) || item.ar?.toLowerCase().includes(q)) {
          results.push({ tab: 'skills', id: group.id, name: `Skill: ${item.en}`, desc: `In Category: ${group.category?.en}` });
        }
      });
    });

    // Experience
    formData.experience?.forEach(exp => {
      if (exp.role?.en?.toLowerCase().includes(q) || exp.company?.en?.toLowerCase().includes(q)) {
        results.push({ tab: 'experience', id: exp.id, name: `Experience: ${exp.role?.en}`, desc: exp.company?.en });
      }
    });

    // Certifications
    formData.certifications?.forEach(cert => {
      const name = cert.name?.en || cert.en || '';
      const provider = cert.provider?.en || '';
      if (name.toLowerCase().includes(q) || provider.toLowerCase().includes(q)) {
        results.push({ tab: 'certifications', id: cert.id, name: `Certification: ${name}`, desc: provider });
      }
    });

    // Achievements
    formData.achievements?.forEach(ach => {
      const label = ach.label?.en || '';
      if (label.toLowerCase().includes(q) || String(ach.value).includes(q)) {
        results.push({ tab: 'achievements', id: ach.id, name: `Achievement: ${ach.value}${ach.suffix} ${label}`, desc: 'Stats counter' });
      }
    });

    // Translations
    Object.keys(formData.translations?.en || {}).forEach(key => {
      const valEn = formData.translations?.en?.[key] || '';
      if (key.toLowerCase().includes(q) || valEn.toLowerCase().includes(q)) {
        results.push({ tab: 'translations', id: key, name: `Translation Key: ${key}`, desc: valEn });
      }
    });

    return results.slice(0, 10);
  };

  const handleSearchResultClick = (result) => {
    setActiveTab(result.tab);
    setSearchQuery('');
    if (result.id) {
      setExpandedItems(prev => ({ ...prev, [result.id]: true }));
      setTimeout(() => {
        const el = document.getElementById(`item-${result.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('bg-zinc-800/60');
          setTimeout(() => el.classList.remove('bg-zinc-800/60'), 2500);
        }
      }, 200);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
        <p className="text-sm font-medium opacity-60">Loading CMS Dashboard...</p>
      </div>
    );
  }

  const searchResults = getSearchResults();

  // --- TABS RENDERING ---

  // Tab 1: General Settings
  const renderGeneralTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-zinc-800 pb-3 mb-4">{t.cms.tabGeneral}</h3>
      <AdminMultiLangInput label={t.cms.siteName} valueObj={formData.general.siteName} onChangeKey={(langKey, val) => {
        const updated = { ...formData };
        updated.general.siteName[langKey] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label={t.cms.logoText} valueObj={formData.general.logoText} onChangeKey={(langKey, val) => {
        const updated = { ...formData };
        updated.general.logoText[langKey] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label={t.cms.brandSubtitle} valueObj={formData.general.brandIdentity} onChangeKey={(langKey, val) => {
        const updated = { ...formData };
        updated.general.brandIdentity[langKey] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label={t.cms.seoDescription} textarea valueObj={formData.general.seoDescription} onChangeKey={(langKey, val) => {
        const updated = { ...formData };
        updated.general.seoDescription[langKey] = val;
        setFormData(updated);
      }} />

      <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/10 space-y-4">
        <h4 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.socialLinks}</h4>
        <AdminInput label={t.cms.githubUrl} value={formData.general.socialLinks.github} onChange={(e) => {
          const updated = { ...formData };
          updated.general.socialLinks.github = e.target.value;
          setFormData(updated);
        }} />
        <AdminInput label={t.cms.linkedinUrl} value={formData.general.socialLinks.linkedin} onChange={(e) => {
          const updated = { ...formData };
          updated.general.socialLinks.linkedin = e.target.value;
          setFormData(updated);
        }} />
        <AdminInput label={t.cms.whatsappNumber} value={formData.general.socialLinks.whatsapp} onChange={(e) => {
          const updated = { ...formData };
          updated.general.socialLinks.whatsapp = e.target.value.replace(/\D/g, '');
          setFormData(updated);
        }} />
      </div>
    </div>
  );

  // Tab 2: Website Structure
  const renderStructureTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-zinc-800 pb-3 mb-4">{t.cms.tabStructure}</h3>
      
      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/10">
        <div>
          <h5 className="font-bold text-sm text-white mb-0.5">{t.cms.showNavbar}</h5>
          <p className="text-xs text-zinc-500">{t.cms.showNavbarDesc}</p>
        </div>
        <button 
          onClick={() => {
            const updated = { ...formData };
            updated.websiteStructure.navbarVisible = !updated.websiteStructure.navbarVisible;
            setFormData(updated);
          }}
          className={`p-2.5 rounded-lg border transition-all ${
            formData.websiteStructure.navbarVisible 
              ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]' 
              : 'border-zinc-800 text-zinc-600'
          }`}
        >
          {formData.websiteStructure.navbarVisible ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.homepageSections}</h4>
        <p className="text-xs text-zinc-500">{t.cms.sectionsDesc}</p>
        
        <div className="space-y-3">
          {formData.websiteStructure.sections.map((sect, idx) => (
            <div key={sect.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  disabled={idx === 0}
                  onClick={() => {
                    const list = [...formData.websiteStructure.sections];
                    const temp = list[idx];
                    list[idx] = list[idx - 1];
                    list[idx - 1] = temp;
                    setFormData({ ...formData, websiteStructure: { ...formData.websiteStructure, sections: list } });
                  }}
                  className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4 text-zinc-400" />
                </button>
                <button
                  disabled={idx === formData.websiteStructure.sections.length - 1}
                  onClick={() => {
                    const list = [...formData.websiteStructure.sections];
                    const temp = list[idx];
                    list[idx] = list[idx + 1];
                    list[idx + 1] = temp;
                    setFormData({ ...formData, websiteStructure: { ...formData.websiteStructure, sections: list } });
                  }}
                  className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4 text-zinc-400" />
                </button>
                <div>
                  <h5 className="font-bold text-sm text-white capitalize">{sect.id.replace('-', ' ')}</h5>
                  <p className="text-[10px] text-zinc-500">{t.cms.projectId || 'ID'}: #{sect.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    const list = [...formData.websiteStructure.sections];
                    list[idx].visible = !list[idx].visible;
                    setFormData({ ...formData, websiteStructure: { ...formData.websiteStructure, sections: list } });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    sect.visible 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-500'
                  }`}
                >
                  {sect.visible ? t.cms.visible : t.cms.hidden}
                </button>

                <div className="w-44 text-right">
                  <input 
                    type="text" 
                    value={sect.title[lang] || sect.title.en || ''} 
                    onChange={(e) => {
                      const list = [...formData.websiteStructure.sections];
                      list[idx].title[lang] = e.target.value;
                      setFormData({ ...formData, websiteStructure: { ...formData.websiteStructure, sections: list } });
                    }}
                    placeholder={t.cms.sectionTitlePlaceholder}
                    className="p-2 w-full rounded bg-black/60 border border-zinc-800 text-xs text-white outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Tab 3: Hero Section
  const renderHeroTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-zinc-800 pb-3 mb-4">{t.cms.sidebarHero}</h3>
      <AdminMultiLangInput label={t.cms.heroTitle1} valueObj={formData.hero.title1} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.hero.title1[key] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label={t.cms.heroTitle2} valueObj={formData.hero.title2} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.hero.title2[key] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label={t.cms.heroTagline} textarea valueObj={formData.hero.tagline} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.hero.tagline[key] = val;
        setFormData(updated);
      }} />

      {/* Roles List */}
      <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/10 space-y-4">
        <h4 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.animatedRoles}</h4>
        <div className="space-y-3">
          {formData.hero.roles.map((role, idx) => (
            <div key={idx} className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button disabled={idx === 0} onClick={() => {
                  const list = [...formData.hero.roles];
                  const temp = list[idx];
                  list[idx] = list[idx - 1];
                  list[idx - 1] = temp;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-zinc-400" /></button>
                <button disabled={idx === formData.hero.roles.length - 1} onClick={() => {
                  const list = [...formData.hero.roles];
                  const temp = list[idx];
                  list[idx] = list[idx + 1];
                  list[idx + 1] = temp;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-zinc-400" /></button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="text" value={role.ar || ''} onChange={(e) => {
                  const list = [...formData.hero.roles];
                  list[idx].ar = e.target.value;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} placeholder={t.cms.arabic} className="p-2 text-xs rounded bg-black/60 border border-zinc-800 text-white" />
                <input type="text" value={role.en || ''} onChange={(e) => {
                  const list = [...formData.hero.roles];
                  list[idx].en = e.target.value;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} placeholder={t.cms.english} className="p-2 text-xs rounded bg-black/60 border border-zinc-800 text-white" />
                <input type="text" value={role.ur || ''} onChange={(e) => {
                  const list = [...formData.hero.roles];
                  list[idx].ur = e.target.value;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} placeholder={t.cms.urdu} className="p-2 text-xs rounded bg-black/60 border border-zinc-800 text-white" />
              </div>

              <button 
                onClick={() => {
                  const list = formData.hero.roles.filter((_, i) => i !== idx);
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} 
                className="p-2 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={() => {
            const list = [...formData.hero.roles, { ar: '', en: '', ur: '' }];
            setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
          }}
          className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewRole}
        </button>
      </div>

      {/* Hero statistics */}
      <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/10 space-y-4">
        <h4 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.heroStats}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminInput label={t.cms.yearsExpLabel} type="number" value={formData.hero.statistics.experienceYears} onChange={(e) => {
            const updated = { ...formData };
            updated.hero.statistics.experienceYears = Number(e.target.value);
            setFormData(updated);
          }} />
          <AdminInput label={t.cms.projectsBuiltLabel} type="number" value={formData.hero.statistics.projectsBuilt} onChange={(e) => {
            const updated = { ...formData };
            updated.hero.statistics.projectsBuilt = Number(e.target.value);
            setFormData(updated);
          }} />
          <AdminInput label={t.cms.certsCountLabel} type="number" value={formData.hero.statistics.certificationsCount} onChange={(e) => {
            const updated = { ...formData };
            updated.hero.statistics.certificationsCount = Number(e.target.value);
            setFormData(updated);
          }} />
        </div>
      </div>
    </div>
  );

  // Tab 4: About Section
  const renderAboutTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-zinc-800 pb-3 mb-4">{t.cms.sidebarAbout}</h3>
      <AdminMultiLangInput label={t.cms.aboutTitleLabel} valueObj={formData.about.title} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.about.title[key] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label={t.cms.aboutSubtitleLabel} valueObj={formData.about.subtitle} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.about.subtitle[key] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label={t.cms.aboutTextLabel} textarea valueObj={formData.about.text} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.about.text[key] = val;
        setFormData(updated);
      }} />
    </div>
  );

  // Helper local search input
  const renderListFilterBar = (placeholder = "Search items...") => (
    <div className="mb-4 relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <input 
        type="text" 
        value={localListFilter} 
        onChange={(e) => setLocalListFilter(e.target.value)} 
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 outline-none focus:border-[var(--primary)]"
      />
    </div>
  );

  // Tab 5: Projects
  const renderProjectsTab = () => {
    const filteredProjects = formData.projects.filter(p => 
      p.title?.toLowerCase().includes(localListFilter.toLowerCase()) || 
      p.id?.toLowerCase().includes(localListFilter.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.projectsTitleLabel}</h3>
          <button 
            onClick={() => {
              const updated = { ...formData };
              const newId = `project-${Date.now()}`;
              updated.projects.push({
                id: newId,
                title: 'New Project',
                category: { ar: '', en: '', ur: '' },
                description: { ar: '', en: '', ur: '' },
                challenges: { ar: '', en: '', ur: '' },
                architecture: { ar: '', en: '', ur: '' },
                businessValue: { ar: '', en: '', ur: '' },
                features: [],
                tech: [],
                iconType: 'shield',
                demoLink: '',
                githubLink: '',
                projectType: 'commercial',
                status: 'completed',
                featured: false
              });
              setFormData(updated);
              setExpandedItems(prev => ({ ...prev, [newId]: true }));
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t.cms.addNewProject}
          </button>
        </div>

        {renderListFilterBar(t.cms.searchProjectsPlaceholder)}

        <div className="space-y-4">
          {filteredProjects.map((proj, idx) => {
            const isExpanded = !!expandedItems[proj.id];
            const isFeatured = !!(proj.featured || formData.settings.featuredProjects.includes(proj.id));
            const globalIndex = formData.projects.findIndex(p => p.id === proj.id);

            return (
              <div key={proj.id} id={`item-${proj.id}`} className="rounded-xl border border-zinc-800 bg-zinc-900/10 overflow-hidden transition-all duration-300">
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => toggleAccordion(proj.id)}
                  className="p-4 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-950 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        disabled={globalIndex === 0}
                        onClick={(e) => { e.stopPropagation(); moveItem('projects', globalIndex, 'up'); }}
                        className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                      <button 
                        disabled={globalIndex === formData.projects.length - 1}
                        onClick={(e) => { e.stopPropagation(); moveItem('projects', globalIndex, 'down'); }}
                        className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        {proj.title || t.cms.untitledProject || 'Untitled Project'}
                        {isFeatured && <span className="text-[9px] font-black uppercase bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] px-2 py-0.5 rounded">{t.cms.featured}</span>}
                      </h4>
                      <p className="text-[10px] text-zinc-500">{t.cms.projectId}: {proj.id} | {t.cms.projectType}: {proj.projectType || 'N/A'} | {t.cms.projectStatus}: {proj.status || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = { ...formData };
                        const targetProj = updated.projects[globalIndex];
                        const nextFeatured = !targetProj.featured;
                        targetProj.featured = nextFeatured;
                        
                        if (nextFeatured) {
                          if (!updated.settings.featuredProjects.includes(proj.id)) {
                            updated.settings.featuredProjects.push(proj.id);
                          }
                        } else {
                          updated.settings.featuredProjects = updated.settings.featuredProjects.filter(id => id !== proj.id);
                        }
                        setFormData(updated);
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-extrabold border transition-all ${
                        isFeatured 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'border-zinc-800 text-zinc-500 hover:text-white'
                      }`}
                    >
                      {isFeatured ? t.cms.featured : t.cms.makeFeatured}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(t.cms.confirmDelete)) {
                          const updated = { ...formData };
                          updated.projects = updated.projects.filter(p => p.id !== proj.id);
                          updated.settings.featuredProjects = updated.settings.featuredProjects.filter(id => id !== proj.id);
                          setFormData(updated);
                        }
                      }}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Card Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-zinc-900 bg-black/30 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdminInput label={t.cms.projectIdLabel} value={proj.id} onChange={(e) => {
                        const updated = { ...formData };
                        updated.projects[globalIndex].id = e.target.value.toLowerCase().replace(/\s+/g, '-');
                        setFormData(updated);
                      }} />
                      <AdminInput label={t.cms.projectTitle} value={proj.title} onChange={(e) => {
                        const updated = { ...formData };
                        updated.projects[globalIndex].title = e.target.value;
                        setFormData(updated);
                      }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdminInput label={t.cms.projectTypeLabel} value={proj.projectType || ''} onChange={(e) => {
                        const updated = { ...formData };
                        updated.projects[globalIndex].projectType = e.target.value;
                        setFormData(updated);
                      }} />
                      <AdminInput label={t.cms.projectStatusLabel} value={proj.status || ''} onChange={(e) => {
                        const updated = { ...formData };
                        updated.projects[globalIndex].status = e.target.value;
                        setFormData(updated);
                      }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdminInput label={t.cms.demoUrl} value={proj.demoLink || ''} onChange={(e) => {
                        const updated = { ...formData };
                        updated.projects[globalIndex].demoLink = e.target.value;
                        setFormData(updated);
                      }} />
                      <AdminInput label={t.cms.sourceUrl} value={proj.githubLink || ''} onChange={(e) => {
                        const updated = { ...formData };
                        updated.projects[globalIndex].githubLink = e.target.value;
                        setFormData(updated);
                      }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdminInput label={t.cms.projectIconLabel || t.cms.skillIcon} value={proj.iconType || 'shield'} onChange={(e) => {
                        const updated = { ...formData };
                        updated.projects[globalIndex].iconType = e.target.value;
                        setFormData(updated);
                      }} />
                      <AdminMultiLangInput label={t.cms.projectCategory} valueObj={proj.category} onChangeKey={(key, val) => {
                        const updated = { ...formData };
                        updated.projects[globalIndex].category[key] = val;
                        setFormData(updated);
                      }} />
                    </div>

                    <AdminMultiLangInput label={t.cms.projectDescLabel} textarea valueObj={proj.description} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      updated.projects[globalIndex].description[key] = val;
                      setFormData(updated);
                    }} />

                    <AdminMultiLangInput label={t.cms.projectChallenges} textarea valueObj={proj.challenges} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      updated.projects[globalIndex].challenges[key] = val;
                      setFormData(updated);
                    }} />

                    <AdminMultiLangInput label={t.cms.projectArch} textarea valueObj={proj.architecture} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      updated.projects[globalIndex].architecture[key] = val;
                      setFormData(updated);
                    }} />

                    <AdminMultiLangInput label={t.cms.projectImpact} textarea valueObj={proj.businessValue} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      updated.projects[globalIndex].businessValue[key] = val;
                      setFormData(updated);
                    }} />

                    {/* Features List */}
                    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 space-y-3">
                      <h5 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.projectKeyFeatures}</h5>
                      <div className="space-y-3">
                        {proj.features.map((feat, fIdx) => (
                          <div key={fIdx} className="p-3 border border-zinc-800 rounded bg-black/40 flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <AdminMultiLangInput label={`${t.cms.featureLabel || 'Feature'} #${fIdx + 1}`} valueObj={feat} onChangeKey={(key, val) => {
                                const updated = { ...formData };
                                updated.projects[globalIndex].features[fIdx][key] = val;
                                setFormData(updated);
                              }} />
                            </div>
                            <button 
                              onClick={() => {
                                const updated = { ...formData };
                                updated.projects[globalIndex].features = updated.projects[globalIndex].features.filter((_, i) => i !== fIdx);
                                setFormData(updated);
                              }}
                              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer shrink-0 self-end mb-5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const updated = { ...formData };
                          updated.projects[globalIndex].features.push({ ar: '', en: '', ur: '' });
                          setFormData(updated);
                        }}
                        className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> {t.cms.addNewFeature}
                      </button>
                    </div>

                    {/* Tech Stack List */}
                    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 space-y-3">
                      <h5 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.techStackDetails}</h5>
                      <div className="space-y-3">
                        {proj.tech.map((tItem, tIdx) => {
                          const valObj = typeof tItem === 'string' ? { ar: tItem, en: tItem, ur: tItem } : tItem;
                          return (
                            <div key={tIdx} className="p-3 border border-zinc-800 rounded bg-black/40 flex items-center justify-between gap-3">
                              <div className="flex-1">
                                <AdminMultiLangInput label={`${t.cms.technologyLabel || 'Technology'} #${tIdx + 1}`} valueObj={valObj} onChangeKey={(key, val) => {
                                  const updated = { ...formData };
                                  if (typeof updated.projects[globalIndex].tech[tIdx] === 'string') {
                                    const prevVal = updated.projects[globalIndex].tech[tIdx];
                                    updated.projects[globalIndex].tech[tIdx] = { ar: prevVal, en: prevVal, ur: prevVal };
                                  }
                                  updated.projects[globalIndex].tech[tIdx][key] = val;
                                  setFormData(updated);
                                }} />
                              </div>
                              <button 
                                onClick={() => {
                                  const updated = { ...formData };
                                  updated.projects[globalIndex].tech = updated.projects[globalIndex].tech.filter((_, i) => i !== tIdx);
                                  setFormData(updated);
                                }}
                                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer shrink-0 self-end mb-5"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <button 
                        onClick={() => {
                          const updated = { ...formData };
                          updated.projects[globalIndex].tech.push({ ar: '', en: '', ur: '' });
                          setFormData(updated);
                        }}
                        className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> {t.cms.addNewTech}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Tab 6: Skills
  const renderSkillsTab = () => {
    const filteredSkills = formData.skills.filter(s => 
      s.category?.en?.toLowerCase().includes(localListFilter.toLowerCase()) ||
      s.category?.ar?.toLowerCase().includes(localListFilter.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.skillsTitleLabel}</h3>
          <button 
            onClick={() => {
              const updated = { ...formData };
              const newId = `skill-${Date.now()}`;
              updated.skills.push({ id: newId, category: { ar: '', en: '', ur: '' }, iconType: 'shield', items: [] });
              setFormData(updated);
              setExpandedItems(prev => ({ ...prev, [newId]: true }));
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t.cms.addNewSkillCategory || 'Add Category'}
          </button>
        </div>

        {renderListFilterBar(t.cms.searchSkillsPlaceholder)}

        <div className="space-y-4">
          {filteredSkills.map((group, idx) => {
            const isExpanded = !!expandedItems[group.id];
            const globalIndex = formData.skills.findIndex(s => s.id === group.id);

            return (
              <div key={group.id} id={`item-${group.id}`} className="rounded-xl border border-zinc-800 bg-zinc-900/10 overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => toggleAccordion(group.id)}
                  className="p-4 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-950 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled={globalIndex === 0} onClick={(e) => { e.stopPropagation(); moveItem('skills', globalIndex, 'up'); }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-zinc-400" /></button>
                      <button disabled={globalIndex === formData.skills.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('skills', globalIndex, 'down'); }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-zinc-400" /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{group.category?.[lang] || group.category?.en || t.cms.untitledGroup || 'Untitled Group'}</h4>
                      <p className="text-[10px] text-zinc-500">{group.items?.length || 0} {t.cms.skillsInside}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t.cms.confirmDelete)) {
                        const updated = { ...formData };
                        updated.skills = updated.skills.filter(s => s.id !== group.id);
                        setFormData(updated);
                      }
                    }}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-zinc-900 bg-black/30 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdminMultiLangInput label={t.cms.skillCategory} valueObj={group.category} onChangeKey={(key, val) => {
                        const updated = { ...formData };
                        updated.skills[globalIndex].category[key] = val;
                        setFormData(updated);
                      }} />
                      <AdminInput label={t.cms.skillIcon} value={group.iconType} onChange={(e) => {
                        const updated = { ...formData };
                        updated.skills[globalIndex].iconType = e.target.value;
                        setFormData(updated);
                      }} />
                    </div>

                    {/* Skill items list */}
                    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 space-y-3">
                      <h5 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.individualSkills}</h5>
                      <div className="space-y-3">
                        {group.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="p-3 border border-zinc-800 rounded bg-black/40 flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <AdminMultiLangInput label={`${t.cms.skillLabel} #${itemIdx + 1}`} valueObj={item} onChangeKey={(key, val) => {
                                const updated = { ...formData };
                                updated.skills[globalIndex].items[itemIdx][key] = val;
                                setFormData(updated);
                              }} />
                            </div>
                            <button 
                              onClick={() => {
                                const updated = { ...formData };
                                updated.skills[globalIndex].items = updated.skills[globalIndex].items.filter((_, i) => i !== itemIdx);
                                setFormData(updated);
                              }}
                              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer shrink-0 self-end mb-5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const updated = { ...formData };
                          updated.skills[globalIndex].items.push({ ar: '', en: '', ur: '' });
                          setFormData(updated);
                        }}
                        className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> {t.cms.addNewSkillItem}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Tab 7: Experience
  const renderExperienceTab = () => {
    const filteredExp = formData.experience.filter(e => 
      e.company?.en?.toLowerCase().includes(localListFilter.toLowerCase()) ||
      e.role?.en?.toLowerCase().includes(localListFilter.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.experienceTitleLabel}</h3>
          <button 
            onClick={() => {
              const updated = { ...formData };
              const newId = `exp-${Date.now()}`;
              updated.experience.push({
                id: newId,
                role: { ar: '', en: '', ur: '' },
                company: { ar: '', en: '', ur: '' },
                period: { ar: '', en: '', ur: '' },
                description: { ar: '', en: '', ur: '' }
              });
              setFormData(updated);
              setExpandedItems(prev => ({ ...prev, [newId]: true }));
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t.cms.addNewExp}
          </button>
        </div>

        {renderListFilterBar(t.cms.searchExperiencePlaceholder)}

        <div className="space-y-4">
          {filteredExp.map((exp, idx) => {
            const isExpanded = !!expandedItems[exp.id];
            const globalIndex = formData.experience.findIndex(e => e.id === exp.id);

            return (
              <div key={exp.id} id={`item-${exp.id}`} className="rounded-xl border border-zinc-800 bg-zinc-900/10 overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => toggleAccordion(exp.id)}
                  className="p-4 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-950 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled={globalIndex === 0} onClick={(e) => { e.stopPropagation(); moveItem('experience', globalIndex, 'up'); }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-zinc-400" /></button>
                      <button disabled={globalIndex === formData.experience.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('experience', globalIndex, 'down'); }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-zinc-400" /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{exp.role?.[lang] || exp.role?.en || t.cms.untitledJob}</h4>
                      <p className="text-[10px] text-zinc-500">{exp.company?.[lang] || exp.company?.en} • {exp.period?.[lang] || exp.period?.en}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t.cms.confirmDelete)) {
                        const updated = { ...formData };
                        updated.experience = updated.experience.filter(e => e.id !== exp.id);
                        setFormData(updated);
                      }
                    }}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-zinc-900 bg-black/30 space-y-6">
                    <AdminMultiLangInput label={t.cms.roleTitle} valueObj={exp.role} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      updated.experience[globalIndex].role[key] = val;
                      setFormData(updated);
                    }} />
                    <AdminMultiLangInput label={t.cms.companyName} valueObj={exp.company} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      updated.experience[globalIndex].company[key] = val;
                      setFormData(updated);
                    }} />
                    <AdminMultiLangInput label={t.cms.periodDates} valueObj={exp.period} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      updated.experience[globalIndex].period[key] = val;
                      setFormData(updated);
                    }} />
                    <AdminMultiLangInput label={t.cms.responsibilities} textarea valueObj={exp.description} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      updated.experience[globalIndex].description[key] = val;
                      setFormData(updated);
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Tab 8: Certifications
  const renderCertificationsTab = () => {
    const filteredCerts = formData.certifications.filter(c => {
      const name = c.name?.en || c.en || '';
      return name.toLowerCase().includes(localListFilter.toLowerCase());
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.certsTitleLabel}</h3>
          <button 
            onClick={() => {
              const updated = { ...formData };
              const newId = `cert-${Date.now()}`;
              updated.certifications.push({
                id: newId,
                en: 'New Certificate',
                ar: 'شهادة جديدة',
                ur: 'نئی سند',
                name: { en: 'New Certificate', ar: 'شهادة جديدة', ur: 'نئی سند' },
                provider: { en: '', ar: '', ur: '' },
                date: { en: '', ar: '', ur: '' }
              });
              setFormData(updated);
              setExpandedItems(prev => ({ ...prev, [newId]: true }));
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t.cms.addNewCert}
          </button>
        </div>

        {renderListFilterBar(t.cms.searchCertsPlaceholder)}

        <div className="space-y-4">
          {filteredCerts.map((cert, idx) => {
            const isExpanded = !!expandedItems[cert.id];
            const globalIndex = formData.certifications.findIndex(c => c.id === cert.id);
            const name = cert.name?.[lang] || cert[lang] || t.cms.untitledCert;

            return (
              <div key={cert.id} id={`item-${cert.id}`} className="rounded-xl border border-zinc-800 bg-zinc-900/10 overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => toggleAccordion(cert.id)}
                  className="p-4 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-950 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled={globalIndex === 0} onClick={(e) => { e.stopPropagation(); moveItem('certifications', globalIndex, 'up'); }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-zinc-400" /></button>
                      <button disabled={globalIndex === formData.certifications.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('certifications', globalIndex, 'down'); }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-zinc-400" /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{name}</h4>
                      <p className="text-[10px] text-zinc-500">{t.cms.providerLabel}: {cert.provider?.[lang] || cert.provider?.en || 'N/A'}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t.cms.confirmDelete)) {
                        const updated = { ...formData };
                        updated.certifications = updated.certifications.filter(c => c.id !== cert.id);
                        setFormData(updated);
                      }
                    }}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-zinc-900 bg-black/30 space-y-6">
                    <AdminInput label={t.cms.certIdLabel} value={cert.id} onChange={(e) => {
                      const updated = { ...formData };
                      updated.certifications[globalIndex].id = e.target.value;
                      setFormData(updated);
                    }} />

                    <AdminMultiLangInput label={t.cms.certName} valueObj={cert.name || { ar: cert.ar, en: cert.en, ur: cert.ur }} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      if (!updated.certifications[globalIndex].name) {
                        updated.certifications[globalIndex].name = { ar: cert.ar, en: cert.en, ur: cert.ur };
                      }
                      updated.certifications[globalIndex].name[key] = val;
                      updated.certifications[globalIndex][key] = val; // maintain flat keys too
                      setFormData(updated);
                    }} />

                    <AdminMultiLangInput label={t.cms.certProvider} valueObj={cert.provider || { ar: '', en: '', ur: '' }} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      if (!updated.certifications[globalIndex].provider) {
                        updated.certifications[globalIndex].provider = { ar: '', en: '', ur: '' };
                      }
                      updated.certifications[globalIndex].provider[key] = val;
                      setFormData(updated);
                    }} />

                    <AdminMultiLangInput label={t.cms.certDate} valueObj={cert.date || { ar: '', en: '', ur: '' }} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      if (!updated.certifications[globalIndex].date) {
                        updated.certifications[globalIndex].date = { ar: '', en: '', ur: '' };
                      }
                      updated.certifications[globalIndex].date[key] = val;
                      setFormData(updated);
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Tab 9: Achievements
  const renderAchievementsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.achievementsTitleLabel}</h3>
        <button 
          onClick={() => {
            const updated = { ...formData };
            const newId = `stat-${Date.now()}`;
            updated.achievements.push({
              id: newId,
              value: 0,
              suffix: '+',
              label: { ar: '', en: '', ur: '' }
            });
            setFormData(updated);
            setExpandedItems(prev => ({ ...prev, [newId]: true }));
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewAch}
        </button>
      </div>

      <div className="space-y-4">
        {formData.achievements.map((ach, idx) => {
          const isExpanded = !!expandedItems[ach.id];
          return (
            <div key={ach.id} id={`item-${ach.id}`} className="rounded-xl border border-zinc-800 bg-zinc-900/10 overflow-hidden transition-all duration-300">
              <div 
                onClick={() => toggleAccordion(ach.id)}
                className="p-4 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-950 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button disabled={idx === 0} onClick={(e) => { e.stopPropagation(); moveItem('achievements', idx, 'up'); }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-zinc-400" /></button>
                    <button disabled={idx === formData.achievements.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('achievements', idx, 'down'); }} className="p-1 rounded hover:bg-zinc-800 disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-zinc-400" /></button>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{ach.value}{ach.suffix} {ach.label?.[lang] || ach.label?.en || t.cms.untitled}</h4>
                    <p className="text-[10px] text-zinc-500">{t.cms.achIdLabel}: {ach.id}</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(t.cms.confirmDelete)) {
                      const updated = { ...formData };
                      updated.achievements = updated.achievements.filter(a => a.id !== ach.id);
                      setFormData(updated);
                    }
                  }}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-zinc-900 bg-black/30 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput label={t.cms.achValue} type="number" value={ach.value} onChange={(e) => {
                      const updated = { ...formData };
                      updated.achievements[idx].value = Number(e.target.value);
                      setFormData(updated);
                    }} />
                    <AdminInput label={t.cms.achSuffix} value={ach.suffix} onChange={(e) => {
                      const updated = { ...formData };
                      updated.achievements[idx].suffix = e.target.value;
                      setFormData(updated);
                    }} />
                  </div>
                  <AdminMultiLangInput label={t.cms.achLabel} valueObj={ach.label} onChangeKey={(key, val) => {
                    const updated = { ...formData };
                    updated.achievements[idx].label[key] = val;
                    setFormData(updated);
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Tab 10: Contact
  const renderContactTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-zinc-800 pb-3 mb-4">{t.cms.contactTitleLabel}</h3>
      <AdminInput label={t.cms.contactEmail} value={formData.contact.email} onChange={(e) => {
        const updated = { ...formData };
        updated.contact.email = e.target.value;
        setFormData(updated);
      }} />
      <AdminInput label={t.cms.githubUrl} value={formData.contact.github} onChange={(e) => {
        const updated = { ...formData };
        updated.contact.github = e.target.value;
        setFormData(updated);
      }} />
      <AdminInput label={t.cms.contactPhone} value={formData.contact.whatsapp} onChange={(e) => {
        const updated = { ...formData };
        updated.contact.whatsapp = e.target.value.replace(/\D/g, '');
        setFormData(updated);
      }} />
      <AdminInput label={t.cms.linkedinUrl} value={formData.contact.linkedin || ''} onChange={(e) => {
        const updated = { ...formData };
        updated.contact.linkedin = e.target.value;
        setFormData(updated);
      }} />
    </div>
  );

  // Tab 11: Translations Editor
  const renderTranslationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-zinc-800 pb-3 mb-4">{t.cms.translationsTitle}</h3>
      <p className="text-xs text-zinc-500">{t.cms.translationsDesc}</p>
      
      {renderListFilterBar(t.cms.searchTranslationsPlaceholder)}

      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
        {Object.keys(formData.translations?.en || {})
          .filter(key => key.toLowerCase().includes(localListFilter.toLowerCase()) || (formData.translations.en[key] || '').toLowerCase().includes(localListFilter.toLowerCase()))
          .map(key => (
            <div key={key} id={`item-${key}`} className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/20 space-y-3">
              <span className="text-xs font-bold text-[var(--primary)] font-mono block border-b border-zinc-900 pb-1.5">{t.cms.transKey}: {key}</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5 block">{t.cms.arabicLabel}</span>
                  <input type="text" dir="rtl" value={formData.translations.ar?.[key] || ''} onChange={(e) => {
                    const updated = { ...formData };
                    updated.translations.ar[key] = e.target.value;
                    setFormData(updated);
                  }} className="w-full p-2 bg-black/60 border border-zinc-800 text-xs rounded text-white" />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5 block">{t.cms.englishLabel}</span>
                  <input type="text" dir="ltr" value={formData.translations.en?.[key] || ''} onChange={(e) => {
                    const updated = { ...formData };
                    updated.translations.en[key] = e.target.value;
                    setFormData(updated);
                  }} className="w-full p-2 bg-black/60 border border-zinc-800 text-xs rounded text-white" />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5 block">{t.cms.urduLabel}</span>
                  <input type="text" dir="rtl" value={formData.translations.ur?.[key] || ''} onChange={(e) => {
                    const updated = { ...formData };
                    updated.translations.ur[key] = e.target.value;
                    setFormData(updated);
                  }} className="w-full p-2 bg-black/60 border border-zinc-800 text-xs text-white rounded" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // Tab 12: Theme Settings & Theme Builder
  const renderThemeTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-zinc-800 pb-3 mb-4">{t.cms.themeSettingsTitle}</h3>
      
      <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/10 space-y-4">
        <h4 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.defaultVisualSettings}</h4>
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-400">{t.cms.defaultTheme}</label>
          <select 
            value={formData.themeSettings.defaultTheme} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.defaultTheme = e.target.value;
              setFormData(updated);
            }}
            className="w-full p-3 rounded-lg bg-black border border-zinc-800 text-white outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="dark">{t.cms.themeDark || 'Dark Obsidian'}</option>
            <option value="ocean">{t.cms.themeOcean || 'Ocean Blue'}</option>
            <option value="aurora">{t.cms.themeAurora || 'Aurora Green'}</option>
            <option value="platinum">{t.cms.themePlatinum || 'Platinum Silver'}</option>
            <option value="midnight">{t.cms.themeMidnight || 'Midnight Purple'}</option>
          </select>
        </div>
      </div>

      <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/10 space-y-5">
        <h4 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.themeBuilderTitle}</h4>
        <p className="text-xs text-zinc-500">{t.cms.themeBuilderDesc}</p>
        
        {/* Accent Color picker */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <AdminInput label={t.cms.accentColor} value={formData.themeSettings.accentColor} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.accentColor = e.target.value;
              setFormData(updated);
            }} />
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{t.cms.picker}</span>
            <input type="color" value={formData.themeSettings.accentColor} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.accentColor = e.target.value;
              setFormData(updated);
            }} className="w-12 h-12 rounded border border-zinc-800 bg-transparent cursor-pointer" />
          </div>
        </div>

        {/* Glass opacity slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-zinc-400">{t.cms.glassOpacity}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.glassOpacity}</span>
          </div>
          <input type="range" min="0.0" max="0.3" step="0.01" value={formData.themeSettings.glassOpacity} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.glassOpacity = Number(e.target.value);
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
        </div>

        {/* Glass blur strength */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-zinc-400">{t.cms.backdropBlur}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.blurStrength}px</span>
          </div>
          <input type="range" min="0" max="40" step="1" value={formData.themeSettings.blurStrength} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.blurStrength = Number(e.target.value);
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
        </div>

        {/* Glass border opacity */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-zinc-400">{t.cms.borderOpacity}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.borderOpacity}</span>
          </div>
          <input type="range" min="0.0" max="0.2" step="0.01" value={formData.themeSettings.borderOpacity} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.borderOpacity = Number(e.target.value);
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
        </div>

        {/* Mouse Glow intensity */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-zinc-400">{t.cms.cursorGlow}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.glowIntensity}</span>
          </div>
          <input type="range" min="0.0" max="1.0" step="0.05" value={formData.themeSettings.glowIntensity} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.glowIntensity = Number(e.target.value);
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
        </div>

        {/* Background ambient blobs intensity */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-zinc-400">{t.cms.ambientBlob}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.bgIntensity}</span>
          </div>
          <input type="range" min="0.0" max="0.5" step="0.01" value={formData.themeSettings.bgIntensity} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.bgIntensity = Number(e.target.value);
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
        </div>
      </div>

      {/* Typography settings controls */}
      <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/10 space-y-5">
        <h4 className="font-extrabold text-xs text-zinc-400 uppercase">{t.cms.typographySettingsTitle}</h4>
        
        {/* Font Family */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-400">{t.cms.fontFamily}</label>
          <select 
            value={formData.themeSettings.fontFamily || 'Inter'} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.fontFamily = e.target.value;
              setFormData(updated);
            }}
            className="w-full p-3 rounded-lg bg-black border border-zinc-800 text-white outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="Inter">Inter</option>
            <option value="Cairo">Cairo</option>
            <option value="Tajawal">Tajawal</option>
            <option value="IBM Plex Sans">IBM Plex Sans</option>
            <option value="Poppins">Poppins</option>
          </select>
        </div>

        {/* Font Scale slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-zinc-400">{t.cms.fontScale}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.fontScale || 1.0}x</span>
          </div>
          <input type="range" min="0.8" max="1.4" step="0.05" value={formData.themeSettings.fontScale || 1.0} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.fontScale = Number(e.target.value);
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
        </div>

        {/* Heading Weight selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-400">{t.cms.headingWeight}</label>
          <select 
            value={formData.themeSettings.headingWeight || '800'} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.headingWeight = e.target.value;
              setFormData(updated);
            }}
            className="w-full p-3 rounded-lg bg-black border border-zinc-800 text-white outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="400">400 ({t.cms.weightRegular || 'Regular'})</option>
            <option value="500">500 ({t.cms.weightMedium || 'Medium'})</option>
            <option value="600">600 ({t.cms.weightSemibold || 'Semibold'})</option>
            <option value="700">700 ({t.cms.weightBold || 'Bold'})</option>
            <option value="800">800 ({t.cms.weightExtraBold || 'Extra Bold'})</option>
          </select>
        </div>

        {/* Body Weight selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-400">{t.cms.bodyWeight}</label>
          <select 
            value={formData.themeSettings.bodyWeight || '300'} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.bodyWeight = e.target.value;
              setFormData(updated);
            }}
            className="w-full p-3 rounded-lg bg-black border border-zinc-800 text-white outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="300">300 ({t.cms.weightLight || 'Light'})</option>
            <option value="400">400 ({t.cms.weightRegular || 'Regular'})</option>
            <option value="500">500 ({t.cms.weightMedium || 'Medium'})</option>
          </select>
        </div>

        {/* Font Color picker */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <AdminInput label={t.cms.fontColor} value={formData.themeSettings.fontColor || '#fafafa'} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.fontColor = e.target.value;
              setFormData(updated);
            }} />
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{t.cms.picker}</span>
            <input type="color" value={formData.themeSettings.fontColor || '#fafafa'} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.fontColor = e.target.value;
              setFormData(updated);
            }} className="w-12 h-12 rounded border border-zinc-800 bg-transparent cursor-pointer" />
          </div>
        </div>

        {/* Heading Color picker */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <AdminInput label={t.cms.headingColor} value={formData.themeSettings.headingColor || '#fafafa'} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.headingColor = e.target.value;
              setFormData(updated);
            }} />
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{t.cms.picker}</span>
            <input type="color" value={formData.themeSettings.headingColor || '#fafafa'} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.headingColor = e.target.value;
              setFormData(updated);
            }} className="w-12 h-12 rounded border border-zinc-800 bg-transparent cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );

  // Tab 13: Media & Branding
  const renderBrandingTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-zinc-800 pb-3 mb-4">{t.cms.mediaBrandingTitle}</h3>
      <AdminInput label={t.cms.preloaderLogo} value={formData.mediaBranding.preloaderLogo || ''} onChange={(e) => {
        const updated = { ...formData };
        updated.mediaBranding.preloaderLogo = e.target.value;
        setFormData(updated);
      }} />
      <AdminInput label={t.cms.faviconPath} value={formData.mediaBranding.favicon || ''} onChange={(e) => {
        const updated = { ...formData };
        updated.mediaBranding.favicon = e.target.value;
        setFormData(updated);
      }} />
      <AdminInput label={t.cms.seoImagePath} value={formData.mediaBranding.seoImage || ''} onChange={(e) => {
        const updated = { ...formData };
        updated.mediaBranding.seoImage = e.target.value;
        setFormData(updated);
      }} />
      <AdminInput label={t.cms.ogImagePath} value={formData.mediaBranding.openGraphImage || ''} onChange={(e) => {
        const updated = { ...formData };
        updated.mediaBranding.openGraphImage = e.target.value;
        setFormData(updated);
      }} />
      <AdminInput label={t.cms.brandLogo} value={formData.mediaBranding.logo || ''} onChange={(e) => {
        const updated = { ...formData };
        updated.mediaBranding.logo = e.target.value;
        setFormData(updated);
      }} />
    </div>
  );

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab();
      case 'structure': return renderStructureTab();
      case 'hero': return renderHeroTab();
      case 'about': return renderAboutTab();
      case 'projects': return renderProjectsTab();
      case 'skills': return renderSkillsTab();
      case 'experience': return renderExperienceTab();
      case 'certifications': return renderCertificationsTab();
      case 'achievements': return renderAchievementsTab();
      case 'contact': return renderContactTab();
      case 'translations': return renderTranslationsTab();
      case 'theme': return renderThemeTab();
      case 'branding': return renderBrandingTab();
      default: return renderGeneralTab();
    }
  };

  // --- STICKY REAL-TIME PREVIEW WINDOW ---
  const renderPreviewPanel = () => {
    return (
      <div 
        className="w-full h-full p-6 border border-zinc-800 bg-[#070709] rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[300px]"
        style={{
          '--accent-color': formData.themeSettings.accentColor,
          '--primary': formData.themeSettings.accentColor,
          '--glass-opacity': formData.themeSettings.glassOpacity,
          '--border-opacity': formData.themeSettings.borderOpacity,
          '--blur-strength': `${formData.themeSettings.blurStrength}px`,
          '--font-family-setting': formData.themeSettings.fontFamily ? `'${formData.themeSettings.fontFamily}', sans-serif` : 'sans-serif',
          '--font-scale-setting': formData.themeSettings.fontScale !== undefined ? formData.themeSettings.fontScale : 1.0,
          '--heading-weight-setting': formData.themeSettings.headingWeight || '800',
          '--body-weight-setting': formData.themeSettings.bodyWeight || '300',
          '--font-color-setting': formData.themeSettings.fontColor || '#fafafa',
          '--heading-color-setting': formData.themeSettings.headingColor || '#fafafa',
          'fontFamily': formData.themeSettings.fontFamily ? `'${formData.themeSettings.fontFamily}', sans-serif` : 'sans-serif',
          'fontSize': `calc(100% * ${formData.themeSettings.fontScale || 1.0})`,
          '--heading-weight': formData.themeSettings.headingWeight || '800',
          '--body-weight': formData.themeSettings.bodyWeight || '300',
          '--font-color': formData.themeSettings.fontColor || '#fafafa',
          '--heading-color': formData.themeSettings.headingColor || '#fafafa'
        }}
      >
        {/* Glow ambient spot */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-300" 
          style={{
            background: formData.themeSettings.accentColor,
            opacity: formData.themeSettings.glowIntensity * 0.4
          }}
        />

        <div className="relative z-10 space-y-4" style={{ color: 'var(--font-color)' }}>
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            <span>{t.cms?.previewCardTitle}</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {t.cms?.realtime}</span>
          </div>

          {activeTab === 'general' && (
            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 space-y-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">{t.cms?.previewLogo}</span>
              <div className="text-lg font-black text-white" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.general.logoText[lang] || formData.general.logoText.en}</div>
              <div className="text-xs text-zinc-400" style={{ fontWeight: 'var(--body-weight)' }}>{formData.general.brandIdentity[lang] || formData.general.brandIdentity.en}</div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">{t.cms?.previewFlow}</span>
              <div className="space-y-1.5">
                {formData.websiteStructure.sections.map(s => (
                  <div key={s.id} className={`p-2 rounded text-[10px] font-bold border flex items-center justify-between ${
                    s.visible ? 'bg-[var(--accent-color)]/5 border-[var(--accent-color)]/20 text-white' : 'bg-black/10 border-zinc-900 text-zinc-500'
                  }`}>
                    <span className="capitalize">{s.id}</span>
                    <span>{s.visible ? t.cms.on : t.cms.off}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 uppercase">{t.cms.availableBadge}</div>
              <h4 className="text-xl font-black text-white leading-tight" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>
                {formData.hero.title1[lang] || formData.hero.title1.en}<br />
                <span style={{ color: formData.themeSettings.accentColor }}>{formData.hero.title2[lang] || formData.hero.title2.en}</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-3" style={{ fontWeight: 'var(--body-weight)' }}>
                {formData.hero.tagline[lang] || formData.hero.tagline.en}
              </p>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-2">
                {t.cms.statsLabel}: {formData.hero.statistics.experienceYears} {t.yearsExp} • {formData.hero.statistics.projectsBuilt} {t.projectsBuilt}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
              <h4 className="text-base font-bold text-white" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.about.title[lang] || formData.about.title.en}</h4>
              <p className="text-[11px] text-[var(--accent-color)] font-medium">{formData.about.subtitle[lang] || formData.about.subtitle.en}</p>
              <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-5 whitespace-pre-line" style={{ fontWeight: 'var(--body-weight)' }}>
                {formData.about.text[lang] || formData.about.text.en}
              </p>
            </div>
          )}

          {activeTab === 'projects' && (
            <div 
              className="p-5 rounded-2xl border bg-white/[var(--glass-opacity)] backdrop-blur-[var(--blur-strength)] space-y-4"
              style={{ borderColor: `rgba(255,255,255,var(--border-opacity))` }}
            >
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                <span>{formData.projects[0]?.category[lang] || t.cms.projectPlaceholderCategory}</span>
                <span className="text-[var(--accent-color)]">{t.cms.previewLabel || 'Preview'}</span>
              </div>
              <h4 className="text-base font-extrabold text-white" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.projects[0]?.title || 'Safety System'}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-3" style={{ fontWeight: 'var(--body-weight)' }}>
                {formData.projects[0]?.description[lang] || formData.projects[0]?.description.en}
              </p>
              <div className="flex flex-wrap gap-1">
                {formData.projects[0]?.tech.slice(0, 3).map((tItem, i) => {
                  const label = typeof tItem === 'string' ? tItem : tItem[lang] || tItem.en;
                  return <span key={i} className="text-[8px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/75">{label}</span>;
                })}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
              <h4 className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider">{formData.skills[0]?.category[lang] || t.cms.sidebarSkills}</h4>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills[0]?.items.slice(0, 5).map((item, i) => (
                  <span key={i} className="text-[10px] font-medium bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-white/80">{item[lang] || item.en}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">{t.cms.previewTimeline}</span>
              <div className="border-l border-zinc-800 pl-3 space-y-3">
                {formData.experience.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <h5 className="font-bold text-white">{exp.role[lang] || exp.role.en}</h5>
                    <p className="text-[10px] text-zinc-500 mb-1">{exp.company[lang] || exp.company.en} • {exp.period[lang] || exp.period.en}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div 
              className="p-4 rounded-xl border bg-white/[var(--glass-opacity)] backdrop-blur-[var(--blur-strength)] text-center relative"
              style={{ borderColor: `rgba(255,255,255,var(--border-opacity))` }}
            >
              <div className="mx-auto w-10 h-10 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 flex items-center justify-center text-[var(--accent-color)] mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-white text-xs px-2 leading-snug">
                {formData.certifications[0]?.name?.[lang] || formData.certifications[0]?.[lang] || t.cms.certPlaceholderName}
              </h5>
              <p className="text-[9px] text-zinc-500 mt-1">{formData.certifications[0]?.provider?.[lang] || t.cms.certPlaceholderProvider}</p>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-2 gap-3">
              {formData.achievements.slice(0, 2).map((ach) => (
                <div key={ach.id} className="p-4 rounded-xl border border-zinc-900 bg-black/40 text-center">
                  <div className="text-2xl font-black text-white" style={{ color: formData.themeSettings.accentColor }}>{ach.value}{ach.suffix}</div>
                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{ach.label[lang] || ach.label.en}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-2 gap-2">
              {formData.contact.email && <div className="p-2 border border-zinc-900 bg-black/40 rounded text-center text-[10px] text-white">{t.emailLabel}</div>}
              {formData.contact.whatsapp && <div className="p-2 border border-zinc-900 bg-black/40 rounded text-center text-[10px] text-emerald-400">{t.whatsappLabel}</div>}
              {formData.contact.github && <div className="p-2 border border-zinc-900 bg-black/40 rounded text-center text-[10px] text-zinc-400">{t.githubLabel}</div>}
              {formData.contact.linkedin && <div className="p-2 border border-zinc-900 bg-black/40 rounded text-center text-[10px] text-blue-400">LinkedIn</div>}
            </div>
          )}

          {activeTab === 'theme' && (
            <div 
              className="p-6 rounded-2xl border text-center relative overflow-hidden transition-all duration-300"
              style={{
                background: `rgba(255,255,255,var(--glass-opacity))`,
                borderColor: `rgba(255,255,255,var(--border-opacity))`,
                backdropFilter: `blur(var(--blur-strength))`
              }}
            >
              <div 
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${formData.themeSettings.accentColor}, transparent)`,
                  opacity: formData.themeSettings.glowIntensity * 0.15
                }}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: formData.themeSettings.accentColor }}>{t.cms.previewMockup}</span>
              <p className="text-xs text-white/70 mt-3 font-light leading-relaxed">
                {t.cms.previewThemeDesc}
              </p>
            </div>
          )}

          {activeTab === 'translations' && (
            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 space-y-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">{t.cms.previewTranslation}</span>
              <div className="text-xs text-white"><span className="opacity-55">workTitle:</span> "{formData.translations[lang]?.workTitle || ''}"</div>
              <div className="text-xs text-white"><span className="opacity-55">footerText:</span> "{formData.translations[lang]?.footerText || ''}"</div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 text-center space-y-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">{t.cms.previewBranding}</span>
              <div className="text-xl font-bold tracking-widest text-white animate-pulse uppercase">{formData.mediaBranding.preloaderLogo || 'Mohamed Okash'}</div>
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#050507] text-white flex flex-col font-sans">
      
      {/* CMS Header Bar */}
      <header className="fixed top-0 inset-x-0 h-16 bg-black/80 border-b border-zinc-800 backdrop-blur-md flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-zinc-300"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.cms?.viewSite || 'View Site'}
          </button>
          
          <select 
            value={lang} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-white outline-none cursor-pointer hover:border-zinc-700 transition-colors"
          >
            <option value="ar">{t.cms?.arabic || 'العربية'}</option>
            <option value="en">{t.cms?.english || 'English'}</option>
            <option value="ur">{t.cms?.urdu || 'اردو'}</option>
          </select>
          
          <h1 className="text-sm font-black text-white tracking-widest uppercase hidden md:flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-[var(--primary)]" />
            {t.cms?.panelTitle || 'Portfolio Enterprise CMS'}
          </h1>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.cms?.searchPlaceholder || 'Search everywhere...'}
            className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 outline-none focus:border-[var(--primary)] transition-all"
          />

          {/* Search Dropdown Overlay */}
          {searchQuery && (
            <div className="absolute top-full right-0 w-80 mt-1 border border-zinc-800 bg-black/95 rounded-xl shadow-2xl overflow-hidden z-50 py-1.5">
              <div className="px-3 py-1 text-[9px] uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900">{t.cms?.searchResults || 'Search Results'}</div>
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-xs text-zinc-500">{t.cms?.noResults || 'No matches found.'}</div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((res, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleSearchResultClick(res)}
                      className="px-4 py-2.5 hover:bg-zinc-900 cursor-pointer flex flex-col gap-0.5 border-b border-zinc-900 last:border-b-0"
                    >
                      <span className="text-xs font-bold text-white">{res.name}</span>
                      <span className="text-[9px] text-zinc-500 capitalize">{res.desc} ({t.cms?.tabLabel || 'Tab'}: {res.tab})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action controls (Export/Import, LogOut) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            title={t.cms?.exportBackup || 'Export Portfolio JSON Backup'}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            title={t.cms?.importBackup || 'Import Portfolio JSON Backup'}
            className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportJSON} 
            accept=".json" 
            className="hidden" 
          />

          {data?.settings?.backup && (
            <button
              onClick={handleRollback}
              title={t.cms?.rollbackBackup || 'Restore Previous Backup Version'}
              className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800 text-amber-500 hover:bg-amber-500/10 cursor-pointer"
            >
              <Undo className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={async () => {
              if (isDirty && !window.confirm(t.cms?.tabDirtyConfirm || 'You have unsaved changes in this tab. Switch tabs anyway?')) {
                return;
              }
              await logout();
              navigate('/admin/login', { replace: true });
            }}
            className="p-2 rounded-lg border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title={t.cms?.logOut || 'Log Out'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 pt-16 flex flex-col md:flex-row h-screen overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-black/60 border-b md:border-b-0 md:border-r border-zinc-800 md:h-[calc(100vh-64px)] overflow-y-auto shrink-0 flex md:flex-col p-4 gap-1 flex-wrap md:flex-nowrap">
          <div className="px-3 py-2 text-[9px] uppercase font-bold text-zinc-600 tracking-widest hidden md:block">{t.cms?.sidebarHeaderSettings || 'Settings'}</div>
          <button 
            onClick={() => handleTabChange('general')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'general' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Settings className="w-3.5 h-3.5" /> {t.cms?.sidebarSettings || 'General Settings'}
          </button>

          <button 
            onClick={() => handleTabChange('structure')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'structure' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Globe className="w-3.5 h-3.5" /> {t.cms?.sidebarStructure || 'Website Structure'}
          </button>

          <button 
            onClick={() => handleTabChange('branding')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'branding' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Image className="w-3.5 h-3.5" /> {t.cms?.sidebarBranding || 'Media & Branding'}
          </button>

          <div className="px-3 py-2 mt-4 text-[9px] uppercase font-bold text-zinc-600 tracking-widest hidden md:block">{t.cms?.sidebarHeaderComponents || 'Components'}</div>
          <button 
            onClick={() => handleTabChange('hero')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'hero' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <User className="w-3.5 h-3.5" /> {t.cms?.sidebarHero || 'Hero Section'}
          </button>

          <button 
            onClick={() => handleTabChange('about')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'about' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Star className="w-3.5 h-3.5" /> {t.cms?.sidebarAbout || 'About Section'}
          </button>

          <button 
            onClick={() => handleTabChange('projects')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'projects' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Briefcase className="w-3.5 h-3.5" /> {t.cms?.sidebarProjects || 'Projects Showcase'}
          </button>

          <button 
            onClick={() => handleTabChange('skills')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'skills' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Monitor className="w-3.5 h-3.5" /> {t.cms?.sidebarSkills || 'Toolbox / Skills'}
          </button>

          <button 
            onClick={() => handleTabChange('experience')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'experience' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Briefcase className="w-3.5 h-3.5" /> {t.cms?.sidebarExperience || 'Job Experience'}
          </button>

          <button 
            onClick={() => handleTabChange('certifications')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'certifications' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Award className="w-3.5 h-3.5" /> {t.cms?.sidebarCertifications || 'Certifications'}
          </button>

          <button 
            onClick={() => handleTabChange('achievements')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'achievements' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Award className="w-3.5 h-3.5" /> {t.cms?.sidebarAchievements || 'Achievements'}
          </button>

          <button 
            onClick={() => handleTabChange('contact')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'contact' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Mail className="w-3.5 h-3.5" /> {t.cms?.sidebarContact || 'Contact Details'}
          </button>

          <div className="px-3 py-2 mt-4 text-[9px] uppercase font-bold text-zinc-600 tracking-widest hidden md:block">{t.cms?.sidebarHeaderThemeLang || 'Theme & Language'}</div>
          <button 
            onClick={() => handleTabChange('theme')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'theme' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Palette className="w-3.5 h-3.5" /> {t.cms?.sidebarTheme || 'Theme Settings'}
          </button>

          <button 
            onClick={() => handleTabChange('translations')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'translations' ? 'bg-zinc-800 text-white border-l-2 border-[var(--primary)]' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
          >
            <Languages className="w-3.5 h-3.5" /> {t.cms?.sidebarTranslations || 'Dictionary Texts'}
          </button>
        </aside>

        {/* Content Pane Split (60% Form Editor, 40% Visual Preview Card) */}
        <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
          
          {/* Left Form Workspace (60% width) */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto h-full space-y-6">
            
            {/* Action status message toast */}
            {statusMsg.text && (
              <div className={`p-4 rounded-xl border font-bold text-xs transition-all flex items-center gap-2.5 ${
                statusMsg.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                {statusMsg.text}
              </div>
            )}

            <div className="max-w-3xl pb-16">
              {renderActiveForm()}
            </div>
          </div>

          {/* Right Visual Preview Sidebar Panel (40% width) */}
          <div className="hidden lg:block w-96 xl:w-[28rem] h-full p-6 border-l border-zinc-800 bg-[#040405] shrink-0 overflow-y-auto">
            {renderPreviewPanel()}
          </div>

        </main>
      </div>

      {/* Dirty state / Unsaved changes floating banner at the bottom */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0d0d12] border border-zinc-800 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-5 justify-between min-w-[320px] md:min-w-[500px] animate-bounce-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <div>
              <p className="text-xs font-bold text-white">{t.cms?.unsavedTitle || 'Unsaved Changes'}</p>
              <p className="text-[10px] text-zinc-500">{t.cms?.unsavedSubtitle || 'Press Save Changes to publish.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFormData(JSON.parse(JSON.stringify(data)))}
              className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 rounded-lg text-xs font-extrabold text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              {t.cms?.reset || 'Reset'}
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-5 py-2.5 bg-[var(--primary)] text-black hover:opacity-90 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[var(--primary)]/10"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {isSaving ? (t.cms?.saving || 'Saving...') : (t.cms?.saveChanges || 'Save Changes')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
