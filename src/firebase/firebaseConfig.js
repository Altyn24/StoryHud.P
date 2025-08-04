// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7Tg0NQ3wm_Gk-EphhvsS4fwO17Y_Kh80",
  authDomain: "storyhub-f59aa.firebaseapp.com",
  projectId: "storyhub-f59aa",
  storageBucket: "storyhub-f59aa.firebasestorage.com",
  messagingSenderId: "387643874885",
  appId: "1:387643874885:web:7bb36a028054bd5c518d2c",
  measurementId: "G-01F6GB2W05",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const storiesCollectionRef = collection(db, "stories")
export default app;
export const storage = getStorage(app);
