<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import { 
    Gift, Trash, User, ArrowSquareOut, Heart, 
    ChatTeardrop, DotsThreeVertical, Trophy, 
    Sword, Target, ChartLineUp, ShareNetwork,
    Rocket, Lightbulb, Question, WarningCircle, Skull
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
  import { t } from '$lib/i18n';

  interface Props {
    post: SocialPost;
    onDelete?: (id: string) => void;
  }
  
  let { post, onDelete }: Props = $props();
  
  let showTipModal = $state(false);
  let isReacting = $state(false);
  let showReactions = $state(false);
  let reactionTimeout: any;

  const isAuthor = $derived($user?.uid === post.authorId);
  const userBalance = $derived($appStore.settings.economy?.netsBalance || 0);
  
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
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(d);
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

  const authorNameColor = $derived(post.metadata?.authorColor || 'text-white');
  const authorFrame = $derived(post.metadata?.authorFrame || 'none');

  const frameStyles: Record<string, string> = {
    'Acero': 'border-zinc-400 shadow-[0_0_10px_rgba(161,161,170,0.3)]',
    'Amatista': 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]',
    'Eléctrico': 'border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.6)] animate-pulse',
    'Maestro': 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)] border-[3px]',
    'Neón Violeta': 'border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]',
    'Dorado Real': 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]',
    'Cian Cyber': 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
    'Esmeralda': 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    'Rojo Sangre': 'border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]'
  };

  const nameColorStyles: Record<string, string> = {
    'Esmeralda': 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]',
    'Violeta Neón': 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]',
    'Oro Puro': 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] font-black',
    'Gris Piedra': 'text-zinc-500',
    'Violeta': 'text-violet-400',
    'Dorado': 'text-amber-400',
    'Cian': 'text-cyan-400',
    'Rojo': 'text-red-500',
    'Fucsia': 'text-fuchsia-400'
  };

  const nameFontStyles: Record<string, string> = {
    'Retro': 'font-mono tracking-tighter',
    'Elegante': 'italic font-serif',
    'Maestro': 'uppercase tracking-[0.2em] font-black',
    'Cyber': 'font-cyber',
    'Inter Tight': 'font-inter-tight',
    'Monospace Pro': 'font-mono'
  };

  const authorFont = $derived(post.metadata?.authorFont || 'none');
</script>

<div class="post-card group relative p-4 bg-zinc-950 border border-white/5 hover:border-white/10 transition-all duration-300">
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
          {#if isAuthor && onDelete}
            <button 
              onclick={() => onDelete(post.id)}
              class="p-1.5 text-zinc-700 hover:text-red-500 transition-colors"
            >
              <Trash size={14} />
            </button>
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
                   <span class="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Opening_Data</span>
                   <span class="text-[10px] font-black text-white uppercase tracking-wider">{post.metadata?.opening || 'Custom Position'}</span>
                </div>
                
                {#if post.lichessUrl}
                  <a href={post.lichessUrl} target="_blank" class="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all flex items-center gap-2">
                    <ArrowSquareOut size={12} weight="bold" />
                    Analyze
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


