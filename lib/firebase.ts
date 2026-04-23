// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2dy3FaktEgIVgpA713BqhupZa2vfHHfM",
  authDomain: "kola-academy-50955.firebaseapp.com",
  projectId: "kola-academy-50955",
  storageBucket: "kola-academy-50955.firebasestorage.app",
  messagingSenderId: "797267520886",
  appId: "1:797267520886:web:dbe670d05ec4c46b545e57",
  measurementId: "G-0D8SSTBN3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, analytics };
