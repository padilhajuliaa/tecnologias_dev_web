import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmb_HZaOOe6ajtWEq58IRvIy0uoDBEbzU",
  authDomain: "atp2-firebase-app.firebaseapp.com",
  projectId: "atp2-firebase-app",
  storageBucket: "atp2-firebase-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345",
  measurementId: "G-ABCDEF1234"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;