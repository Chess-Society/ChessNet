import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";


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
  }
}

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

export { app, auth, db, analytics, signInAnonymously };

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
    if (key === 'owner_id') newKey = 'ownerId';
    else if (key === 'student_id') newKey = 'studentId';
    else if (key === 'round_no') newKey = 'roundNo';
    else if (key === 'tournament_id') newKey = 'tournamentId';
    else if (key === 'school_id') newKey = 'schoolId';
    else if (key === 'class_id') newKey = 'classId';
    else if (key === 'first_name') newKey = 'firstName';
    else if (key === 'last_name') newKey = 'lastName';
    else if (key === 'time_control') newKey = 'timeControl';
    else if (key === 'max_players') newKey = 'maxPlayers';
    else if (key === 'prize_pool') newKey = 'prizePool';
    else if (key === 'points_white') newKey = 'pointsWhite';
    else if (key === 'points_black') newKey = 'pointsBlack';
    else if (key === 'white_student_id') newKey = 'whiteStudentId';
    else if (key === 'black_student_id') newKey = 'blackStudentId';
    else if (key === 'round_no') newKey = 'roundNo';
    else if (key === 'started_at') newKey = 'startedAt';
    else if (key === 'finished_at') newKey = 'finishedAt';
    else if (key === 'created_at') newKey = 'createdAt';
    else if (key === 'updated_at') newKey = 'updatedAt';
    
    normalized[newKey] = data[key];
  }
  
  return normalized as T;
};

