<script lang="ts">
  import { page } from '$app/stores';
  import { appStore } from '$lib/stores/appStore';
  import PostCard from '$lib/components/social/PostCard.svelte';
  import { fade, fly } from 'svelte/transition';
  import { CaretLeft, IdentificationCard, ChartBar, Newspaper } from 'phosphor-svelte';

  const uid = $page.params.uid;
  
  let authorPosts = $derived($appStore.posts
    .filter((n: any) => n.authorId === uid)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  let authorInfo = $derived(authorPosts[0] || null);
  
  let totalReactions = $derived(authorPosts.reduce((acc: number, post: any) => {
    return acc + Object.values(post.reactions || {}).reduce((rAcc: number, r: any) => rAcc + (Array.isArray(r) ? r.length : 0), 0);
  }, 0));
</script>

<svelte:head>
  <title>{authorInfo?.authorName || 'Perfil'} | Nets</title>
</svelte:head>

<div class="max-w-5xl mx-auto p-6 lg:p-12">
  <!-- Navigation -->
  <a href="/panel/nets" class="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-12">
    <CaretLeft size={14} weight="bold" />
    Volver al Feed Global
  </a>

  {#if authorInfo}
    <!-- Profile Header -->
    <header class="mb-16 glass-card p-10 relative overflow-hidden border-violet-500/20" in:fade>
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/5 blur-3xl rounded-full"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
        <div class="w-32 h-32 bg-zinc-900 border border-white/10 shadow-2xl relative">
          {#if authorInfo.authorPhotoUrl}
            <img src={authorInfo.authorPhotoUrl} alt={authorInfo.authorName} class="w-full h-full object-cover" />
          {:else}
            <div class="w-full h-full flex items-center justify-center text-zinc-700 font-black text-4xl">
              {authorInfo.authorName[0]}
            </div>
          {/if}
          <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 flex items-center justify-center shadow-lg">
            <IdentificationCard size={18} color="white" weight="bold" />
          </div>
        </div>

        <div class="flex-1 text-center md:text-left">
          <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
              {authorInfo.authorName}
            </h1>
            <div class="badge badge-primary bg-violet-600 border-none text-[9px] font-black uppercase tracking-widest px-4">
              Profesor Certificado
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8 mt-10 border-t border-white/5 pt-8">
            <div>
              <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Publicaciones</span>
              <div class="flex items-center gap-3">
                <Newspaper size={20} class="text-violet-500" />
                <span class="text-2xl font-black text-white">{authorPosts.length}</span>
              </div>
            </div>
            <div>
              <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Feedback Total</span>
              <div class="flex items-center gap-3">
                <ChartBar size={20} class="text-emerald-500" />
                <span class="text-2xl font-black text-white">{totalReactions}</span>
              </div>
            </div>
            <div class="col-span-2 md:col-span-1">
              <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Prestigio</span>
              <div class="h-2 w-full bg-white/5 mt-4 relative overflow-hidden">
                <div class="absolute inset-y-0 left-0 bg-violet-500/50" style="width: 65%"></div>
              </div>
              <span class="text-[9px] font-bold text-zinc-500 uppercase mt-2 block tracking-widest text-right">65% Tier Oro</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Author's Feed -->
    <div class="flex items-center gap-4 mb-8">
      <div class="h-[1px] flex-1 bg-white/5"></div>
      <h2 class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Actividad Reciente</h2>
      <div class="h-[1px] flex-1 bg-white/5"></div>
    </div>

    <div class="space-y-8">
      {#each authorPosts as post (post.id)}
        <div in:fly={{ y: 20, duration: 500 }}>
          <PostCard {post} />
        </div>
      {/each}
    </div>
  {:else}
    <div class="py-32 text-center" in:fade>
      <p class="text-zinc-600 font-black uppercase tracking-widest">No se encontró actividad para este usuario</p>
    </div>
  {/if}
</div>
