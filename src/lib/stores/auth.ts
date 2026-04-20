import { writable } from "svelte/store";
import { auth } from "$lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { browser } from "$app/environment";

// Store simplificado para UI
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);
export const authInitialized = writable<boolean>(false);
export const cookieSynced = writable<boolean>(false);

// Inicializar auth state con tiempo muerto de seguridad (8s)
export const initAuth = () => {
    if (!browser) return;

    let resolved = false;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            user.set(firebaseUser);
            try {
                // Sincronizar Token con el Servidor para Hooks y SSR
                const idToken = await firebaseUser.getIdToken();
                await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: idToken })
                });
                cookieSynced.set(true);
            } catch (err) {
                console.error("❌ [Auth] Error syncing session:", err);
            }
        } else {
            user.set(null);
            // Limpiar sesión en servidor si no hay usuario
            try {
                await fetch('/api/auth/session', { method: 'DELETE' });
                cookieSynced.set(false);
            } catch (e) {}
        }

        loading.set(false);
        authInitialized.set(true);
        cookieSynced.set(true);
        resolved = true;
        
    }, (error) => {
        console.error("❌ [Auth] Error detected:", error);
        loading.set(false);
        authInitialized.set(true);
        resolved = true;
    });

    // Timeout de seguridad robusto
    setTimeout(() => {
        if (!resolved) {
            loading.set(false);
            authInitialized.set(true);
            resolved = true;
        }
    }, 8000);

    return unsubscribe;
};
