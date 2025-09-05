// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add your own Firebase configuration from your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCNJzukS0Ka6rwGIY5o3kLs6UHEX-jNZAE",
  authDomain: "bloghub-5616b.firebaseapp.com",
  projectId: "bloghub-5616b",
  storageBucket: "bloghub-5616b.firebasestorage.app",
  messagingSenderId: "930079682626",
  appId: "1:930079682626:web:43720f03f8cff39933fddb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };