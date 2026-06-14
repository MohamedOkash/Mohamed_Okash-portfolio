import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { Compass, Home } from 'lucide-react';
import { SpotlightCard } from '../../components/ui/SpotlightCard';

export default function NotFound() {
  const navigate = useNavigate();
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-6 relative overflow-hidden transition-theme">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-15 mix-blend-screen bg-pink-500/20 pointer-events-none" />

      <div className="w-full max-w-md text-center">
        <SpotlightCard className="shadow-2xl border-[var(--border-color)] p-8 md:p-10 relative">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border-color)] text-pink-500 mb-4 animate-bounce">
              <Compass className="w-10 h-10" />
            </div>
            <h1 className="text-6xl font-black text-[var(--text-primary)] tracking-tight mb-2">404</h1>
            <h2 className="text-xl font-bold tracking-tight">
              {lang === 'ar' ? 'الصفحة غير موجودة' : lang === 'ur' ? 'صفحہ نہیں ملا' : 'Page Not Found'}
            </h2>
            <p className="text-xs opacity-50 mt-2 font-light leading-relaxed">
              {lang === 'ar' 
                ? 'عذراً، الصفحة التي تحاول الوصول إليها قد تم نقلها أو حذفها.' 
                : 'The page you are looking for does not exist or has been moved.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-xl font-bold text-sm bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Home className="w-4.5 h-4.5" />
            {t.backToHome}
          </button>
        </SpotlightCard>
      </div>
    </div>
  );
}
