import { writable } from "svelte/store";
import { auth } from "$lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

// Store simplificado para UI
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);
export const authInitialized = writable<boolean>(false);

// Inicializar auth state con tiempo muerto de seguridad (8s)
export const initAuth = () => {
  console.log('🔄 Initializing Firebase auth...');
  
  let resolved = false;

  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    console.log("🔄 Auth state changed:", firebaseUser ? firebaseUser.email : 'none');
    user.set(firebaseUser);
    loading.set(false);
    authInitialized.set(true);
    resolved = true;
  });

  // Timeout de seguridad más corto (8s)
  setTimeout(() => {
    if (!resolved) {
      console.warn('⚠️ Auth timeout. Forcing state.');
      loading.set(false);
      authInitialized.set(true);
    }
  }, 8000);

  return unsubscribe;
};
