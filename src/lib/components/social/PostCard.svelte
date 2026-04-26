<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import { 
    Gift, Trash, User, ArrowSquareOut, Heart, 
    ChatTeardrop, DotsThreeVertical, Trophy, 
    Sword, Target, ChartLineUp, ShareNetwork,
    Rocket, Lightbulb, Question, WarningCircle, Skull, Shield
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import type { SocialPost } from '$lib/types/social';
  import { socialApi } from '$lib/api/social';
  import { economyApi } from '$lib/api/economy';
  import { user } from '$lib/stores/auth';
  import TipModal from './TipModal.svelte';
  import ReactionPicker from './ReactionPicker.svelte';
  import ChessBoard from '../ChessBoard.svelte';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { t } from '$lib/i18n';

  import { frameStyles, nameColorStyles, nameFontStyles } from '$lib/data/economy';

  interface Props {
    post: SocialPost;
    onDelete?: (id: string) => void;
    onEdit?: (post: SocialPost) => void;
  }
  
  let { post, onDelete, onEdit }: Props = $props();
  
  let showTipModal = $state(false);
  let isReacting = $state(false);
  let showReactions = $state(false);
  let reactionTimeout: any;

  const isAuthor = $derived($user?.uid === post.authorId);
  const isAdmin = $derived($appStore.settings?.role === 'admin');
  const userBalance = $derived($appStore.settings?.economy?.netsBalance || 0);
  
  const reactionConfig: Record<string, any> = {
    'brilliant': { icon: Rocket, color: 'text-cyan-400', label: '!!' },
    'great': { icon: Trophy, color: 'text-emerald-400', label: '!' },
    'interesting': { icon: Lightbulb, color: 'text-violet-400', label: '!?' },
    'dubious': { icon: Question, color: 'text-zinc-400', label: '?!' },
    'mistake': { icon: WarningCircle, color: 'text-amber-400', label: '?' },
    'blunder': { icon: Skull, color: 'text-red-400', label: '??' },
    'heart': { icon: Heart, color: 'text-rose-500', label: '' }
  };

  const activeReactions = $derived(
    Object.entries(post.reactions || {})
      .filter(([key, uids]) => uids.length > 0 && key !== 'heart')
      .map(([key, uids]) => ({ key, count: uids.length, ...reactionConfig[key] }))
  );

  const hasLiked = $derived(post.reactions?.['heart']?.includes($user?.uid || ''));
  const likeCount = $derived(post.reactions?.['heart']?.length || 0);

  async function handleReact(key: string) {
    if (!$user?.uid || isReacting || isAuthor) return;
    isReacting = true;
    showReactions = false;
    try {
      const hasReacted = post.reactions?.[key]?.includes($user.uid);
      if (hasReacted) {
        await socialApi.unreactFromPost(post.id, $user.uid, key);
      } else {
        await socialApi.reactToPost(post.id, $user.uid, key);
      }
    } catch (e) {
      console.error("Error reacting:", e);
    } finally {
      isReacting = false;
    }
  }

  async function handleTip(amount: number) {
    if (!$user?.uid) return;
    try {
      await economyApi.sendTip($user.uid, post.authorId, amount, post.id);
      showTipModal = false;
      toast.success(`¡Enviados ${amount} Nets!`);
    } catch (e) {
      console.error("Error sending tip:", e);
      toast.error("Error al enviar Nets");
    }
  }

  function formatDate(date: any) {
    if (!date) return '';
    const d = date?.toDate ? date.toDate() : (typeof date === 'string' ? new Date(date) : date);
    if (isNaN(d.getTime())) return '';

    // "WorldMonitor" Style: 24 ABR 2024 · 10:30
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    return `${day} ${month} ${year} · ${time}`;
  }

  function handleReactionMouseEnter() {
    clearTimeout(reactionTimeout);
    reactionTimeout = setTimeout(() => {
      showReactions = true;
    }, 200); // Faster reaction
  }

  function handleReactionMouseLeave() {
    clearTimeout(reactionTimeout);
    reactionTimeout = setTimeout(() => {
      showReactions = false;
    }, 400);
  }

  const isPremiumAuthor = $derived(
    post.metadata?.isPremium || 
    (post.authorId === $user?.uid && $appStore.settings?.plan === 'premium')
  );

  const authorNameColor = $derived(post.metadata?.authorColor || 'none');
  const authorFrame = $derived(post.metadata?.authorFrame || 'none');
  const authorFont = $derived(post.metadata?.authorFont || 'none');

  async function handleDelete() {
    if (!onDelete) return;
    const confirmed = await uiStore.confirm({
      title: 'ELIMINAR PUBLICACIÓN',
      message: '¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.',
      type: 'danger',
      confirmText: 'SÍ, ELIMINAR',
      cancelText: 'CANCELAR'
    });

    if (confirmed) {
      onDelete(post.id);
    }
  }

  async function handleAdminDelete() {
    if (!isAdmin || !onDelete) return;
    const confirmed = await uiStore.confirm({
      title: 'MODERACIÓN: ELIMINAR POST',
      message: '¿Estás seguro de que quieres eliminar esta publicación como administrador? Esta acción no se puede deshacer.',
      type: 'danger',
      confirmText: 'SÍ, ELIMINAR',
      cancelText: 'CANCELAR'
    });

    if (confirmed) {
      onDelete(post.id);
    }
  }

  async function handleToggleFeature() {
    if (!isAdmin) return;
    try {
      // Toggle the featured status
      await socialApi.toggleFeaturePost(post.id, !post.isFeatured);
      toast.success(post.isFeatured ? 'Post quitado de destacados' : 'Post destacado con éxito');
    } catch (e) {
      console.error("Error toggling feature:", e);
      toast.error("Error al modificar el estado del post");
    }
  }
</script>

<div 
  class="post-card group relative p-4 bg-zinc-950 border transition-all duration-300 {post.isFeatured ? 'border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.05)]' : 'border-white/5'}"
>
  {#if post.isFeatured}
    <div class="absolute -top-px -left-px px-2 py-0.5 bg-violet-600 text-[7px] font-black text-white uppercase tracking-[0.2em] z-10">
      POST_DESTACADO
    </div>
  {/if}
  
  <div class="flex gap-4">
    <!-- Left: Avatar Column -->
    <div class="flex flex-col items-center gap-2">
      <div class="w-12 h-12 bg-zinc-900 border border-white/10 overflow-hidden relative {frameStyles[authorFrame] || ''}">
        {#if post.authorPhotoUrl}
          <img src={post.authorPhotoUrl} alt={post.authorName} class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-zinc-700">
            <User size={24} weight="bold" />
          </div>
        {/if}
        
        {#if post.type === 'ACHIEVEMENT'}
          <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-600 text-white flex items-center justify-center border-2 border-zinc-950">
            <Trophy size={10} weight="fill" />
          </div>
        {/if}
      </div>
      <div class="w-0.5 flex-1 bg-gradient-to-b from-white/5 to-transparent"></div>
    </div>

    <!-- Right: Content Column -->
    <div class="flex-1 space-y-3 min-w-0">
      <!-- Header -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-[11px] font-black uppercase truncate {nameColorStyles[authorNameColor] || 'text-white'} {nameFontStyles[authorFont] || ''}">{post.authorName}</span>
            {#if isPremiumAuthor}
              <Rocket size={10} weight="fill" class="text-violet-400 flex-shrink-0" />
            {/if}
          </div>
          <span class="text-[9px] font-mono text-zinc-600 uppercase whitespace-nowrap">@{post.authorId.slice(0, 4)}</span>
          <span class="text-zinc-800">·</span>
          <span class="text-[9px] font-mono text-zinc-600 uppercase whitespace-nowrap">{formatDate(post.createdAt)}</span>
        </div>
        
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {#if isAdmin || isAuthor}
            <div class="flex items-center gap-1">
              {#if isAdmin}
                <button 
                  onclick={handleToggleFeature}
                  class="p-1.5 transition-colors flex items-center gap-1 {post.isFeatured ? 'text-violet-400' : 'text-zinc-700 hover:text-violet-400'}"
                  title="Destacar Post"
                >
                  <Trophy size={14} weight={post.isFeatured ? "fill" : "bold"} />
                </button>
              {/if}
              
              {#if isAuthor || isAdmin}
                <button 
                  onclick={() => onEdit?.(post)}
                  class="p-1.5 text-zinc-700 hover:text-white transition-colors"
                  title="Editar Publicación"
                >
                  <ArrowSquareOut size={14} weight="bold" />
                </button>
                <button 
                  onclick={isAdmin && !isAuthor ? handleAdminDelete : handleDelete}
                  class="p-1.5 text-zinc-700 hover:text-red-500 transition-colors"
                  title="Eliminar Publicación"
                >
                  <Trash size={14} />
                </button>
              {/if}
            </div>
          {/if}
          <button class="p-1.5 text-zinc-700 hover:text-white transition-colors">
            <DotsThreeVertical size={16} weight="bold" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="space-y-3">
        {#if post.title && post.title !== 'Sin título'}
          <h3 class="text-xs font-black text-white uppercase tracking-tight leading-tight">
            {post.title}
          </h3>
        {/if}
        
        <p class="text-xs text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap {nameFontStyles[authorFont] || ''}">
          {post.content}
        </p>

        {#if post.fen}
          <div class="p-4 bg-black border border-white/5 space-y-4">
             <div class="flex justify-center">
                <ChessBoard 
                  position={post.fen} 
                  interactive={false} 
                  size={240} 
                  showCoordinates={false}
                />
             </div>
             
             <div class="flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                <div class="flex flex-col gap-1">
                   <span class="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">DATOS_APERTURA</span>
                   <span class="text-[10px] font-black text-white uppercase tracking-wider">{post.metadata?.opening || 'Posición Personalizada'}</span>
                </div>
                
                {#if post.lichessUrl}
                  <a href={post.lichessUrl} target="_blank" class="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all flex items-center gap-2">
                    <ArrowSquareOut size={12} weight="bold" />
                    Analizar
                  </a>
                {/if}
             </div>
          </div>
        {/if}
      </div>

      <!-- Active Reactions Stack -->
      {#if activeReactions.length > 0}
        <div class="flex flex-wrap gap-1.5 py-1" in:fade>
          {#each activeReactions as react}
            {@const Icon = react.icon}
            <button 
              onclick={() => handleReact(react.key)}
              class="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all rounded-full"
            >
              <Icon size={12} weight="fill" class={react.color} />
              <span class="text-[9px] font-black text-white/60">{react.count}</span>
            </button>
          {/each}
        </div>
      {/if}

      <!-- Actions Footer -->
      <div class="flex items-center justify-between pt-2 border-t border-white/5">
        <div class="flex items-center gap-6 sm:gap-10">
          <!-- Like Action -->
          <button 
            onclick={() => handleReact('heart')}
            class="flex items-center gap-2 transition-all group/action active:scale-90"
            class:text-rose-500={hasLiked}
            class:text-zinc-600={!hasLiked}
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center group-hover/action:bg-rose-500/10 transition-all">
              <Heart size={18} weight={hasLiked ? "fill" : "bold"} class="transition-transform group-hover/action:scale-110" />
            </div>
            {#if likeCount > 0}
              <span class="text-[10px] font-black">{likeCount}</span>
            {/if}
          </button>

          <!-- Reactions Trigger (Hover/Click) -->
          <div 
            class="relative"
            role="none"
            onmouseenter={handleReactionMouseEnter}
            onmouseleave={handleReactionMouseLeave}
          >
            <button 
              onclick={(e) => {
                e.stopPropagation();
                showReactions = !showReactions;
              }}
              class="flex items-center gap-2 text-zinc-600 hover:text-cyan-400 transition-all group/action active:scale-90"
              class:text-cyan-400={showReactions}
            >
              <div class="w-8 h-8 rounded-full flex items-center justify-center group-hover/action:bg-cyan-500/10 transition-all">
                <Rocket size={18} weight={showReactions ? "fill" : "bold"} class="transition-transform group-hover/action:scale-110" />
              </div>
            </button>

            {#if showReactions}
              <ReactionPicker 
                onSelect={handleReact} 
                activeReactions={Object.keys(post.reactions || {}).filter(k => $user?.uid && post.reactions[k]?.includes($user.uid))}
                unlockedEmotes={$appStore.settings?.economy?.collection?.emotes || []}
              />
            {/if}
          </div>

          <!-- Reply (Visual only for now) -->
          <button class="flex items-center gap-2 text-zinc-600 hover:text-violet-400 transition-all group/action active:scale-90">
            <div class="w-8 h-8 rounded-full flex items-center justify-center group-hover/action:bg-violet-500/10 transition-all">
              <ChatTeardrop size={18} weight="bold" class="transition-transform group-hover/action:scale-110" />
            </div>
          </button>

          <!-- Share -->
          <button class="flex items-center gap-2 text-zinc-600 hover:text-emerald-400 transition-all group/action active:scale-90">
            <div class="w-8 h-8 rounded-full flex items-center justify-center group-hover/action:bg-emerald-500/10 transition-all">
              <ShareNetwork size={18} weight="bold" class="transition-transform group-hover/action:scale-110" />
            </div>
          </button>
        </div>

        <!-- Tips Section -->
        <div class="flex items-center gap-2">
          {#if post.tipsTotal > 0}
             <div class="hidden sm:flex items-center gap-1.5 text-[9px] font-black text-amber-500 px-2 py-1 bg-amber-500/10 border border-amber-500/20">
                <ChartLineUp size={12} weight="bold" />
                {(post.tipsTotal ?? 0).toLocaleString()}
             </div>
          {/if}
          <button 
            onclick={() => showTipModal = true}
            disabled={isAuthor}
            class="w-8 h-8 rounded-full flex items-center justify-center text-amber-500 hover:bg-amber-500/10 transition-all"
          >
            <Gift size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

{#if showTipModal}
  <TipModal 
    authorName={post.authorName} 
    onConfirm={handleTip} 
    onClose={() => showTipModal = false}
  />
{/if}

<style>
  .post-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .post-card:hover {
    background-color: rgba(255, 255, 255, 0.01);
  }

  button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
</style>


