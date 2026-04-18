<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { signInWithGoogle } from '$lib/firebase';
  import Logo from '$lib/components/Logo.svelte';
  import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-svelte';
  import { devLogin } from '$lib/stores/auth';
  import { dev } from '$app/environment';
  import { fade } from 'svelte/transition';
  import { t } from '$lib/i18n';

  let isLoggingIn = $state(false);
  let errorMessage = $state('');
  let successMessage = $state(false);
  
  const isDev = dev;

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
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken })
          });
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
    if (isLoggingIn) return;
    isLoggingIn = true;
    try {
      await devLogin();
      successMessage = true;
      setTimeout(() => {
        goto('/panel');
      }, 1200);
    } catch (err) {
      errorMessage = $t('auth.error.dev');
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
    <div class="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-primary-500/15 rounded-full blur-[140px] animate-pulse"></div>
    <div class="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
    
    <!-- Abstract subtle grid instead of noise -->
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(var(--primary-500) 1px, transparent 1px), linear-gradient(90deg, var(--primary-500) 1px, transparent 1px); background-size: 50px 50px;"></div>
  </div>

  {#if successMessage}
    <div class="absolute inset-0 bg-[#09090b]/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-center text-white text-center" transition:fade>
      <div class="relative mb-6">
        <div class="absolute -inset-4 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
        <div class="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center shadow-2xl shadow-primary-500/50">
          <CheckCircle2 class="w-10 h-10 text-white" />
        </div>
      </div>
      <h2 class="text-3xl font-display font-black tracking-tighter">{$t('auth.welcome_back')}</h2>
      <p class="text-primary-400 font-medium mt-2 animate-pulse uppercase tracking-widest text-xs">{$t('auth.preparing_panel')}</p>
    </div>
  {/if}

  <div class="w-full max-w-md relative z-10 flex flex-col gap-8" in:fade={{ duration: 800 }}>
    
    <div class="text-center">
      <div class="inline-flex items-center gap-3 transition-transform hover:scale-105 group mb-4">
        <div class="relative">
          <div class="absolute -inset-2 bg-primary-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <Logo size="w-16 h-16" iconSize="w-10 h-10" />
        </div>
      </div>
      <h1 class="text-4xl font-display font-black tracking-tighter text-white uppercase italic">
        Chess<span class="text-primary-500">Net</span>
      </h1>
      <p class="text-surface-400 text-sm mt-1 font-medium tracking-wide">{$t('auth.login_subtitle')}</p>
    </div>

    <div class="bento-card !p-0 overflow-hidden shadow-2xl shadow-black/50 border-white/10 bg-[#121214]/60 backdrop-blur-xl">
      <div class="p-10">
        <div class="text-center mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles class="w-3 h-3" />
            <span>{$t('auth.secure_access')}</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">{$t('auth.login_title')}</h2>
        </div>

        {#if errorMessage}
          <div class="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-3 mb-6 animate-shake">
            <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span>{errorMessage}</span>
          </div>
        {/if}

        <div class="space-y-4">
          <button 
            onclick={handleGoogleSignIn}
            disabled={isLoggingIn}
            class="group relative w-full h-16 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-primary-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div class="relative flex items-center justify-center gap-3">
              {#if isLoggingIn && !successMessage}
                <div class="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
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

          {#if isDev}
            <div class="pt-6">
              <div class="relative mb-6">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/5"></div></div>
                <div class="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-bold">
                  <span class="bg-[#121214] px-4 text-surface-500">{$t('auth.local_env')}</span>
                </div>
              </div>

              <button 
                onclick={handleDevLogin}
                disabled={isLoggingIn}
                class="w-full h-14 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 font-bold rounded-2xl border border-primary-500/30 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group active:scale-95"
              >
                 <div class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                 <span class="tracking-wide">{$t('auth.mock_access')}</span>
                 <ArrowLeft class="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 rotate-180 transition-all" />
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
      <span class="w-1 h-1 rounded-full bg-white/10"></span>
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
