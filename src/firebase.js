// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  
        apiKey: "AIzaSyBejcqdAJS8x1AHi7u2_wIEpTZrHkMSqL8",
        authDomain: "fir-61759.firebaseapp.com",
        projectId: "fir-61759",
        storageBucket: "fir-61759.firebasestorage.app",
        messagingSenderId: "95195855298",
        appId: "1:95195855298:web:52ae98200db8d69ee4be5b",
        measurementId: "G-856E446CYQ"
      
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
