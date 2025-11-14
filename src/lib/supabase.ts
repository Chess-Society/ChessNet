import { createBrowserClient } from "@supabase/ssr";
import { browser } from "$app/environment";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

// Validación mejorada de variables de entorno
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  const missingVars = [];
  if (!PUBLIC_SUPABASE_URL) missingVars.push('PUBLIC_SUPABASE_URL');
  if (!PUBLIC_SUPABASE_ANON_KEY) missingVars.push('PUBLIC_SUPABASE_ANON_KEY');
  
  const errorMessage = `❌ Variables de entorno de Supabase faltantes: ${missingVars.join(', ')}. 
  
Para solucionarlo:
1. Crea un archivo .env en la raíz del proyecto
2. Copia el contenido de env.example y reemplaza con tus credenciales reales
3. Para producción, configura las variables en Netlify Dashboard > Site Settings > Environment Variables

Variables requeridas:
- PUBLIC_SUPABASE_URL: Tu URL de Supabase (ej: https://tu-proyecto.supabase.co)
- PUBLIC_SUPABASE_ANON_KEY: Tu clave anónima de Supabase`;

  console.error(errorMessage);
  throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`);
}

// Log de configuración exitosa (solo en desarrollo)
if (browser && import.meta.env.DEV) {
  console.log('✅ Supabase configurado correctamente:', {
    url: PUBLIC_SUPABASE_URL,
    hasAnonKey: !!PUBLIC_SUPABASE_ANON_KEY
  });
}

export const supabase = createBrowserClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key: string) => {
          if (typeof window !== 'undefined') {
            return window.localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key: string, value: string) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value);
          }
        },
        removeItem: (key: string) => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
          }
        }
      }
    }
  }
);

// Auth helpers
export const signInWithGoogle = async (redirectTo: string = '/dashboard') => {
  // Detectar automáticamente el entorno
  const baseUrl = browser ? window.location.origin : 'http://localhost:5173';
  const callbackUrl = `${baseUrl}/auth/callback`;
  const fullRedirectUrl = `${callbackUrl}?redirectTo=${encodeURIComponent(redirectTo)}`;
  
  console.log('🔍 Google OAuth - baseUrl:', baseUrl);
  console.log('🔍 Google OAuth - callbackUrl:', callbackUrl);
  console.log('🔍 Google OAuth - redirectTo:', redirectTo);
  console.log('🔍 Google OAuth - fullRedirectUrl:', fullRedirectUrl);
  
  // Clear any existing auth state to prevent flow_state conflicts
  await supabase.auth.signOut();
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: fullRedirectUrl,
    },
  });
  
  if (error) {
    console.error('❌ Google OAuth Error:', error);
  } else {
    console.log('✅ Google OAuth - Redirect initiated');
  }
  
  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};

export const getCurrentSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};

// Helper para leer la sesión sin interferir con stores
export const readSession = async () => {
  try {
    console.log('🔍 Reading session from Supabase...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error reading session:', error);
      return null;
    }
    
    console.log('📋 Session read result:', session ? 'found' : 'none');
    return session;
  } catch (error) {
    console.error('❌ Error reading session:', error);
    return null;
  }
};
