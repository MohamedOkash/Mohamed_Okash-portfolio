import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useLanguageStore } from '../../store/languageStore';
import { useThemeStore } from '../../store/themeStore';
import { translations } from '../../data/translations';
import { THEME_PROFILES_DEFAULTS } from '../../data/constants';
import { validatePortfolioData } from '../../utils/validators';
import { validateContrasts, calculateHealthScore, getHealthScoreColor, getHealthScoreLabel, getSectionScores, autoFixTheme } from '../../utils/themeValidator';
import { 
  User, Star, Award, Briefcase, Plus, Trash2, Save, 
  Loader2, Languages, Mail, Settings, ShieldAlert, Cpu, 
  HardHat, Monitor, LogOut, ArrowLeft, CheckCircle2,
  Search, ArrowUp, ArrowDown, Upload, Download, Undo, Eye,
  Globe, Palette, Image, ShieldCheck, Shield, HeartPulse, FlameKindling,
  Server, Copy, Check, ArrowUpRight, CheckSquare, Square,
  ChevronDown, ChevronUp, EyeOff, Layers, Menu, X
} from 'lucide-react';

// Form Input UI Helpers
const AdminInput = ({ label, value, onChange, type="text", textarea=false, dir="auto", min, max, step }) => (
  <div className="mb-4 w-full min-w-0">
    {label && <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{label}</label>}
    {textarea ? (
      <textarea rows="4" dir={dir} value={value ?? ''} onChange={onChange} className="block w-full min-w-0 max-w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
    ) : (
      <input type={type} min={min} max={max} step={step} dir={dir} value={value ?? ''} onChange={onChange} className="block w-full min-w-0 max-w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
    )}
  </div>
);

const AdminMultiLangInput = ({ label, valueObj = { ar: '', en: '', ur: '' }, onChangeKey, textarea=false }) => {
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;
  return (
    <div className="mb-5 p-3 sm:p-4 min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-extrabold">{label}</label>}
      <div className="space-y-3 pl-3 border-l border-[var(--border-color)]">
        <div>
          <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block mb-1">{t.cms?.arabic || 'العربية (Arabic)'}</span>
          {textarea ? (
            <textarea rows="3" dir="rtl" value={valueObj.ar || ""} onChange={(e) => onChangeKey('ar', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="rtl" value={valueObj.ar || ""} onChange={(e) => onChangeKey('ar', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          )}
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block mb-1">{t.cms?.english || 'English'}</span>
          {textarea ? (
            <textarea rows="3" dir="ltr" value={valueObj.en || ""} onChange={(e) => onChangeKey('en', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="ltr" value={valueObj.en || ""} onChange={(e) => onChangeKey('en', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          )}
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block mb-1">{t.cms?.urdu || 'اردو (Urdu)'}</span>
          {textarea ? (
            <textarea rows="3" dir="rtl" value={valueObj.ur || ""} onChange={(e) => onChangeKey('ur', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
          ) : (
            <input type="text" dir="rtl" value={valueObj.ur || ""} onChange={(e) => onChangeKey('ur', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors text-sm" />
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
  const { setTheme } = useThemeStore();
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [themeStudioSelectedTheme, setThemeStudioSelectedTheme] = useState('dark');
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef(null);
  const savedHashRef = useRef(null);

  // Generate hash from formData ignoring transient metadata (settings.backup, settings.lastSavedAt, etc.)
  const generateHash = (obj) => {
    if (!obj) return 'null';
    const clone = JSON.parse(JSON.stringify(obj));
    if (clone.settings) {
      delete clone.settings.backup;
      delete clone.settings.lastSavedAt;
      delete clone.settings.lastSavedBy;
    }
    const stableStringify = (val) => {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        const keys = Object.keys(val).sort();
        const pairs = keys.map(k => `"${k}":${stableStringify(val[k])}`);
        return `{${pairs.join(',')}}`;
      }
      if (Array.isArray(val)) {
        return `[${val.map(stableStringify).join(',')}]`;
      }
      return JSON.stringify(val);
    };
    const str = stableStringify(clone);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString();
  };

  const initializeFormData = (rawDoc) => {
    if (!rawDoc) return null;
    const copy = JSON.parse(JSON.stringify(rawDoc));
    if (!copy.brandIdentity) {
      copy.brandIdentity = {};
    }
    const defaultBrand = {
      brandName: { ar: "محمد عكاش", en: "Mohamed Okash", ur: "محمد عکاش" },
      shortName: { ar: "عكاش", en: "Okash", ur: "عکاش" },
      subtitle: { ar: "مهندس سلامة وبنية تحتية IT", en: "HSE & IT Infrastructure Engineer", ur: "ایچ ایس ای اور آئی تي انفراسٹرکچر انجینئر" },
      logoText: { ar: "محمد عكاش", en: "Mohamed Okash", ur: "محمد عکاش" },
      heroName: { ar: "محمد عكاش", en: "Mohamed Okash", ur: "محمد عکاش" },
      footerText: { ar: "محمد عكاش", en: "Mohamed Okash", ur: "Mohamed Okash" },
      preloaderText: { ar: "عكاش", en: "OKASH", ur: "عکاش" },
      browserTitle: { ar: "محمد عكاش | معرض الأعمال", en: "Mohamed Okash | Portfolio", ur: "محمد عکاش | پورٹ فولیو" },
      seoTitle: { ar: "محمد عكاش | معرض الأعمال الاحترافي", en: "Mohamed Okash | Professional Portfolio", ur: "محمد عکاش | پورٹ فولیو" },
      seoDescription: { ar: "الموقع الشخصي لمحمد عكاش - مهندس بنية تحتية IT وأمن وسلامة مهنية HSE", en: "Personal portfolio of Mohamed Okash - IT Infrastructure & HSE Safety Engineer", ur: "محمد عکاش کا ذاتی پورٹ فولیو - آئی تي انفراسٹرکچر اور ایچ ایس ای سيفتي انجینئر" }
    };
    copy.brandIdentity = {
      ...defaultBrand,
      ...copy.brandIdentity
    };
    for (const key of Object.keys(defaultBrand)) {
      copy.brandIdentity[key] = {
        ...defaultBrand[key],
        ...copy.brandIdentity[key]
      };
    }
    if (!copy.themeSettings) {
      copy.themeSettings = {};
    }
    const themeDefaults = {
      defaultTheme: 'dark',
      headingSize: 48,
      paragraphSize: 16,
      buttonTextColor: '#000000',
      buttonBackgroundColor: '#ffffff',
      cardTitleColor: '#fafafa',
      cardDescriptionColor: '#a1a1aa'
    };
    copy.themeSettings = { ...themeDefaults, ...copy.themeSettings };
    if (copy.themeSettings.letterSpacing === undefined) {
      copy.themeSettings.letterSpacing = "0px";
    }
    if (copy.themeSettings.lineHeight === undefined) {
      copy.themeSettings.lineHeight = 1.6;
    }
    if (copy.themeSettings.paragraphWidth === undefined) {
      copy.themeSettings.paragraphWidth = "65ch";
    }
    // Initialize per-theme profiles with migration from shared themeSettings if needed
    if (!copy.themeProfiles) {
      copy.themeProfiles = {};
      const themes = ['dark', 'ocean', 'aurora', 'platinum', 'midnight'];
      themes.forEach(t => {
        copy.themeProfiles[t] = { ...THEME_PROFILES_DEFAULTS[t], ...copy.themeSettings };
      });
    } else {
      // Ensure each theme profile has all keys from defaults
      const themes = ['dark', 'ocean', 'aurora', 'platinum', 'midnight'];
      themes.forEach(t => {
        if (!copy.themeProfiles[t]) {
          copy.themeProfiles[t] = { ...THEME_PROFILES_DEFAULTS[t], ...copy.themeSettings };
        } else {
          copy.themeProfiles[t] = { ...THEME_PROFILES_DEFAULTS[t], ...copy.themeProfiles[t] };
        }
      });
    }
    const identityDefaults = {
      displayName: { ar: 'محمد عكاش', en: 'Mohamed Okash', ur: 'محمد عکاش' },
      availabilityLabel: { ar: 'متاح للعمل', en: 'Available for work', ur: 'کام کے لیے دستیاب' },
      statusLabel: { ar: 'مهندس سلامة وبنية تحتية', en: 'Practical problem solver', ur: 'عملی مسائل حل کرنے والا' },
      statusDotColor: '#10b981',
      badgeBackground: 'rgba(255,255,255,0.02)',
      badgeBorder: 'rgba(255,255,255,0.08)',
      badgeTextColor: '#ffffff'
    };
    copy.hero = copy.hero || {};
    copy.hero.identity = { ...identityDefaults, ...(copy.hero.identity || {}) };
    for (const key of ['displayName', 'availabilityLabel', 'statusLabel']) {
      copy.hero.identity[key] = { ...identityDefaults[key], ...(copy.hero.identity[key] || {}) };
    }
    return copy;
  };

  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  // Sync form state on store load
  useEffect(() => {
    if (data) {
      const initialized = initializeFormData(data);
      setFormData(initialized);
      if (initialized) {
        savedHashRef.current = generateHash(initialized);
      }
    }
  }, [data]);

  // Load portfolio from firestore on mount
  useEffect(() => {
    loadPortfolio(user);
  }, [loadPortfolio, user]);

  // isDirty flag — hash-based comparison to eliminate false positives after save
  const isDirty = formData && savedHashRef.current !== null && generateHash(formData) !== savedHashRef.current;

  // Dev logging for dirty state
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[SaveEngine] isDirty:', isDirty, '| Current Hash:', formData ? generateHash(formData) : 'null', '| Saved Hash:', savedHashRef.current);
    }
  }, [isDirty, formData]);

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
    setIsMobileNavOpen(false);
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
      // Reset dirty state hash to match current formData
      savedHashRef.current = generateHash(updated);
      if (import.meta.env.DEV) {
        console.log('[SaveEngine] Hash updated:', savedHashRef.current, '| isDirty:', false);
      }
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

    const updated = { ...formData, [listKey]: list };
    if (listKey === 'customSections' && updated.websiteStructure?.sections) {
      const customIds = list.map((section) => section.id);
      const customPositions = updated.websiteStructure.sections
        .map((section, position) => customIds.includes(section.id) ? position : -1)
        .filter((position) => position !== -1);
      const reorderedStructure = [...updated.websiteStructure.sections];
      customPositions.forEach((position, customIndex) => {
        const sectionId = customIds[customIndex];
        reorderedStructure[position] = updated.websiteStructure.sections.find((section) => section.id === sectionId);
      });
      updated.websiteStructure = {
        ...updated.websiteStructure,
        sections: reorderedStructure
      };
    }
    setFormData(updated);
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
          el.classList.add('bg-[var(--bg-secondary)]');
          setTimeout(() => el.classList.remove('bg-[var(--bg-secondary)]'), 2500);
        }
      }, 200);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center text-[var(--text-primary)]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
        <p className="text-sm font-medium opacity-60">{t.cms?.loadingCms || 'Loading CMS Dashboard...'}</p>
      </div>
    );
  }

  const searchResults = getSearchResults();

  // --- TABS RENDERING ---

  // Tab 1: General Settings
  const renderGeneralTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.tabGeneral}</h3>
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

      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.socialLinks}</h4>
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
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.tabStructure}</h3>
      
      <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div>
          <h5 className="font-bold text-sm text-[var(--text-primary)] mb-0.5">{t.cms.showNavbar}</h5>
          <p className="text-xs text-[var(--text-secondary)]">{t.cms.showNavbarDesc}</p>
        </div>
        <button 
          onClick={() => {
            const updated = { ...formData };
            updated.websiteStructure.navbarVisible = !updated.websiteStructure.navbarVisible;
            setFormData(updated);
          }}
          aria-label={t.cms?.ariaToggleNavbar || 'Toggle navbar'}
          className={`p-2.5 rounded-lg border transition-all ${
            formData.websiteStructure.navbarVisible 
              ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]' 
              : 'border-[var(--border-color)] text-[var(--text-secondary)]'
          }`}
        >
          {formData.websiteStructure.navbarVisible ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.homepageSections}</h4>
        <p className="text-xs text-[var(--text-secondary)]">{t.cms.sectionsDesc}</p>
        
        <div className="space-y-3">
          {formData.websiteStructure.sections.map((sect, idx) => (
            <div key={sect.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  disabled={idx === 0}
                  onClick={() => {
                    const list = [...formData.websiteStructure.sections];
                    const temp = list[idx];
                    list[idx] = list[idx - 1];
                    list[idx - 1] = temp;
                    setFormData({ ...formData, websiteStructure: { ...formData.websiteStructure, sections: list } });
                  }}
                  aria-label={t.cms?.ariaReorderUp || 'Move up'}
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4 text-[var(--text-secondary)]" />
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
                  aria-label={t.cms?.ariaReorderDown || 'Move down'}
                  className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
                <div>
                  <h5 className="font-bold text-sm text-[var(--text-primary)] capitalize">{sect.id.replace('-', ' ')}</h5>
                  <p className="text-[10px] text-[var(--text-secondary)]">{t.cms.projectId || 'ID'}: #{sect.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    const list = [...formData.websiteStructure.sections];
                    const nextVal = !list[idx].visible;
                    list[idx].visible = nextVal;
                    const updated = { ...formData, websiteStructure: { ...formData.websiteStructure, sections: list } };
                    if (sect.id.startsWith('custom-')) {
                      const cIdx = updated.customSections?.findIndex(cs => cs.id === sect.id);
                      if (cIdx !== undefined && cIdx !== -1) {
                        updated.customSections[cIdx].visible = nextVal;
                      }
                    }
                    setFormData(updated);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    sect.visible 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  {sect.visible ? t.cms.visible : t.cms.hidden}
                </button>

                <div className="flex-1 sm:w-44 text-right">
                  <input 
                    type="text" 
                    value={sect.title[lang] || sect.title.en || ''} 
                    onChange={(e) => {
                      const list = [...formData.websiteStructure.sections];
                      list[idx].title[lang] = e.target.value;
                      const updated = { ...formData, websiteStructure: { ...formData.websiteStructure, sections: list } };
                      if (sect.id.startsWith('custom-')) {
                        const cIdx = updated.customSections?.findIndex(cs => cs.id === sect.id);
                        if (cIdx !== undefined && cIdx !== -1) {
                          if (!updated.customSections[cIdx].title) {
                            updated.customSections[cIdx].title = { ar: '', en: '', ur: '' };
                          }
                          updated.customSections[cIdx].title[lang] = e.target.value;
                        }
                      }
                      setFormData(updated);
                    }}
                    placeholder={t.cms.sectionTitlePlaceholder}
                    className="p-2 w-full rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
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
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.sidebarHero}</h3>
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">Hero Identity</h4>
        <AdminMultiLangInput label={t.cms.heroIdentityDisplayName} valueObj={formData.hero.identity.displayName} onChangeKey={(key, val) => {
          const updated = structuredClone(formData);
          updated.hero.identity.displayName[key] = val;
          setFormData(updated);
        }} />
        <AdminMultiLangInput label={t.cms.heroIdentityAvailabilityLabel} valueObj={formData.hero.identity.availabilityLabel} onChangeKey={(key, val) => {
          const updated = structuredClone(formData);
          updated.hero.identity.availabilityLabel[key] = val;
          setFormData(updated);
        }} />
        <AdminMultiLangInput label={t.cms.heroIdentityStatusLabel} valueObj={formData.hero.identity.statusLabel} onChangeKey={(key, val) => {
          const updated = structuredClone(formData);
          updated.hero.identity.statusLabel[key] = val;
          setFormData(updated);
        }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['statusDotColor', t.cms.heroIdentityStatusDotColor],
            ['badgeBackground', t.cms.heroIdentityBadgeBackground],
            ['badgeBorder', t.cms.heroIdentityBadgeBorder],
            ['badgeTextColor', t.cms.heroIdentityBadgeTextColor]
          ].map(([key, label]) => (
            <AdminInput key={key} label={label} value={formData.hero.identity[key]} onChange={(e) => {
              const updated = structuredClone(formData);
              updated.hero.identity[key] = e.target.value;
              setFormData(updated);
            }} />
          ))}
        </div>
      </div>
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
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.animatedRoles}</h4>
        <div className="space-y-3">
          {formData.hero.roles.map((role, idx) => (
            <div key={idx} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button disabled={idx === 0} onClick={() => {
                  const list = [...formData.hero.roles];
                  const temp = list[idx];
                  list[idx] = list[idx - 1];
                  list[idx - 1] = temp;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} aria-label={t.cms?.ariaReorderUp || 'Move up'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                <button disabled={idx === formData.hero.roles.length - 1} onClick={() => {
                  const list = [...formData.hero.roles];
                  const temp = list[idx];
                  list[idx] = list[idx + 1];
                  list[idx + 1] = temp;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} aria-label={t.cms?.ariaReorderDown || 'Move down'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="text" value={role.ar || ''} onChange={(e) => {
                  const list = [...formData.hero.roles];
                  list[idx].ar = e.target.value;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} placeholder={t.cms.arabic} className="p-2 text-xs rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)]" />
                <input type="text" value={role.en || ''} onChange={(e) => {
                  const list = [...formData.hero.roles];
                  list[idx].en = e.target.value;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} placeholder={t.cms.english} className="p-2 text-xs rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)]" />
                <input type="text" value={role.ur || ''} onChange={(e) => {
                  const list = [...formData.hero.roles];
                  list[idx].ur = e.target.value;
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} placeholder={t.cms.urdu} className="p-2 text-xs rounded bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)]" />
              </div>

              <button 
                onClick={() => {
                  const list = formData.hero.roles.filter((_, i) => i !== idx);
                  setFormData({ ...formData, hero: { ...formData.hero, roles: list } });
                }} 
                aria-label={t.cms?.ariaDelete || 'Delete'}
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
          className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewRole}
        </button>
      </div>

      {/* Hero statistics */}
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.heroStats}</h4>
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
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.sidebarAbout}</h3>
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
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
      <input 
        type="text" 
        value={localListFilter} 
        onChange={(e) => setLocalListFilter(e.target.value)} 
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--primary)]"
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
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
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
              <div key={proj.id} id={`item-${proj.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => toggleAccordion(proj.id)}
                  className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        disabled={globalIndex === 0}
                        onClick={(e) => { e.stopPropagation(); moveItem('projects', globalIndex, 'up'); }}
                        aria-label={t.cms?.ariaReorderUp || 'Move up'}
                        className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      </button>
                      <button 
                        disabled={globalIndex === formData.projects.length - 1}
                        onClick={(e) => { e.stopPropagation(); moveItem('projects', globalIndex, 'down'); }}
                        aria-label={t.cms?.ariaReorderDown || 'Move down'}
                        className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                        {proj.title || t.cms.untitledProject || 'Untitled Project'}
                        {isFeatured && <span className="text-[9px] font-black uppercase bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] px-2 py-0.5 rounded">{t.cms.featured}</span>}
                      </h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">{t.cms.projectId}: {proj.id} | {t.cms.projectType}: {proj.projectType || 'N/A'} | {t.cms.projectStatus}: {proj.status || 'N/A'}</p>
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
                          : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                      aria-label={t.cms?.ariaDelete || 'Delete'} className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Card Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-[var(--border-color)] bg-[var(--card-bg)] space-y-6">
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

                    <AdminMultiLangInput label={t.cms.problemLabel || 'Problem Context'} textarea valueObj={proj.problem || { ar: '', en: '', ur: '' }} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      if (!updated.projects[globalIndex].problem) updated.projects[globalIndex].problem = { ar: '', en: '', ur: '' };
                      updated.projects[globalIndex].problem[key] = val;
                      setFormData(updated);
                    }} />

                    <AdminMultiLangInput label={t.cms.solutionLabel || 'Proposed Solution'} textarea valueObj={proj.solution || { ar: '', en: '', ur: '' }} onChangeKey={(key, val) => {
                      const updated = { ...formData };
                      if (!updated.projects[globalIndex].solution) updated.projects[globalIndex].solution = { ar: '', en: '', ur: '' };
                      updated.projects[globalIndex].solution[key] = val;
                      setFormData(updated);
                    }} />

                    {/* Features List */}
                    <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
                      <h5 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.projectKeyFeatures}</h5>
                      <div className="space-y-3">
                        {proj.features.map((feat, fIdx) => (
                          <div key={fIdx} className="p-3 border border-[var(--border-color)] rounded bg-[var(--card-bg)] flex items-center justify-between gap-3">
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
                              aria-label={t.cms?.ariaDelete || 'Delete'}
                              className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer shrink-0 self-end mb-5"
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
                        className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> {t.cms.addNewFeature}
                      </button>
                    </div>

                    {/* Tech Stack List */}
                    <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
                      <h5 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.techStackDetails}</h5>
                      <div className="space-y-3">
                        {proj.tech.map((tItem, tIdx) => {
                          const valObj = typeof tItem === 'string' ? { ar: tItem, en: tItem, ur: tItem } : tItem;
                          return (
                            <div key={tIdx} className="p-3 border border-[var(--border-color)] rounded bg-[var(--card-bg)] flex items-center justify-between gap-3">
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
                                aria-label={t.cms?.ariaDelete || 'Delete'}
                                className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer shrink-0 self-end mb-5"
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
                        className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
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
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
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
              <div key={group.id} id={`item-${group.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => toggleAccordion(group.id)}
                  className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled={globalIndex === 0} onClick={(e) => { e.stopPropagation(); moveItem('skills', globalIndex, 'up'); }} aria-label={t.cms?.ariaReorderUp || 'Move up'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                      <button disabled={globalIndex === formData.skills.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('skills', globalIndex, 'down'); }} aria-label={t.cms?.ariaReorderDown || 'Move down'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{group.category?.[lang] || group.category?.en || t.cms.untitledGroup || 'Untitled Group'}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">{group.items?.length || 0} {t.cms.skillsInside}</p>
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
                    aria-label={t.cms?.ariaDelete || 'Delete'} className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-[var(--border-color)] bg-[var(--card-bg)] space-y-6">
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
                    <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
                      <h5 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.individualSkills}</h5>
                      <div className="space-y-3">
                        {group.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="p-3 border border-[var(--border-color)] rounded bg-[var(--card-bg)] flex items-center justify-between gap-3">
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
                              aria-label={t.cms?.ariaDelete || 'Delete'}
                              className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer shrink-0 self-end mb-5"
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
                        className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
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
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
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
              <div key={exp.id} id={`item-${exp.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => toggleAccordion(exp.id)}
                  className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled={globalIndex === 0} onClick={(e) => { e.stopPropagation(); moveItem('experience', globalIndex, 'up'); }} aria-label={t.cms?.ariaReorderUp || 'Move up'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                      <button disabled={globalIndex === formData.experience.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('experience', globalIndex, 'down'); }} aria-label={t.cms?.ariaReorderDown || 'Move down'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{exp.role?.[lang] || exp.role?.en || t.cms.untitledJob}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">{exp.company?.[lang] || exp.company?.en} • {exp.period?.[lang] || exp.period?.en}</p>
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
                    aria-label={t.cms?.ariaDelete || 'Delete'} className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-[var(--border-color)] bg-[var(--card-bg)] space-y-6">
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
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
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
              <div key={cert.id} id={`item-${cert.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => toggleAccordion(cert.id)}
                  className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled={globalIndex === 0} onClick={(e) => { e.stopPropagation(); moveItem('certifications', globalIndex, 'up'); }} aria-label={t.cms?.ariaReorderUp || 'Move up'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                      <button disabled={globalIndex === formData.certifications.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('certifications', globalIndex, 'down'); }} aria-label={t.cms?.ariaReorderDown || 'Move down'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{name}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">{t.cms.providerLabel}: {cert.provider?.[lang] || cert.provider?.en || 'N/A'}</p>
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
                    aria-label={t.cms?.ariaDelete || 'Delete'} className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-[var(--border-color)] bg-[var(--card-bg)] space-y-6">
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
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
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
            <div key={ach.id} id={`item-${ach.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
              <div 
                onClick={() => toggleAccordion(ach.id)}
                className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button disabled={idx === 0} onClick={(e) => { e.stopPropagation(); moveItem('achievements', idx, 'up'); }} aria-label={t.cms?.ariaReorderUp || 'Move up'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                    <button disabled={idx === formData.achievements.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('achievements', idx, 'down'); }} aria-label={t.cms?.ariaReorderDown || 'Move down'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{ach.value}{ach.suffix} {ach.label?.[lang] || ach.label?.en || t.cms.untitled}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">{t.cms.achIdLabel}: {ach.id}</p>
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
                  aria-label={t.cms?.ariaDelete || 'Delete'} className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-[var(--border-color)] bg-[var(--card-bg)] space-y-4">
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

  // Tab 10: Contact (Advanced Contact Builder)
  const renderContactTab = () => {
    // Fallback if contactMethods doesn't exist
    if (!formData.contactMethods) {
      formData.contactMethods = [
        { id: "method-1", type: "email", label: "Email", value: formData.contact?.email || '', visible: true },
        { id: "method-2", type: "whatsapp", label: "WhatsApp", value: formData.contact?.whatsapp || '', visible: true },
        { id: "method-3", type: "linkedin", label: "LinkedIn", value: formData.contact?.linkedin || '', visible: true },
        { id: "method-4", type: "github", label: "GitHub", value: formData.contact?.github || '', visible: true }
      ];
    }

    const filteredMethods = formData.contactMethods.filter(m => 
      (m.label || '').toLowerCase().includes(localListFilter.toLowerCase()) ||
      (m.type || '').toLowerCase().includes(localListFilter.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
          <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.contactMethodsTitleLabel || 'Contact Methods'}</h3>
          <button 
            type="button"
            onClick={() => {
              const updated = { ...formData };
              const newId = `method-${Date.now()}`;
              if (!updated.contactMethods) updated.contactMethods = [];
              updated.contactMethods.push({ id: newId, type: 'link', label: 'Custom Link', value: '', visible: true });
              setFormData(updated);
              setExpandedItems(prev => ({ ...prev, [newId]: true }));
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t.cms.addNewContactMethod || 'Add Method'}
          </button>
        </div>

        {renderListFilterBar(t.cms.searchContactMethodsPlaceholder || 'Search contact methods...')}

        <div className="space-y-4">
          {filteredMethods.map((method, idx) => {
            const isExpanded = !!expandedItems[method.id];
            const globalIndex = formData.contactMethods.findIndex(m => m.id === method.id);

            return (
              <div key={method.id} id={`item-${method.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => toggleAccordion(method.id)}
                  className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled={globalIndex === 0} onClick={(e) => { e.stopPropagation(); moveItem('contactMethods', globalIndex, 'up'); }} aria-label={t.cms?.ariaReorderUp || 'Move up'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                      <button disabled={globalIndex === formData.contactMethods.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('contactMethods', globalIndex, 'down'); }} aria-label={t.cms?.ariaReorderDown || 'Move down'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{method.label || t.cms.untitledContactMethod || 'Untitled Method'}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] capitalize">{method.type} • {method.visible ? (t.cms.visible || 'Visible') : (t.cms.hidden || 'Hidden')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = { ...formData };
                        updated.contactMethods[globalIndex].visible = !updated.contactMethods[globalIndex].visible;
                        setFormData(updated);
                      }}
                      aria-label={t.cms?.ariaToggleVisibility || 'Toggle visibility'}
                      className={`p-1.5 rounded hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer ${method.visible ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      {method.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(t.cms.confirmDelete || 'Are you sure you want to delete this item?')) {
                          const updated = { ...formData };
                          updated.contactMethods.splice(globalIndex, 1);
                          setFormData(updated);
                        }
                      }}
                      aria-label={t.cms?.ariaDelete || 'Delete'}
                      className="p-1.5 rounded hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-[var(--text-secondary)]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 bg-[var(--card-bg)] border-t border-[var(--border-color)] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.contactMethodType || 'Type'}</label>
                        <select 
                          value={method.type} 
                          onChange={(e) => {
                            const updated = { ...formData };
                            updated.contactMethods[globalIndex].type = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
                        >
                          <option value="email">{t.cms?.contactTypeEmail || 'Email'}</option>
                          <option value="whatsapp">{t.cms?.contactTypeWhatsApp || 'WhatsApp'}</option>
                          <option value="linkedin">{t.cms?.contactTypeLinkedIn || 'LinkedIn'}</option>
                          <option value="github">{t.cms?.contactTypeGitHub || 'GitHub'}</option>
                          <option value="facebook">{t.cms?.contactTypeFacebook || 'Facebook'}</option>
                          <option value="telegram">{t.cms?.contactTypeTelegram || 'Telegram'}</option>
                          <option value="twitter">{t.cms?.contactTypeTwitter || 'X (Twitter)'}</option>
                          <option value="instagram">{t.cms?.contactTypeInstagram || 'Instagram'}</option>
                          <option value="link">{t.cms?.contactTypeCustom || 'Custom Link'}</option>
                        </select>
                      </div>

                      <AdminInput 
                        label={t.cms.contactMethodLabel || 'Label'} 
                        value={method.label} 
                        onChange={(e) => {
                          const updated = { ...formData };
                          updated.contactMethods[globalIndex].label = e.target.value;
                          setFormData(updated);
                        }} 
                      />
                    </div>

                    <AdminInput 
                      label={t.cms.contactMethodValue || 'Value/URL'} 
                      value={method.value} 
                      onChange={(e) => {
                        const updated = { ...formData };
                        updated.contactMethods[globalIndex].value = e.target.value;
                        setFormData(updated);
                      }} 
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Tab 14: Custom Sections
  const renderCustomSectionsTab = () => {
    if (!formData.customSections) {
      formData.customSections = [];
    }

    const filteredSections = formData.customSections.filter(s => 
      (s.title?.[lang] || s.title?.en || '').toLowerCase().includes(localListFilter.toLowerCase()) ||
      (s.layoutType || '').toLowerCase().includes(localListFilter.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
          <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.customSectionsTitleLabel || 'Custom Sections'}</h3>
          <button 
            type="button"
            onClick={() => {
              const updated = { ...formData };
              const newId = `custom-${Date.now()}`;
              if (!updated.customSections) updated.customSections = [];
              const newSect = { 
                id: newId, 
                title: { ar: 'قسم مخصص جديد', en: 'New Custom Section', ur: 'نیا کسٹم سیکشن' }, 
                subtitle: { ar: '', en: '', ur: '' }, 
                content: { ar: '', en: '', ur: '' }, 
                icon: 'sparkles', 
                layoutType: 'glassCard', 
                visible: true 
              };
              updated.customSections.push(newSect);
              
              if (!updated.websiteStructure) updated.websiteStructure = { sections: [] };
              if (!updated.websiteStructure.sections) updated.websiteStructure.sections = [];
              updated.websiteStructure.sections.push({
                id: newId,
                visible: true,
                title: { ...newSect.title }
              });

              setFormData(updated);
              setExpandedItems(prev => ({ ...prev, [newId]: true }));
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t.cms.addNewCustomSection || 'Add Section'}
          </button>
        </div>

        {renderListFilterBar(t.cms.searchCustomSectionsPlaceholder || 'Search custom sections...')}

        <div className="space-y-4">
          {filteredSections.map((section, idx) => {
            const isExpanded = !!expandedItems[section.id];
            const globalIndex = formData.customSections.findIndex(s => s.id === section.id);
            const titleText = section.title?.[lang] || section.title?.en || t.cms.untitledCustomSection || 'Untitled Section';

            return (
              <div key={section.id} id={`item-${section.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => toggleAccordion(section.id)}
                  className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                      <button disabled={globalIndex === 0} onClick={(e) => { e.stopPropagation(); moveItem('customSections', globalIndex, 'up'); }} aria-label={t.cms?.ariaReorderUp || 'Move up'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                      <button disabled={globalIndex === formData.customSections.length - 1} onClick={(e) => { e.stopPropagation(); moveItem('customSections', globalIndex, 'down'); }} aria-label={t.cms?.ariaReorderDown || 'Move down'} className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"><ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{titleText}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] capitalize">{section.layoutType} • {section.visible ? (t.cms.visible || 'Visible') : (t.cms.hidden || 'Hidden')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = { ...formData };
                        const nextVal = !updated.customSections[globalIndex].visible;
                        updated.customSections[globalIndex].visible = nextVal;
                        if (updated.websiteStructure?.sections) {
                          const sIdx = updated.websiteStructure.sections.findIndex(s => s.id === section.id);
                          if (sIdx !== -1) {
                            updated.websiteStructure.sections[sIdx].visible = nextVal;
                          }
                        }
                        setFormData(updated);
                      }}
                      aria-label={t.cms?.ariaToggleVisibility || 'Toggle visibility'}
                      className={`p-1.5 rounded hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer ${section.visible ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(t.cms.confirmDelete || 'Are you sure you want to delete this item?')) {
                          const updated = { ...formData };
                          updated.customSections.splice(globalIndex, 1);
                          if (updated.websiteStructure?.sections) {
                            const sIdx = updated.websiteStructure.sections.findIndex(s => s.id === section.id);
                            if (sIdx !== -1) {
                              updated.websiteStructure.sections.splice(sIdx, 1);
                            }
                          }
                          setFormData(updated);
                        }
                      }}
                      aria-label={t.cms?.ariaDelete || 'Delete'}
                      className="p-1.5 rounded hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-[var(--text-secondary)]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 bg-[var(--card-bg)] border-t border-[var(--border-color)] space-y-4">
                    <AdminMultiLangInput 
                      label={t.cms.customSectionTitle || 'Section Title'} 
                      valueObj={section.title} 
                      onChangeKey={(langKey, val) => {
                        const updated = { ...formData };
                        updated.customSections[globalIndex].title[langKey] = val;
                        if (updated.websiteStructure?.sections) {
                          const sIdx = updated.websiteStructure.sections.findIndex(s => s.id === section.id);
                          if (sIdx !== -1) {
                            if (!updated.websiteStructure.sections[sIdx].title) {
                              updated.websiteStructure.sections[sIdx].title = { ar: '', en: '', ur: '' };
                            }
                            updated.websiteStructure.sections[sIdx].title[langKey] = val;
                          }
                        }
                        setFormData(updated);
                      }} 
                    />

                    <AdminMultiLangInput 
                      label={t.cms.customSectionSubtitle || 'Subtitle'} 
                      valueObj={section.subtitle} 
                      onChangeKey={(langKey, val) => {
                        const updated = { ...formData };
                        updated.customSections[globalIndex].subtitle[langKey] = val;
                        setFormData(updated);
                      }} 
                    />

                    <AdminMultiLangInput 
                      label={t.cms.sectionRichTextContent || 'Content Narrative'} 
                      textarea 
                      valueObj={section.content} 
                      onChangeKey={(langKey, val) => {
                        const updated = { ...formData };
                        updated.customSections[globalIndex].content[langKey] = val;
                        setFormData(updated);
                      }} 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.layoutTypeLabel || 'Layout Type'}</label>
                        <select 
                          value={section.layoutType} 
                          onChange={(e) => {
                            const updated = { ...formData };
                            updated.customSections[globalIndex].layoutType = e.target.value;
                            setFormData(updated);
                          }}
                          className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
                        >
                          <option value="heroBanner">{t.cms?.layoutHeroBanner || 'Hero Banner'}</option>
                          <option value="cardsGrid">{t.cms?.layoutCardsGrid || 'Cards Grid'}</option>
                          <option value="featureGrid">{t.cms?.layoutFeatureGrid || 'Features'}</option>
                          <option value="timeline">{t.cms?.layoutTimeline || 'Timeline'}</option>
                          <option value="textBlock">{t.cms?.layoutTextBlock || 'Text Block'}</option>
                          <option value="ctaBlock">{t.cms?.layoutCtaBlock || 'CTA Block'}</option>
                          <option value="statisticsBlock">{t.cms?.layoutStats || 'Stats'}</option>
                          <option value="richContent">{t.cms?.layoutRichContent || 'Rich Content'}</option>
                          <option value="quoteBlock">{t.cms?.layoutQuote || 'Quote'}</option>
                          {/* Backward compatibility aliases */}
                          <option value="glassCard">{t.cms?.layoutGlassCard || 'Glass Card (Deprecated)'}</option>
                          <option value="contactBlock">{t.cms?.layoutContactBlock || 'Contact Block (Deprecated)'}</option>
                          <option value="highlightBanner">{t.cms?.layoutHighlightBanner || 'Highlight Banner (Deprecated)'}</option>
                        </select>
                      </div>

                      <AdminInput 
                        label={t.cms.sectionIcon || 'Section Icon (Lucide)'} 
                        value={section.icon} 
                        onChange={(e) => {
                          const updated = { ...formData };
                          updated.customSections[globalIndex].icon = e.target.value;
                          setFormData(updated);
                        }} 
                      />
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

  // Tab 11: Translations Editor
  const renderTranslationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.translationsTitle}</h3>
      <p className="text-xs text-[var(--text-secondary)]">{t.cms.translationsDesc}</p>
      
      {renderListFilterBar(t.cms.searchTranslationsPlaceholder)}

      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
        {Object.keys(formData.translations?.en || {})
          .filter(key => key.toLowerCase().includes(localListFilter.toLowerCase()) || (formData.translations.en[key] || '').toLowerCase().includes(localListFilter.toLowerCase()))
          .map(key => (
            <div key={key} id={`item-${key}`} className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-3">
              <span className="text-xs font-bold text-[var(--primary)] font-mono block border-b border-[var(--border-color)] pb-1.5">{t.cms.transKey}: {key}</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mb-0.5 block">{t.cms.arabicLabel}</span>
                  <input type="text" dir="rtl" value={formData.translations.ar?.[key] || ''} onChange={(e) => {
                    const updated = { ...formData };
                    updated.translations.ar[key] = e.target.value;
                    setFormData(updated);
                  }} className="w-full p-2 bg-[var(--card-bg)] border border-[var(--border-color)] text-xs rounded text-[var(--text-primary)]" />
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mb-0.5 block">{t.cms.englishLabel}</span>
                  <input type="text" dir="ltr" value={formData.translations.en?.[key] || ''} onChange={(e) => {
                    const updated = { ...formData };
                    updated.translations.en[key] = e.target.value;
                    setFormData(updated);
                  }} className="w-full p-2 bg-[var(--card-bg)] border border-[var(--border-color)] text-xs rounded text-[var(--text-primary)]" />
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase mb-0.5 block">{t.cms.urduLabel}</span>
                  <input type="text" dir="rtl" value={formData.translations.ur?.[key] || ''} onChange={(e) => {
                    const updated = { ...formData };
                    updated.translations.ur[key] = e.target.value;
                    setFormData(updated);
                  }} className="w-full p-2 bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] rounded" />
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
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.themeSettingsTitle}</h3>
      
      <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.defaultVisualSettings}</h4>
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.defaultTheme}</label>
          <select 
            value={formData.themeSettings.defaultTheme} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.defaultTheme = e.target.value;
              setFormData(updated);
              setTheme(e.target.value);
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="dark">{t.cms.themeDark || 'Dark Obsidian'}</option>
            <option value="ocean">{t.cms.themeOcean || 'Ocean Blue'}</option>
            <option value="aurora">{t.cms.themeAurora || 'Aurora Green'}</option>
            <option value="platinum">{t.cms.themePlatinum || 'Platinum Silver'}</option>
            <option value="midnight">{t.cms.themeMidnight || 'Midnight Purple'}</option>
          </select>
        </div>
      </div>

      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.themeBuilderTitle}</h4>
        <p className="text-xs text-[var(--text-secondary)]">{t.cms.themeBuilderDesc}</p>
        
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
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">{t.cms.picker}</span>
            <input type="color" value={formData.themeSettings.accentColor} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.accentColor = e.target.value;
              setFormData(updated);
            }} className="w-12 h-12 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" />
          </div>
        </div>

        {/* Glass opacity slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.glassOpacity}</span>
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
            <span className="text-[var(--text-secondary)]">{t.cms.backdropBlur}</span>
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
            <span className="text-[var(--text-secondary)]">{t.cms.borderOpacity}</span>
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
            <span className="text-[var(--text-secondary)]">{t.cms.cursorGlow}</span>
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
            <span className="text-[var(--text-secondary)]">{t.cms.ambientBlob}</span>
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
      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.typographySettingsTitle}</h4>
        
        {/* Font Family */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.fontFamily}</label>
          <select 
            value={formData.themeSettings.fontFamily || 'Inter'} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.fontFamily = e.target.value;
              setFormData(updated);
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
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
            <span className="text-[var(--text-secondary)]">{t.cms.fontScale}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.fontScale || 1.0}x</span>
          </div>
          <input type="range" min="0.8" max="1.5" step="0.05" value={formData.themeSettings.fontScale || 1.0} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.fontScale = Number(e.target.value);
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms.headingSize}</span>
              <span className="text-[var(--primary)]">{formData.themeSettings.headingSize}px</span>
            </div>
            <input type="range" min="32" max="88" step="2" value={formData.themeSettings.headingSize} onChange={(e) => {
              setFormData({ ...formData, themeSettings: { ...formData.themeSettings, headingSize: Number(e.target.value) } });
            }} className="w-full accent-[var(--primary)]" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms.paragraphSize}</span>
              <span className="text-[var(--primary)]">{formData.themeSettings.paragraphSize}px</span>
            </div>
            <input type="range" min="12" max="24" step="1" value={formData.themeSettings.paragraphSize} onChange={(e) => {
              setFormData({ ...formData, themeSettings: { ...formData.themeSettings, paragraphSize: Number(e.target.value) } });
            }} className="w-full accent-[var(--primary)]" />
          </div>
        </div>

        {/* Heading Weight selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.headingWeight}</label>
          <select 
            value={formData.themeSettings.headingWeight || '800'} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.headingWeight = e.target.value;
              setFormData(updated);
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
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
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.bodyWeight}</label>
          <select 
            value={formData.themeSettings.bodyWeight || '300'} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.bodyWeight = e.target.value;
              setFormData(updated);
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="300">300 ({t.cms.weightLight || 'Light'})</option>
            <option value="400">400 ({t.cms.weightRegular || 'Regular'})</option>
            <option value="500">500 ({t.cms.weightMedium || 'Medium'})</option>
          </select>
        </div>

        {/* Letter Spacing selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.letterSpacing || 'Letter Spacing'}</label>
          <select 
            value={formData.themeSettings.letterSpacing || '0px'} 
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.letterSpacing = e.target.value;
              setFormData(updated);
            }}
            className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
          >
            <option value="-0.05em">-0.05em</option>
            <option value="-0.02em">-0.02em</option>
            <option value="0px">0px (Normal)</option>
            <option value="0.02em">0.02em</option>
            <option value="0.05em">0.05em</option>
            <option value="0.1em">0.1em</option>
            <option value="0.15em">0.15em</option>
            <option value="0.2em">0.2em</option>
          </select>
        </div>

        {/* Line Height slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.lineHeight || 'Line Height'}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.lineHeight || 1.6}</span>
          </div>
          <input type="range" min="1.0" max="2.2" step="0.1" value={formData.themeSettings.lineHeight || 1.6} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.lineHeight = Number(e.target.value);
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
        </div>

        {/* Paragraph Max Width slider */}
        <div>
          <div className="flex justify-between text-xs font-bold uppercase mb-1">
            <span className="text-[var(--text-secondary)]">{t.cms.paragraphWidth || 'Paragraph Max Width'}</span>
            <span className="text-[var(--primary)]">{formData.themeSettings.paragraphWidth || '65ch'}</span>
          </div>
          <input type="range" min="40" max="95" step="5" value={parseInt(formData.themeSettings.paragraphWidth, 10) || 65} onChange={(e) => {
            const updated = { ...formData };
            updated.themeSettings.paragraphWidth = `${e.target.value}ch`;
            setFormData(updated);
          }} className="w-full accent-[var(--primary)]" />
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
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">{t.cms.picker}</span>
            <input type="color" value={formData.themeSettings.fontColor || '#fafafa'} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.fontColor = e.target.value;
              setFormData(updated);
            }} className="w-12 h-12 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" />
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
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">{t.cms.picker}</span>
            <input type="color" value={formData.themeSettings.headingColor || '#fafafa'} onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.headingColor = e.target.value;
              setFormData(updated);
            }} className="w-12 h-12 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['buttonTextColor', 'Button Text Color'],
            ['buttonBackgroundColor', 'Button Background Color'],
            ['cardTitleColor', 'Card Title Color'],
            ['cardDescriptionColor', 'Card Description Color']
          ].map(([key, label]) => (
            <div key={key} className="flex items-end gap-3">
              <div className="flex-1">
                <AdminInput label={label} value={formData.themeSettings[key]} onChange={(e) => {
                  setFormData({ ...formData, themeSettings: { ...formData.themeSettings, [key]: e.target.value } });
                }} />
              </div>
              <input type="color" value={formData.themeSettings[key]} onChange={(e) => {
                setFormData({ ...formData, themeSettings: { ...formData.themeSettings, [key]: e.target.value } });
              }} className="w-12 h-12 mb-4 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Tab 15: Brand Identity
  const renderBrandIdentityTab = () => {
    if (!formData.brandIdentity) {
      formData.brandIdentity = {};
    }
    if (!formData.brandIdentity.brandName) formData.brandIdentity.brandName = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.logoText) formData.brandIdentity.logoText = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.heroName) formData.brandIdentity.heroName = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.footerText) formData.brandIdentity.footerText = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.preloaderText) formData.brandIdentity.preloaderText = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.seoTitle) formData.brandIdentity.seoTitle = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.seoDescription) formData.brandIdentity.seoDescription = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.shortName) formData.brandIdentity.shortName = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.subtitle) formData.brandIdentity.subtitle = { ar: '', en: '', ur: '' };
    if (!formData.brandIdentity.browserTitle) formData.brandIdentity.browserTitle = { ar: '', en: '', ur: '' };

    return (
      <div className="space-y-6">
        <div className="border-b border-[var(--border-color)] pb-3 mb-4">
          <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms?.sidebarBrandIdentity || 'Brand Identity'}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.cms?.brandIdentityDesc || 'Manage your global brand names, logos, subtitles, preloader, and SEO properties.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] mb-5">
          <div className="md:col-span-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">{t.cms?.brandNameArabic || 'Arabic Brand Name'} / {t.cms?.brandNameEnglish || 'English Brand Name'} / {t.cms?.brandNameUrdu || 'Urdu Brand Name'}</span>
          </div>
          <AdminInput 
            label={t.cms?.brandNameArabic || 'Arabic Brand Name'} 
            value={formData.brandIdentity.brandName?.ar || ''} 
            dir="rtl"
            onChange={(e) => {
              const updated = { ...formData };
              if (!updated.brandIdentity) updated.brandIdentity = {};
              if (!updated.brandIdentity.brandName) updated.brandIdentity.brandName = {};
              updated.brandIdentity.brandName.ar = e.target.value;
              setFormData(updated);
            }} 
          />
          <AdminInput 
            label={t.cms?.brandNameEnglish || 'English Brand Name'} 
            value={formData.brandIdentity.brandName?.en || ''} 
            dir="ltr"
            onChange={(e) => {
              const updated = { ...formData };
              if (!updated.brandIdentity) updated.brandIdentity = {};
              if (!updated.brandIdentity.brandName) updated.brandIdentity.brandName = {};
              updated.brandIdentity.brandName.en = e.target.value;
              setFormData(updated);
            }} 
          />
          <AdminInput 
            label={t.cms?.brandNameUrdu || 'Urdu Brand Name'} 
            value={formData.brandIdentity.brandName?.ur || ''} 
            dir="rtl"
            onChange={(e) => {
              const updated = { ...formData };
              if (!updated.brandIdentity) updated.brandIdentity = {};
              if (!updated.brandIdentity.brandName) updated.brandIdentity.brandName = {};
              updated.brandIdentity.brandName.ur = e.target.value;
              setFormData(updated);
            }} 
          />
        </div>

        <AdminMultiLangInput 
          label={t.cms?.brandNameShort || 'Short Brand Name'} 
          valueObj={formData.brandIdentity.shortName} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.shortName) updated.brandIdentity.shortName = {};
            updated.brandIdentity.shortName[key] = val;
            setFormData(updated);
          }} 
        />

        <AdminMultiLangInput 
          label={t.cms?.brandNameSubtitle || 'Brand Subtitle'} 
          valueObj={formData.brandIdentity.subtitle} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.subtitle) updated.brandIdentity.subtitle = {};
            updated.brandIdentity.subtitle[key] = val;
            setFormData(updated);
          }} 
        />

        <AdminMultiLangInput 
          label={t.cms?.heroDisplayName || 'Hero Display Name'} 
          valueObj={formData.brandIdentity.heroName} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.heroName) updated.brandIdentity.heroName = {};
            updated.brandIdentity.heroName[key] = val;
            setFormData(updated);
          }} 
        />

        <AdminMultiLangInput 
          label={t.cms?.navbarLogoText || 'Navbar Logo Text'} 
          valueObj={formData.brandIdentity.logoText} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.logoText) updated.brandIdentity.logoText = {};
            updated.brandIdentity.logoText[key] = val;
            setFormData(updated);
          }} 
        />

        <AdminMultiLangInput 
          label={t.cms?.footerBrandText || 'Footer Brand Text'} 
          valueObj={formData.brandIdentity.footerText} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.footerText) updated.brandIdentity.footerText = {};
            updated.brandIdentity.footerText[key] = val;
            setFormData(updated);
          }} 
        />

        <AdminMultiLangInput 
          label={t.cms?.preloaderBrandText || 'Preloader Brand Text'} 
          valueObj={formData.brandIdentity.preloaderText} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.preloaderText) updated.brandIdentity.preloaderText = {};
            updated.brandIdentity.preloaderText[key] = val;
            setFormData(updated);
          }} 
        />

        <AdminMultiLangInput 
          label={t.cms?.browserTitle || 'Browser Title'} 
          valueObj={formData.brandIdentity.browserTitle} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.browserTitle) updated.brandIdentity.browserTitle = {};
            updated.brandIdentity.browserTitle[key] = val;
            setFormData(updated);
          }} 
        />

        <AdminMultiLangInput 
          label={t.cms?.seoTitle || 'SEO Title'} 
          valueObj={formData.brandIdentity.seoTitle} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.seoTitle) updated.brandIdentity.seoTitle = {};
            updated.brandIdentity.seoTitle[key] = val;
            setFormData(updated);
          }} 
        />

        <AdminMultiLangInput 
          label={t.cms?.seoDescription || 'SEO Description'} 
          textarea
          valueObj={formData.brandIdentity.seoDescription} 
          onChangeKey={(key, val) => {
            const updated = { ...formData };
            if (!updated.brandIdentity) updated.brandIdentity = {};
            if (!updated.brandIdentity.seoDescription) updated.brandIdentity.seoDescription = {};
            updated.brandIdentity.seoDescription[key] = val;
            setFormData(updated);
          }} 
        />
      </div>
    );
  };

  // Tab 13: Media & Branding
  const renderBrandingTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.mediaBrandingTitle}</h3>
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

  // --- Theme Studio Helpers ---
  const getActiveProfile = () => formData.themeProfiles?.[themeStudioSelectedTheme] || THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] || {};
  
  const updateThemeProfileKey = (key, value) => {
    const updated = { ...formData };
    if (!updated.themeProfiles) updated.themeProfiles = { ...THEME_PROFILES_DEFAULTS };
    if (!updated.themeProfiles[themeStudioSelectedTheme]) {
      updated.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] };
    }
    updated.themeProfiles[themeStudioSelectedTheme][key] = value;
    setFormData(updated);
  };

  // --- Theme Studio Tab ---
  const renderThemeStudioTab = () => {
    const profile = getActiveProfile();
    const themeNames = ['dark', 'ocean', 'aurora', 'platinum', 'midnight'];
    const themeLabels = { dark: t.cms?.themeDark || 'Dark Obsidian', ocean: t.cms?.themeOcean || 'Ocean Blue', aurora: t.cms?.themeAurora || 'Aurora Green', platinum: t.cms?.themePlatinum || 'Platinum Silver', midnight: t.cms?.themeMidnight || 'Midnight Purple' };

    const handleResetTheme = () => {
      if (window.confirm(`Reset "${themeLabels[themeStudioSelectedTheme]}" to defaults?`)) {
        const updated = { ...formData };
        if (!updated.themeProfiles) updated.themeProfiles = {};
        updated.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] };
        setFormData(updated);
      }
    };

    const handleExportTheme = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
      const a = document.createElement('a');
      a.setAttribute("href", dataStr);
      a.setAttribute("download", `${themeStudioSelectedTheme}-theme.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    const handleImportTheme = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          const updated = { ...formData };
          if (!updated.themeProfiles) updated.themeProfiles = {};
          updated.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], ...parsed };
          setFormData(updated);
        } catch (err) {
          showStatus('error', `Import Error: ${err.message}`);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    };

    const allValidations = validateContrasts(profile, THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], themeStudioSelectedTheme);
    const healthScore = calculateHealthScore(allValidations);
    const sectionScores = getSectionScores(allValidations);
    const failedChecks = allValidations.filter(v => !v.pass);

    const handleAutoFix = () => {
      const fixed = autoFixTheme(profile, THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], themeStudioSelectedTheme);
      const updated = { ...formData };
      if (!updated.themeProfiles) updated.themeProfiles = {};
      updated.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme], ...fixed };
      setFormData(updated);
    };

    return (
      <div className="space-y-6">
        {/* Theme Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-3 mb-4">
          {themeNames.map(t => (
            <button
              key={t}
              onClick={() => setThemeStudioSelectedTheme(t)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer ${
                themeStudioSelectedTheme === t
                  ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {themeLabels[t]}
            </button>
          ))}
        </div>

        {/* Theme Health Score */}
        <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">Theme Health Score</h4>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black" style={{ color: getHealthScoreColor(healthScore) }}>{healthScore}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: getHealthScoreColor(healthScore) + '20', color: getHealthScoreColor(healthScore) }}>{getHealthScoreLabel(healthScore)}</span>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${healthScore}%`, backgroundColor: getHealthScoreColor(healthScore) }} />
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            {Object.entries(sectionScores).map(([key, { score }]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getHealthScoreColor(score) }} />
                <span className="text-[10px] font-bold text-[var(--text-secondary)]">{key}: {score}</span>
              </div>
            ))}
          </div>
          {failedChecks.length > 0 && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 space-y-1">
              {failedChecks.map(check => (
                <p key={check.key} className="text-[10px] text-red-400 font-medium">
                  {check.label}: {check.ratio}:1 (needs {check.threshold}:1)
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Theme Action Bar */}
        <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <button onClick={handleResetTheme} className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer flex items-center gap-1">
            <Undo className="w-3.5 h-3.5" /> {t.cms?.reset || 'Reset'} {themeLabels[themeStudioSelectedTheme]}
          </button>
          <button onClick={handleAutoFix} className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-amber-400 hover:bg-amber-500/10 cursor-pointer flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Auto Fix Theme
          </button>
          <button onClick={handleExportTheme} className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> {t.cms?.exportTheme || 'Export Theme'}
          </button>
          <label className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" /> {t.cms?.importTheme || 'Import Theme'}
            <input type="file" accept=".json" onChange={handleImportTheme} className="hidden" />
          </label>
        </div>

        {/* Colors Section */}
        <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
          <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.colorsLabel || 'Colors'}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['accentColor', t.cms?.accentColor || 'Accent Color'],
              ['accentText', t.cms?.accentText || 'Accent Text Color'],
              ['fontColor', t.cms?.bodyFontColor || 'Body Font Color'],
              ['headingColor', t.cms?.headingColorLabel || 'Heading Color'],
              ['cardBackground', t.cms?.cardBackground || 'Card Background'],
              ['inputBackground', t.cms?.inputBackground || 'Input Background'],
              ['borderColor', t.cms?.borderColorLabel || 'Border Color'],
            ].map(([key, label]) => {
              const checkMap = { fontColor: 'bgBodyText', headingColor: 'bgHeadingText', accentText: 'accentAccentText', cardBackground: 'cardBodyText', inputBackground: 'inputInputText' };
              const fail = checkMap[key] ? allValidations.find(v => v.key === checkMap[key]) : null;
              return (
              <div key={key} className="flex items-end gap-3">
                <div className="flex-1">
                  <AdminInput label={label} value={profile[key] || ''} onChange={(e) => updateThemeProfileKey(key, e.target.value)} />
                </div>
                <div className="flex flex-col items-center gap-1 mb-4">
                  <input type="color" value={profile[key] || '#ffffff'} onChange={(e) => updateThemeProfileKey(key, e.target.value)} className="w-10 h-10 rounded border border-[var(--border-color)] bg-transparent cursor-pointer" />
                  {fail && !fail.pass && <span className="text-[8px] font-bold text-red-400" title={`${fail.label}: ${fail.ratio}:1`}>⚠</span>}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Glass Section */}
        <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
          <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.glassLabel || 'Glass'}</h4>
          {[
            ['glassOpacity', t.cms?.glassOpacity || 'Glass Opacity', 0, 0.3, 0.01],
            ['blurStrength', t.cms?.backdropBlur || 'Blur Strength', 0, 40, 1],
            ['borderOpacity', t.cms?.borderOpacity || 'Border Opacity', 0, 0.2, 0.01],
          ].map(([key, label, min, max, step]) => (
            <div key={key}>
              <div className="flex justify-between text-xs font-bold uppercase mb-1">
                <span className="text-[var(--text-secondary)]">{label}</span>
                <span className="text-[var(--primary)]">{key === 'blurStrength' ? `${profile[key]}px` : profile[key]}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={profile[key] !== undefined ? profile[key] : THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme]?.[key]} onChange={(e) => updateThemeProfileKey(key, Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </div>
          ))}
        </div>

        {/* Effects Section */}
        <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
          <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.effectsLabel || 'Effects'}</h4>
          {[
            ['glowIntensity', t.cms?.glowIntensity || 'Glow Intensity', 0, 1, 0.05],
            ['bgIntensity', t.cms?.backgroundIntensity || 'Background Intensity', 0, 0.5, 0.01],
          ].map(([key, label, min, max, step]) => (
            <div key={key}>
              <div className="flex justify-between text-xs font-bold uppercase mb-1">
                <span className="text-[var(--text-secondary)]">{label}</span>
                <span className="text-[var(--primary)]">{profile[key]}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={profile[key] !== undefined ? profile[key] : THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme]?.[key]} onChange={(e) => updateThemeProfileKey(key, Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </div>
          ))}
        </div>

        {/* Typography Section */}
        <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
          <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.typographyLabel || 'Typography'}</h4>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms?.fontFamily || 'Font Family'}</label>
            <select value={profile.fontFamily || 'Inter'} onChange={(e) => updateThemeProfileKey('fontFamily', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm">
              <option value="Inter">Inter</option>
              <option value="Cairo">Cairo</option>
              <option value="Tajawal">Tajawal</option>
              <option value="IBM Plex Sans">IBM Plex Sans</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms?.fontScale || 'Font Scale'}</span>
              <span className="text-[var(--primary)]">{profile.fontScale || 1.0}x</span>
            </div>
            <input type="range" min="0.8" max="1.5" step="0.05" value={profile.fontScale || 1.0} onChange={(e) => updateThemeProfileKey('fontScale', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase mb-1">
                <span className="text-[var(--text-secondary)]">{t.cms?.headingSize || 'Heading Size'}</span>
                <span className="text-[var(--primary)]">{profile.headingSize || 48}px</span>
              </div>
              <input type="range" min="32" max="88" step="2" value={profile.headingSize || 48} onChange={(e) => updateThemeProfileKey('headingSize', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase mb-1">
                <span className="text-[var(--text-secondary)]">{t.cms?.paragraphSize || 'Paragraph Size'}</span>
                <span className="text-[var(--primary)]">{profile.paragraphSize || 16}px</span>
              </div>
              <input type="range" min="12" max="24" step="1" value={profile.paragraphSize || 16} onChange={(e) => updateThemeProfileKey('paragraphSize', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms?.headingWeight || 'Heading Weight'}</label>
            <select value={profile.headingWeight || '800'} onChange={(e) => updateThemeProfileKey('headingWeight', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm">
              <option value="400">{t.cms?.weightRegular || 'Regular'}</option>
              <option value="500">{t.cms?.weightMedium || 'Medium'}</option>
              <option value="600">{t.cms?.weightSemibold || 'Semibold'}</option>
              <option value="700">{t.cms?.weightBold || 'Bold'}</option>
              <option value="800">{t.cms?.weightExtraBold || 'Extra Bold'}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms?.bodyWeight || 'Body Weight'}</label>
            <select value={profile.bodyWeight || '300'} onChange={(e) => updateThemeProfileKey('bodyWeight', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm">
              <option value="300">{t.cms?.weightLight || 'Light'}</option>
              <option value="400">{t.cms?.weightRegular || 'Regular'}</option>
              <option value="500">{t.cms?.weightMedium || 'Medium'}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms?.letterSpacing || 'Letter Spacing'}</label>
            <select value={profile.letterSpacing || '0px'} onChange={(e) => updateThemeProfileKey('letterSpacing', e.target.value)} className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm">
              <option value="-0.05em">{t.cms?.spacingTighter || '-0.05em'}</option>
              <option value="-0.02em">{t.cms?.spacingTight || '-0.02em'}</option>
              <option value="0px">{t.cms?.spacingNormal || '0px (Normal)'}</option>
              <option value="0.02em">0.02em</option>
              <option value="0.05em">0.05em</option>
              <option value="0.1em">0.1em</option>
              <option value="0.15em">0.15em</option>
              <option value="0.2em">0.2em</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1">
              <span className="text-[var(--text-secondary)]">{t.cms?.lineHeight || 'Line Height'}</span>
              <span className="text-[var(--primary)]">{profile.lineHeight || 1.6}</span>
            </div>
            <input type="range" min="1.0" max="2.2" step="0.1" value={profile.lineHeight || 1.6} onChange={(e) => updateThemeProfileKey('lineHeight', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
        </div>

        {/* Radius Section */}
        <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-5">
          <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms?.radiusLabel || 'Radius'}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase mb-1">
                <span className="text-[var(--text-secondary)]">{t.cms?.cardRadius || 'Card Radius'}</span>
                <span className="text-[var(--primary)]">{profile.cardRadius || 16}px</span>
              </div>
              <input type="range" min="4" max="32" step="2" value={profile.cardRadius || 16} onChange={(e) => updateThemeProfileKey('cardRadius', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase mb-1">
                <span className="text-[var(--text-secondary)]">{t.cms?.buttonRadius || 'Button Radius'}</span>
                <span className="text-[var(--primary)]">{profile.buttonRadius || 8}px</span>
              </div>
              <input type="range" min="2" max="24" step="2" value={profile.buttonRadius || 8} onChange={(e) => updateThemeProfileKey('buttonRadius', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Background Builder Tab ---
  const renderBackgroundBuilderTab = () => {
    const profile = getActiveProfile();
    const layers = ['grid', 'itNetwork', 'aiNodes', 'safetyGeometry', 'blueprint', 'lightRays'];
    const layerLabels = { grid: 'Layer 1 — Engineering Grid', itNetwork: 'Layer 2 — IT Network', aiNodes: 'Layer 3 — AI Nodes', safetyGeometry: 'Layer 4 — Safety Geometry', blueprint: 'Layer 5 — Blueprint', lightRays: 'Layer 6 — Ambient Light Rays' };

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
              onClick={() => updateThemeProfileKey('backgroundEnabled', !profile.backgroundEnabled)}
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
                <span className="text-[var(--primary)]">{(profile.layerOpacities?.[layer] ?? THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme]?.layerOpacities?.[layer])?.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="0.25" step="0.005" value={profile.layerOpacities?.[layer] ?? THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme]?.layerOpacities?.[layer] ?? 0.08} onChange={(e) => {
                const updated = { ...formData };
                if (!updated.themeProfiles) updated.themeProfiles = {};
                if (!updated.themeProfiles[themeStudioSelectedTheme]) updated.themeProfiles[themeStudioSelectedTheme] = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme] };
                if (!updated.themeProfiles[themeStudioSelectedTheme].layerOpacities) {
                  updated.themeProfiles[themeStudioSelectedTheme].layerOpacities = { ...THEME_PROFILES_DEFAULTS[themeStudioSelectedTheme].layerOpacities };
                }
                updated.themeProfiles[themeStudioSelectedTheme].layerOpacities[layer] = Number(e.target.value);
                setFormData(updated);
              }} className="w-full accent-[var(--primary)]" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab();
      case 'brandIdentity': return renderBrandIdentityTab();
      case 'themeStudio': return renderThemeStudioTab();
      case 'backgroundBuilder': return renderBackgroundBuilderTab();
      case 'structure': return renderStructureTab();
      case 'hero': return renderHeroTab();
      case 'about': return renderAboutTab();
      case 'projects': return renderProjectsTab();
      case 'skills': return renderSkillsTab();
      case 'experience': return renderExperienceTab();
      case 'certifications': return renderCertificationsTab();
      case 'achievements': return renderAchievementsTab();
      case 'contact': return renderContactTab();
      case 'customSections': return renderCustomSectionsTab();
      case 'translations': return renderTranslationsTab();
      case 'theme': return renderThemeTab();
      case 'branding': return renderBrandingTab();
      default: return renderGeneralTab();
    }
  };

  // --- STICKY REAL-TIME PREVIEW WINDOW ---
  const renderPreviewPanel = () => {
    const isThemeStudio = activeTab === 'themeStudio' || activeTab === 'backgroundBuilder';
    const previewProfile = isThemeStudio ? getActiveProfile() : (formData.themeProfiles?.[formData.themeSettings?.defaultTheme || 'dark'] || formData.themeSettings);
    const p = previewProfile;
    const isLight = (themeStudioSelectedTheme || formData.themeSettings?.defaultTheme) === 'platinum';
    // Compute preview-safe text colors derived from profile for guaranteed readability
    const previewTextColor = isLight ? '#0f172a' : (p.fontColor && p.fontColor !== '#000000' ? p.fontColor : '#f1f5f9');
    const previewCardText = isLight ? '#334155' : (p.cardDescriptionColor && p.cardDescriptionColor !== '#000000' ? p.cardDescriptionColor : '#cbd5e1');
    const previewInputText = isLight ? '#0f172a' : (p.fontColor && p.fontColor !== '#000000' ? p.fontColor : '#e2e8f0');
    return (
      <div 
        className="w-full h-full p-6 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[300px]"
        style={{
          '--accent-color': p.accentColor || '#ffffff',
          '--primary': p.accentColor || '#ffffff',
          '--glass-opacity': p.glassOpacity !== undefined ? p.glassOpacity : 0.03,
          '--border-opacity': p.borderOpacity !== undefined ? p.borderOpacity : 0.06,
          '--blur-strength': `${p.blurStrength !== undefined ? p.blurStrength : 16}px`,
          '--font-family-setting': p.fontFamily ? `'${p.fontFamily}', var(--font-sans)` : 'var(--font-sans)',
          '--font-scale-setting': p.fontScale !== undefined ? p.fontScale : 1.0,
          '--heading-size-setting': `${p.headingSize || 48}px`,
          '--paragraph-size-setting': `${p.paragraphSize || 16}px`,
          '--heading-weight-setting': p.headingWeight || '800',
          '--body-weight-setting': p.bodyWeight || '300',
          '--font-color-setting': previewTextColor,
          '--heading-color-setting': isLight ? 'var(--text-primary)' : previewTextColor,
          '--letter-spacing-setting': p.letterSpacing || 'normal',
          '--line-height-setting': p.lineHeight || '1.6',
          '--paragraph-width-setting': p.paragraphWidth || '65ch',
          '--button-text-color-setting': isLight ? 'var(--accent-text)' : (p.buttonTextColor || 'var(--accent-text)'),
          '--button-background-color-setting': isLight ? 'var(--accent-color)' : (p.buttonBackgroundColor || 'var(--accent)'),
          '--card-title-color-setting': isLight ? 'var(--text-primary)' : (p.cardTitleColor || 'var(--heading-color-setting)'),
          '--card-description-color-setting': isLight ? 'var(--text-secondary)' : (p.cardDescriptionColor || 'var(--muted)'),
          'fontFamily': p.fontFamily ? `'${p.fontFamily}', sans-serif` : 'sans-serif',
          'fontSize': `calc(100% * ${p.fontScale || 1.0})`,
          'letterSpacing': p.letterSpacing || 'normal',
          'lineHeight': p.lineHeight || '1.6',
          '--heading-weight': p.headingWeight || '800',
          '--body-weight': p.bodyWeight || '300',
          '--font-color': isLight ? 'var(--text-primary)' : (p.fontColor || 'var(--text-primary)'),
          '--heading-color': isLight ? 'var(--text-primary)' : (p.headingColor || 'var(--text-primary)')
        }}
      >
        {/* Glow ambient spot */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-300" 
          style={{
            background: p.accentColor || '#ffffff',
            opacity: (p.glowIntensity !== undefined ? p.glowIntensity : 0.2) * 0.4
          }}
        />

        <div className="relative z-10 space-y-4" style={{ color: 'var(--font-color)' }}>
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
            <span>{t.cms?.previewCardTitle}</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {t.cms?.realtime}</span>
          </div>

          {activeTab === 'general' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-2">
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms?.previewLogo}</span>
              <div className="text-lg font-black text-[var(--text-primary)]" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.general.logoText[lang] || formData.general.logoText.en}</div>
              <div className="text-xs text-[var(--text-secondary)]" style={{ fontWeight: 'var(--body-weight)' }}>{formData.general.brandIdentity[lang] || formData.general.brandIdentity.en}</div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms?.previewFlow}</span>
              <div className="space-y-1.5">
                {formData.websiteStructure.sections.map(s => (
                  <div key={s.id} className={`p-2 rounded text-[10px] font-bold border flex items-center justify-between ${
                    s.visible ? 'bg-[var(--accent-color)]/5 border-[var(--accent-color)]/20 text-[var(--text-primary)]' : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}>
                    <span className="capitalize">{s.id}</span>
                    <span>{s.visible ? t.cms.on : t.cms.off}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 uppercase">{t.cms.availableBadge}</div>
              <h4 className="text-xl font-black text-[var(--text-primary)] leading-tight" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>
                {formData.hero.title1[lang] || formData.hero.title1.en}<br />
                <span style={{ color: formData.themeSettings.accentColor }}>{formData.hero.title2[lang] || formData.hero.title2.en}</span>
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light line-clamp-3" style={{ fontWeight: 'var(--body-weight)' }}>
                {formData.hero.tagline[lang] || formData.hero.tagline.en}
              </p>
              <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pt-2">
                {t.cms.statsLabel}: {formData.hero.statistics.experienceYears} {t.yearsExp} • {formData.hero.statistics.projectsBuilt} {t.projectsBuilt}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
              <h4 className="text-base font-bold text-[var(--text-primary)]" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.about.title[lang] || formData.about.title.en}</h4>
              <p className="text-[11px] text-[var(--accent-color)] font-medium">{formData.about.subtitle[lang] || formData.about.subtitle.en}</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light line-clamp-5 whitespace-pre-line" style={{ fontWeight: 'var(--body-weight)' }}>
                {formData.about.text[lang] || formData.about.text.en}
              </p>
            </div>
          )}

          {activeTab === 'projects' && (
            <div 
              className="p-5 rounded-2xl border bg-[var(--surface-hover)] backdrop-blur-[var(--blur-strength)] space-y-4"
              style={{ borderColor: `rgba(255,255,255,var(--border-opacity))` }}
            >
              <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-secondary)]">
                <span>{formData.projects[0]?.category[lang] || t.cms.projectPlaceholderCategory}</span>
                <span className="text-[var(--accent-color)]">{t.cms.previewLabel || 'Preview'}</span>
              </div>
              <h4 className="text-base font-extrabold text-[var(--text-primary)]" style={{ color: 'var(--heading-color)', fontWeight: 'var(--heading-weight)' }}>{formData.projects[0]?.title || 'Safety System'}</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light line-clamp-3" style={{ fontWeight: 'var(--body-weight)' }}>
                {formData.projects[0]?.description[lang] || formData.projects[0]?.description.en}
              </p>
              <div className="flex flex-wrap gap-1">
                {formData.projects[0]?.tech.slice(0, 3).map((tItem, i) => {
                  const label = typeof tItem === 'string' ? tItem : tItem[lang] || tItem.en;
                  return <span key={i} className="text-[8px] font-bold bg-[var(--surface-hover)] border border-[var(--border-color)] px-2 py-0.5 rounded text-[var(--text-primary)]/75">{label}</span>;
                })}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
              <h4 className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider">{formData.skills[0]?.category[lang] || t.cms.sidebarSkills}</h4>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills[0]?.items.slice(0, 5).map((item, i) => (
                  <span key={i} className="text-[10px] font-medium bg-[var(--surface-hover)] border border-[var(--border-color)] px-2.5 py-1 rounded-lg text-[var(--text-primary)]/80">{item[lang] || item.en}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3">
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms.previewTimeline}</span>
              <div className="border-l border-[var(--border-color)] pl-3 space-y-3">
                {formData.experience.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <h5 className="font-bold text-[var(--text-primary)]">{exp.role[lang] || exp.role.en}</h5>
                    <p className="text-[10px] text-[var(--text-secondary)] mb-1">{exp.company[lang] || exp.company.en} • {exp.period[lang] || exp.period.en}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div 
              className="p-4 rounded-xl border bg-[var(--surface-hover)] backdrop-blur-[var(--blur-strength)] text-center relative"
              style={{ borderColor: `rgba(255,255,255,var(--border-opacity))` }}
            >
              <div className="mx-auto w-10 h-10 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 flex items-center justify-center text-[var(--accent-color)] mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-[var(--text-primary)] text-xs px-2 leading-snug">
                {formData.certifications[0]?.name?.[lang] || formData.certifications[0]?.[lang] || t.cms.certPlaceholderName}
              </h5>
              <p className="text-[9px] text-[var(--text-secondary)] mt-1">{formData.certifications[0]?.provider?.[lang] || t.cms.certPlaceholderProvider}</p>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-2 gap-3">
              {formData.achievements.slice(0, 2).map((ach) => (
                <div key={ach.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-center">
                  <div className="text-2xl font-black text-[var(--text-primary)]" style={{ color: formData.themeSettings.accentColor }}>{ach.value}{ach.suffix}</div>
                  <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-1">{ach.label[lang] || ach.label.en}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-2 gap-2">
              {formData.contact.email && <div className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded text-center text-[10px] text-[var(--text-primary)]">{t.emailLabel}</div>}
              {formData.contact.whatsapp && <div className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded text-center text-[10px] text-emerald-400">{t.whatsappLabel}</div>}
              {formData.contact.github && <div className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded text-center text-[10px] text-[var(--text-secondary)]">{t.githubLabel}</div>}
              {formData.contact.linkedin && <div className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded text-center text-[10px] text-blue-400">LinkedIn</div>}
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
              <p className="text-xs text-[var(--text-primary)]/70 mt-3 font-light leading-relaxed">
                {t.cms.previewThemeDesc}
              </p>
            </div>
          )}

          {activeTab === 'themeStudio' && (() => {
            const p = getActiveProfile();
            const themeNames = ['dark', 'ocean', 'aurora', 'platinum', 'midnight'];
            const themeLabels = { dark: t.cms?.themeDark || 'Dark Obsidian', ocean: t.cms?.themeOcean || 'Ocean Blue', aurora: t.cms?.themeAurora || 'Aurora Green', platinum: t.cms?.themePlatinum || 'Platinum Silver', midnight: t.cms?.themeMidnight || 'Midnight Purple' };
            return (
              <div className="space-y-4" style={{ fontFamily: p.fontFamily ? `'${p.fontFamily}', sans-serif` : undefined }}>
                <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[var(--text-secondary)] tracking-wider">
                  <span>{t.cms?.themeStudioPreview || 'Theme Studio Preview'}</span>
                  <span className="text-[var(--primary)]">{themeLabels[themeStudioSelectedTheme]}</span>
                </div>
                {/* Navbar preview */}
                <div className="p-3 rounded-xl border flex items-center gap-3 text-xs" style={{ borderColor: p.borderColor, background: p.cardBackground, borderRadius: p.cardRadius }}>
                  <div className="w-6 h-6 rounded-full" style={{ background: p.accentColor }} />
                  <span className="font-bold flex-1" style={{ color: p.headingColor }}>{formData.brandIdentity?.logoText?.en || 'Mohamed Okash'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: p.accentColor + '20', color: p.accentColor }}>Work</span>
                </div>
                {/* Hero title preview */}
                <h3 className="text-lg font-black leading-tight" style={{ color: p.headingColor, fontWeight: p.headingWeight, fontSize: p.headingSize ? `${p.headingSize * 0.5}px` : undefined }}>
                  HSE & <span style={{ color: p.accentColor }}>Engineering</span>
                </h3>
                {/* Paragraph preview */}
                <p className="text-xs leading-relaxed" style={{ color: previewCardText, fontWeight: p.bodyWeight, lineHeight: p.lineHeight, letterSpacing: p.letterSpacing }}>
                  Bridging 7 years of IT infrastructure experience with modern Health & Safety engineering to build practical applications.
                </p>
                {/* Button preview */}
                <div className="flex gap-2">
                  <div className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: p.buttonBackgroundColor || p.accentColor, color: p.buttonTextColor || (p.accentText || '#000'), borderRadius: p.buttonRadius }}>
                    View Projects
                  </div>
                  <div className="px-4 py-2 rounded-lg text-xs font-bold border" style={{ borderColor: p.borderColor, color: previewTextColor, borderRadius: p.buttonRadius }}>
                    Contact Me
                  </div>
                </div>
                {/* Card preview */}
                <div className="p-4 rounded-xl border space-y-2" style={{ borderColor: p.borderColor, background: `rgba(255,255,255,${p.glassOpacity || 0.03})`, backdropFilter: `blur(${p.blurStrength || 16}px)`, borderRadius: p.cardRadius }}>
                  <h5 className="text-xs font-bold" style={{ color: previewTextColor }}>Project Card</h5>
                  <p className="text-[10px]" style={{ color: previewCardText }}>Safety management system built with React and Firestore.</p>
                </div>
                {/* Input preview */}
                <input placeholder="Email address" className="w-full p-3 rounded-lg text-xs border outline-none" style={{ borderColor: p.borderColor, background: p.inputBackground || 'rgba(0,0,0,0.3)', color: previewInputText, borderRadius: p.buttonRadius }} />
              </div>
            );
          })()}

          {activeTab === 'backgroundBuilder' && (() => {
            const p = getActiveProfile();
            const layerNames = ['grid', 'itNetwork', 'aiNodes', 'safetyGeometry', 'blueprint', 'lightRays'];
            const layerLabels = { grid: 'Engineering Grid', itNetwork: 'IT Network', aiNodes: 'AI Nodes', safetyGeometry: 'Safety Geometry', blueprint: 'Blueprint', lightRays: 'Light Rays' };
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[var(--text-secondary)] tracking-wider">
                  <span>{t.cms?.backgroundPreview || 'Background Preview'}</span>
                  <span className={p.backgroundEnabled !== false ? 'text-emerald-400' : 'text-red-400'}>{p.backgroundEnabled !== false ? 'ON' : 'OFF'}</span>
                </div>
                <div className="p-4 rounded-xl border min-h-[160px] relative overflow-hidden flex items-center justify-center" style={{ borderColor: p.borderColor, background: p.cardBackground }}>
                  <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }} />
                  <div className="relative z-10 text-center">
                    <div className="text-[18px] font-black uppercase tracking-widest" style={{ color: p.accentColor }}>LIVE</div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1">{layerLabels[layerNames[0]]}: ×{(p.layerOpacities?.grid ?? 0.08).toFixed(2)}</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">{layerLabels[layerNames[1]]}: ×{(p.layerOpacities?.itNetwork ?? 0.12).toFixed(2)}</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">{layerLabels[layerNames[2]]}: ×{(p.layerOpacities?.aiNodes ?? 0.1).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'translations' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-2">
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms.previewTranslation}</span>
              <div className="text-xs text-[var(--text-primary)]"><span className="opacity-55">workTitle:</span> "{formData.translations[lang]?.workTitle || ''}"</div>
              <div className="text-xs text-[var(--text-primary)]"><span className="opacity-55">footerText:</span> "{formData.translations[lang]?.footerText || ''}"</div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-center space-y-2">
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block">{t.cms.previewBranding}</span>
              <div className="text-xl font-bold tracking-widest text-[var(--text-primary)] animate-pulse uppercase">{formData.mediaBranding.preloaderLogo || formData.brandIdentity?.preloaderText?.en || 'OKASH'}</div>
            </div>
          )}

          {activeTab === 'brandIdentity' && (
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-left space-y-2 text-xs">
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase block text-center border-b border-[var(--border-color)] pb-1 mb-2">
                {t.cms?.sidebarBrandIdentity || 'Brand Identity'}
              </span>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityArabicName}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.brandName?.ar || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityEnglishName}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.brandName?.en || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityUrduName}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.brandName?.ur || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityShortName}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.shortName?.[lang] || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentitySubtitle}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.subtitle?.[lang] || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityNavbarLogo}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.logoText?.[lang] || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityHeroDisplay}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.heroName?.[lang] || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityFooterText}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.footerText?.[lang] || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityPreloaderText}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.preloaderText?.[lang] || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentityBrowserTitle}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.browserTitle?.[lang] || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentitySeoTitle}</strong> <span className="text-[var(--text-primary)] font-medium">{formData.brandIdentity?.seoTitle?.[lang] || 'N/A'}</span></div>
              <div><strong className="text-[var(--text-secondary)]">{t.cms.brandIdentitySeoDescription}</strong> <span className="text-[var(--text-primary)] font-light block mt-1">{formData.brandIdentity?.seoDescription?.[lang] || 'N/A'}</span></div>
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans">
      
      {/* CMS Header Bar */}
      <header className="fixed top-0 inset-x-0 h-16 bg-[var(--card-bg)] border-b border-[var(--border-color)] backdrop-blur-md flex items-center gap-2 px-2 sm:px-4 lg:px-6 z-40">
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[var(--text-secondary)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.cms?.viewSite || 'View Site'}</span>
          </button>
          
          <select 
            value={lang} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs text-[var(--text-primary)] outline-none cursor-pointer hover:border-[var(--border-color)] transition-colors"
          >
            <option value="ar">{t.cms?.arabic || 'العربية'}</option>
            <option value="en">{t.cms?.english || 'English'}</option>
            <option value="ur">{t.cms?.urdu || 'اردو'}</option>
          </select>

          <select 
            value={formData.themeSettings?.defaultTheme || 'dark'}
            onChange={(e) => {
              const updated = { ...formData };
              updated.themeSettings.defaultTheme = e.target.value;
              setFormData(updated);
              setTheme(e.target.value);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs text-[var(--text-primary)] outline-none cursor-pointer hidden sm:block"
            title="Default Theme"
          >
            <option value="dark">{t.cms?.themeDark || 'Dark'}</option>
            <option value="ocean">{t.cms?.themeOcean || 'Ocean'}</option>
            <option value="aurora">{t.cms?.themeAurora || 'Aurora'}</option>
            <option value="platinum">{t.cms?.themePlatinum || 'Platinum'}</option>
            <option value="midnight">{t.cms?.themeMidnight || 'Midnight'}</option>
          </select>

          <button
            onClick={() => setPreviewMode(!previewMode)}
            aria-label={t.cms?.ariaPreviewMode || 'Preview mode'}
            className={`p-2 rounded-lg border text-xs cursor-pointer hidden lg:flex items-center gap-1 ${
              previewMode ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]' : 'border-[var(--border-color)] text-[var(--text-secondary)]'
            }`}
            title="Preview Mode"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <h1 className="font-black text-[var(--text-primary)] tracking-widest uppercase items-center gap-2 hidden md:flex"
            style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)' }}>
            <Cpu className="w-4.5 h-4.5 text-[var(--primary)] shrink-0" />
            <span className="truncate">{t.cms?.panelTitle || 'Portfolio Enterprise CMS'}</span>
          </h1>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 min-w-0 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.cms?.searchPlaceholder || 'Search everywhere...'}
            className="w-full pl-9 pr-3 py-1.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--primary)] transition-all"
          />

          {/* Search Dropdown Overlay */}
          {searchQuery && (
            <div className="absolute top-full right-0 w-[min(20rem,calc(100vw-1rem))] mt-1 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl shadow-2xl overflow-hidden z-50 py-1.5">
              <div className="px-3 py-1 text-[9px] uppercase font-bold text-[var(--text-secondary)] tracking-wider border-b border-[var(--border-color)]">{t.cms?.searchResults || 'Search Results'}</div>
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-xs text-[var(--text-secondary)]">{t.cms?.noResults || 'No matches found.'}</div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((res, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleSearchResultClick(res)}
                      className="px-4 py-2.5 hover:bg-[var(--bg-secondary)] cursor-pointer flex flex-col gap-0.5 border-b border-[var(--border-color)] last:border-b-0"
                    >
                      <span className="text-xs font-bold text-[var(--text-primary)]">{res.name}</span>
                      <span className="text-[9px] text-[var(--text-secondary)] capitalize">{res.desc} ({t.cms?.tabLabel || 'Tab'}: {res.tab})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action controls (Export/Import, LogOut) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportJSON}
            aria-label={t.cms?.exportBackup || 'Export Portfolio JSON Backup'}
            title={t.cms?.exportBackup || 'Export Portfolio JSON Backup'}
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label={t.cms?.importBackup || 'Import Portfolio JSON Backup'}
            title={t.cms?.importBackup || 'Import Portfolio JSON Backup'}
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
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
              aria-label={t.cms?.rollbackBackup || 'Restore Previous Backup Version'}
              title={t.cms?.rollbackBackup || 'Restore Previous Backup Version'}
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] text-amber-500 hover:bg-amber-500/10 cursor-pointer"
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
            aria-label={t.cms?.logOut || 'Log Out'}
            className="p-2 rounded-lg border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title={t.cms?.logOut || 'Log Out'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          className="lg:hidden p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] shrink-0"
          aria-label={t.cms?.ariaCloseModal || 'Close'}
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 pt-16 flex h-screen overflow-hidden">
        {isMobileNavOpen && (
          <button
            type="button"
            className="fixed inset-0 top-16 bg-[var(--card-bg)] backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label={t.cms?.ariaCloseModal || 'Close'}
          />
        )}
        
        {/* Navigation Sidebar */}
        <aside className={`fixed lg:static top-16 bottom-0 start-0 z-50 w-[min(19rem,88vw)] lg:w-64 bg-[var(--bg-secondary)] lg:bg-[var(--card-bg)] border-e border-[var(--border-color)] h-[calc(100vh-64px)] overflow-y-auto shrink-0 flex flex-col p-4 gap-1 transition-transform duration-300 ease-out will-change-transform ${isMobileNavOpen ? 'translate-x-0' : isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="lg:hidden flex items-center justify-between px-2 pb-3 mb-2 border-b border-[var(--border-color)]">
            <span className="text-xs font-black uppercase tracking-widest">CMS Navigation</span>
            <button type="button" onClick={() => setIsMobileNavOpen(false)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]" aria-label={t.cms?.ariaCloseModal || 'Close'}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-3 py-2 text-[9px] uppercase font-bold text-[var(--text-secondary)] tracking-widest hidden md:block">{t.cms?.sidebarHeaderSettings || 'Settings'}</div>
          <button 
            onClick={() => handleTabChange('general')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'general' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Settings className="w-3.5 h-3.5" /> {t.cms?.sidebarSettings || 'General Settings'}
          </button>

          <button 
            onClick={() => handleTabChange('brandIdentity')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'brandIdentity' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Shield className="w-3.5 h-3.5" /> {t.cms?.sidebarBrandIdentity || 'Brand Identity'}
          </button>

          <button 
            onClick={() => handleTabChange('structure')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'structure' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Globe className="w-3.5 h-3.5" /> {t.cms?.sidebarStructure || 'Website Structure'}
          </button>

          <button 
            onClick={() => handleTabChange('branding')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'branding' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Image className="w-3.5 h-3.5" /> {t.cms?.sidebarBranding || 'Media & Branding'}
          </button>

          <button 
            onClick={() => handleTabChange('themeStudio')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'themeStudio' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Palette className="w-3.5 h-3.5" /> {t.cms?.sidebarThemeStudio || 'Theme Studio'}
          </button>

          <div className="px-3 py-2 mt-4 text-[9px] uppercase font-bold text-[var(--text-secondary)] tracking-widest hidden md:block">{t.cms?.sidebarHeaderComponents || 'Components'}</div>
          <button 
            onClick={() => handleTabChange('hero')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'hero' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <User className="w-3.5 h-3.5" /> {t.cms?.sidebarHero || 'Hero Section'}
          </button>

          <button 
            onClick={() => handleTabChange('about')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'about' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Star className="w-3.5 h-3.5" /> {t.cms?.sidebarAbout || 'About Section'}
          </button>

          <button 
            onClick={() => handleTabChange('projects')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'projects' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Briefcase className="w-3.5 h-3.5" /> {t.cms?.sidebarProjects || 'Projects Showcase'}
          </button>

          <button 
            onClick={() => handleTabChange('skills')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'skills' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Monitor className="w-3.5 h-3.5" /> {t.cms?.sidebarSkills || 'Toolbox / Skills'}
          </button>

          <button 
            onClick={() => handleTabChange('experience')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'experience' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Briefcase className="w-3.5 h-3.5" /> {t.cms?.sidebarExperience || 'Job Experience'}
          </button>

          <button 
            onClick={() => handleTabChange('certifications')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'certifications' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Award className="w-3.5 h-3.5" /> {t.cms?.sidebarCertifications || 'Certifications'}
          </button>

          <button 
            onClick={() => handleTabChange('achievements')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'achievements' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Award className="w-3.5 h-3.5" /> {t.cms?.sidebarAchievements || 'Achievements'}
          </button>

          <button 
            onClick={() => handleTabChange('contact')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'contact' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Mail className="w-3.5 h-3.5" /> {t.cms?.sidebarContact || 'Contact Details'}
          </button>

          <button 
            onClick={() => handleTabChange('customSections')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'customSections' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Layers className="w-3.5 h-3.5" /> {t.cms?.sidebarCustomSections || 'Custom Sections'}
          </button>

          <div className="px-3 py-2 mt-4 text-[9px] uppercase font-bold text-[var(--text-secondary)] tracking-widest hidden md:block">{t.cms?.sidebarHeaderThemeLang || 'Theme & Language'}</div>
          <button 
            onClick={() => handleTabChange('theme')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'theme' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Palette className="w-3.5 h-3.5" /> {t.cms?.sidebarTheme || 'Theme Settings'}
          </button>

          <button 
            onClick={() => handleTabChange('backgroundBuilder')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'backgroundBuilder' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Layers className="w-3.5 h-3.5" /> {t.cms?.sidebarBackgroundBuilder || 'Background Builder'}
          </button>

          <button 
            onClick={() => handleTabChange('translations')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'translations' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Languages className="w-3.5 h-3.5" /> {t.cms?.sidebarTranslations || 'Dictionary Texts'}
          </button>
        </aside>

        {/* Content Pane Split (60% Form Editor, 40% Visual Preview Card) */}
        <main className="flex-1 min-w-0 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
          
          {/* Left Form Workspace (60% width) */}
          <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto h-full space-y-6">
            
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

            <div className="max-w-3xl pb-28 overflow-x-hidden">
              {renderActiveForm()}
              <div className="lg:hidden mt-8 rounded-xl border border-[var(--border-color)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsMobilePreviewOpen((open) => !open)}
                  className="w-full p-4 flex items-center justify-between bg-[var(--bg-secondary)] text-sm font-bold"
                >
                  <span>{t.cms?.realtime || 'Live Preview'}</span>
                  {isMobilePreviewOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isMobilePreviewOpen && <div className="p-4 bg-[var(--bg-secondary)]">{renderPreviewPanel()}</div>}
              </div>
            </div>
          </div>

          {/* Right Visual Preview Sidebar Panel (40% width) */}
          <div className="hidden lg:block w-96 xl:w-[28rem] h-full p-6 border-s border-[var(--border-color)] bg-[var(--bg-secondary)] shrink-0 overflow-y-auto">
            {renderPreviewPanel()}
          </div>

        </main>
      </div>

      {/* Persistent sticky save toolbar at the bottom */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card-bg)] border border-[var(--border-color)] px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 flex-wrap justify-center w-[calc(100vw-1rem)] max-w-[600px]">
        {isDirty && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />}
        <span className={`text-[10px] sm:text-xs font-bold text-[var(--text-secondary)] ${isDirty ? '' : 'hidden'}`}>
          {t.cms?.unsavedTitle || 'Unsaved'}
        </span>
        <button 
          onClick={() => setFormData(JSON.parse(JSON.stringify(data)))}
          className="px-3 py-1.5 border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] rounded-lg text-[10px] sm:text-xs font-extrabold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          title={t.cms?.reset || 'Reset'}
        >
          <Undo className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
        {data?.settings?.backup && (
          <button
            onClick={handleRollback}
            className="px-3 py-1.5 border border-amber-500/20 hover:bg-amber-500/10 rounded-lg text-[10px] sm:text-xs font-extrabold text-amber-400 transition-all cursor-pointer"
            title={t.cms?.rollbackBackup || 'Restore Backup'}
          >
            <Undo className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        )}
        <button
          onClick={handleExportJSON}
          className="px-3 py-1.5 border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] rounded-lg text-[10px] sm:text-xs font-extrabold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          title={t.cms?.exportBackup || 'Export'}
        >
          <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] rounded-lg text-[10px] sm:text-xs font-extrabold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          title={t.cms?.importBackup || 'Import'}
        >
          <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />
        <div className="w-px h-5 bg-[var(--border-color)] mx-1" />
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-4 sm:px-5 py-1.5 sm:py-2 bg-[var(--primary)] text-[var(--accent-text)] hover:opacity-90 rounded-lg text-[10px] sm:text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[var(--primary)]/10"
        >
          {isSaving ? <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" /> : <Save className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          {isSaving ? (t.cms?.saving || 'Saving...') : (t.cms?.saveChanges || 'Save')}
        </button>
      </div>

    </div>
  );
}
