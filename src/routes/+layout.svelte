<script lang="ts">

  import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
  import PromptModal from '$lib/components/PromptModal.svelte';
  import { uiStore } from '$lib/stores/uiStore';
  import CookieBanner from '$lib/components/CookieBanner.svelte';
  import '../app.css';

  import { onMount } from 'svelte';
  import { initAuth, loading, user, authInitialized, cookieSynced } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { fade, fly } from 'svelte/transition';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { db } from '$lib/firebase';
  import { doc, onSnapshot } from 'firebase/firestore';

  import { Crown, ChevronRight } from 'lucide-svelte';
  import { Horse } from 'phosphor-svelte';
  import Logo from '$lib/components/Logo.svelte';
  import { t } from '$lib/i18n';
  import { appStore } from '$lib/stores/appStore';
  import { systemConfig, initGlobalConfig } from '$lib/stores/configStore';
  import BroadcastBanner from '$lib/components/BroadcastBanner.svelte';
  import { Toaster } from 'svelte-sonner';

  let { children } = $props();
  let maintenanceMode = $derived($systemConfig.maintenanceMode);

  if (typeof window !== 'undefined') {
    initAuth();
    initGlobalConfig();
  }

  import { dev } from '$app/environment';

  // Admin access logic with local bypass for Antigravity/Development
  // In dev: bypass only applies when visiting /admin, so maintenance CAN be tested on other routes
  const isAdmin = $derived(
    (dev && $user && $page.url.pathname.startsWith('/admin')) || // Dev bypass only on /admin
    ($user?.isAdmin === true)
  );
  const isMaintenanceExempt = $derived(
    ['/admin', '/login', '/maintenance', '/api/auth', '/api/stripe'].some(path => $page.url.pathname.startsWith(path)) || 
    ['/', '/pricing', '/legal'].includes($page.url.pathname)
  );

  let isRedirecting = false;

  // Guard de Navegación Centralizado (Svelte 5 Runes)
  $effect(() => {
    if (!$authInitialized || (typeof window === 'undefined') || $loading || isRedirecting) return;

    // Lógica de Redirección Robusta
    const currentPath = $page.url.pathname as string;
    const isProtected = currentPath.startsWith('/panel') || currentPath.startsWith('/admin');
    const isPublicOnly = currentPath === '/login' || currentPath === '/';

    if ($user && isPublicOnly) {
      isRedirecting = true;
      goto('/panel', { replaceState: true, noScroll: true }).finally(() => isRedirecting = false);
    } else if (!$user && isProtected) {
      isRedirecting = true;
      const redirectParam = currentPath !== '/panel' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
      goto(`/login${redirectParam}`, { replaceState: true, noScroll: true }).finally(() => isRedirecting = false);
    }
  });
</script>

{#if $page.url.pathname !== '/'}
  <BroadcastBanner />
{/if}

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
          <div class="absolute -inset-4 bg-primary-500/20 rounded-none blur-xl animate-pulse"></div>
          <LoadingSpinner size="w-16 h-16" color="text-primary-500" />
        </div>
        <p class="text-surface-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">{$t('common.initializing')}</p>
      </div>
    </div>
  {:else if maintenanceMode && !isAdmin && !isMaintenanceExempt}
    <div class="fixed inset-0 flex items-center justify-center bg-[#070709] z-[100] p-6 overflow-hidden">
      <!-- Minimalist Background -->
      <div class="absolute inset-0">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070709_80%)]"></div>
      </div>

      <div class="max-w-xl w-full text-center space-y-8 relative" in:fade={{ duration: 800 }}>
        <!-- Central Icon -->
        <div class="relative inline-block">
          <div class="w-24 h-24 md:w-32 md:h-32 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl relative group">
            <div class="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent rounded-3xl"></div>
            <div class="relative z-10">
              <Horse class="w-12 h-12 md:w-16 md:h-16 text-violet-400 filter drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))" weight="fill" />
            </div>
            <!-- Pulse Effect -->
            <div class="absolute -inset-1 border border-violet-500/20 rounded-3xl animate-pulse"></div>
          </div>
        </div>

        <div class="space-y-4">
          <h1 class="text-4xl md:text-6xl font-outfit font-black tracking-widest text-white uppercase italic">
            ChessNet <span class="text-violet-500">2.0</span>
          </h1>
          <div class="h-px w-24 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent mx-auto"></div>
          <p class="text-slate-400 text-lg md:text-xl font-outfit font-light leading-relaxed px-4">
            {$t('maintenance.description')}
          </p>
        </div>

        <!-- Status Indicator -->
        <div class="pt-12">
          <div class="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-md">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span class="text-[10px] text-slate-500 font-outfit font-black uppercase tracking-[0.3em]">
              {$t('maintenance.online')}
            </span>
          </div>
        </div>

        <!-- Footer Logo -->
        <div class="pt-16 opacity-20 grayscale scale-75 flex justify-center">
          <Logo size="w-16 h-16" iconSize="w-8 h-8" />
        </div>
      </div>
    </div>

  {:else}
    {@render children()}
  {/if}

  <ConfirmModal 
    show={!!$uiStore.confirmDialog}
    title={$uiStore.confirmDialog?.title || ''}
    message={$uiStore.confirmDialog?.message || ''}
    confirmText={$uiStore.confirmDialog?.confirmText}
    cancelText={$uiStore.confirmDialog?.cancelText}
    type={$uiStore.confirmDialog?.type}
    onConfirm={$uiStore.confirmDialog?.onConfirm}
    onCancel={$uiStore.confirmDialog?.onCancel || (() => uiStore.closeConfirm())}
  />
  <PromptModal />

  <Toaster position="top-right" expand={true} richColors theme="dark" />
  <CookieBanner />
</main>

