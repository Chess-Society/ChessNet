import { writable } from "svelte/store";
import { auth } from "$lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { browser } from "$app/environment";

// Store simplificado para UI
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);
export const authInitialized = writable<boolean>(false);

// Inicializar auth state con tiempo muerto de seguridad (8s)
export const initAuth = () => {
    if (!browser) return;

    console.log('🔄 [Auth] Initializing Firebase auth...');
    
    let resolved = false;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log("🔄 [Auth] State changed:", firebaseUser ? firebaseUser.email : 'No user');
        
        user.set(firebaseUser);
        
        if (firebaseUser) {
            try {
                // Sincronizar Token con el Servidor para Hooks y SSR
                const idToken = await firebaseUser.getIdToken();
                await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: idToken })
                });
                console.log("📡 [Auth] Session cookie synchronized.");
            } catch (err) {
                console.warn("⚠️ [Auth] Could not sync session cookie:", err);
            }
        } else {
            // Limpiar sesión en servidor si no hay usuario
            try {
                await fetch('/api/auth/session', { method: 'DELETE' });
            } catch (e) {}
        }

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
