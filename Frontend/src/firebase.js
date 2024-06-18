// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "faite-1234d.firebaseapp.com",
  projectId: "faite-1234d",
  storageBucket: "faite-1234d.appspot.com",
  messagingSenderId: "603146930628",
  appId: "1:603146930628:web:a6ef48dbaf4a90d5607c91"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);