import { create } from 'zustand';
import { loginAdmin, logoutAdmin, subscribeToAuth } from '../firebase/auth';

export const useAuthStore = create((set) => {
  // Listen for firebase auth state changes immediately
  subscribeToAuth((user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: true,
    error: null,
    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const user = await loginAdmin(email, password);
        set({ user, loading: false });
        return user;
      } catch (err) {
        set({ error: err.code || err.message, loading: false });
        throw err;
      }
    },
    logout: async () => {
      set({ loading: true, error: null });
      try {
        await logoutAdmin();
        set({ user: null, loading: false });
      } catch (err) {
        set({ error: err.message, loading: false });
        throw err;
      }
    },
    clearError: () => set({ error: null })
  };
});
