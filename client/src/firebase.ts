// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-platform-a5ec6.firebaseapp.com",
  projectId: "blog-platform-a5ec6",
  storageBucket: "blog-platform-a5ec6.firebasestorage.app",
  messagingSenderId: "465412550559",
  appId: "1:465412550559:web:b7ff2e88ca976d54d657aa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
