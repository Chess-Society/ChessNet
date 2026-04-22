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
    if (typeof window === 'undefined') return;

    // Local Development Bypass Check
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const hasBypassCookie = document.cookie.includes('antigravity_access=antigravity-dev-secret');

    if (isDev && hasBypassCookie) {
        console.log("🚀 [Auth] Local Dev Bypass Detected");
        user.set({
            uid: 'antigravity-dev-worker',
            email: 'tomih@chess-society.com',
            displayName: 'Antigravity (Dev Mode)',
            photoURL: ''
        } as any);
        loading.set(false);
        authInitialized.set(true);
        cookieSynced.set(true);
        return () => {}; // No active listener needed for bypass
    }

    let resolved = false;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        const currentUser = get(user);
        
        // If we have a firebaseUser, we always trust it
        if (firebaseUser) {
            const userToStore = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                emailVerified: firebaseUser.emailVerified
            };
            
            // Only update if UID changed to avoid redundant store triggers
            if (currentUser?.uid !== firebaseUser.uid) {
                user.set(userToStore as any);
            }
            
            if (!resolved) {
                try {
                    const idToken = await firebaseUser.getIdToken();
                    const res = await fetch('/api/auth/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: idToken })
                    });
                    if (res.ok) cookieSynced.set(true);
                } catch (e) {}
            }
        } else {
            // FIREBASE SAYS NULL. 
            // If we have a current session user, we only clear it if we are NOT in dev bypass
            // AND we have waited long enough for Firebase to truly confirm the state.
            const hasBypass = (typeof window !== 'undefined') && document.cookie.includes('antigravity_access=antigravity-dev-secret');
            
            if (currentUser && !hasBypass && resolved) {
                user.set(null);
                try {
                    await fetch('/api/auth/session', { method: 'DELETE' });
                    cookieSynced.set(false);
                } catch (e) {}
            }
        }

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

// Helper for stores
function get<T>(store: { subscribe: (fn: (v: T) => void) => () => void }): T {
    let result: T | undefined;
    const unsub = store.subscribe(v => result = v);
    unsub();
    return result as T;
}
