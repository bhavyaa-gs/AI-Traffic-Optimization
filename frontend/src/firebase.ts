import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRCo1q6ylR5o7eGbjL0057oPXQHp22rXo",
  authDomain: "smarttraffic-a8d1e.firebaseapp.com",
  projectId: "smarttraffic-a8d1e",
  storageBucket: "smarttraffic-a8d1e.firebasestorage.app",
  messagingSenderId: "312279386283",
  appId: "1:312279386283:web:69cb36341b446f9aa58fee"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
