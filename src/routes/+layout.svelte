<script lang="ts">
  import Toast from '$lib/components/Toast.svelte';
  import CookieBanner from '$lib/components/CookieBanner.svelte';
  import KofiWidget from '$lib/components/KofiWidget.svelte';
  import '../app.css';

  import { onMount } from 'svelte';
  import { initAuth, loading, user, authInitialized } from '$lib/stores/auth';
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

  // Centralized Navigation Guard (Runes)
  $effect(() => {
    console.log(`🛡️ [Guard] State - Initialized: ${$authInitialized}, Loading: ${$loading}, User: ${$user ? $user.email : 'None'}`);
    
    if (!$authInitialized) return;

    const path = $page.url.pathname;
    const isProtected = path.startsWith('/panel') || path.startsWith('/admin');
    const isPublicOnly = path === '/' || path === '/login';

    if ($user && isPublicOnly) {
      console.log('🛡️ [Guard] Authenticated user on public page -> /panel');
      goto('/panel');
    } else if (!$user && isProtected) {
      console.log('🛡️ [Guard] Unauthenticated user on protected page -> /login');
      goto('/login');
    }
  });
</script>

<main class="min-h-screen bg-bento-bg text-surface-200">
  {#if !$authInitialized || $loading}
    <div class="fixed inset-0 flex items-center justify-center bg-bento-bg z-[100]">
      <div class="flex flex-col items-center gap-6">
        <div class="relative">
          <div class="absolute -inset-4 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
          <LoadingSpinner size="w-16 h-16" color="text-primary-500" />
        </div>
        <p class="text-surface-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Iniciando ChessNet</p>
      </div>
    </div>
  {:else if maintenanceMode && !isAdmin}
    <div class="fixed inset-0 flex items-center justify-center bg-[#0f172a] z-[100] p-6 text-center">
      <div class="max-w-md space-y-8" in:fade>
        <div class="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
          <Settings class="w-12 h-12 text-amber-500 animate-spin-slow" />
        </div>
        <div class="space-y-4">
          <h1 class="text-4xl font-black tracking-tight uppercase italic text-white">Mantenimiento</h1>
          <p class="text-slate-400 leading-relaxed font-medium">Estamos actualizando ChessNet para ofrecerte una mejor experiencia. Volveremos muy pronto.</p>
        </div>
        <div class="pt-8 border-t border-white/5">
          <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Estado del Sistema: <span class="text-amber-500">Actualizando Core</span></p>
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
