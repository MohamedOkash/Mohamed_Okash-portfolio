import { create } from 'zustand';
import { getPortfolioData, savePortfolioData } from '../firebase/firestore';
import { DEFAULT_PORTFOLIO_DATA } from '../data/constants';

export const usePortfolioStore = create((set, get) => ({
  data: DEFAULT_PORTFOLIO_DATA,
  loading: true,
  saving: false,
  error: null,

  loadPortfolio: async (currentUser = null) => {
    set({ loading: true, error: null });
    try {
      const dbData = await getPortfolioData();
      if (dbData) {
        set({ data: dbData, loading: false });
      } else {
        // If data is missing in Firestore and an authenticated admin is active, bootstrap it
        if (currentUser && currentUser.email === 'mohamed.okash1998@gmail.com') {
          console.log("Firestore document is empty. Bootstrapping with default portfolio data...");
          await savePortfolioData(DEFAULT_PORTFOLIO_DATA);
        }
        set({ data: DEFAULT_PORTFOLIO_DATA, loading: false });
      }
    } catch (err) {
      console.error("loadPortfolio Store Error:", err);
      // Fallback to local default data if offline or error
      set({ data: DEFAULT_PORTFOLIO_DATA, loading: false, error: err.message });
    }
  },

  savePortfolio: async (newData) => {
    set({ saving: true, error: null });
    try {
      await savePortfolioData(newData);
      set({ data: newData, saving: false });
      return true;
    } catch (err) {
      set({ error: err.message, saving: false });
      throw err;
    }
  },

  updateSection: async (sectionName, sectionData) => {
    const currentData = get().data;
    const updatedData = { ...currentData, [sectionName]: sectionData };
    set({ saving: true, error: null });
    try {
      await savePortfolioData(updatedData);
      set({ data: updatedData, saving: false });
      return true;
    } catch (err) {
      set({ error: err.message, saving: false });
      throw err;
    }
  }
}));
