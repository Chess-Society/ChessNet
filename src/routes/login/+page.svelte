<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth, signInWithGoogle, signInAnonymously } from '$lib/firebase';
  import Logo from '$lib/components/Logo.svelte';
  import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { dev } from '$app/environment';

  let isLoggingIn = $state(false);
  let errorMessage = $state('');
  let successMessage = $state(false);

  const handleGoogleSignIn = async () => {
    if (isLoggingIn) return;
    
    isLoggingIn = true;
    errorMessage = '';
    
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        errorMessage = $t('auth.error.google');
        isLoggingIn = false;
        return;
      }
      
      if (user) {
        successMessage = true;
        
        try {
          const idToken = await user.getIdToken();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
            signal: controller.signal
          }).catch(() => {}).finally(() => clearTimeout(timeoutId));
        } catch (e) {
        }

        setTimeout(() => {
          goto('/panel');
        }, 1200);
      }
    } catch (err) {
      errorMessage = $t('auth.error.unexpected');
      isLoggingIn = false;
    }
  };

  const handleDevLogin = async () => {
    isLoggingIn = true;
    try {
      // Direct cookie-based bypass for local development
      // This matches the 'antigravity_access' check in src/lib/server/auth.ts
      document.cookie = "antigravity_access=antigravity-dev-secret; path=/; max-age=432000"; // 5 days
      
      successMessage = true;
      setTimeout(() => {
        goto('/panel');
      }, 800);
    } catch (e: any) {
      errorMessage = e.message;
      isLoggingIn = false;
    }
  };

</script>

<svelte:head>
  <title>{$t('auth.login_title')} - ChessNet Premium</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b] text-surface-200 font-sans flex items-center justify-center p-6 relative overflow-hidden">
  
  <!-- Premium Background Effects (No grain/noise) -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-primary-500/15 rounded-none blur-[140px] animate-pulse"></div>
    <div class="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-none blur-[120px]"></div>
    
    <!-- Abstract subtle grid instead of noise -->
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(var(--primary-500) 1px, transparent 1px), linear-gradient(90deg, var(--primary-500) 1px, transparent 1px); background-size: 50px 50px;"></div>
  </div>

  {#if successMessage}
    <div class="absolute inset-0 bg-[#09090b]/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center text-white text-center" transition:fade>
      <div class="relative mb-12">
        <div class="absolute -inset-10 bg-primary-500/20 rounded-none blur-[60px] animate-pulse"></div>
        <div class="w-24 h-24 bg-zinc-950 border-2 border-primary-500 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.3)] relative">
          <!-- Animated scanning line -->
          <div class="absolute inset-0 w-full h-0.5 bg-primary-500/50 shadow-[0_0_10px_#8b5cf6] animate-[scan_2s_ease-in-out_infinite]"></div>
          <Sparkles class="w-12 h-12 text-primary-400 animate-pulse" />
        </div>
      </div>
      
      <div class="space-y-6 max-w-xs w-full px-6">
        <div>
          <h2 class="text-3xl font-display font-black tracking-tighter uppercase italic">
            {$t('auth.welcome_back')}
          </h2>
          <div class="h-0.5 w-12 bg-primary-500 mx-auto mt-2"></div>
        </div>
        
        <div class="space-y-3">
          <div class="flex flex-col gap-2">
            <p class="text-primary-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
              {$t('auth.preparing_panel')}
            </p>
            <div class="h-1 w-full bg-zinc-900 border border-white/5 overflow-hidden">
              <div class="h-full bg-primary-500 animate-[loading-bar_1.5s_ease-in-out_infinite] shadow-[0_0_10px_#8b5cf6]" style="width: 40%"></div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-1">
            {#each ['auth_node_sync', 'academy_data_load', 'social_pulse_connect', 'ops_center_ready'] as step, i}
              <div class="flex items-center gap-3 py-1 opacity-40 animate-[step-in_0.5s_ease-out_forwards]" style="animation-delay: {i * 0.2}s">
                <div class="w-1.5 h-1.5 bg-primary-500/50"></div>
                <span class="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">{step.replace(/_/g, ' ')}</span>
                <span class="ml-auto text-[8px] font-black text-primary-500/40">OK</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <style lang="postcss">
    @keyframes scan {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(94px); }
    }
    @keyframes loading-bar {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    @keyframes step-in {
      from { transform: translateX(-10px); opacity: 0; }
      to { transform: translateX(0); opacity: 0.4; }
    }
  </style>

  <div class="w-full max-w-md relative z-10 flex flex-col gap-8" in:fade={{ duration: 800 }}>
    
    <div class="text-center">
      <div class="inline-flex items-center gap-3 transition-transform hover:scale-105 group mb-4">
        <div class="relative">
          <div class="absolute -inset-2 bg-primary-500/30 rounded-none blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <Logo size="w-16 h-16" iconSize="w-10 h-10" />
        </div>
      </div>
      <h1 class="text-4xl font-display font-black tracking-tighter text-white uppercase italic">
        Chess<span class="text-primary-500">Net</span>
      </h1>
      <p class="text-surface-400 text-sm mt-1 font-medium tracking-wide">Acceso para Profesores, Escuelas y Familias</p>
    </div>

    <div class="bento-card !p-0 overflow-hidden shadow-2xl shadow-black/50 border-white/10 bg-[#121214]/60 backdrop-blur-xl">
      <div class="p-10">
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles class="w-3 h-3" />
            <span>{$t('auth.secure_access')}</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">{$t('auth.login_title')}</h2>
        </div>

        {#if errorMessage}
          <div class="p-4 rounded-none bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-3 mb-6 animate-shake">
            <div class="w-1.5 h-1.5 rounded-none bg-red-500"></div>
            <span>{errorMessage}</span>
          </div>
        {/if}

        <div class="space-y-4">
          <button 
            onclick={handleGoogleSignIn}
            disabled={isLoggingIn}
            class="group relative w-full h-16 bg-white text-black font-bold rounded-none overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-primary-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div class="relative flex items-center justify-center gap-3">
              {#if isLoggingIn && !successMessage}
                <div class="w-5 h-5 border-2 border-black/30 border-t-black rounded-none animate-spin"></div>
              {:else}
                <svg class="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.38z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.81 2.94c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              {/if}
              <span>{$t('auth.google_button')}</span>
            </div>
          </button>

          {#if dev || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))}
            <div class="pt-6">
              <div class="flex items-center gap-4 mb-3">
                <div class="flex-1 h-px bg-white/5"></div>
                <span class="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Developer Access</span>
                <div class="flex-1 h-px bg-white/5"></div>
              </div>
              <button 
                onclick={handleDevLogin}
                class="w-full py-5 bg-zinc-900 hover:bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/5 flex items-center justify-center gap-3 active:scale-95 shadow-xl"
              >
                <div class="w-2 h-2 bg-violet-400"></div>
                <span>Antigravity Dev Login</span>
                <div class="w-2 h-2 bg-violet-400"></div>
              </button>
            </div>
          {/if}
        </div>

        <div class="mt-10 pt-8 border-t border-white/5">
          <p class="text-[10px] text-surface-600 font-bold uppercase tracking-[0.2em] text-center italic">
            {$t('auth.quote')}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center gap-6">
      <a href="/" class="flex items-center gap-2 text-surface-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {$t('auth.back_to_home')}
      </a>
      <span class="w-1 h-1 rounded-none bg-white/10"></span>
      <a href="/panel/support" class="text-surface-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
        {$t('auth.support')}
      </a>
    </div>
  </div>
</div>

<style lang="postcss">
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .animate-shake {
    animation: shake 0.2s ease-in-out 0s 2;
  }
</style>

