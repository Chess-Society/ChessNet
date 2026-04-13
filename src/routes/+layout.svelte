<script lang="ts">
  import Toast from '$lib/components/Toast.svelte';
  import CookieBanner from '$lib/components/CookieBanner.svelte';
  import KofiWidget from '$lib/components/KofiWidget.svelte';
  import '../app.css';

  import { onMount } from 'svelte';
  import { initAuth, loading, user, authInitialized } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  let { children } = $props();

  onMount(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  });

  // Redirección inteligente: Si está logueado y en la landing/login, llevar al panel
  $effect(() => {
    if ($authInitialized && $user) {
      const path = $page.url.pathname;
      if (path === '/' || path === '/login') {
        console.log('🚀 User logged in, redirecting from', path, 'to /panel');
        goto('/panel');
      }
    }
  });
</script>

<main class="min-h-screen bg-slate-900 text-slate-100">
  {#if !$authInitialized || $loading}
    <div class="fixed inset-0 flex items-center justify-center bg-slate-900 z-50">
      <div class="flex flex-col items-center gap-4">
        <LoadingSpinner size="w-12 h-12" color="text-emerald-500" />
        <p class="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Cargando ChessNet</p>
      </div>
    </div>
  {:else}
    {@render children()}
  {/if}
  <Toast />
  <CookieBanner />
  <KofiWidget />
</main>
