import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDY7x8LhUERDYEZBqkJxdU50VldShcyssc",
  authDomain: "travel-gecko.firebaseapp.com",
  projectId: "travel-gecko",
  storageBucket: "travel-gecko.firebasestorage.app",
  messagingSenderId: "627232585926",
  appId: "1:627232585926:web:90701d27db7614c12affc7",
  measurementId: "G-TG2JFR9Z2L"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
};
