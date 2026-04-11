<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { 
    LogOut, 
    User, 
    ChevronDown, 
    LayoutDashboard, 
    School, 
    Users, 
    GraduationCap, 
    Trophy, 
    Target,
    Bell,
    Settings,
    Menu,
    X,
    Search,
    CheckCircle,
    DollarSign,
    Zap,
    Sparkles,
    Shield
  } from 'lucide-svelte';
  import type { LayoutData } from './$types';
  import { fade, slide, fly, scale } from 'svelte/transition';

  let { data, children } = $props<{ data: LayoutData, children: import('svelte').Snippet }>();

  let isLoggingOut = $state(false);
  let isMobileMenuOpen = $state(false);

  let user = $derived(data.user);
  let currentRoute = $derived($page.url.pathname);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    try {
      const response = await fetch('/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const result = await response.json();
      if (result.success) goto('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      isLoggingOut = false;
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/schools', label: 'Sedes Académicas', icon: School },
    { href: '/classes', label: 'Programas', icon: GraduationCap },
    { href: '/students', label: 'Estudiantes', icon: Users },
    { href: '/attendance', label: 'Asistencia', icon: CheckCircle },
    { href: '/payments', label: 'Finanzas', icon: DollarSign },
    { href: '/skills', label: 'Habilidades', icon: Target },
    { href: '/tournaments', label: 'Torneos', icon: Trophy },
    { href: '/reports', label: 'Análisis', icon: Zap },
  ];

  const toggleMobileMenu = () => isMobileMenuOpen = !isMobileMenuOpen;
</script>

<div class="min-h-screen bg-surface-950 flex flex-col lg:flex-row selection:bg-primary-500/30">
  <!-- Desktop Sidebar -->
  <aside class="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-surface-950 border-r border-surface-900 z-50">
    <!-- Logo Area -->
    <div class="p-8">
      <div class="flex items-center gap-4">
        <div class="w-11 h-11 bg-primary-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <Trophy class="text-black w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-black text-white tracking-tighter uppercase leading-none">ChessNet</h1>
          <p class="text-[9px] text-primary-400 font-black uppercase tracking-[0.2em] mt-1.5 opacity-80">System Core</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto no-scrollbar">
       <p class="px-4 text-[9px] font-black text-surface-600 uppercase tracking-[0.3em] mb-4">Administración</p>
      {#each navItems as item}
        {@const Icon = item.icon as any}
        <a 
          href={item.href} 
          aria-current={currentRoute.startsWith(item.href) ? 'page' : undefined}
          class="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group {currentRoute.startsWith(item.href) ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5' : 'text-surface-500 hover:text-white hover:bg-surface-900 border border-transparent'}"
        >
          <Icon class="w-4 h-4 transition-transform group-hover:scale-110" />
          {item.label}
          {#if currentRoute.startsWith(item.href)}
             <div class="ml-auto w-1 h-1 bg-primary-500 rounded-full"></div>
          {/if}
        </a>
      {/each}
    </nav>

    <!-- User Profile Area -->
    <div class="p-6 mt-auto border-t border-surface-900">
      <div class="glass-panel p-4 rounded-3xl flex items-center gap-4">
        <div class="relative">
           <div class="w-10 h-10 rounded-2xl bg-surface-950 border border-surface-800 flex items-center justify-center overflow-hidden">
             <User class="w-5 h-5 text-primary-400" />
           </div>
           <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 border-2 border-surface-950 rounded-full flex items-center justify-center">
              <Shield class="w-2 h-2 text-black" />
           </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-black text-white truncate uppercase tracking-tight">{user?.email?.split('@')[0] || 'ADMINISTRADOR'}</p>
          <p class="text-[8px] text-surface-600 font-black uppercase tracking-widest mt-0.5">Licencia Premium</p>
        </div>
        <button onclick={handleLogout} title="Cerrar Sesión" class="p-2 text-surface-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>

  <!-- Mobile Header -->
  <header class="lg:hidden h-16 bg-surface-950/80 backdrop-blur-xl border-b border-surface-900 flex items-center justify-between px-6 sticky top-0 z-50">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
         <Trophy class="text-black w-4 h-4" />
      </div>
      <span class="text-sm font-black text-white uppercase tracking-tighter">ChessNet</span>
    </div>
    <button onclick={toggleMobileMenu} class="p-2 text-surface-400 hover:text-white transition-colors">
      {#if isMobileMenuOpen} <X class="w-6 h-6" /> {:else} <Menu class="w-6 h-6" /> {/if}
    </button>
  </header>

  <!-- Mobile Nav Overlay -->
  {#if isMobileMenuOpen}
    <div 
      role="button"
      tabindex="0"
      class="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
      onclick={toggleMobileMenu}
      onkeydown={(e) => e.key === 'Enter' && toggleMobileMenu()}
      transition:fade
    ></div>
    <div 
      class="fixed left-0 top-16 bottom-0 w-72 bg-surface-950 z-50 lg:hidden p-6 border-r border-surface-900"
      transition:fly={{ x: -100, duration: 300 }}
    >
      <nav class="space-y-2">
        {#each navItems as item}
          {@const Icon = item.icon as any}
          <a 
            href={item.href} 
            class="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all {currentRoute.startsWith(item.href) ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-surface-500 hover:text-white'}"
            onclick={() => isMobileMenuOpen = false}
          >
            <Icon class="w-4 h-4" />
            {item.label}
          </a>
        {/each}
        <div class="pt-6 border-t border-surface-900 mt-6">
           <button onclick={handleLogout} class="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 w-full transition-all">
            <LogOut class="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </div>
  {/if}

  <!-- Main Content Wrapper -->
  <main class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
    <!-- Top Bar -->
    <header class="hidden lg:flex h-20 items-center justify-between px-10 bg-surface-950 border-b border-surface-900/50 z-10 transition-all">
      <div class="relative w-96 group">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors" />
        <input 
          type="text" 
          placeholder="EXPLORAR SISTEMA..." 
          class="bg-surface-950 border border-surface-900 rounded-2xl pl-12 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest w-full focus:border-primary-500/50 transition-all outline-none text-white placeholder:text-surface-800"
        />
      </div>

      <div class="flex items-center gap-8">
        <div class="flex items-center gap-6 pr-8 border-r border-surface-900">
           <button class="relative p-2.5 text-surface-500 hover:text-white transition-all hover:scale-110">
             <Bell class="w-5 h-5" />
             <span class="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-surface-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
           </button>
           <button class="p-2.5 text-surface-500 hover:text-white transition-all hover:scale-110">
             <Settings class="w-5 h-5" />
           </button>
        </div>
        
        <div class="flex items-center gap-4">
           <div class="text-right hidden xl:block">
              <p class="text-[10px] font-black text-white uppercase leading-none">Status: Online</p>
              <p class="text-[8px] font-black text-primary-500 uppercase tracking-widest mt-1">HIVE NETWORK</p>
           </div>
           <div class="w-10 h-10 bg-surface-900 border border-surface-800 rounded-xl flex items-center justify-center">
              <Zap class="w-5 h-5 text-yellow-400 fill-yellow-400/10" />
           </div>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar">
      <div class="max-w-screen-2xl mx-auto p-8 lg:p-12">
        {@render children()}
      </div>
    </div>
  </main>
</div>

<style lang="postcss">
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
