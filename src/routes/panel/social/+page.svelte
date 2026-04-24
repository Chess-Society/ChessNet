<script lang="ts">
  import { appStore } from '$lib/stores/appStore';
  import { t } from '$lib/i18n';
  import PostCard from '$lib/components/social/PostCard.svelte';
  import PostCreator from '$lib/components/social/PostCreator.svelte';
  import ChallengeCreator from '$lib/components/social/ChallengeCreator.svelte';
  import { Trophy, Plus } from 'phosphor-svelte';
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  let selectedType = $state('ALL');
  let searchQuery = $state('');
  let showChallengeCreator = $state(false);
  const isDirector = $derived($appStore.settings?.role === 'director' || $appStore.settings?.role === 'admin');

  // Sort and filter posts
  let sortedPosts = $derived([...$appStore.posts]
    .filter(post => {
      const matchesType = selectedType === 'ALL' || post.type === selectedType;
      const matchesSearch = !searchQuery || 
        (post.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
  );

  async function handleDeletePost(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        await appStore.removePost(id);
        // Toast is handled in appStore
      } catch (e) {
        console.error("Error deleting post:", e);
      }
    }
  }

  const categories = [
    { id: 'ALL', label: 'Todo' },
    { id: 'GAME_ANALYSIS', label: 'Análisis' },
    { id: 'EXERCISE', label: 'Ejercicios' },
    { id: 'ACHIEVEMENT', label: 'Logros' },
    { id: 'SCHOOL_UPDATE', label: 'Escuelas' }
  ];
</script>

<svelte:head>
  <title>Comunidad | ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-black text-white selection:bg-violet-500 selection:text-white pb-32 relative overflow-hidden">
  <!-- Scanline effect -->
  <div class="fixed inset-0 scanline-overlay opacity-[0.03] pointer-events-none"></div>

  <div class="max-w-7xl mx-auto px-6 pt-12 relative z-10">
  <!-- Header Section -->
  <header class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8" in:fade={{ duration: 800 }}>
    <div class="relative">
      <div class="flex items-center gap-3 mb-4">
        <span class="px-3 py-1 bg-violet-600 text-[11px] font-black text-white uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(139,92,246,0.3)]">SISTEMA SOCIAL</span>
        <div class="h-[1px] w-24 bg-white/10"></div>
      </div>
      <h1 class="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
        MURO <span class="text-violet-500">SOCIAL</span>
      </h1>
      <p class="text-zinc-500 text-sm mt-6 max-w-xl font-medium leading-relaxed">
        Comparte conocimientos, posiciones tácticas y análisis con la comunidad de profesores de <span class="text-white">ChessNet</span>. Un espacio para el crecimiento profesional colectivo.
      </p>
    </div>
    
    <div class="flex items-center gap-6">
      <div class="text-right border-r border-white/5 pr-6">
        <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Actividad Global</span>
        <div class="flex items-baseline gap-2 justify-end">
          <span class="text-3xl font-black text-white">{$appStore.posts.length}</span>
          <span class="text-[10px] font-black uppercase text-violet-500/70 tracking-widest">PUBLICACIONES</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Filter & Search Bar -->
  <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-16" in:fade={{ delay: 400 }}>
    <!-- Segmented Control -->
    <div class="inline-flex bg-zinc-950 border border-white/5 p-1 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.02] pro-grid-bg pointer-events-none"></div>
      {#each categories as cat}
        <button 
          class="relative px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all z-10 {selectedType === cat.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}"
          onclick={() => selectedType = cat.id}
        >
          {#if selectedType === cat.id}
            <div 
              class="absolute inset-0 bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.3)] -z-10"
              transition:fade={{ duration: 200 }}
            ></div>
          {/if}
          {cat.label}
        </button>
      {/each}
    </div>

    <div class="relative flex-1 max-w-md group">
      <div class="absolute inset-0 bg-violet-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="FILTRAR_CONTENIDO_STREAM..."
        class="w-full bg-zinc-950 border border-white/10 px-12 py-4 text-[10px] font-mono font-black uppercase tracking-widest text-white placeholder:text-zinc-700 focus:border-violet-500/50 outline-none transition-all relative z-10"
      />
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Creator Section -->
  <section in:fly={{ y: 30, duration: 800, delay: 200 }}>
    <div class="flex flex-col md:flex-row gap-6 mb-8">
      <div class="flex-1">
        <PostCreator onComplete={() => { /* Opción para cerrar modal si lo hubiera */ }} />
      </div>
      
      {#if isDirector}
        <button 
          class="md:w-64 flex flex-col items-center justify-center gap-4 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all p-8 group relative overflow-hidden"
          onclick={() => showChallengeCreator = true}
        >
          <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={80} weight="fill" />
          </div>
          <div class="p-3 bg-amber-500 text-black rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Plus size={24} weight="bold" />
          </div>
          <div class="text-center">
            <span class="block text-[11px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">HERRAMIENTAS_DIRECTOR</span>
            <span class="block text-lg font-black text-white uppercase italic tracking-tighter">Lanzar Reto</span>
          </div>
        </button>
      {/if}
    </div>
  </section>

  {#if showChallengeCreator}
    <ChallengeCreator onClose={() => showChallengeCreator = false} />
  {/if}

  <!-- Feed Section -->
  <section class="space-y-8 mt-12">
    {#if sortedPosts.length === 0}
      <div class="flex flex-col items-center justify-center py-24 glass-card bg-zinc-950/20 border-dashed border-white/5" in:fade>
        <div class="w-20 h-20 bg-white/5 flex items-center justify-center mb-6 pro-grid-bg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">SIN ACTIVIDAD DETECTADA</p>
        <p class="text-zinc-700 text-[10px] uppercase tracking-widest mt-2">Inicia la conversación compartiendo la primera publicación</p>
      </div>
    {:else}
      {#each sortedPosts as post (post.id)}
        <div in:fly={{ y: 40, duration: 600 }} animate:flip={{ duration: 400 }}>
          <PostCard {post} onDelete={handleDeletePost} />
        </div>
      {/each}
    {/if}
  </section>
</div>
</div>

<style>
  :global(body) {
    background-image: 
      radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.03) 0px, transparent 50%);
  }
  .pro-grid-bg {
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .scanline-overlay {
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 0, 0, 0.2) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 50;
  }
</style>
