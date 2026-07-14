import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCApHKwpk0JgnfENjAek8f8MLQA2ugcRD8",
  authDomain: "mohamed-okash.firebaseapp.com",
  projectId: "mohamed-okash",
  storageBucket: "mohamed-okash.firebasestorage.app",
  messagingSenderId: "345685960693",
  appId: "1:345685960693:web:9918a927b921665bf362bc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const run = async () => {
  try {
    const docRef = doc(db, "portfolio", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const projects = data.projects || [];
      console.log("PROJECTS FROM FIRESTORE:");
      projects.forEach((p, i) => {
        console.log(`[${i}] Title: "${p.title}" | ID: "${p.id}"`);
        console.log(`    - Featured: ${p.featured}`);
        console.log(`    - Tech array is array: ${Array.isArray(p.tech)}`);
        if (p.tech) {
          console.log(`    - Tech items:`, JSON.stringify(p.tech));
        } else {
          console.log(`    - Tech is missing!`);
        }
      });
    } else {
      console.log("No main portfolio document.");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    process.exit(0);
  }
};

run();
