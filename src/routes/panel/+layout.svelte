<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { LogOut, Settings, Home, Key } from 'lucide-svelte';
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

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // El appStore se inicializa automáticamente mediante su propio listener de Auth
      } else {
        goto('/login');
      }
    });
    return unsubscribe;
  });

</script>

<div class="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
  <header class="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 sm:gap-6 min-w-0 flex-1">
        
        <button onclick={handleGoHome} class="flex items-center gap-2 cursor-pointer focus:outline-none group" type="button">
          <Logo className="group-hover:border-emerald-500/50" />
          <span class="text-xl font-bold text-white tracking-tight hidden sm:block">ChessNet</span>
        </button>
        
        <div class="hidden lg:flex h-6 w-px bg-slate-700"></div>
        
        <nav class="hidden lg:flex items-center gap-2 text-sm text-slate-500">
          <button onclick={handleGoHome} class="hover:text-slate-300 transition-colors">
            <Home class="w-4 h-4 text-slate-700" />
          </button>
          
          {#if breadcrumbName}
            <svg class="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            <span class="capitalize text-slate-300 font-medium">{breadcrumbName}</span>
          {/if}
        </nav>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        
        <div class="flex items-center gap-1 sm:gap-2 bg-slate-900/50 rounded-lg py-1 px-3 border border-slate-700/50">
          <span class="text-[10px] uppercase font-bold text-slate-500 hidden sm:inline">Plan</span>
          <span class="text-xs text-white font-bold flex items-center gap-1.5">
            {#if plan === 'premium'}
              <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> Maestro Premium
            {:else}
              <div class="w-1.5 h-1.5 rounded-full bg-slate-500"></div> Ajedrecista (Gratis)
            {/if}
          </span>
        </div>
        
        <div class="relative group">
          <button class="flex items-center gap-2 sm:gap-3 hover:bg-slate-800 py-1.5 px-1.5 sm:pr-3 rounded-full transition-all border border-transparent hover:border-slate-700">
            <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-emerald-500/20 shadow-lg overflow-hidden relative">
              {#if teacherAvatar}
                <img src={teacherAvatar} alt="Profile" class="w-full h-full object-cover" />
              {:else}
                {initials}
              {/if}
            </div>
            <div class="text-left hidden sm:block">
              <p class="text-sm font-medium text-white">{teacherName}</p>
              <p class="text-xs text-slate-400 capitalize">{plan}</p>
            </div>
          </button>
          
          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50 translate-y-2 group-hover:translate-y-0">
            <div class="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50 rounded-t-xl">
              <p class="text-sm text-white font-bold max-w-full truncate">{teacherName}</p>
              <p class="text-xs text-slate-400 truncate">{email}</p>
            </div>
            <div class="py-1">
              <a href="/panel/configuracion" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <Settings class="w-4 h-4" /> Configuración
              </a>
              {#if email === 'andrelgumuzio@gmail.com'}
                <a href="/admin" class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-amber-400 hover:bg-slate-800 hover:text-amber-300 transition-colors">
                  <Key class="w-4 h-4" /> Panel Admin
                </a>
              {/if}
            </div>
            
            <div class="py-1 border-t border-slate-700/50">
              <button onclick={handleLogout} class="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                <LogOut class="w-4 h-4" /> Cerrar Sesión
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </header>

  <main class="py-6 min-h-[calc(100vh-64px)] overflow-x-hidden">
    {@render children()}
  </main>
</div>
