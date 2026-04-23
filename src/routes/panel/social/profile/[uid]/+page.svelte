<script lang="ts">
  import { page } from '$app/stores';
  import { appStore } from '$lib/stores/appStore';
  import PostCard from '$lib/components/social/PostCard.svelte';
  import { fade, fly } from 'svelte/transition';
  import { CaretLeft, IdentificationCard, ChartBar, Newspaper, Star, Heart } from 'phosphor-svelte';

  const uid = $derived($page.params.uid);
  
  let authorPosts = $derived($appStore.posts
    .filter(p => p.authorId === uid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  let authorInfo = $derived(authorPosts[0] || null);
  
  let totalReactions = $derived(authorPosts.reduce((acc, post) => {
    return acc + Object.values(post.reactions || {}).reduce((rAcc, r) => rAcc + r.length, 0);
  }, 0));
</script>

<svelte:head>
  <title>{authorInfo?.authorName || 'Perfil'} | Comunidad</title>
</svelte:head>

<div class="max-w-5xl mx-auto p-6 lg:p-12">
  <!-- Navigation -->
  <a href="/panel/social" class="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-12 group">
    <CaretLeft size={14} weight="bold" class="group-hover:-translate-x-1 transition-transform" />
    Volver al Feed Global
  </a>

  {#if authorPosts.length > 0}
    <!-- Profile Header -->
    <header class="mb-20 relative" in:fade>
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-violet-500/[0.03] blur-[120px] rounded-full"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-end">
        <!-- Avatar Area -->
        <div class="relative">
          <div class="w-40 h-40 bg-zinc-900 border border-white/10 p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
            {#if authorInfo.authorPhotoUrl}
              <img src={authorInfo.authorPhotoUrl} alt={authorInfo.authorName} class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            {:else}
              <div class="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-800">
                <IdentificationCard size={64} weight="thin" />
              </div>
            {/if}
          </div>
          <div class="absolute -bottom-3 -right-3 px-4 py-1 bg-violet-600 text-[10px] font-black text-white uppercase tracking-widest shadow-xl italic">
            Elite
          </div>
        </div>

        <div class="flex-1 text-center md:text-left pb-2">
          <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h1 class="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
              {authorInfo.authorName}
            </h1>
          </div>
          
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-10">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/5 border border-white/5 text-zinc-500">
                <Newspaper size={18} />
              </div>
              <div>
                <span class="block text-xl font-black text-white leading-none">{authorPosts.length}</span>
                <span class="text-[9px] text-zinc-600 uppercase tracking-widest font-black">Posts</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/5 border border-white/5 text-zinc-500">
                <Heart size={18} />
              </div>
              <div>
                <span class="block text-xl font-black text-white leading-none">{totalReactions}</span>
                <span class="text-[9px] text-zinc-600 uppercase tracking-widest font-black">Engagement</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/5 border border-white/5 text-zinc-500">
                <Star size={18} />
              </div>
              <div>
                <span class="block text-xl font-black text-white leading-none">12.4k</span>
                <span class="text-[9px] text-zinc-600 uppercase tracking-widest font-black">Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Activity Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-8 space-y-8">
        <div class="flex items-center gap-4 mb-8">
          <div class="h-[1px] flex-1 bg-white/5"></div>
          <h2 class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Journal de Actividad</h2>
          <div class="h-[1px] flex-1 bg-white/5"></div>
        </div>

        <div class="space-y-8">
          {#each authorPosts as post (post.id)}
            <div in:fly={{ y: 20, duration: 600 }}>
              <PostCard {post} />
            </div>
          {/each}
        </div>
      </div>

      <!-- Stats / About Sidebar -->
      <aside class="lg:col-span-4 space-y-8">
        <div class="pro-card p-8">
          <h3 class="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <ChartBar size={14} class="text-violet-500" />
            Rendimiento Social
          </h3>
          
          <div class="space-y-6">
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Impacto de Comunidad</span>
                <span class="text-[10px] font-black text-white">88%</span>
              </div>
              <div class="h-1 w-full bg-white/5 relative overflow-hidden">
                <div class="absolute inset-y-0 left-0 bg-violet-500" style="width: 88%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Calidad de Contenido</span>
                <span class="text-[10px] font-black text-white">94%</span>
              </div>
              <div class="h-1 w-full bg-white/5 relative overflow-hidden">
                <div class="absolute inset-y-0 left-0 bg-emerald-500" style="width: 94%"></div>
              </div>
            </div>
          </div>

          <div class="mt-10 pt-8 border-t border-white/5">
            <p class="text-[11px] text-zinc-500 italic leading-relaxed uppercase tracking-wider font-medium">
              "La constancia en el análisis es el camino hacia la maestría."
            </p>
          </div>
        </div>
      </aside>
    </div>
  {:else}
    <div class="py-40 text-center border border-dashed border-white/5 bg-white/[0.01]" in:fade>
      <div class="mb-6 inline-flex p-4 bg-white/5 rounded-full text-zinc-700">
        <IdentificationCard size={48} weight="thin" />
      </div>
      <p class="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em]">Protocolo: No se detectó actividad para el ID especificado</p>
      <a href="/panel/social" class="mt-8 inline-block px-8 py-3 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all">
        Volver al Panel
      </a>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    background-image: 
      radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.03) 0px, transparent 50%);
  }
</style>
