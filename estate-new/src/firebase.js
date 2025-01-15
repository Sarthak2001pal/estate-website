// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-34742.firebaseapp.com",
  projectId: "mern-estate-34742",
  storageBucket: "mern-estate-34742.firebasestorage.app",
  messagingSenderId: "35745424783",
  appId: "1:35745424783:web:4328a7c3188460aa4cd7fa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);