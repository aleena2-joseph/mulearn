import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC38d4CiqZpWd1cRXvmyljM9hEpkjCqOeI",
  authDomain: "mulearn-2e7d7.firebaseapp.com",
  projectId: "mulearn-2e7d7",
  storageBucket: "mulearn-2e7d7.firebasestorage.app",
  messagingSenderId: "712474809610",
  appId: "1:712474809610:web:9f00f01095b630f48556f3",
  measurementId: "G-XGLJZD6E6H",
};

const app = initializeApp(firebaseConfig);

// ✅ Firestore instance
const db = getFirestore(app);

// ✅ Export as a named export
export { db };
