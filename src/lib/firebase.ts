import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { browser, building } from "$app/environment";
import * as publicEnv from "$env/static/public";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

// Helper to get config from dynamic env
const getFirebaseConfig = () => ({
  apiKey: publicEnv.PUBLIC_FIREBASE_API_KEY,
  authDomain: publicEnv.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: publicEnv.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: publicEnv.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: publicEnv.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: publicEnv.PUBLIC_FIREBASE_APP_ID,
  measurementId: publicEnv.PUBLIC_FIREBASE_MEASUREMENT_ID
});

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;

// Only initialize if we have required config AND we are not in the middle of a build
const config = getFirebaseConfig();
const hasConfig = !!(config.apiKey && config.projectId && config.appId);
const shouldInitialize = hasConfig && !building;

if (shouldInitialize) {
    try {
        app = getApps().length === 0 ? initializeApp(config) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);

        if (browser) {
            isSupported().then(supported => {
                if (supported) {
                    analytics = getAnalytics(app);
                }
            });
        }
    } catch (error) {
        console.error("⚠️ [Firebase] Initialization failed:", error);
    }
}

// Fallback objects for build time or failed initialization
// @ts-ignore
if (!app) app = { name: '[DEFAULT]' } as FirebaseApp;
// @ts-ignore
if (!auth) auth = { currentUser: null } as Auth;
// @ts-ignore
if (!db) db = {} as Firestore;

export { app, auth, db, analytics };
export { signInAnonymously };

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
  const data = doc.data();
  const id = doc.id;
  
  // Normalize legacy snake_case fields to camelCase
  const normalized: any = { id };
  for (const key in data) {
    let newKey = key;
    if (key === 'ownerId' || key === 'userId') newKey = 'ownerId';
    else if (key === 'studentId') newKey = 'studentId';
    else if (key === 'schoolId') newKey = 'schoolId';
    else if (key === 'classId') newKey = 'classId';
    else if (key === 'tournamentId') newKey = 'tournamentId';
    else if (key === 'roundNo') newKey = 'roundNo';
    else if (key === 'firstName') newKey = 'firstName';
    else if (key === 'lastName') newKey = 'lastName';
    else if (key === 'parentEmail') newKey = 'parentEmail';
    else if (key === 'parentPhone') newKey = 'parentPhone';
    else if (key === 'dateOfBirth') newKey = 'dateOfBirth';
    else if (key === 'lichessUsername') newKey = 'lichessUsername';
    else if (key === 'paymentType') newKey = 'paymentType';
    else if (key === 'dueDate') newKey = 'dueDate';
    else if (key === 'paidDate') newKey = 'paidDate';
    else if (key === 'periodStart') newKey = 'periodStart';
    else if (key === 'periodEnd') newKey = 'periodEnd';
    else if (key === 'createdAt') newKey = 'createdAt';
    else if (key === 'updatedAt') newKey = 'updatedAt';
    else if (key === 'startedAt' || key === 'start_date') newKey = 'startAt';
    else if (key === 'finishedAt' || key === 'end_date') newKey = 'endAt';
    
    normalized[newKey] = data[key];
  }
  
  return normalized as T;
};

