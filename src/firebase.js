// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRJJzraI6K7qb7xaBj1M7SgGfmPjJrkpY",
  authDomain: "foody-database-ed443.firebaseapp.com",
  projectId: "foody-database-ed443",
  storageBucket: "foody-database-ed443.appspot.com",
  messagingSenderId: "596988112499",
  appId: "1:596988112499:web:630fa2c162cc27a7e7c406",
  measurementId: "G-98RXRTMK0N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
