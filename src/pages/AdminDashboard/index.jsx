import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useLanguageStore } from '../../store/languageStore';
import { useThemeStore } from '../../store/themeStore';
import { translations } from '../../data/translations';
import { DEFAULT_PORTFOLIO_DATA, THEME_PROFILES_DEFAULTS } from '../../data/constants';
import { validatePortfolioData } from '../../utils/validators';

// Icon imports
import { 
  Cpu, LogOut, ArrowLeft, Search, Menu, X, Eye, Loader2, Download, Upload, RotateCcw, RotateCw
} from 'lucide-react';

// Subcomponents imports
import { GeneralSettings } from './components/GeneralSettings';
import { BrandIdentitySettings } from './components/BrandIdentitySettings';
import { StructureSettings } from './components/StructureSettings';
import { BrandingSettings } from './components/BrandingSettings';
import { HeroSettings } from './components/HeroSettings';
import { AboutSettings } from './components/AboutSettings';
import { StorySettings } from './components/StorySettings';
import { ProjectsSettings } from './components/ProjectsSettings';
import { SkillsSettings } from './components/SkillsSettings';
import { ExperienceSettings } from './components/ExperienceSettings';
import { CertificationsSettings } from './components/CertificationsSettings';
import { AchievementsSettings } from './components/AchievementsSettings';
import { ContactSettings } from './components/ContactSettings';
import { CustomSectionsSettings } from './components/CustomSectionsSettings';
import { ThemeSettings } from './components/ThemeSettings';
import { ThemeStudio } from './components/ThemeStudio';
import { BackgroundBuilder } from './components/BackgroundBuilder';
import { TranslationsSettings } from './components/TranslationsSettings';
import { PreviewPanel } from './components/PreviewPanel';

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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [themeStudioSelectedTheme, setThemeStudioSelectedTheme] = useState('dark');
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef(null);
  const savedHashRef = useRef(null);

  // --- Undo / Redo History Stack ---
  // historyRef.current = { past: [], future: [] } each entry is a deep copy of formData
  const MAX_HISTORY = 50;
  const historyRef = useRef({ past: [], future: [] });
  const [historySize, setHistorySize] = useState({ past: 0, future: 0 });

  // Sync history size badge counts without causing full re-renders
  const syncHistorySize = useCallback(() => {
    setHistorySize({
      past: historyRef.current.past.length,
      future: historyRef.current.future.length
    });
  }, []);

  // Clear history (on data load / rollback / import)
  const clearHistory = useCallback(() => {
    historyRef.current = { past: [], future: [] };
    syncHistorySize();
  }, [syncHistorySize]);

  const showStatus = useCallback((type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
  }, []);

  // Generate hash from formData ignoring transient metadata (settings.backup, settings.lastSavedAt, etc.)
  const generateHash = useCallback((obj) => {
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
  }, []);

  const initializeFormData = useCallback((rawDoc) => {
    if (!rawDoc) return null;
    const copy = JSON.parse(JSON.stringify(rawDoc));
    if (!copy.brandIdentity) {
      copy.brandIdentity = {};
    }
    const defaultBrand = {
      brandName: { ar: "محمد عكاش", en: "Okash", ur: "محمد عکاش" },
      shortName: { ar: "عكاش", en: "Okash", ur: "عکاش" },
      subtitle: { ar: "مهندس سلامة وبنية تحتية IT", en: "HSE & IT Infrastructure Engineer", ur: "ایچ ایس ای اور آئی تي انفراسٹرکچر انجینئر" },
      logoText: { ar: "محمد عكاش", en: "Okash", ur: "محمد عکاش" },
      heroName: { ar: "محمد عكاش", en: "Okash", ur: "محمد عکاش" },
      footerText: { ar: "محمد عكاش", en: "Okash", ur: "Okash" },
      preloaderText: { ar: "عكاش", en: "OKASH", ur: "عکاش" },
      browserTitle: { ar: "محمد عكاش | معرض الأعمال", en: "Okash | Portfolio", ur: "محمد عکاش | پورٹ فولیو" },
      seoTitle: { ar: "محمد عكاش | معرض الأعمال الاحترافي", en: "Okash | Professional Portfolio", ur: "محمد عکاش | پورٹ فولیو" },
      seoDescription: { ar: "الموقع الشخصي لمحمد عكاش - مهندس بنية تحتية IT وأمن وسلامة مهنية HSE", en: "Personal portfolio of Okash - IT Infrastructure & HSE Safety Engineer", ur: "محمد عکاش کا ذاتی پورٹ فولیو - آئی تي انفراسٹرکچر اور ایچ ایس ای سيفتي انجینئر" }
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
      displayName: { ar: 'محمد عكاش', en: 'Okash', ur: 'محمد عکاش' },
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
    const storyDefaults = DEFAULT_PORTFOLIO_DATA.storySection;
    copy.storySection = {
      ...storyDefaults,
      ...(copy.storySection || {}),
      title: {
        ...storyDefaults.title,
        ...(copy.storySection?.title || {})
      },
      content: {
        ...storyDefaults.content,
        ...(copy.storySection?.content || {})
      }
    };
    if (!copy.websiteStructure) copy.websiteStructure = { sections: [] };
    if (!Array.isArray(copy.websiteStructure.sections)) copy.websiteStructure.sections = [];
    if (!copy.websiteStructure.sections.some((section) => section.id === 'story')) {
      const storySection = DEFAULT_PORTFOLIO_DATA.websiteStructure.sections.find((section) => section.id === 'story');
      const whyIndex = copy.websiteStructure.sections.findIndex((section) => section.id === 'why-me');
      copy.websiteStructure.sections.splice(whyIndex === -1 ? copy.websiteStructure.sections.length : whyIndex + 1, 0, storySection);
    }
    return copy;
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  // Sync form state on store load — also resets history
  useEffect(() => {
    if (data) {
      const initialized = initializeFormData(data);
      setFormData(initialized);
      if (initialized) {
        savedHashRef.current = generateHash(initialized);
        clearHistory();
      }
    }
  }, [data, initializeFormData, generateHash, clearHistory]);

  // Load portfolio from firestore on mount
  useEffect(() => {
    loadPortfolio(user);
  }, [loadPortfolio, user]);

  // isDirty flag — hash-based comparison to eliminate false positives after save
  const isDirty = useMemo(() => {
    return formData && savedHashRef.current !== null && generateHash(formData) !== savedHashRef.current;
  }, [formData, generateHash]);

  // Dev logging for dirty state (wrapped in DEV validation)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[SaveEngine] isDirty:', isDirty, '| Current Hash:', formData ? generateHash(formData) : 'null', '| Saved Hash:', savedHashRef.current);
    }
  }, [isDirty, formData, generateHash]);

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

  // Generic callback updater passed to children — pushes snapshot to history before mutation
  const updateField = useCallback((updater) => {
    setFormData(prev => {
      if (!prev) return null;
      // Push current state into undo stack before mutating
      historyRef.current.past.push(JSON.parse(JSON.stringify(prev)));
      if (historyRef.current.past.length > MAX_HISTORY) {
        historyRef.current.past.shift(); // Drop oldest
      }
      // Clear redo stack on new mutation
      historyRef.current.future = [];
      syncHistorySize();

      const copy = JSON.parse(JSON.stringify(prev));
      updater(copy);
      return copy;
    });
  }, [syncHistorySize]);

  // Undo — pops from past, pushes to future
  const handleUndo = useCallback(() => {
    if (historyRef.current.past.length === 0) return;
    setFormData(prev => {
      if (!prev) return null;
      historyRef.current.future.unshift(JSON.parse(JSON.stringify(prev)));
      const previous = historyRef.current.past.pop();
      syncHistorySize();
      return previous;
    });
    showStatus('info', t.cms?.undoSuccess || 'Undid last change.');
  }, [syncHistorySize, showStatus, t]);

  // Redo — pops from future, pushes to past
  const handleRedo = useCallback(() => {
    if (historyRef.current.future.length === 0) return;
    setFormData(prev => {
      if (!prev) return null;
      historyRef.current.past.push(JSON.parse(JSON.stringify(prev)));
      const next = historyRef.current.future.shift();
      syncHistorySize();
      return next;
    });
    showStatus('info', t.cms?.redoSuccess || 'Redid last change.');
  }, [syncHistorySize, showStatus, t]);

  // Safe navigation alert
  const handleTabChange = (newTab) => {
    if (isDirty) {
      if (!window.confirm(t.cms?.tabDirtyConfirm || 'You have unsaved changes in this tab. Switch tabs anyway?')) {
        return;
      }
    }
    setActiveTab(newTab);
    setIsMobileNavOpen(false);
  };

  // Firestore Save with Safety Snapshot
  const handleSave = useCallback(async () => {
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
  }, [formData, user, data, savePortfolio, generateHash, showStatus, t]);

  // Keyboard shortcut Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y / Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleSave]);

  // Safety Rollback — also clears history
  const handleRollback = () => {
    if (!data?.settings?.backup) {
      showStatus('error', t.cms?.noBackupCloud || 'No backup snapshot found in cloud database.');
      return;
    }
    const backupVer = data.settings.backup.settings?.version || 'N/A';
    const backupTime = new Date(data.settings.backup.settings?.lastSavedAt).toLocaleString();
    if (window.confirm((t.cms?.restoreConfirm || 'Are you sure you want to restore?').replace('{version}', backupVer).replace('{time}', backupTime))) {
      setFormData(JSON.parse(JSON.stringify(data.settings.backup)));
      clearHistory();
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

  // Import JSON — also clears history
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
        clearHistory();
        showStatus('success', t.cms?.importSuccess || 'JSON backup parsed successfully into editor. Press "Save Changes" to apply.');
      } catch (err) {
        showStatus('error', (t.cms?.importError || 'Failed to parse backup JSON file: {error}').replace('{error}', err.message));
      }
    };
    fileReader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  // Global Search Engine
  const searchResults = useMemo(() => {
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

    if (
      formData.storySection?.title?.en?.toLowerCase().includes(q) ||
      formData.storySection?.content?.en?.some((line) => line.toLowerCase().includes(q)) ||
      formData.storySection?.content?.ar?.some((line) => line.toLowerCase().includes(q))
    ) {
      results.push({ tab: 'story', id: 'story', name: `Story: ${formData.storySection.title?.en}`, desc: 'Flagship storytelling section' });
    }

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
  }, [searchQuery, formData]);

  const handleSearchResultClick = (result) => {
    setActiveTab(result.tab);
    setSearchQuery('');
    if (result.id) {
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

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'general': 
        return <GeneralSettings generalData={formData.general} t={t} updateField={updateField} />;
      case 'brandIdentity': 
        return <BrandIdentitySettings brandIdentityData={formData.brandIdentity} t={t} updateField={updateField} lang={lang} />;
      case 'themeStudio': 
        return <ThemeStudio themeProfilesData={formData.themeProfiles} t={t} updateField={updateField} showStatus={showStatus} selectedTheme={themeStudioSelectedTheme} setSelectedTheme={setThemeStudioSelectedTheme} />;
      case 'backgroundBuilder': 
        return <BackgroundBuilder themeProfilesData={formData.themeProfiles} themeStudioSelectedTheme={themeStudioSelectedTheme} t={t} updateField={updateField} />;
      case 'structure': 
        return <StructureSettings websiteStructure={formData.websiteStructure} t={t} updateField={updateField} lang={lang} />;
      case 'hero': 
        return <HeroSettings heroData={formData.hero} t={t} updateField={updateField} />;
      case 'about': 
        return <AboutSettings aboutData={formData.about} t={t} updateField={updateField} />;
      case 'story': 
        return <StorySettings storyData={formData.storySection} t={t} updateField={updateField} lang={lang} />;
      case 'projects': 
        return <ProjectsSettings projectsData={formData.projects} featuredProjects={formData.settings?.featuredProjects || []} t={t} updateField={updateField} lang={lang} />;
      case 'skills': 
        return <SkillsSettings skillsData={formData.skills} t={t} updateField={updateField} lang={lang} />;
      case 'experience': 
        return <ExperienceSettings experienceData={formData.experience} t={t} updateField={updateField} lang={lang} />;
      case 'certifications': 
        return <CertificationsSettings certificationsData={formData.certifications} t={t} updateField={updateField} lang={lang} />;
      case 'achievements': 
        return <AchievementsSettings achievementsData={formData.achievements} t={t} updateField={updateField} lang={lang} />;
      case 'contact': {
        // fallback initializer if contactMethods doesn't exist
        const methods = formData.contactMethods || [
          { id: "method-1", type: "email", label: "Email", value: formData.contact?.email || '', visible: true },
          { id: "method-2", type: "whatsapp", label: "WhatsApp", value: formData.contact?.whatsapp || '', visible: true },
          { id: "method-3", type: "linkedin", label: "LinkedIn", value: formData.contact?.linkedin || '', visible: true },
          { id: "method-4", type: "github", label: "GitHub", value: formData.contact?.github || '', visible: true }
        ];
        return <ContactSettings contactMethods={methods} t={t} updateField={updateField} lang={lang} />;
      }
      case 'customSections': 
        return <CustomSectionsSettings customSectionsData={formData.customSections} t={t} updateField={updateField} lang={lang} />;
      case 'translations': 
        return <TranslationsSettings translationsData={formData.translations} t={t} updateField={updateField} />;
      case 'theme': 
        return <ThemeSettings themeSettingsData={formData.themeSettings} t={t} updateField={updateField} setTheme={setTheme} />;
      case 'branding': 
        return <BrandingSettings mediaBranding={formData.mediaBranding || {}} t={t} updateField={updateField} />;
      default: 
        return <GeneralSettings generalData={formData.general} t={t} updateField={updateField} />;
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

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans">
      
      {/* CMS Header Bar */}
      <header className="fixed top-0 inset-x-0 h-16 bg-[var(--card-bg)] border-b border-[var(--border-color)] backdrop-blur-md flex items-center gap-2 px-2 sm:px-4 lg:px-6 z-50">
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
              const val = e.target.value;
              updateField((draft) => {
                draft.themeSettings.defaultTheme = val;
              });
              setTheme(val);
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

        {/* Action controls (Export/Import, Undo/Redo, LogOut) */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">

          {/* Undo / Redo cluster */}
          <div className="flex items-center gap-0.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] px-0.5 py-0.5">
            <button
              onClick={handleUndo}
              disabled={historySize.past === 0}
              title={`Undo (Ctrl+Z) — ${historySize.past} step${historySize.past !== 1 ? 's' : ''}`}
              aria-label="Undo"
              className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all relative"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {historySize.past > 0 && (
                <span className="absolute -top-1 -right-1 text-[8px] font-black bg-[var(--primary)] text-[var(--bg-primary)] rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                  {historySize.past > 9 ? '9+' : historySize.past}
                </span>
              )}
            </button>
            <button
              onClick={handleRedo}
              disabled={historySize.future === 0}
              title={`Redo (Ctrl+Y) — ${historySize.future} step${historySize.future !== 1 ? 's' : ''}`}
              aria-label="Redo"
              className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

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
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] text-[var(--status-amber)] hover:bg-[var(--status-amber-bg)] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
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
            className="p-2 rounded-lg border border-[var(--status-red-border)] text-[var(--status-red)] hover:bg-[var(--status-red-bg)] transition-colors cursor-pointer"
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
            className="fixed inset-0 top-16 bg-[var(--card-bg)] backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label={t.cms?.ariaCloseModal || 'Close'}
          />
        )}
        
        {/* Navigation Sidebar */}
        <aside className={`fixed lg:static top-16 bottom-0 start-0 z-40 w-[min(19rem,88vw)] lg:w-64 bg-[var(--bg-secondary)] lg:bg-[var(--card-bg)] border-e border-[var(--border-color)] h-[calc(100vh-64px)] overflow-y-auto shrink-0 flex flex-col p-4 gap-1 transition-transform duration-300 ease-out will-change-transform ${isMobileNavOpen ? 'translate-x-0' : isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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
            <span>{t.cms?.tabGeneral || 'General Info'}</span>
          </button>
          <button 
            onClick={() => handleTabChange('brandIdentity')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'brandIdentity' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <span>{t.cms?.sidebarBrandIdentity || 'Brand Identity'}</span>
          </button>
          <button 
            onClick={() => handleTabChange('structure')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'structure' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <span>{t.cms?.tabStructure || 'Structure'}</span>
          </button>
          <button 
            onClick={() => handleTabChange('branding')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'branding' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <span>{t.cms?.sidebarBranding || 'Media & Favicon'}</span>
          </button>
          
          <div className="px-3 py-2 text-[9px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mt-4 hidden md:block">{t.cms?.sidebarHeaderComponents || 'Components'}</div>
          
          {[
            ['hero', t.cms?.sidebarHero || 'Hero Section'],
            ['about', t.cms?.sidebarAbout || 'About Me'],
            ['story', t.cms?.sidebarStorySection || 'Story Section'],
            ['projects', t.cms?.sidebarProjects || 'Projects'],
            ['skills', t.cms?.sidebarSkills || 'Toolbox & Skills'],
            ['experience', t.cms?.sidebarExperience || 'Work Experience'],
            ['certifications', t.cms?.sidebarCertifications || 'Licenses & Certs'],
            ['achievements', t.cms?.sidebarAchievements || 'Stats & Counters'],
            ['contact', t.cms?.sidebarContact || 'Contact Details'],
            ['customSections', t.cms?.sidebarCustomSections || 'Custom Sections']
          ].map(([tabKey, label]) => (
            <button 
              key={tabKey}
              onClick={() => handleTabChange(tabKey)}
              className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === tabKey ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <span>{label}</span>
            </button>
          ))}

          <div className="px-3 py-2 text-[9px] uppercase font-bold text-[var(--text-secondary)] tracking-widest mt-4 hidden md:block">{t.cms?.sidebarHeaderThemeLang || 'Theme & Language'}</div>
          
          <button 
            onClick={() => handleTabChange('theme')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'theme' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <span>{t.cms?.sidebarThemeSettings || 'Visual Theme Builder'}</span>
          </button>
          <button 
            onClick={() => handleTabChange('themeStudio')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'themeStudio' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <span>{t.cms?.sidebarThemeStudio || 'Theme CSS Studio'}</span>
          </button>
          <button 
            onClick={() => handleTabChange('backgroundBuilder')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'backgroundBuilder' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <span>{t.cms?.sidebarBackgroundBuilder || 'Background FX'}</span>
          </button>
          <button 
            onClick={() => handleTabChange('translations')}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'translations' ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-l-2 border-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <span>{t.cms?.sidebarTranslations || 'Dictionary Editor'}</span>
          </button>
        </aside>

        {/* Form Editor Body Area */}
        <main className="flex-1 h-full overflow-y-auto bg-[var(--bg-primary)] p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
          
          {/* Status message banners */}
          {statusMsg.text && (
            <div className={`p-4 rounded-xl border text-sm font-bold animate-fade-in flex items-start gap-3 ${
              statusMsg.type === 'success'
                ? 'bg-[var(--status-green-bg)] border-[var(--status-green-border)] text-[var(--status-green)]'
                : statusMsg.type === 'info'
                ? 'bg-[var(--primary)]/10 border-[var(--primary)]/20 text-[var(--primary)]'
                : 'bg-[var(--status-red-bg)] border-[var(--status-red-border)] text-[var(--status-red)]'
            }`}>
              {statusMsg.text}
            </div>
          )}

          {isDirty && (
            <div className="p-4 rounded-xl border bg-[var(--status-orange-bg)] border-[var(--status-orange-border)] text-[var(--status-orange)] text-xs font-bold flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg">
              <div>
                <h5 className="font-extrabold text-sm mb-0.5">{t.cms?.unsavedTitle || 'Unsaved Changes'}</h5>
                <p className="opacity-80 font-normal">{t.cms?.unsavedSubtitle || 'You have modifications that are not synchronized with the database.'}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {historySize.past > 0 && (
                  <button
                    onClick={handleUndo}
                    title={`Undo (Ctrl+Z) — ${historySize.past} step${historySize.past !== 1 ? 's' : ''}`}
                    className="px-3 py-2 border border-[var(--status-orange-border)] text-[var(--status-orange)] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-[var(--status-orange-border)]/20 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{historySize.past}</span>
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--surface-hover)] border border-[var(--primary)]/30 text-[var(--accent-text)] font-extrabold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Loader2 className={`w-4 h-4 ${isSaving ? 'animate-spin' : 'hidden'}`} />
                  <span>{t.cms?.saveChanges || 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Render Active Component Form */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 shadow-xl">
            {renderActiveForm()}
          </div>
        </main>

        {/* Live Real-time Sticky Preview Pane */}
        {previewMode && (
          <aside className="w-96 border-s border-[var(--border-color)] bg-[var(--bg-secondary)] h-full overflow-y-auto p-6 hidden lg:block shrink-0">
            <PreviewPanel 
              formData={formData} 
              activeTab={activeTab} 
              themeStudioSelectedTheme={themeStudioSelectedTheme} 
              lang={lang} 
              t={t} 
            />
          </aside>
        )}
      </div>

    </div>
  );
}
