import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

const PORTFOLIO_DOC_PATH = ['portfolio', 'main'];

export const getPortfolioData = async () => {
  try {
    const docRef = doc(db, ...PORTFOLIO_DOC_PATH);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Firestore getPortfolioData Error:", error);
    throw error;
  }
};

export const savePortfolioData = async (data) => {
  try {
    const docRef = doc(db, ...PORTFOLIO_DOC_PATH);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Firestore savePortfolioData Error:", error);
    throw error;
  }
};

export const updatePortfolioSection = async (section, sectionData) => {
  try {
    const docRef = doc(db, ...PORTFOLIO_DOC_PATH);
    await updateDoc(docRef, { [section]: sectionData });
  } catch (error) {
    console.error(`Firestore updatePortfolioSection [${section}] Error:`, error);
    throw error;
  }
};
