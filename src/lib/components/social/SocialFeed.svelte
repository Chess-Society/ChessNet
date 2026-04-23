<script lang="ts">
  import { appStore } from '$lib/stores/appStore';
  import type { SocialPost } from '$lib/types';
  import { socialApi } from '$lib/api/social';
  import { user } from '$lib/stores/auth';
  import PostCard from './PostCard.svelte';
  import PredictionCard from './PredictionCard.svelte';
  import ChessBoard from '../ChessBoard.svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { 
    Plus, Lightning, PaperPlaneTilt, 
    MagnifyingGlass, UserCircle, X, 
    Layout, Trophy, ChatCircleDots, Medal, Lock
  } from 'phosphor-svelte';
  import { toast } from '$lib/stores/toast';
  import HonorWall from './HonorWall.svelte';

  let loading = $derived(!$appStore.initialized);
  let activeTab = $state<'ALL' | 'CHALLENGES' | 'POSTS' | 'HONOR'>('ALL');

  // Quick Post State
  let isExpanded = $state(false);
  let postContent = $state('');
  let postTitle = $state('');
  let isSubmitting = $state(false);
  
  let detectedFen = $derived.by(() => {
    const fenRegex = /\b([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+( [bw] (-|K?Q?k?q?) (-|[a-h][36]) \d+ \d+)?\b/;
    const match = postContent.match(fenRegex);
    return match ? match[0] : null;
  });

  async function handleCreatePost() {
    if (!postContent.trim() || !$user) return;
    isSubmitting = true;
    try {
      await socialApi.createPost({
        authorId: $user.uid,
        authorName: $user.displayName || 'Anónimo',
        authorPhotoUrl: $user.photoURL || '',
        title: postTitle || 'Actualización de Estado',
        content: postContent,
        type: 'SCHOOL_UPDATE',
        fen: detectedFen || undefined,
        metadata: {
          authorColor: $appStore.settings?.economy?.activeColor,
          authorFrame: $appStore.settings?.economy?.activeFrame,
          authorFont: $appStore.settings?.economy?.activeFont,
          isPremium: $appStore.settings?.plan === 'premium'
        }
      });
      postContent = '';
      postTitle = '';
      isExpanded = false;
      toast.success("Publicado en el muro");
    } catch (e) {
      console.error("Error creating post:", e);
      toast.error("Error al publicar");
    } finally {
      isSubmitting = false;
    }
  }

  const filteredItems = $derived.by(() => {
    let combined = [
      ...$appStore.posts.map(p => ({ ...p, _sortType: 'POST' })),
      ...$appStore.markets.map(c => ({ ...c, _sortType: 'CHALLENGE', createdAt: c.createdAt }))
    ].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    if (activeTab === 'CHALLENGES') return combined.filter(i => i._sortType === 'CHALLENGE');
    if (activeTab === 'POSTS') return combined.filter(i => i._sortType === 'POST');
    return combined;
  });

  async function handleDeletePost(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        await socialApi.deletePost(id);
      } catch (e) {
        console.error("Error deleting post:", e);
      }
    }
  }

  const isSocialEnabled = $derived($appStore.schools[0]?.socialEnabled !== false);
</script>

<div class="social-feed-container max-w-[640px] mx-auto px-4 py-8 space-y-8">
  {#if !isSocialEnabled}
    <div class="locked-state p-12 text-center bg-zinc-950 border border-white/5" in:fade>
      <div class="w-16 h-16 bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-6">
        <Lock size={24} weight="bold" class="text-zinc-700" />
      </div>
      <h2 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-2">Social Desactivado</h2>
      <p class="text-[10px] text-zinc-500 uppercase font-bold tracking-widest max-w-xs mx-auto leading-relaxed">
        La dirección de la escuela ha pausado las funciones sociales temporalmente.
      </p>
    </div>
  {:else}
    <!-- Quick Post Box -->
    <div class="relative z-20">
      <div class="bg-zinc-950 border border-white/5 transition-all duration-300 {isExpanded ? 'p-6 border-violet-500/30 ring-4 ring-violet-500/5' : 'p-4'}">
        {#if !isExpanded}
          <button 
            onclick={() => isExpanded = true}
            class="w-full flex items-center gap-4 text-left group"
          >
            <div class="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-violet-400 group-hover:border-violet-500/20 transition-all">
              <Plus weight="bold" size={16} />
            </div>
            <span class="text-[11px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">Comparte una jugada, logro o idea...</span>
          </button>
        {:else}
          <div class="space-y-4" in:slide={{duration: 300}}>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 bg-violet-500"></div>
                <h3 class="text-[10px] font-black text-white uppercase tracking-[0.3em]">Nueva Publicación</h3>
              </div>
              <button onclick={() => isExpanded = false} class="text-zinc-600 hover:text-white transition-colors">
                <X size={16} weight="bold" />
              </button>
            </div>

            <div class="space-y-2">
              <input 
                type="text" 
                bind:value={postTitle}
                placeholder="TÍTULO DE LA PUBLICACIÓN"
                class="w-full bg-zinc-900/50 border-none py-2 px-3 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-zinc-700 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />

              <textarea 
                bind:value={postContent}
                placeholder="¿Qué está pasando en el tablero? Pega un FEN para invocar el motor..."
                class="w-full bg-transparent border-none py-3 px-3 text-sm font-medium text-zinc-300 placeholder:text-zinc-600 focus:ring-0 min-h-[120px] resize-none"
              ></textarea>
            </div>

            {#if detectedFen}
              <div class="p-6 bg-black border border-white/5 flex flex-col items-center gap-4" in:slide>
                <div class="text-[9px] font-black text-violet-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Lightning weight="fill" size={14} /> Engine_Detected
                </div>
                <ChessBoard 
                  position={detectedFen} 
                  interactive={false} 
                  size={200} 
                  showCoordinates={false}
                />
              </div>
            {/if}

            <div class="flex items-center justify-between pt-4 border-t border-white/5">
              <div class="flex items-center gap-3">
                <span class="text-[9px] font-mono text-zinc-700 font-bold uppercase">
                  {postContent.length} / 500
                </span>
              </div>
              
              <button 
                onclick={handleCreatePost}
                disabled={!postContent.trim() || isSubmitting}
                class="px-8 py-3 bg-white text-black hover:bg-violet-500 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3"
              >
                {isSubmitting ? 'ENVIANDO...' : 'PUBLICAR'}
                <PaperPlaneTilt weight="fill" size={14} />
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Feed Navigation -->
    <div class="feed-header sticky top-20 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-2">
      <div class="flex items-center justify-between">
        <div class="flex gap-1">
          {#each [
            { id: 'ALL', label: 'Feed', icon: Layout },
            { id: 'CHALLENGES', label: 'Retos', icon: Trophy },
            { id: 'POSTS', label: 'Muro', icon: ChatCircleDots },
            { id: 'HONOR', label: 'Honor', icon: Medal }
          ] as tab}
            {@const TabIcon = tab.icon}
            <button 
              class="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all {activeTab === tab.id ? 'text-white bg-white/5 border border-white/10' : 'text-zinc-600 hover:text-zinc-400'}"
              onclick={() => activeTab = tab.id as any}
            >
              <TabIcon size={14} weight={activeTab === tab.id ? "fill" : "bold"} />
              <span class="hidden sm:inline">{tab.label}</span>
              {#if tab.id === 'CHALLENGES' && $appStore.markets.length > 0}
                <span class="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
              {/if}
            </button>
          {/each}
        </div>

        <button class="p-2 text-zinc-600 hover:text-white transition-colors">
          <MagnifyingGlass size={18} weight="bold" />
        </button>
      </div>
    </div>

    <!-- Feed Content -->
    <div class="space-y-4">
      {#if activeTab === 'HONOR'}
        <div in:fade>
          <HonorWall />
        </div>
      {:else if loading}
        <div class="flex flex-col items-center justify-center py-20 gap-4" in:fade>
          <div class="w-10 h-10 border-2 border-white/5 border-t-white animate-spin"></div>
          <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Sincronizando Muro...</p>
        </div>
      {:else if filteredItems.length === 0}
        <div class="py-20 text-center space-y-4 border border-dashed border-white/5" in:fade>
          <div class="text-3xl opacity-20">♟️</div>
          <div class="space-y-1">
            <h3 class="text-xs font-black text-white uppercase tracking-widest">El tablero está vacío</h3>
            <p class="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Sé el primero en compartir un logro o crear un reto.</p>
          </div>
        </div>
      {:else}
        <div class="space-y-4">
          {#each filteredItems as item (item.id)}
            <div in:fly={{ y: 20, duration: 400 }} class="feed-item">
              {#if item._sortType === 'POST'}
                <PostCard post={item as any} onDelete={handleDeletePost} />
              {:else}
                <PredictionCard market={item as any} />
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :global(.menu-open) {
    overflow: hidden;
  }

  .feed-item {
    transition: transform 0.2s ease;
  }

  .feed-item:active {
    transform: scale(0.995);
  }
</style>

