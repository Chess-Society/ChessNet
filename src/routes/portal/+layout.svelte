<script lang="ts">
  import '../../app.css';
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import { page } from '$app/state';
  import { 
    SquaresFour, 
    Bell, 
    BookOpen, 
    User, 
    SignOut, 
    List, 
    X,
    ChatCircleDots,
    Trophy
  } from 'phosphor-svelte';
  import Logo from '$lib/components/Logo.svelte';
  import { auth } from '$lib/firebase';
  import { signOut } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let { children, data } = $props();
  
  let isMobileMenuOpen = $state(false);
  let scrolled = $state(false);

  const navigation = [
    { name: 'Dashboard', href: '/portal', icon: SquaresFour },
    { name: 'Comunicados', href: '/portal/announcements', icon: Bell },
    { name: 'Progreso', href: '/portal/progress', icon: Trophy },
    { name: 'Soporte', href: '/panel/support', icon: ChatCircleDots }
  ];

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleSignOut = async () => {
    await signOut(auth);
    // Delete session cookie
    await fetch('/api/auth/session', { method: 'DELETE' });
    goto('/login');
  };

</script>

<div class="min-h-screen bg-[#060608] text-zinc-100 font-sans selection:bg-blue-500/30">
  
  <!-- Ambient background -->
  <div class="fixed inset-0 pointer-events-none z-0">
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full"></div>
    <div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
  </div>

  <!-- Sidebar (Desktop) -->
  <aside class="fixed left-0 top-0 bottom-0 w-64 bg-zinc-950/50 border-r border-white/5 backdrop-blur-xl z-40 hidden lg:flex flex-col">
    <div class="p-8">
      <div class="flex items-center gap-3">
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
        <div>
          <h1 class="text-xl font-display font-black tracking-tighter uppercase italic">
            Chess<span class="text-blue-500">Net</span>
          </h1>
          <p class="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Family Portal</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-4 space-y-2 mt-4">
      {#each navigation as item}
        {@const active = page.url.pathname === item.href}
        <a 
          href={item.href}
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
            {active ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}"
        >
          <item.icon size={20} weight={active ? 'duotone' : 'regular'} class={active ? 'text-blue-400' : 'group-hover:scale-110 transition-transform'} />
          <span class="text-sm font-bold tracking-tight uppercase">{item.name}</span>
          {#if active}
            <div class="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" in:fade></div>
          {/if}
        </a>
      {/each}
    </nav>

    <div class="p-4 border-t border-white/5 bg-black/20">
      <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/50 border border-white/5 mb-4">
        <div class="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
          {#if data.user?.picture}
            <img src={data.user.picture} alt={data.user.name} class="w-full h-full object-cover" />
          {:else}
            <User size={20} class="text-zinc-500" />
          {/if}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-white truncate">{data.user?.name || 'Parent'}</p>
          <p class="text-[9px] font-black text-zinc-500 uppercase tracking-wider truncate">Familia ChessNet</p>
        </div>
      </div>
      
      <button 
        onclick={handleSignOut}
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
      >
        <SignOut size={20} class="group-hover:translate-x-1 transition-transform" />
        <span class="text-sm font-bold tracking-tight uppercase">Cerrar Sesión</span>
      </button>
    </div>
  </aside>

  <!-- Mobile Header -->
  <header class="fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 {scrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5' : ''}">
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-2">
        <Logo size="w-8 h-8" iconSize="w-5 h-5" />
        <h1 class="text-lg font-display font-black tracking-tighter uppercase italic">
          Chess<span class="text-blue-500">Net</span>
        </h1>
      </div>
      <button 
        onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
        class="p-2 text-zinc-400 hover:text-white"
      >
        {#if isMobileMenuOpen}
          <X size={24} />
        {:else}
          <List size={24} />
        {/if}
      </button>
    </div>
  </header>

  <!-- Mobile Menu Overlay -->
  {#if isMobileMenuOpen}
    <div 
      class="fixed inset-0 z-40 bg-zinc-950 lg:hidden pt-20 flex flex-col"
      transition:fade={{ duration: 200 }}
    >
      <nav class="flex-1 px-6 space-y-4 pt-10">
        {#each navigation as item}
          <a 
            href={item.href}
            onclick={() => isMobileMenuOpen = false}
            class="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-white/5"
          >
            <item.icon size={24} class="text-blue-400" />
            <span class="text-lg font-bold uppercase tracking-tight">{item.name}</span>
          </a>
        {/each}
      </nav>
      <div class="p-8 border-t border-white/5">
        <button 
          onclick={handleSignOut}
          class="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase"
        >
          <SignOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  {/if}

  <!-- Main Content -->
  <main class="lg:pl-64 min-h-screen pt-20 lg:pt-0 relative z-10">
    <div class="max-w-7xl mx-auto p-6 lg:p-12">
      {@render children()}
    </div>
  </main>
</div>

<style>
  :global(body) {
    background-color: #060608;
  }
</style>
