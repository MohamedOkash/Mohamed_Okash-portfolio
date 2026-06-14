import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { SpotlightCard } from '../../components/ui/SpotlightCard';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { lang } = useLanguageStore();
  const { user, loading, error, login, clearError } = useAuthStore();
  const t = translations[lang] || translations.ar;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // If already logged in, redirect immediately to dashboard
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Clean error state on mount/unmount
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Map Firebase errors to human readable messages in selected language
  useEffect(() => {
    if (error) {
      if (error.includes('auth/invalid-credential') || error.includes('auth/wrong-password') || error.includes('auth/user-not-found')) {
        setAuthError(t.invalidCreds);
      } else {
        setAuthError(error);
      }
    } else {
      setAuthError('');
    }
  }, [error, t.invalidCreds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      // Handled in store/effects
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-6 relative overflow-hidden transition-theme">
      {/* Ambient background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-15 mix-blend-screen bg-[var(--primary)] pointer-events-none" />

      {/* Back to Home button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] hover:bg-[var(--surface-hover)] text-xs font-bold transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.backToHome}
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <SpotlightCard className="shadow-2xl border-[var(--border-color)] p-8 md:p-10 relative">
          {/* Lock Icon Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--primary)] mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center">
              {t.adminLogin}
            </h1>
            <p className="text-xs opacity-40 mt-1 font-light">
              {t.cms?.loginSubtitle2 || 'Secure control access panel'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {authError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                {authError}
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <label className="block text-xs font-bold opacity-60 uppercase mb-2">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]/50 transition-colors"
                  placeholder={t.cms?.placeholderEmail || 'admin@example.com'}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-xs font-bold opacity-60 uppercase mb-2">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]/50 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                t.login
              )}
            </button>
          </form>
        </SpotlightCard>
      </div>
    </div>
  );
}
