// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:  import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate5633.firebaseapp.com",
  projectId: "mern-estate5633",
  storageBucket: "mern-estate5633.firebasestorage.app",
  messagingSenderId: "601289344263",
  appId: "1:601289344263:web:c64e5d0c925e33dce731a2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);