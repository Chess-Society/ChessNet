<script lang="ts">
  import Toast from '$lib/components/Toast.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import PromptModal from '$lib/components/PromptModal.svelte';
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
  import { ADMIN_EMAILS } from '$lib/constants';
  import { Settings, Crown, Trophy, ChevronRight } from 'lucide-svelte';
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
  const isAdmin = $derived(
    (dev && $user) || // Full access in local dev if logged in
    ($user?.email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes($user.email.toLowerCase()))
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
    <div class="fixed inset-0 flex items-center justify-center bg-[#070709] z-[100] p-4 md:p-10 overflow-hidden">
      <!-- Premium Background Architecture -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.18)_0%,transparent_70%)]"></div>
        <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(79,70,229,0.12)_0%,transparent_50%)]"></div>
        
        <!-- Chess Board Pattern Overlay -->
        <div class="absolute inset-0 opacity-[0.03] grayscale invert" style="background-image: repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%); background-size: 80px 80px;"></div>
        
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070709_100%)]"></div>
      </div>

      <div class="max-w-4xl w-full text-center space-y-12 relative" in:fade={{ duration: 1000 }}>
        <!-- Abstract Visual Core -->
        <div class="relative inline-flex flex-col items-center">
          <div class="absolute -inset-32 bg-violet-600/20 rounded-none blur-[140px] animate-pulse"></div>
          
          <div class="relative mb-8">
            <div class="w-32 h-32 md:w-44 md:h-44 bg-white/[0.015] backdrop-blur-3xl border border-white/10 rounded-none flex items-center justify-center shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)] border-b-violet-500/30 relative group overflow-visible">
               <div class="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-none"></div>
               
               <!-- Core Icon -->
               <div class="relative z-10 transition-transform duration-700 group-hover:scale-110">
                 <Crown class="w-16 h-16 md:w-20 md:h-20 text-violet-400 opacity-90 group-hover:opacity-100" strokeWidth={1.5} />
               </div>
               
               <!-- Orbital Synchronizer -->
               <div class="absolute -inset-4 border border-white/5 rounded-none animate-spin-slow opacity-20"></div>
               <div class="absolute -inset-8 border border-white/[0.02] rounded-none animate-spin-reverse-slow opacity-10"></div>
               
               <!-- Floating Particles -->
               <div class="absolute -top-4 -right-4 w-14 h-14 bg-[#0a0a0c] border border-white/10 rounded-none flex items-center justify-center shadow-2xl animate-float">
                  <div class="w-3 h-3 bg-violet-500 rounded-none animate-ping"></div>
               </div>
               <div class="absolute -bottom-2 -left-6 w-10 h-10 bg-[#0a0a0c] border border-white/5 rounded-none flex items-center justify-center shadow-2xl animate-float-delayed">
                  <LoadingSpinner size="w-5 h-5" color="text-indigo-400" />
               </div>
            </div>
          </div>

          <div class="space-y-4 md:space-y-8">
            <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-none mb-2">
                <span class="w-1.5 h-1.5 bg-violet-400 rounded-none animate-pulse shadow-[0_0_8px_rgba(167,139,250,0.8)]"></span>
                <span class="text-[10px] font-outfit font-black text-violet-300 uppercase tracking-[0.3em]">{$t('maintenance.subtitle')}</span>
            </div>
            <h1 class="text-6xl md:text-9xl font-outfit font-black tracking-tighter text-white uppercase italic leading-[0.85]">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-violet-500">ChessNet</span><br/>
              <span class="text-white opacity-95">2.0</span>
            </h1>
          </div>
        </div>

        <p class="text-slate-400 text-lg md:text-2xl font-outfit font-light max-w-2xl mx-auto leading-relaxed px-6">
          {$t('maintenance.description')}
        </p>

        <!-- Premium Status Bento Tiles -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto pt-4 px-6">
          {#each [
            { label: $t('maintenance.status.system'), value: $t('maintenance.status.syncing'), icon: Crown, delay: 0, color: 'text-violet-400' },
            { label: $t('maintenance.status.tournaments'), value: $t('maintenance.status.optimizing'), icon: Trophy, delay: 150, color: 'text-indigo-400' },
            { label: $t('maintenance.status.server'), value: $t('maintenance.status.stable'), icon: Settings, delay: 300, color: 'text-emerald-400' }
          ] as indicator}
             {@const Icon = indicator.icon}
             <div 
               class="p-6 md:p-8 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-none flex flex-col items-center gap-4 hover:bg-white/[0.05] hover:border-violet-500/20 transition-all group relative overflow-hidden"
               in:fly={{ y: 20, delay: indicator.delay, duration: 600 }}
             >
                <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon class="w-24 h-24" />
                </div>
                <div class="w-12 h-12 bg-black/40 rounded-none flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/5">
                  <Icon class="w-6 h-6 {indicator.color}" />
                </div>
                <div class="relative z-10 text-center">
                    <p class="text-[9px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1.5">{indicator.label}</p>
                    <p class="text-xs font-bold text-white uppercase tracking-tight">{indicator.value}</p>
                </div>
             </div>
          {/each}
        </div>

        <!-- Progress Indicator -->
        <div class="max-w-xs mx-auto pt-6 flex flex-col items-center gap-4">
            <div class="w-full h-1 bg-white/5 rounded-none overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 animate-shimmer scale-x-[0.6] origin-left"></div>
            </div>
            <p class="text-[10px] text-slate-600 font-outfit font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                Progress <ChevronRight class="w-3 h-3" /> 84%
            </p>
        </div>
      </div>
    </div>

  {:else}
    {@render children()}
  {/if}

  <ConfirmModal />
  <PromptModal />
  <Toast />
  <Toaster position="top-right" expand={true} richColors theme="dark" />
  <CookieBanner />
</main>

