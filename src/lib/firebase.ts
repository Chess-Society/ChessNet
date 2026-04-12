import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";

const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY || "AIzaSyAVfcGFylUSYSkwEH0dTrCySqu-SwAhHm4",
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN || "chessnet-2505.firebaseapp.com",
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID || "chessnet-2505",
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET || "chessnet-2505.firebasestorage.app",
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "668650751820",
  appId: env.PUBLIC_FIREBASE_APP_ID || "1:668650751820:web:94d658408221c4c11af1e9",
  measurementId: env.PUBLIC_FIREBASE_MEASUREMENT_ID || "G-37RZFE1WJQ"
};

// Initialize Firebase

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


let analytics = null;
if (browser) {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };

// Auth helpers
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { user: null, error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
