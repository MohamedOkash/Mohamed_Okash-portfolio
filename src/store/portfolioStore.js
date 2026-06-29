import { create } from 'zustand';
import { getPortfolioData, savePortfolioData } from '../firebase/firestore';
import { DEFAULT_PORTFOLIO_DATA } from '../data/constants';

const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

const deepMerge = (target, source) => {
  if (!source) return target;
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
};

const mergeMissingHomepageSections = (data) => {
  const currentSections = Array.isArray(data?.websiteStructure?.sections)
    ? [...data.websiteStructure.sections]
    : [];
  const defaultSections = DEFAULT_PORTFOLIO_DATA.websiteStructure.sections;
  const existingIds = new Set(currentSections.map((section) => section.id));

  defaultSections.forEach((defaultSection) => {
    if (existingIds.has(defaultSection.id)) return;

    const defaultIndex = defaultSections.findIndex((section) => section.id === defaultSection.id);
    const previousDefaultIds = defaultSections.slice(0, defaultIndex).map((section) => section.id);
    const previousExistingIndexes = previousDefaultIds
      .map((id) => currentSections.findIndex((section) => section.id === id))
      .filter((index) => index !== -1);
    const insertAt = previousExistingIndexes.length > 0
      ? Math.max(...previousExistingIndexes) + 1
      : currentSections.length;

    currentSections.splice(insertAt, 0, defaultSection);
    existingIds.add(defaultSection.id);
  });

  return {
    ...data,
    websiteStructure: {
      ...data.websiteStructure,
      sections: currentSections
    }
  };
};

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
        const mergedData = mergeMissingHomepageSections(deepMerge(DEFAULT_PORTFOLIO_DATA, dbData));
        set({ data: mergedData, loading: false });
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
