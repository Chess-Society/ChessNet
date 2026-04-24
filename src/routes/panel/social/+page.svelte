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

<div class="max-w-5xl mx-auto p-6 lg:p-12">
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
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12" in:fade={{ delay: 400 }}>
    <div class="flex flex-wrap gap-2">
      {#each categories as cat}
        <button 
          class="px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border {selectedType === cat.id ? 'bg-violet-600 text-white border-violet-500' : 'bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10'}"
          onclick={() => selectedType = cat.id}
        >
          {cat.label}
        </button>
      {/each}
    </div>

    <div class="relative flex-1 max-w-md">
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="Buscar en el feed..."
        class="w-full bg-zinc-950/50 border border-white/10 px-10 py-3 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500/50 outline-none transition-all"
      />
      <div class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
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

<style>
  :global(body) {
    background-image: 
      radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.03) 0px, transparent 50%);
  }
</style>
