import { writable } from "svelte/store";
import { supabase } from "$lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

// Store simplificado solo para UI - la autenticación se maneja en el servidor
export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);
export const loading = writable<boolean>(false);

// Inicializar auth state solo para sincronización de UI
export const initAuth = async () => {
  try {
    console.log('🔄 Initializing auth store for UI...');

    // Obtener sesión inicial
    const { data: { session: initialSession }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Error getting session:", error);
      session.set(null);
      user.set(null);
      return;
    }

    console.log('📋 Initial session for UI:', initialSession ? 'found' : 'none');
    session.set(initialSession);
    user.set(initialSession?.user ?? null);

    // Escuchar cambios de auth para sincronizar UI
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("🔄 Auth state changed for UI:", event, newSession?.user?.email || 'none');
      session.set(newSession);
      user.set(newSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error("❌ Error initializing auth store:", error);
    session.set(null);
    user.set(null);
  }
};
