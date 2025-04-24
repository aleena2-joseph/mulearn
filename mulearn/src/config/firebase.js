// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { logEvent } from "firebase/analytics";

// Later in your code
logEvent(analytics, "notification_received");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
