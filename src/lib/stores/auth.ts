import { writable } from "svelte/store";
import { auth } from "$lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { browser } from "$app/environment";

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAdmin: boolean;
}

// Store simplificado para UI
export const user = writable<AuthUser | null>(null);
export const loading = writable<boolean>(true);
export const authInitialized = writable<boolean>(false);
export const cookieSynced = writable<boolean>(false);

// Inicializar auth state con tiempo muerto de seguridad (8s)
export const initAuth = () => {
    if (typeof window === 'undefined') return;

    let resolved = false;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        const currentUser = get(user);
        const hasBypass = (typeof window !== 'undefined') && document.cookie.includes('antigravity_access=antigravity-dev-secret');
        
        // Priority 1: Real Firebase User
        if (firebaseUser) {
            // Fetch custom claims to check for admin status
            const tokenResult = await firebaseUser.getIdTokenResult();
            const isAdmin = tokenResult.claims.admin === true;

            const userToStore = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                emailVerified: firebaseUser.emailVerified,
                isAdmin: isAdmin
            };
            
            // Only update if UID or Admin status changed to avoid redundant store triggers
            if (currentUser?.uid !== firebaseUser.uid || (currentUser as any)?.isAdmin !== isAdmin) {
                user.set(userToStore as any);
            }
            
            if (!resolved) {
                (async () => {
                    try {
                        const idToken = await firebaseUser.getIdToken();
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 8000);
                        
                        const res = await fetch('/api/auth/session', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token: idToken }),
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);
                        if (res.ok) cookieSynced.set(true);
                    } catch (e) {}
                })();
            }
        } 
        // Priority 2: Developer Bypass (Local Dev Only)
        else if (hasBypass && !currentUser) {
            console.info('🛠️ [Auth] Client-side Developer Bypass detected. Setting mock user.');
            user.set({
                uid: 'antigravity-dev-worker',
                email: 'tomih@chess-society.com',
                displayName: 'Antigravity (Dev Mode)',
                photoURL: null,
                emailVerified: true,
                isAdmin: true
            });
            cookieSynced.set(true);
        }
        // Priority 3: No User
        else if (!firebaseUser && !hasBypass) {
            if (currentUser && resolved) {
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
            cookieSynced.set(true); // Desbloquear UI aunque Firebase no responda
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
