import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC38d4CiqZpWd1cRXvmyljM9hEpkjCqOeI",
  authDomain: "mulearn-2e7d7.firebaseapp.com",
  projectId: "mulearn-2e7d7",
  storageBucket: "mulearn-2e7d7.firebasestorage.app",
  messagingSenderId: "712474809610",
  appId: "1:712474809610:web:58ab239cae3e89db8556f3",
  measurementId: "G-RPZKXMHVLJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
