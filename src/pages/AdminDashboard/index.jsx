import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { validatePortfolioData } from '../../utils/validators';
import { 
  User, Star, Award, Briefcase, Plus, Trash2, Save, 
  Loader2, Languages, Mail, Settings, ShieldAlert, Cpu, 
  HardHat, Monitor, LogOut, ArrowLeft, CheckCircle2 
} from 'lucide-react';

// --- 100% FREE TRANSLATION ENGINE (NO API KEY REQUIRED) ---
const freeTranslate = async (text, targetLang) => {
  if (!text) return "";
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(item => item[0]).join('');
  } catch (e) {
    console.error("Translation Error:", e);
    return text; 
  }
};

const deepTranslate = async (data) => {
  if (Array.isArray(data)) {
    const arr = [];
    for (const item of data) {
      arr.push(await deepTranslate(item));
    }
    return arr;
  } else if (typeof data === 'object' && data !== null) {
    if (data.ar !== undefined && data.en !== undefined && data.ur !== undefined) {
       const newObj = { ...data };
       if (data.ar) {
         newObj.en = await freeTranslate(data.ar, 'en');
         newObj.ur = await freeTranslate(data.ar, 'ur');
         await new Promise(r => setTimeout(r, 300)); // Rate limit buffer
       }
       return newObj;
    } else {
       const newObj = {};
       for (const key in data) {
         newObj[key] = await deepTranslate(data[key]);
       }
       return newObj;
    }
  }
  return data;
};

// Form Input UI Helpers
const AdminInput = ({ label, value, onChange, type="text", textarea=false, dir="auto" }) => (
  <div className="mb-4 w-full">
    {label && <label className="block text-xs font-bold uppercase mb-2 opacity-75">{label}</label>}
    {textarea ? (
      <textarea rows="4" dir={dir} value={value} onChange={onChange} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
    ) : (
      <input type={type} dir={dir} value={value} onChange={onChange} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-[var(--primary)] transition-colors text-sm" />
    )}
  </div>
);

const AdminMultiLangInput = ({ label, valueObj = { ar: '', en: '', ur: '' }, onChangeKey, textarea=false }) => {
  return (
    <div className="mb-6 p-5 rounded-2xl border border-white/10 bg-white/[0.01] relative shadow-lg">
       <label className="block text-sm font-extrabold text-[var(--primary)] mb-4">{label}</label>
       <div className="space-y-4">
          <div className="relative">
            <span className="absolute top-2 right-4 text-[10px] font-bold text-[var(--primary)] bg-black/80 px-2 py-0.5 rounded border border-white/10 z-10">العربية (الأساس)</span>
            <AdminInput type="text" value={valueObj.ar || ""} onChange={(e)=>onChangeKey('ar', e.target.value)} textarea={textarea} dir="rtl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
             <div className="relative">
                <span className="absolute top-2 left-4 text-[10px] font-bold text-white/50 bg-black/80 px-2 py-0.5 rounded border border-white/10 z-10">English</span>
                <AdminInput type="text" value={valueObj.en || ""} onChange={(e)=>onChangeKey('en', e.target.value)} textarea={textarea} dir="ltr" />
             </div>
             <div className="relative">
                <span className="absolute top-2 right-4 text-[10px] font-bold text-white/50 bg-black/80 px-2 py-0.5 rounded border border-white/10 z-10">اردو</span>
                <AdminInput type="text" value={valueObj.ur || ""} onChange={(e)=>onChangeKey('ur', e.target.value)} textarea={textarea} dir="rtl" />
             </div>
          </div>
       </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { data, loadPortfolio, savePortfolio } = usePortfolioStore();
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;

  // Local state for full CMS form
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Sync form state on store load
  useEffect(() => {
    if (data) {
      setFormData(JSON.parse(JSON.stringify(data)));
    }
  }, [data]);

  // Load portfolio from firestore on mount
  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  const handleTranslateSection = async () => {
    if (!formData) return;
    setIsTranslating(true);
    try {
      const updated = { ...formData };
      if (activeTab === 'general') {
        updated.hero.title1 = await deepTranslate(updated.hero.title1);
        updated.hero.title2 = await deepTranslate(updated.hero.title2);
        updated.hero.tagline = await deepTranslate(updated.hero.tagline);
        showStatus('success', 'تمت ترجمة نصوص المقدمة بنجاح!');
      } else if (activeTab === 'about') {
        updated.about = await deepTranslate(updated.about);
        showStatus('success', 'تمت ترجمة نصوص عني بنجاح!');
      } else if (['skills', 'certifications', 'experience', 'projects'].includes(activeTab)) {
        updated[activeTab] = await deepTranslate(updated[activeTab]);
        showStatus('success', `تمت ترجمة قسم [${activeTab}] بالكامل!`);
      }
      setFormData(updated);
    } catch (err) {
      showStatus('error', `خطأ في الترجمة: ${err.message}`);
    }
    setIsTranslating(false);
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      // Validate schema
      validatePortfolioData(formData);
      // Save to Firestore
      await savePortfolio(formData);
      showStatus('success', t.savedSuccess || 'Saved successfully!');
    } catch (err) {
      showStatus('error', `خطأ في الحفظ: ${err.message}`);
    }
    setIsSaving(false);
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
        <p className="text-sm font-medium opacity-60">Loading Dashboard Data...</p>
      </div>
    );
  }

  // --- RENDER TAB FORMS ---

  const renderGeneralForm = () => (
    <div className="space-y-6">
      <AdminMultiLangInput label="العنوان الأول (Hero Title Part 1)" valueObj={formData.hero.title1} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.hero.title1[key] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label="العنوان الثاني (Hero Title Part 2)" valueObj={formData.hero.title2} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.hero.title2[key] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label="السطر الوصفي (Hero Tagline)" textarea valueObj={formData.hero.tagline} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.hero.tagline[key] = val;
        setFormData(updated);
      }} />

      <div className="p-6 border border-white/10 rounded-2xl bg-white/[0.01] space-y-4">
        <h4 className="font-extrabold text-sm text-[var(--primary)] uppercase mb-2">إحصائيات المقدمة (Hero Counters)</h4>
        <div className="grid grid-cols-3 gap-4">
          <AdminInput label="سنوات الخبرة" type="number" value={formData.hero.statistics.experienceYears} onChange={(e) => {
            const updated = { ...formData };
            updated.hero.statistics.experienceYears = Number(e.target.value);
            setFormData(updated);
          }} />
          <AdminInput label="المشاريع المطورة" type="number" value={formData.hero.statistics.projectsBuilt} onChange={(e) => {
            const updated = { ...formData };
            updated.hero.statistics.projectsBuilt = Number(e.target.value);
            setFormData(updated);
          }} />
          <AdminInput label="الشهادات المكتسبة" type="number" value={formData.hero.statistics.certificationsCount} onChange={(e) => {
            const updated = { ...formData };
            updated.hero.statistics.certificationsCount = Number(e.target.value);
            setFormData(updated);
          }} />
        </div>
      </div>
    </div>
  );

  const renderAboutForm = () => (
    <div className="space-y-6">
      <AdminMultiLangInput label="العنوان الرئيسي (About Title)" valueObj={formData.about.title} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.about.title[key] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label="العنوان الفرعي (About Subtitle)" valueObj={formData.about.subtitle} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.about.subtitle[key] = val;
        setFormData(updated);
      }} />
      <AdminMultiLangInput label="قصة المسيرة المهنية (Biography Text)" textarea valueObj={formData.about.text} onChangeKey={(key, val) => {
        const updated = { ...formData };
        updated.about.text[key] = val;
        setFormData(updated);
      }} />
    </div>
  );

  const renderSkillsForm = () => (
    <div className="space-y-8">
      {formData.skills.map((group, idx) => (
        <div key={group.id} className="p-6 bg-white/[0.01] rounded-2xl border border-white/10 relative shadow">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-sm uppercase text-[var(--primary)]">تصنيف مهارات {idx + 1}</h4>
            <button onClick={() => {
              const updated = { ...formData };
              updated.skills = updated.skills.filter(g => g.id !== group.id);
              setFormData(updated);
            }} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/25 transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <AdminMultiLangInput label="اسم التصنيف" valueObj={group.category} onChangeKey={(key, val) => {
              const updated = { ...formData };
              updated.skills[idx].category[key] = val;
              setFormData(updated);
            }} />
            <AdminInput label="نوع الأيقونة (shield, server, monitor)" value={group.iconType} onChange={(e) => {
              const updated = { ...formData };
              updated.skills[idx].iconType = e.target.value;
              setFormData(updated);
            }} />
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <h5 className="font-bold text-xs opacity-75">المهارات داخل هذا التصنيف:</h5>
            {group.items.map((item, itemIdx) => (
              <div key={itemIdx} className="flex items-center gap-4 relative">
                <div className="flex-1">
                  <AdminMultiLangInput label={`مهارة ${itemIdx + 1}`} valueObj={item} onChangeKey={(key, val) => {
                    const updated = { ...formData };
                    updated.skills[idx].items[itemIdx][key] = val;
                    setFormData(updated);
                  }} />
                </div>
                <button onClick={() => {
                  const updated = { ...formData };
                  updated.skills[idx].items = updated.skills[idx].items.filter((_, i) => i !== itemIdx);
                  setFormData(updated);
                }} className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/25 rounded-xl hover:bg-red-500/20 cursor-pointer self-center">
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
            <button onClick={() => {
              const updated = { ...formData };
              updated.skills[idx].items.push({ ar: '', en: '', ur: '' });
              setFormData(updated);
            }} className="py-2.5 w-full bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 transition-all border border-white/10 cursor-pointer">
              <Plus className="w-4 h-4" /> إضافة مهارة جديدة
            </button>
          </div>
        </div>
      ))}

      <button onClick={() => {
        const updated = { ...formData };
        updated.skills.push({ id: Date.now().toString(), category: { ar: '', en: '', ur: '' }, iconType: 'shield', items: [] });
        setFormData(updated);
      }} className="py-4 w-full bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all border border-[var(--primary)]/20 cursor-pointer">
        <Plus className="w-5 h-5" /> إضافة تصنيف مهارات جديد
      </button>
    </div>
  );

  const renderProjectsForm = () => (
    <div className="space-y-8">
      {formData.projects.map((proj, idx) => (
        <div key={proj.id} className="p-6 bg-white/[0.01] rounded-2xl border border-white/10 relative shadow">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-sm uppercase text-[var(--primary)]">مشروع: {proj.title || 'جديد'}</h4>
            <button onClick={() => {
              const updated = { ...formData };
              updated.projects = updated.projects.filter(p => p.id !== proj.id);
              setFormData(updated);
            }} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/25 transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <AdminInput label="معرف المشروع الفريد (Unique Slug ID)" value={proj.id} onChange={(e) => {
              const updated = { ...formData };
              updated.projects[idx].id = e.target.value;
              setFormData(updated);
            }} />
            <AdminInput label="عنوان المشروع (Title)" value={proj.title} onChange={(e) => {
              const updated = { ...formData };
              updated.projects[idx].title = e.target.value;
              setFormData(updated);
            }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <AdminInput label="رابط العرض (Demo Link)" value={proj.demoLink || ''} onChange={(e) => {
              const updated = { ...formData };
              updated.projects[idx].demoLink = e.target.value;
              setFormData(updated);
            }} />
            <AdminInput label="كود سورس (GitHub Link)" value={proj.githubLink || ''} onChange={(e) => {
              const updated = { ...formData };
              updated.projects[idx].githubLink = e.target.value;
              setFormData(updated);
            }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <AdminInput label="أيقونة الموديل (shield, hardhat, code)" value={proj.iconType || 'shield'} onChange={(e) => {
              const updated = { ...formData };
              updated.projects[idx].iconType = e.target.value;
              setFormData(updated);
            }} />
            <AdminMultiLangInput label="التصنيف (Category)" valueObj={proj.category} onChangeKey={(key, val) => {
              const updated = { ...formData };
              updated.projects[idx].category[key] = val;
              setFormData(updated);
            }} />
          </div>

          <AdminMultiLangInput label="نظرة عامة / الوصف (Description)" textarea valueObj={proj.description} onChangeKey={(key, val) => {
            const updated = { ...formData };
            updated.projects[idx].description[key] = val;
            setFormData(updated);
          }} />

          <AdminMultiLangInput label="المشكلة / التحديات (Challenges)" textarea valueObj={proj.challenges} onChangeKey={(key, val) => {
            const updated = { ...formData };
            updated.projects[idx].challenges[key] = val;
            setFormData(updated);
          }} />

          <AdminMultiLangInput label="الحل / هيكلية النظام (Architecture)" textarea valueObj={proj.architecture} onChangeKey={(key, val) => {
            const updated = { ...formData };
            updated.projects[idx].architecture[key] = val;
            setFormData(updated);
          }} />

          {proj.businessValue && (
            <AdminMultiLangInput label="الأثر المالي والتشغيلي (Business Value)" textarea valueObj={proj.businessValue} onChangeKey={(key, val) => {
              const updated = { ...formData };
              updated.projects[idx].businessValue[key] = val;
              setFormData(updated);
            }} />
          )}

          {/* Dynamic list of features */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h5 className="font-bold text-xs opacity-75">الميزات الرئيسية (Key Features):</h5>
            {proj.features.map((feat, fIdx) => (
              <div key={fIdx} className="flex gap-4">
                <div className="flex-1">
                  <AdminMultiLangInput label={`ميزة ${fIdx + 1}`} valueObj={feat} onChangeKey={(key, val) => {
                    const updated = { ...formData };
                    updated.projects[idx].features[fIdx][key] = val;
                    setFormData(updated);
                  }} />
                </div>
                <button onClick={() => {
                  const updated = { ...formData };
                  updated.projects[idx].features = updated.projects[idx].features.filter((_, i) => i !== fIdx);
                  setFormData(updated);
                }} className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/25 rounded-xl hover:bg-red-500/20 cursor-pointer self-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => {
              const updated = { ...formData };
              updated.projects[idx].features.push({ ar: '', en: '' });
              setFormData(updated);
            }} className="py-2.5 w-full bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 transition-all border border-white/10 cursor-pointer">
              <Plus className="w-4 h-4" /> إضافة ميزة رئيسية
            </button>
          </div>

          {/* Dynamic list of technologies */}
          <div className="border-t border-white/10 pt-6 space-y-4 mt-6">
            <h5 className="font-bold text-xs opacity-75">التقنيات المستخدمة (Tech Stack):</h5>
            {proj.tech.map((tItem, tIdx) => (
              <div key={tIdx} className="flex gap-4">
                <div className="flex-1">
                  <AdminMultiLangInput label={`تقنية ${tIdx + 1}`} valueObj={typeof tItem === 'string' ? { ar: tItem, en: tItem, ur: tItem } : tItem} onChangeKey={(key, val) => {
                    const updated = { ...formData };
                    if (typeof updated.projects[idx].tech[tIdx] === 'string') {
                      const prevVal = updated.projects[idx].tech[tIdx];
                      updated.projects[idx].tech[tIdx] = { ar: prevVal, en: prevVal, ur: prevVal };
                    }
                    updated.projects[idx].tech[tIdx][key] = val;
                    setFormData(updated);
                  }} />
                </div>
                <button onClick={() => {
                  const updated = { ...formData };
                  updated.projects[idx].tech = updated.projects[idx].tech.filter((_, i) => i !== tIdx);
                  setFormData(updated);
                }} className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/25 rounded-xl hover:bg-red-500/20 cursor-pointer self-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => {
              const updated = { ...formData };
              updated.projects[idx].tech.push({ ar: '', en: '', ur: '' });
              setFormData(updated);
            }} className="py-2.5 w-full bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 transition-all border border-white/10 cursor-pointer">
              <Plus className="w-4 h-4" /> إضافة تقنية
            </button>
          </div>
        </div>
      ))}

      <button onClick={() => {
        const updated = { ...formData };
        updated.projects.push({
          id: Date.now().toString(),
          title: 'New Product',
          category: { ar: '', en: '', ur: '' },
          description: { ar: '', en: '', ur: '' },
          challenges: { ar: '', en: '', ur: '' },
          architecture: { ar: '', en: '', ur: '' },
          businessValue: { ar: '', en: '', ur: '' },
          features: [],
          tech: [],
          iconType: 'shield',
          demoLink: '',
          githubLink: ''
        });
        setFormData(updated);
      }} className="py-4 w-full bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all border border-[var(--primary)]/20 cursor-pointer">
        <Plus className="w-5 h-5" /> إضافة مشروع جديد
      </button>
    </div>
  );

  const renderExperienceForm = () => (
    <div className="space-y-8">
      {formData.experience.map((exp, idx) => (
        <div key={exp.id} className="p-6 bg-white/[0.01] rounded-2xl border border-white/10 relative shadow">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-sm uppercase text-[var(--primary)]">خبرة {idx + 1}</h4>
            <button onClick={() => {
              const updated = { ...formData };
              updated.experience = updated.experience.filter(e => e.id !== exp.id);
              setFormData(updated);
            }} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/25 transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <AdminMultiLangInput label="المسمى الوظيفي (Role)" valueObj={exp.role} onChangeKey={(key, val) => {
            const updated = { ...formData };
            updated.experience[idx].role[key] = val;
            setFormData(updated);
          }} />
          <AdminMultiLangInput label="جهة العمل / الشركة (Company)" valueObj={exp.company} onChangeKey={(key, val) => {
            const updated = { ...formData };
            updated.experience[idx].company[key] = val;
            setFormData(updated);
          }} />
          <AdminMultiLangInput label="فترة العمل (Period)" valueObj={exp.period} onChangeKey={(key, val) => {
            const updated = { ...formData };
            updated.experience[idx].period[key] = val;
            setFormData(updated);
          }} />
          <AdminMultiLangInput label="الوصف التفصيلي (Description)" textarea valueObj={exp.description} onChangeKey={(key, val) => {
            const updated = { ...formData };
            updated.experience[idx].description[key] = val;
            setFormData(updated);
          }} />
        </div>
      ))}

      <button onClick={() => {
        const updated = { ...formData };
        updated.experience.push({
          id: Date.now().toString(),
          role: { ar: '', en: '', ur: '' },
          company: { ar: '', en: '', ur: '' },
          period: { ar: '', en: '', ur: '' },
          description: { ar: '', en: '', ur: '' }
        });
        setFormData(updated);
      }} className="py-4 w-full bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all border border-[var(--primary)]/20 cursor-pointer">
        <Plus className="w-5 h-5" /> إضافة خبرة عمل جديدة
      </button>
    </div>
  );

  const renderCertificationsForm = () => (
    <div className="space-y-8">
      {formData.certifications.map((cert, idx) => (
        <div key={cert.id} className="p-6 bg-white/[0.01] rounded-2xl border border-white/10 relative shadow">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-sm uppercase text-[var(--primary)]">شهادة {idx + 1}</h4>
            <button onClick={() => {
              const updated = { ...formData };
              updated.certifications = updated.certifications.filter(c => c.id !== cert.id);
              setFormData(updated);
            }} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/25 transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <AdminInput label="المعرف الفريد للشهادة (Unique ID)" value={cert.id} onChange={(e) => {
              const updated = { ...formData };
              updated.certifications[idx].id = e.target.value;
              setFormData(updated);
            }} />
          </div>

          <AdminMultiLangInput label="اسم الشهادة" valueObj={cert} onChangeKey={(key, val) => {
            const updated = { ...formData };
            updated.certifications[idx][key] = val;
            setFormData(updated);
          }} />
        </div>
      ))}

      <button onClick={() => {
        const updated = { ...formData };
        updated.certifications.push({
          id: Date.now().toString(),
          ar: 'شهادة جديدة',
          en: 'New Certificate',
          ur: 'نئی سند'
        });
        setFormData(updated);
      }} className="py-4 w-full bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all border border-[var(--primary)]/20 cursor-pointer">
        <Plus className="w-5 h-5" /> إضافة شهادة جديدة
      </button>
    </div>
  );

  const renderContactForm = () => (
    <div className="p-6 bg-white/[0.01] rounded-2xl border border-white/10 space-y-6">
      <AdminInput label="البريد الإلكتروني (Email Address)" value={formData.contact.email} onChange={(e) => {
        const updated = { ...formData };
        updated.contact.email = e.target.value;
        setFormData(updated);
      }} />

      <AdminInput label="حساب GitHub (GitHub Profile URL)" value={formData.contact.github} onChange={(e) => {
        const updated = { ...formData };
        updated.contact.github = e.target.value;
        setFormData(updated);
      }} />

      <AdminInput label="رقم WhatsApp (أرقام فقط مع رمز الدولة)" value={formData.contact.whatsapp} onChange={(e) => {
        const updated = { ...formData };
        updated.contact.whatsapp = e.target.value;
        setFormData(updated);
      }} />
    </div>
  );

  const renderSettingsForm = () => (
    <div className="p-6 bg-white/[0.01] rounded-2xl border border-white/10 space-y-6">
      {/* Maintenance Mode Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
        <div>
          <h5 className="font-bold text-sm text-white mb-1">وضع الصيانة (Maintenance Mode)</h5>
          <p className="text-xs opacity-55">تفعيل وضع الصيانة لغلق تصفح الموقع</p>
        </div>
        <input 
          type="checkbox" 
          checked={formData.settings.maintenanceMode} 
          onChange={(e) => {
            const updated = { ...formData };
            updated.settings.maintenanceMode = e.target.checked;
            setFormData(updated);
          }}
          className="w-5 h-5 cursor-pointer accent-[var(--primary)]"
        />
      </div>

      {/* Featured Projects selection */}
      <div className="space-y-4">
        <h5 className="font-bold text-sm text-white">المشاريع المميزة في الصفحة الرئيسية (Featured Products)</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.projects.map((proj) => {
            const isFeatured = formData.settings.featuredProjects.includes(proj.id);
            return (
              <div key={proj.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-xs font-bold text-white">{proj.title}</span>
                <input 
                  type="checkbox" 
                  checked={isFeatured}
                  onChange={(e) => {
                    const updated = { ...formData };
                    if (e.target.checked) {
                      if (!updated.settings.featuredProjects.includes(proj.id)) {
                        updated.settings.featuredProjects.push(proj.id);
                      }
                    } else {
                      updated.settings.featuredProjects = updated.settings.featuredProjects.filter(id => id !== proj.id);
                    }
                    setFormData(updated);
                  }}
                  className="w-4 h-4 cursor-pointer accent-[var(--primary)]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'general': return renderGeneralForm();
      case 'about': return renderAboutForm();
      case 'skills': return renderSkillsForm();
      case 'projects': return renderProjectsForm();
      case 'experience': return renderExperienceForm();
      case 'certifications': return renderCertificationsForm();
      case 'contact': return renderContactForm();
      case 'settings': return renderSettingsForm();
      default: return renderGeneralForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col transition-theme">
      {/* Top Bar Navigation */}
      <header className="fixed top-0 inset-x-0 h-20 bg-black/60 border-b border-white/10 backdrop-blur-md flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'ar' ? 'الرجوع للموقع' : 'View Site'}
          </button>
          <h1 className="text-lg md:text-xl font-black text-[var(--primary)] uppercase tracking-wide hidden sm:block">
            {t.dashboardTitle}
          </h1>
        </div>

        {/* Global Save and Translate CTA triggers */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleTranslateSection} 
            disabled={isTranslating} 
            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isTranslating 
                ? 'bg-zinc-700/50 text-zinc-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md cursor-pointer'
            }`}
          >
            {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
            {isTranslating ? 'جاري الترجمة...' : 'ترجمة كامل القسم'}
          </button>

          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isSaving 
                ? 'bg-zinc-700/50 text-zinc-400 cursor-not-allowed' 
                : 'bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 shadow-md cursor-pointer'
            }`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>

          <button 
            onClick={async () => {
              await logout();
              navigate('/admin/login', { replace: true });
            }}
            className="p-3 rounded-xl border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 pt-24 flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Left Sidebar navigation tab triggers */}
        <aside className="w-full md:w-72 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 md:h-[calc(100vh-80px)] overflow-y-auto shrink-0 flex md:flex-col p-4 md:p-6 gap-2 flex-wrap md:flex-nowrap">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-right cursor-pointer ${activeTab === 'general' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' : 'hover:bg-white/5 opacity-70'}`}
          >
            <User className="w-4 h-4 shrink-0" />
            بيانات المقدمة (Hero)
          </button>
          
          <button 
            onClick={() => setActiveTab('about')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-right cursor-pointer ${activeTab === 'about' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' : 'hover:bg-white/5 opacity-70'}`}
          >
            <Star className="w-4 h-4 shrink-0" />
            قصتي (About/Biography)
          </button>

          <button 
            onClick={() => setActiveTab('skills')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-right cursor-pointer ${activeTab === 'skills' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' : 'hover:bg-white/5 opacity-70'}`}
          >
            <Monitor className="w-4 h-4 shrink-0" />
            المهارات (Toolbox/Skills)
          </button>

          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-right cursor-pointer ${activeTab === 'projects' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' : 'hover:bg-white/5 opacity-70'}`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            المشاريع (Products/Projects)
          </button>

          <button 
            onClick={() => setActiveTab('experience')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-right cursor-pointer ${activeTab === 'experience' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' : 'hover:bg-white/5 opacity-70'}`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            الخبرة (Experience Timeline)
          </button>

          <button 
            onClick={() => setActiveTab('certifications')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-right cursor-pointer ${activeTab === 'certifications' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' : 'hover:bg-white/5 opacity-70'}`}
          >
            <Award className="w-4 h-4 shrink-0" />
            الشهادات (Certifications)
          </button>

          <button 
            onClick={() => setActiveTab('contact')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-right cursor-pointer ${activeTab === 'contact' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' : 'hover:bg-white/5 opacity-70'}`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            اتصال (Contact Details)
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-right cursor-pointer ${activeTab === 'settings' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' : 'hover:bg-white/5 opacity-70'}`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            الإعدادات العامة (Settings)
          </button>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-80px)] bg-[#0a0a0c]/60">
          {/* Real-time status toast */}
          {statusMsg.text && (
            <div className={`p-4 rounded-xl mb-6 border font-bold text-xs transition-all flex items-center gap-2 ${
              statusMsg.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              {statusMsg.text}
            </div>
          )}

          <div className="max-w-4xl mx-auto pb-12">
            {renderActiveForm()}
          </div>
        </main>
      </div>
    </div>
  );
}
