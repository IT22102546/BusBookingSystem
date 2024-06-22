// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "faite-1234d.firebaseapp.com",
  projectId: "faite-1234d",
  storageBucket: "faite-1234d.appspot.com",
  messagingSenderId: "603146930628",
  appId: "1:603146930628:web:a6ef48dbaf4a90d5607c91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
