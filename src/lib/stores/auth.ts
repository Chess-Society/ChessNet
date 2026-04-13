import { writable } from "svelte/store";
import { auth } from "$lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

// Store simplificado para UI
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);
export const authInitialized = writable<boolean>(false);

// Inicializar auth state con tiempo muerto de seguridad (8s)
export const initAuth = () => {
  console.log('🔄 [Auth] Initializing Firebase auth...');
  
  let resolved = false;

  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    console.log("🔄 [Auth] State changed:", firebaseUser ? firebaseUser.email : 'No user');
    
    user.set(firebaseUser);
    loading.set(false);
    authInitialized.set(true);
    resolved = true;
    
    console.log("✅ [Auth] Store synchronized.");
  }, (error) => {
    console.error("❌ [Auth] Error detected:", error);
    loading.set(false);
    authInitialized.set(true);
    resolved = true;
  });

  // Timeout de seguridad robusto
  setTimeout(() => {
    if (!resolved) {
      console.warn('⚠️ [Auth] Initialization timeout (8s). Forcing resolution.');
      loading.set(false);
      authInitialized.set(true);
      resolved = true;
    }
  }, 8000);

  return unsubscribe;
};
