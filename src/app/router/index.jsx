import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

// Lazy load pages for dynamic code splitting
const Home = lazy(() => import('../../pages/Home'));
const AdminLogin = lazy(() => import('../../pages/AdminLogin'));
const AdminDashboard = lazy(() => import('../../pages/AdminDashboard'));
const NotFound = lazy(() => import('../../pages/NotFound'));

// Global dynamic loading screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center text-[var(--text)] transition-theme">
    <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)] mb-4" />
    <p className="text-sm tracking-widest uppercase font-medium opacity-65 animate-pulse">
      Loading Platform...
    </p>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
