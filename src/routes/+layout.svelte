<script lang="ts">
  import Toast from '$lib/components/Toast.svelte';
  import CookieBanner from '$lib/components/CookieBanner.svelte';
  import KofiWidget from '$lib/components/KofiWidget.svelte';
  import '../app.css';

  import { onMount } from 'svelte';
  import { initAuth, loading, user, authInitialized, cookieSynced } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { fade } from 'svelte/transition';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { db } from '$lib/firebase';
  import { doc, onSnapshot } from 'firebase/firestore';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { Settings } from 'lucide-svelte';

  let { children } = $props();
  let maintenanceMode = $state(false);

  console.log('🚀 [Layout] Script block execution start', { browser });

  if (browser) {
    console.log('🏁 [Layout] Immediate browser initialization...');
    initAuth();

    // Monitorizar Modo Mantenimiento
    onSnapshot(doc(db, 'system', 'config'), (snap) => {
      if (snap.exists()) {
        maintenanceMode = snap.data().maintenanceMode || false;
      }
    });
  }

  const isAdmin = $derived($user?.email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes($user.email.toLowerCase()));

  // Guard de Navegación Centralizado (Svelte 5 Runes)
  $effect(() => {
    if (!$authInitialized || !browser) return;

    const path = $page.url.pathname;
    const isProtected = path.startsWith('/panel') || path.startsWith('/admin');
    const isPublicOnly = path === '/' || path === '/login';

    // Evitar procesar si ya estamos en medio de una transición manual
    // o si el estado de carga es activo para evitar "flicker"
    if ($loading && isProtected) return;

    // Si hay usuario pero la cookie no está sincronizada, esperamos (mostrando el spinner)
    // EXCEPTO si estamos en una ruta pública, donde podemos dejar que cargue
    if ($user && !$cookieSynced && isProtected) {
      console.log('⏳ [Guard] Sincronizando sesión...');
      return;
    }

    // Lógica de Redirección
    if ($user && isPublicOnly) {
      console.log('🚀 [Guard] Usuario detector -> Redirigiendo a zona segura');
      goto('/panel', { replaceState: true });
    } else if (!$user && isProtected) {
      console.log('🔒 [Guard] Acceso protegido sin sesión -> /login');
      if (path !== '/login') {
        const redirectParam = path !== '/panel' ? `?redirect=${encodeURIComponent(path)}` : '';
        goto(`/login${redirectParam}`, { replaceState: true });
      }
    }
  });
</script>

<main class="min-h-screen text-surface-200 relative overflow-x-hidden">
  <!-- Fondo con Gradientes Dinámicos -->
  <div class="fixed inset-0 -z-10 bg-[#09090b]">
    <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.08)_0%,transparent_50%)]"></div>
    <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(79,70,229,0.08)_0%,transparent_50%)]"></div>
  </div>
  {#if !$authInitialized || $loading || ($user && !$cookieSynced && !['/', '/login'].includes($page.url.pathname))}
    <div class="fixed inset-0 flex items-center justify-center bg-bento-bg z-[100]">
      <div class="flex flex-col items-center gap-6">
        <div class="relative">
          <div class="absolute -inset-4 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
          <LoadingSpinner size="w-16 h-16" color="text-primary-500" />
        </div>
        <p class="text-surface-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Initializing ChessNet</p>
      </div>
    </div>
  {:else if maintenanceMode && !isAdmin}
    <div class="fixed inset-0 flex items-center justify-center bg-[#0f172a] z-[100] p-6 text-center">
      <div class="max-w-md space-y-8" in:fade>
        <div class="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
          <Settings class="w-12 h-12 text-amber-500 animate-spin-slow" />
        </div>
        <div class="space-y-4">
          <h1 class="text-4xl font-black tracking-tight uppercase italic text-white">Maintenance</h1>
          <p class="text-slate-400 leading-relaxed font-medium">We are updating ChessNet to offer you a better experience. We will be back very soon.</p>
        </div>
        <div class="pt-8 border-t border-white/5">
          <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">System Status: <span class="text-amber-500">Updating Core</span></p>
        </div>
      </div>
    </div>
  {:else}
    {@render children()}
  {/if}
  <Toast />
  <CookieBanner />
  <KofiWidget />
</main>
