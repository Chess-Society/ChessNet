import { writable } from "svelte/store";
import { auth } from "$lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { browser } from "$app/environment";

// Store simplificado para UI
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);
export const authInitialized = writable<boolean>(false);
export const cookieSynced = writable<boolean>(false);

let isDevSessionActive = false;

// Inicializar auth state con tiempo muerto de seguridad (8s)
export const initAuth = () => {
    if (!browser) return;

    console.log('🔄 [Auth] Initializing Firebase auth...');
    
    let resolved = false;

    // Recuperar flag de sesión mock de sessionStorage
    if (sessionStorage.getItem('chessnet_mock_session') === 'true') {
        console.log('🧪 [Auth] Restoring mock session from storage');
        isDevSessionActive = true;
        const mockUser = {
            uid: 'chessnet-dev-uid',
            email: 'admin@chessnet.pro',
            displayName: 'ChessNet Developer',
            photoURL: 'https://ui-avatars.com/api/?name=Chess+Net&background=7C3AED&color=fff',
            emailVerified: true,
            getIdToken: async () => 'mock-chessnet-token'
        } as User;
        user.set(mockUser);
        cookieSynced.set(true);
        loading.set(false);
        authInitialized.set(true);
        resolved = true;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        // Bloqueo: Si una sesión dev está activa y no hay un nuevo usuario real, ignoramos onAuthStateChanged
        if (isDevSessionActive && !firebaseUser) {
            console.log("🛡️ [Auth] Ignoring Firebase null state because Dev Session is active.");
            return;
        }

        console.log("🔄 [Auth] State changed:", firebaseUser ? firebaseUser.email : 'No user');
        
        if (firebaseUser) {
            isDevSessionActive = false; // El usuario real gana
            sessionStorage.removeItem('chessnet_mock_session');
            user.set(firebaseUser);
            try {
                // Sincronizar Token con el Servidor para Hooks y SSR
                const idToken = await firebaseUser.getIdToken();
                await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: idToken })
                });
                console.log("📡 [Auth] Session cookie synchronized.");
                cookieSynced.set(true);
            } catch (err) {
                console.warn("⚠️ [Auth] Could not sync session cookie:", err);
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

// Vía de escape para desarrollo local (ChessNet)
export const devLogin = async () => {
    if (!browser) return;
    
    console.log('🧪 [Auth] Activating Dev Login...');
    loading.set(true);
    isDevSessionActive = true;
    sessionStorage.setItem('chessnet_mock_session', 'true');

    try {
        // Sincronizar Cookie de Desarrollo con el Servidor
        await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: 'mock-chessnet-token' })
        });

        // Simulamos un objeto User de Firebase suficiente para la UI
        const mockUser = {
            uid: 'chessnet-dev-uid',
            email: 'admin@chessnet.pro',
            displayName: 'ChessNet Developer',
            photoURL: 'https://ui-avatars.com/api/?name=Chess+Net&background=7C3AED&color=fff',
            emailVerified: true,
            getIdToken: async () => 'mock-chessnet-token'
        } as User;

        user.set(mockUser);
        cookieSynced.set(true);
        authInitialized.set(true);
        loading.set(false);
        
        console.log('✅ [Auth] Dev Session established.');
    } catch (err) {
        console.error('❌ [Auth] Dev Login failed:', err);
        isDevSessionActive = false;
        sessionStorage.removeItem('chessnet_mock_session');
        loading.set(false);
    }
};
