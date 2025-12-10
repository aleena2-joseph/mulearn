// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyC38d4CiqZpWd1cRXvmyljM9hEpkjCqOeI",
//   authDomain: "mulearn-2e7d7.firebaseapp.com",
//   projectId: "mulearn-2e7d7",
//   storageBucket: "mulearn-2e7d7.firebasestorage.app",
//   messagingSenderId: "712474809610",
//   appId: "1:712474809610:web:58ab239cae3e89db8556f3",
//   measurementId: "G-RPZKXMHVLJ",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const auth = getAuth(app);

// export { db, storage, auth };
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
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


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export default app;