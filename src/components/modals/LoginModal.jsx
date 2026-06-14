import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';
import { Lock, Mail, Loader2, X } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';

export const LoginModal = () => {
  const navigate = useNavigate();
  const { lang } = useLanguageStore();
  const { user, loading, error, login, clearError, loginModalOpen, setLoginModalOpen } = useAuthStore();
  const t = translations[lang] || translations.ar;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (loginModalOpen) {
      clearError();
      setEmail('');
      setPassword('');
      setAuthError('');
    }
  }, [loginModalOpen, clearError]);

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
      // login method in authStore sets loginModalOpen to false on success
      navigate('/admin/dashboard');
    } catch (err) {
      // Handled by state listener
    }
  };

  return (
    <AnimatePresence>
      {loginModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Dark blurred background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoginModalOpen(false)}
            className="fixed inset-0 bg-[var(--card-bg)] backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md z-10"
          >
            <SpotlightCard className="shadow-2xl border-[var(--border)] p-8 md:p-10 relative bg-[var(--bg-primary)]/90 backdrop-blur-2xl">
              {/* Close Button */}
              <button
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Lock Icon Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="p-4 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--primary)] mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center">
                  {t.adminLogin}
                </h2>
                <p className="text-xs opacity-40 mt-1 font-light">
                  {t.cms?.loginSubtitle || 'Secure administration control access'}
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
