import { writable } from "svelte/store";
import { auth } from "$lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

// Store simplificado para UI
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);

// Inicializar auth state
export const initAuth = () => {
  console.log('🔄 Initializing Firebase auth store for UI...');
  
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    console.log("🔄 Firebase auth state changed:", firebaseUser ? firebaseUser.email : 'none');
    user.set(firebaseUser);
    loading.set(false);
  });

  return unsubscribe;
};
