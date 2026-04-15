import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";

console.log('🔥 [Firebase] Module loading...');

const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY,
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.PUBLIC_FIREBASE_APP_ID,
  measurementId: env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

if (browser) {
  if (!env.PUBLIC_FIREBASE_API_KEY || !env.PUBLIC_FIREBASE_PROJECT_ID) {
    console.error('❌ [Firebase] CRITICAL: Environment variables (PUBLIC_FIREBASE_*) are missing!');
  } else {
    console.log('🏁 [Firebase] Initializing for project:', firebaseConfig.projectId);
  }
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 [Firebase] Auth & Firestore initialized');


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

// Helper for data conversion
export const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

