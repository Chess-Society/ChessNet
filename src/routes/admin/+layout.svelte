<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fade, slide, fly } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { adminStore, isAdminLoading } from '$lib/stores/adminStore';
  import { systemConfig } from '$lib/stores/configStore';
  
  // Icons
  import { 
    SquaresFour, 
    Users, 
    ArrowArcLeft,
    X,
    ListDashes,
    Globe,
    Warning,
    Ticket,
    List,
    Buildings
  } from 'phosphor-svelte';

  // Components
  import UpdatePill from '$lib/components/common/UpdatePill.svelte';

  let { children } = $props();

  let isSidebarOpen = $state(false);
  let activeTab = $derived($page.url.pathname.split('/').pop() || 'dashboard');

  const navigationGroups = [
    {
      title: 'MONITOR',
      items: [
        { id: 'dashboard', label: 'Consola Central', icon: SquaresFour, path: '/admin/dashboard' },
        { id: 'system', label: 'Logs del Sistema', icon: ListDashes, path: '/admin/system' }
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { id: 'users', label: 'Usuarios', icon: Users, path: '/admin/users' },
        { id: 'changelog', label: 'Changelog', icon: List, path: '/admin/changelog' },
        { id: 'support', label: 'Soporte', icon: Ticket, path: '/admin/support' }
      ]
    },
    {
      title: 'COMUNICACIÓN',
      items: [
        { id: 'broadcast', label: 'Avisos Globales', icon: Globe, path: '/admin/broadcast' }
      ]
    },
    {
      title: 'MOTOR',
      items: [
        { id: 'danger', label: 'Zona Crítica', icon: Warning, path: '/admin/danger' }
      ]
    }
  ];

  onMount(() => {
    adminStore.init();
  });

  onDestroy(() => {
    adminStore.destroy();
  });
</script>

<div class="min-w-[320px] min-h-screen bg-[#02040a] text-white selection:bg-violet-500/30 font-sans flex flex-col lg:flex-row w-full overflow-x-hidden">
  <!-- Background Patterns (Fixed) -->
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.05)_0%,transparent_50%)]"></div>
    <div class="absolute inset-0 opacity-[0.03] grayscale invert" style="background-image: radial-gradient(#fff 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>
  </div>

  <!-- Desktop Sidebar -->
  <aside class="w-[280px] border-r border-white/5 hidden lg:flex flex-col bg-[#02040a]/80 backdrop-blur-3xl z-50 h-screen sticky top-0">
    <!-- Sidebar Header -->
    <div class="px-10 py-12">
      <button 
        type="button"
        class="w-full flex items-center gap-4 group cursor-pointer bg-transparent border-none p-0 text-left" 
        onclick={() => goto('/admin/dashboard')}
      >
        <div class="w-12 h-12 bg-white flex items-center justify-center transition-transform group-hover:scale-105">
          <SquaresFour weight="fill" size={24} class="text-black" />
        </div>
        <div>
          <h1 class="text-lg font-black font-display uppercase italic tracking-tighter text-white leading-none">ADMIN_OS</h1>
          <p class="text-[8px] font-mono font-black text-primary-500 uppercase tracking-widest mt-1 animate-pulse">SISTEMA_ACTIVO</p>
        </div>
      </button>
    </div>

    <!-- Navigation Groups -->
    <nav class="flex-1 px-8 space-y-12 overflow-y-auto custom-scrollbar pb-10">
      {#each navigationGroups as group}
        <div class="space-y-4">
          <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-[0.3em] px-4">{group.title}</p>
          <div class="space-y-1">
            {#each group.items as item}
              {@const Icon = item.icon}
              {@const isActive = activeTab === item.id}
              <a 
                href={item.path}
                class="w-full flex items-center gap-4 py-3.5 px-4 transition-all relative group/nav {isActive ? 'bg-primary-500/5 text-primary-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}"
              >
                {#if isActive}
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" transition:slide={{ axis: 'y' }}></div>
                {/if}
                <Icon weight={isActive ? 'fill' : 'bold'} size={18} />
                <span class="text-[10px] font-mono font-black uppercase tracking-[0.2em]">{item.label}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-8 border-t border-white/5 bg-black/20">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
        <span class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">SERVIDOR: OK_STABLE</span>
      </div>
      <button 
        onclick={() => window.location.href = '/panel'}
        class="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all"
      >
        SALIR_AL_PANEL
        <ArrowArcLeft weight="bold" size={14} />
      </button>
    </div>
  </aside>

  <!-- Mobile Header -->
  <header class="lg:hidden h-16 bg-[#02040a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-[60] w-full">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-white flex items-center justify-center">
        <SquaresFour weight="fill" size={18} class="text-black" />
      </div>
      <span class="text-xs font-mono font-black text-white uppercase tracking-widest">ADMIN_OS</span>
    </div>

    <div class="flex items-center gap-4">
      <button 
        onclick={() => window.location.href = '/panel'}
        class="h-10 px-4 bg-white/10 hover:bg-white text-white hover:text-black border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-2"
      >
        <ArrowArcLeft weight="bold" size={14} />
        PANEL
      </button>
      
      <button 
        onclick={() => isSidebarOpen = !isSidebarOpen}
        class="p-2 text-white hover:bg-white/5 transition-colors"
      >
        <List size={24} />
      </button>
    </div>
  </header>

  <!-- Mobile Navigation Drawer -->
  {#if isSidebarOpen}
    <div 
      class="fixed inset-0 z-[70] lg:hidden"
      transition:fade={{ duration: 200 }}
    >
      <button 
        type="button"
        class="absolute inset-0 bg-black/80 backdrop-blur-sm w-full h-full border-none cursor-default" 
        onclick={() => isSidebarOpen = false}
        aria-label="Cerrar navegación"
      ></button>
      <div 
        class="absolute left-0 top-0 bottom-0 w-[300px] bg-[#02040a] border-r border-white/10 flex flex-col shadow-2xl"
        transition:fly={{ x: -300, duration: 400, opacity: 1, easing: (t) => t }}
      >
        <!-- Drawer Header -->
        <div class="p-8 border-b border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-white flex items-center justify-center">
              <SquaresFour weight="fill" size={18} class="text-black" />
            </div>
            <span class="text-[10px] font-mono font-black text-white uppercase tracking-widest">ADMIN_MENU</span>
          </div>
          <button onclick={() => isSidebarOpen = false} class="text-slate-500 hover:text-white transition-colors">
            <X size={20} weight="bold" />
          </button>
        </div>

        <!-- Drawer Content -->
        <nav class="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {#each navigationGroups as group}
            <div class="space-y-4">
              <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-[0.3em]">{group.title}</p>
              <div class="space-y-1">
                {#each group.items as item}
                  {@const Icon = item.icon}
                  {@const isActive = activeTab === item.id}
                  <a 
                    href={item.path}
                    onclick={() => isSidebarOpen = false}
                    class="w-full flex items-center gap-4 py-3.5 px-4 transition-all relative {isActive ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}"
                  >
                    <Icon weight={isActive ? 'fill' : 'bold'} size={18} />
                    <span class="text-[10px] font-mono font-black uppercase tracking-widest">{item.label}</span>
                  </a>
                {/each}
              </div>
            </div>
          {/each}
        </nav>

        <!-- Drawer Footer -->
        <div class="p-8 border-t border-white/5 bg-white/[0.02]">
          <button 
            onclick={() => window.location.href = '/panel'}
            class="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-slate-400"
          >
            SALIR_AL_PANEL
            <ArrowArcLeft weight="bold" size={14} />
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Content Area -->
  <main class="flex-1 p-6 sm:p-8 md:p-12 max-w-[1600px] mx-auto w-full relative pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-12 z-10">
    {#if $isAdminLoading}
      <div class="h-[60vh] flex items-center justify-center" in:fade>
        <div class="flex flex-col items-center gap-8">
           <div class="relative w-16 h-16">
             <div class="absolute inset-0 border-2 border-primary-500/20 rounded-none"></div>
             <div class="absolute inset-0 border-2 border-primary-500 border-t-transparent animate-spin rounded-none"></div>
           </div>
           <p class="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600 animate-pulse">{$t('admin.msg.loading_realtime')}</p>
        </div>
      </div>
    {:else}
      {@render children()}
    {/if}
  </main>

  <!-- Premium Mobile Navigation -->
  <div 
    class="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pb-[env(safe-area-inset-bottom)] bg-[#02040a]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
  >
    <div class="flex items-stretch h-20">
      {#each [
        { id: 'dashboard', icon: SquaresFour, label: 'Dash', path: '/admin/dashboard' },
        { id: 'users', icon: Users, label: 'User', path: '/admin/users' },
        { id: 'support', icon: Ticket, label: 'Sop', path: '/admin/support' },
        { id: 'exit', icon: ArrowArcLeft, label: 'Panel', path: '/panel' }
      ] as item}
        {@const Icon = item.icon}
        {@const isActive = activeTab === item.id}
        <a 
          href={item.path}
          class="flex-1 flex flex-col items-center justify-center gap-1.5 transition-all relative {isActive ? 'text-primary-400 bg-primary-500/5' : 'text-slate-600'}"
        >
          {#if isActive}
            <div class="absolute top-0 left-0 right-0 h-1 bg-primary-500" in:fade></div>
          {/if}
          
          <div class="relative">
            <Icon weight={isActive ? 'fill' : 'bold'} size={24} />
          </div>
          <span class="text-[8px] font-mono font-black uppercase tracking-widest">{item.label}</span>
        </a>
      {/each}
    </div>
  </div>

  <UpdatePill />
</div>

<style>
  :global(.custom-scrollbar::-webkit-scrollbar) {
    width: 2px;
  }
  :global(.custom-scrollbar::-webkit-scrollbar-track) {
    background: transparent;
  }
  :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
