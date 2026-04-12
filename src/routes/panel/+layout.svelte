<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { LogOut, Settings, Home, Key, ChevronRight } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { appStore } from '$lib/stores/appStore';
  import { auth, signOut } from '$lib/firebase';
  import { onMount } from 'svelte';

  let { children } = $props();

  let isLoggingOut = $state(false);

  // Reactividad del store
  let teacherName = $derived($appStore?.settings?.teacherName || auth.currentUser?.displayName || 'Profe de Ajedrez');
  let teacherAvatar = $derived($appStore?.settings?.teacherAvatar || auth.currentUser?.photoURL || null);
  let plan = $derived($appStore?.settings?.plan || 'free');
  let email = $derived(auth.currentUser?.email || 'profesor@chessnet.com');
  
  let currentRoute = $derived($page.url.pathname);

  // Breadcrumbs dinámicos idénticos a gh-pages
  let breadcrumbName = $derived.by(() => {
    let parts = currentRoute.replace('/panel', '').split('/').filter(e => e);
    if (parts.length === 0) return 'Resumen';
    
    const mappings: Record<string, string> = {
      'alumnos': 'Mis Alumnos',
      'torneos': 'Torneos',
      'pagos': 'Finanzas',
      'clases': 'Clases',
      'centros': 'Centros',
      'habilidades': 'Habilidades',
      'informes': 'Informes',
      'configuracion': 'Configuración',
      'logros': 'Logros'
    };
    
    return mappings[parts[0]] || parts[0];
  });

  let initials = $derived(teacherName.substring(0,2).toUpperCase());

  const handleLogout = async () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    try {
      await signOut();
      // También llamamos al endpoint de servidor para limpiar la sesión si existe
      await fetch('/logout', { method: 'POST' });
      goto('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      isLoggingOut = false;
    }
  };

  const handleGoHome = () => goto('/panel');

  // Desactivamos SSR para el panel para evitar problemas de hidratación con Firebase
  export const ssr = false;

  let isAuthInitialized = $state(auth.currentUser !== null);

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      isAuthInitialized = true;
      if (!user) {
        goto('/login');
      }
    });

    // Seguro de 3 segundos por si acaso
    const timeout = setTimeout(() => {
      isAuthInitialized = true;
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  });

</script>

<div class="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">
  <header class="fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800">
    <!-- El header se mantiene igual -->
    <div class="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between gap-4">
      <div class="flex items-center gap-6 min-w-0">
        
        <button onclick={handleGoHome} class="flex items-center gap-2 cursor-pointer focus:outline-none group" type="button">
          <div class="relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-200"></div>
            <Logo className="relative h-9 w-9" />
          </div>
          <span class="text-2xl font-black text-white tracking-tighter hidden sm:block font-display bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ChessNet</span>
        </button>
        
        <div class="hidden lg:flex h-6 w-px bg-slate-800"></div>
        
        <nav class="hidden lg:flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          <button onclick={handleGoHome} class="hover:text-emerald-400 transition-colors">
            <Home class="w-4 h-4" />
          </button>
          
          {#if breadcrumbName}
            <ChevronRight class="w-3 h-3 text-slate-700" />
            <span class="text-slate-300">{breadcrumbName}</span>
          {/if}
        </nav>
      </div>

      <div class="flex items-center gap-4">
        
        <div class="hidden md:flex items-center gap-2 bg-white/5 rounded-full py-1.5 px-4 border border-white/5 shadow-inner">
          <span class="text-[10px] uppercase font-black tracking-widest text-slate-600">Plan</span>
          <span class="text-xs text-white font-bold flex items-center gap-2">
            {#if plan === 'premium'}
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Maestro Premium
            {:else}
              <div class="w-1.5 h-1.5 rounded-full bg-slate-600"></div> Ajedrecista (Gratis)
            {/if}
          </span>
        </div>
        
        <div class="relative group">
          <button class="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-2xl transition-all border border-transparent hover:border-white/5 shadow-lg">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-xs ring-4 ring-emerald-500/10 shadow-xl overflow-hidden relative">
              {#if teacherAvatar}
                <img src={teacherAvatar} alt="Profile" class="w-full h-full object-cover" />
              {:else}
                {initials}
              {/if}
            </div>
            <div class="text-left hidden sm:block">
              <p class="text-sm font-bold text-white leading-tight font-display">{teacherName}</p>
              <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest">{plan}</p>
            </div>
          </button>
          
          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-3 w-64 bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-[100] translate-y-2 group-hover:translate-y-0">
            <div class="px-5 py-4 border-b border-white/5 bg-white/5 rounded-t-2xl">
              <p class="text-sm text-white font-black tracking-tight max-w-full truncate font-display">{teacherName}</p>
              <p class="text-[10px] text-slate-500 truncate font-mono">{email}</p>
            </div>
            <div class="p-2 space-y-1">
              <a href="/panel/configuracion" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                <Settings class="w-4 h-4" /> Configuración
              </a>
              {#if email === 'andreslgumuzio@gmail.com' || email === 'andrelgumuzio@gmail.com'}
                <a href="/admin" class="flex items-center gap-3 px-4 py-2.5 text-sm font-black text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 rounded-xl transition-all">
                  <Key class="w-4 h-4" /> Panel Administrativo
                </a>
              {/if}
            </div>
            
            <div class="p-2 mt-1 border-t border-white/5">
              <button onclick={handleLogout} class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500/70 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
                <LogOut class="w-4 h-4" /> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="pt-[72px] pb-6 min-h-screen overflow-x-hidden md:px-4">
    <div class="max-w-7xl mx-auto">
        {#if !isAuthInitialized}
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4" in:fade>
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
                <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Iniciando ChessNet Pro...</p>
            </div>
        {/if}
        
        <div class={isAuthInitialized ? 'block' : 'hidden'}>
            {@render children()}
        </div>
    </div>
  </main>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

  :global(body) {
    font-family: 'Inter', sans-serif;
  }

  .font-display {
    font-family: 'Outfit', sans-serif;
  }

  :global(h1, h2, h3, h4) {
    font-family: 'Outfit', sans-serif;
  }
</style>
