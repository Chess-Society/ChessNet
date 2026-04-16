<script lang="ts">
  import Toast from '$lib/components/Toast.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import CookieBanner from '$lib/components/CookieBanner.svelte';
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


  if (browser) {
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
      return;
    }

    // Lógica de Redirección
    if ($user && isPublicOnly) {
      goto('/panel', { replaceState: true });
    } else if (!$user && isProtected) {
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
    <div class="fixed inset-0 flex items-center justify-center bg-[#050507] z-[100] p-6 overflow-hidden">
      <!-- Background Architecture -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.15)_0%,transparent_70%)]"></div>
        <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(79,70,229,0.1)_0%,transparent_50%)]"></div>
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div class="max-w-2xl w-full text-center space-y-12 relative" in:fade={{ duration: 1000 }}>
        <!-- Main Visual Unit -->
        <div class="relative inline-flex flex-col items-center">
          <div class="absolute -inset-16 bg-violet-600/20 rounded-full blur-[100px] animate-pulse"></div>
          
          <div class="relative mb-8">
            <div class="w-32 h-32 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] flex items-center justify-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border-b-violet-500/50">
               <Settings class="w-14 h-14 text-violet-400 animate-spin-slow" strokeWidth={1} />
            </div>
            <!-- Secondary Floating Elements -->
            <div class="absolute -top-4 -right-4 w-12 h-12 bg-[#09090b] border border-white/10 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                <div class="w-2 h-2 bg-violet-500 rounded-full animate-ping"></div>
            </div>
          </div>

          <div class="space-y-4">
            <h1 class="text-6xl md:text-7xl font-outfit font-black tracking-tighter text-white uppercase italic leading-none">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Mantenimiento</span><br/>
              Evolutivo
            </h1>
            <div class="flex items-center justify-center gap-3">
                <div class="h-px w-12 bg-gradient-to-r from-transparent to-violet-500"></div>
                <span class="text-[10px] font-outfit font-black text-violet-500 uppercase tracking-[0.5em]">ChessNet System</span>
                <div class="h-px w-12 bg-gradient-to-l from-transparent to-violet-500"></div>
            </div>
          </div>
        </div>

        <p class="text-slate-400 text-lg md:text-xl font-plus-jakarta font-medium max-w-lg mx-auto leading-relaxed">
          Estamos desplegando nuevas capacidades inteligentes para transformar tu gestión del ajedrez.
        </p>

        <!-- Dynamic Status Board -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto pt-6">
          {#each [
            { label: 'Sistemas', value: 'Actualizando', icon: '⚡' },
            { label: 'Seguridad', value: 'Verificada', icon: '🛡️' },
            { label: 'Retorno', value: 'Minutos', icon: '⏳' }
          ] as indicator}
             <div class="p-6 bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/[0.04] transition-all group">
                <span class="text-xl group-hover:scale-125 transition-transform">{indicator.icon}</span>
                <div class="text-center">
                    <p class="text-[9px] font-outfit font-black text-slate-500 uppercase tracking-widest">{indicator.label}</p>
                    <p class="text-xs font-bold text-white mt-1 uppercase">{indicator.value}</p>
                </div>
             </div>
          {/each}
        </div>

        <div class="pt-12">
            <div class="inline-flex items-center gap-4 px-6 py-2.5 bg-violet-500/5 border border-violet-500/20 rounded-full">
                <div class="w-2 h-2 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                <span class="text-[10px] text-violet-400 font-outfit font-bold uppercase tracking-[0.3em]">
                    Core Intelligence Synchronizing
                </span>
            </div>
        </div>
      </div>
    </div>
  {:else}
    {@render children()}
  {/if}
  <ConfirmModal />
  <Toast />
  <CookieBanner />
</main>
