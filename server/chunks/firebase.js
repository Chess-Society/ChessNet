import { getApps, initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/analytics";
const PUBLIC_FIREBASE_API_KEY = "AIzaSyAVfcGFylUSYSkwEH0dTrCySqu-SwAhHm4";
const PUBLIC_FIREBASE_AUTH_DOMAIN = "chessnet-2505.firebaseapp.com";
const PUBLIC_FIREBASE_PROJECT_ID = "chessnet-2505";
const PUBLIC_FIREBASE_STORAGE_BUCKET = "chessnet-2505.firebasestorage.app";
const PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "668650751820";
const PUBLIC_FIREBASE_APP_ID = "1:668650751820:web:94d658408221c4c11af1e9";
const PUBLIC_FIREBASE_MEASUREMENT_ID = "G-37RZFE1WJQ";
const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
  measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
export {
  auth as a,
  db as d
};
