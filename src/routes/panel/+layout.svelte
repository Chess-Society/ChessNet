<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { 
    SignOut, 
    GearSix, 
    House, 
    Key, 
    CaretRight, 
    Warning,
    Crown,
    UserCircle,
    CaretDown
  } from 'phosphor-svelte';
  import { fade } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { appStore } from '$lib/stores/appStore';
  import { t, locale } from '$lib/i18n';
  import { auth, signOut } from '$lib/firebase';
  import { onMount } from 'svelte';

  import { user as authUser, loading as authLoading } from '$lib/stores/auth';
  import type { LayoutData } from './$types';
  
  let { data, children } = $props<{ data: LayoutData, children: any }>();

  let isLoggingOut = $state(false);

  // Reactividad del store
  let teacherName = $derived($appStore?.settings?.teacherName || $authUser?.displayName || ($authLoading ? '...' : 'User'));
  let teacherAvatar = $derived($appStore?.settings?.teacherAvatar || $authUser?.photoURL || null);
  let plan = $derived(data.isAdmin ? 'premium' : ($appStore?.settings?.plan || 'free'));
  let email = $derived($authUser?.email || '');
  
  let currentRoute = $derived($page.url.pathname);

  // Impersonation state
  let isImpersonating = $derived(!!data.impersonateEmail);

  function stopImpersonating() {
    document.cookie = 'impersonate_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin';
  }

  // Breadcrumbs dinámicos simplificados
  let breadcrumbName = $derived.by(() => {
    let parts = currentRoute.replace('/panel', '').split('/').filter(e => e);
    if (parts.length === 0) return 'Overview';
    
    const mappings: Record<string, string> = {
      'students': 'Community',
      'tournaments': 'Competition',
      'payments': 'Payments',
      'classes': 'Classes',
      'schools': 'Centers',
      'skills': 'Skills',
      'reports': 'Reports',
      'settings': 'Settings',
      'achievements': 'Achievements'
    };
    
    return mappings[parts[0]] || parts[0];
  });

  let initials = $derived(teacherName.substring(0,2).toUpperCase());

  const handleLogout = async () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    try {
      await signOut();
      await fetch('/logout', { method: 'POST' });
      goto('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      isLoggingOut = false;
    }
  };

  const handleGoHome = () => goto('/panel');

  function toggleLocale() {
    locale.update(l => l === 'en' ? 'es' : 'en');
  }
</script>

<div class="min-h-screen bg-zinc-950 text-slate-300 font-jakarta selection:bg-violet-500/30">
  {#if isImpersonating}
    <div class="fixed top-0 inset-x-0 h-10 bg-red-600 z-[60] flex items-center justify-center gap-3 px-4 shadow-lg border-b border-white/10">
      <Warning weight="duotone" class="w-4 h-4 text-white" />
      <span class="text-[10px] font-outfit font-black text-white uppercase tracking-widest">Impersonation Mode Active</span>
      <button onclick={stopImpersonating} class="ml-4 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-[9px] font-bold text-white transition-all uppercase tracking-widest border border-white/10">
        Back to Admin
      </button>
    </div>
  {/if}

  <header class="fixed top-0 right-0 left-0 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 z-50 transition-all {isImpersonating ? 'mt-10' : ''}">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
      <div class="flex items-center gap-8 min-w-0">
        
        <button onclick={handleGoHome} class="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95" type="button">
          <Logo className="h-10 w-10 shadow-violet-flare/20" />
          <span class="text-2xl font-outfit font-extrabold text-white tracking-tighter hidden sm:block">ChessNet</span>
        </button>
        
        <nav class="hidden lg:flex items-center gap-3 text-slate-500">
          <div class="w-px h-10 bg-white/5 mx-2"></div>
          <button onclick={handleGoHome} class="hover:text-violet-400 transition-colors">
            <House weight="duotone" size={20} />
          </button>
          
          {#if breadcrumbName}
            <CaretRight weight="bold" size={14} class="text-white/10" />
            <span class="text-xs font-outfit font-bold text-white uppercase tracking-widest">{breadcrumbName}</span>
          {/if}
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <!-- Language Switcher -->
        <button 
          onclick={toggleLocale} 
          class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-outfit font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-white/20 transition-all sm:flex hidden"
        >
          {$locale}
        </button>
        
        <!-- Subscription Badge -->
        <div class="hidden md:flex items-center gap-2.5 bg-white/5 rounded-full py-2 px-4 border border-white/5 group hover:border-violet-500/20 transition-all">
          {#if plan === 'premium'}
            <Crown weight="duotone" size={16} class="text-violet-400 group-hover:scale-110 transition-transform" />
            <span class="text-[10px] font-outfit font-bold text-white uppercase tracking-widest">{$t('panel.premiumCoach')}</span>
          {:else}
            <div class="w-2 h-2 rounded-full bg-slate-600"></div>
            <span class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest">{$t('panel.freePlan')}</span>
          {/if}
        </div>
        
        <div class="relative group">
          <button class="flex items-center gap-3 hover:bg-white/5 p-1 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center text-white font-outfit font-extrabold text-sm ring-4 ring-violet-500/10 shadow-xl overflow-hidden relative shadow-violet-flare/10">
              {#if teacherAvatar}
                <img src={teacherAvatar} alt="Profile" class="w-full h-full object-cover" />
              {:else}
                {initials}
              {/if}
            </div>
            <div class="text-left hidden sm:block pr-1">
              <p class="text-sm font-outfit font-bold text-white leading-tight">{teacherName}</p>
              <div class="flex items-center gap-1.5 pt-0.5">
                <p class="text-[9px] text-slate-500 font-outfit font-black uppercase tracking-widest">Control Panel</p>
                <CaretDown weight="bold" size={10} class="text-slate-600 group-hover:text-violet-400 transition-colors" />
              </div>
            </div>
          </button>
          
          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-3 w-64 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-[100] translate-y-2 group-hover:translate-y-0">
            <div class="px-5 py-4 border-b border-white/5 bg-white/[0.02] mb-1">
              <p class="text-sm font-outfit font-bold text-white truncate mb-0.5">{teacherName}</p>
              <p class="text-[10px] font-jakarta font-medium text-slate-500 truncate">{email}</p>
            </div>
            
            <div class="p-2 space-y-1">
              <a href="/panel/settings" class="flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 rounded-xl transition-all group/item">
                <GearSix weight="duotone" size={18} class="group-hover/item:rotate-90 transition-transform duration-500" /> 
                {$t('nav.settings') || 'SETTINGS'}
              </a>
              {#if data.isAdmin}
                <a href="/admin" class="flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-primary-400 hover:bg-primary-500/10 rounded-xl transition-all">
                  <Key weight="duotone" size={18} /> 
                  ADMINISTRATION
                </a>
              {/if}
            </div>
            
            <div class="mx-2 mt-1 border-t border-white/5 pt-1">
              <button onclick={handleLogout} class="w-full flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-red-400/70 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
                <SignOut weight="duotone" size={18} /> 
                {$t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="pt-20 pb-6 min-h-screen">
    <div class="">
        {#if $authLoading}
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6" in:fade>
                <div class="relative">
                  <div class="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                  <div class="absolute inset-x-0 -bottom-12 flex justify-center">
                    <p class="text-slate-500 font-outfit font-black uppercase tracking-[0.3em] text-[10px] whitespace-nowrap">Verifying session</p>
                  </div>
                </div>
            </div>
        {/if}
        
        <div class={!$authLoading && $authUser ? 'block' : 'hidden'} in:fade={{ duration: 400 }}>
            {@render children()}
        </div>
    </div>
  </main>
</div>

<style lang="postcss">
  :global(body) {
    font-family: 'Plus Jakarta Sans', sans-serif;
    @apply bg-zinc-950 text-slate-400 antialiased;
  }

  :global(.font-outfit) {
    font-family: 'Outfit', sans-serif;
  }

  :global(.font-jakarta) {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* Bento specific global improvements */
  :global(.bento-card) {
    @apply bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-24 transition-all duration-300;
  }

  :global(.btn-pill) {
    @apply rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center;
  }

  :global(.shadow-violet-flare) {
    box-shadow: 0 0 30px -5px rgba(139, 92, 246, 0.25);
  }
</style>

