<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide, scale } from 'svelte/transition';
  import { socialApi } from '$lib/api/social';
  import { user as authUser } from '$lib/stores/auth';
  import { t } from '$lib/i18n';
  import type { FacultyPost, FacultyPostType } from '$lib/types';
  import { 
    ChatTeardropDots, 
    ShareNetwork, 
    ThumbsUp, 
    Lightning, 
    Trophy,
    UserCircle,
    PaperPlaneTilt,
    Link,
    Code
  } from 'phosphor-svelte';

  let posts = $state<FacultyPost[]>([]);
  let newPostContent = $state('');
  let newPostType = $state<FacultyPostType>('NOTICE');
  let isPosting = $state(false);
  let unsubscribe: () => void;

  onMount(() => {
    unsubscribe = socialApi.subscribeToStream((updatedPosts) => {
      posts = updatedPosts;
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  async function handleCreatePost() {
    if (!newPostContent.trim() || !$authUser) return;
    
    isPosting = true;
    try {
      await socialApi.createPost({
        authorId: $authUser.uid,
        authorName: $authUser.displayName || 'Professor',
        authorAvatar: $authUser.photoURL || '',
        content: newPostContent,
        type: newPostType,
        metadata: {}
      });
      newPostContent = '';
      newPostType = 'NOTICE';
    } catch (e) {
      console.error('Error creating post:', e);
    } finally {
      isPosting = false;
    }
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Detect Lichess URL and extract ID for thumbnail
  function getLichessThumbnail(content: string) {
    const match = content.match(/lichess\.org\/([a-zA-Z0-9]{8,12})/);
    if (match) {
      return `https://lichess1.org/game/export/gif/${match[1]}.gif`;
    }
    return null;
  }
  async function toggleReaction(postId: string, emoji: string) {
    if (!$authUser) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const userReactions = post.reactions?.[emoji] || [];
    const hasReacted = userReactions.includes($authUser.uid);

    try {
      if (hasReacted) {
        await socialApi.unreactFromPost(postId, $authUser.uid, emoji);
      } else {
        await socialApi.reactToPost(postId, $authUser.uid, emoji);
      }
    } catch (e) {
      console.error('Error toggling reaction:', e);
    }
  }

  function getReactionCount(post: FacultyPost, emoji: string) {
    return post.reactions?.[emoji]?.length || 0;
  }

  function hasUserReacted(post: FacultyPost, emoji: string) {
    return post.reactions?.[emoji]?.includes($authUser?.uid || '') || false;
  }
</script>

<div class="flex flex-col h-full bg-black/40 border border-white/5 font-mono">
  <!-- Header -->
  <div class="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 bg-emerald-500 animate-pulse"></div>
      <h2 class="text-xs font-black uppercase tracking-[0.3em] text-white">FACULTY_STREAM_v1.0</h2>
    </div>
    <div class="text-[9px] text-slate-500 uppercase tracking-widest italic">
      ACTIVE_NODES: {posts.length}
    </div>
  </div>

  <!-- Composer -->
  <div class="p-4 border-b border-white/10 bg-white/[0.01]">
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        {#each ['NOTICE', 'LICHESS_GAME', 'EXERCISE'] as type}
          <button 
            onclick={() => newPostType = type as FacultyPostType}
            class="px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all {newPostType === type ? 'bg-violet-500 text-black border-violet-400' : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30'}"
          >
            {type}
          </button>
        {/each}
      </div>
      
      <div class="relative">
        <textarea 
          bind:value={newPostContent}
          placeholder="SHARE_PARTIDA_FEN_OR_NOTICE..."
          class="w-full bg-black/60 border border-white/10 p-4 text-sm text-emerald-400 focus:outline-none focus:border-emerald-500/50 resize-none transition-all h-24 rounded-none placeholder:text-emerald-900/50"
        ></textarea>
        
        <button 
          onclick={handleCreatePost}
          disabled={isPosting || !newPostContent.trim()}
          class="absolute bottom-4 right-4 p-2 bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-20 disabled:grayscale transition-all rounded-none group"
        >
          <PaperPlaneTilt weight="bold" size={18} class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>

  <!-- Stream -->
  <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
    {#each posts as post (post.id)}
      <div 
        in:slide={{ duration: 400 }}
        class="group relative pl-4 border-l-2 border-white/5 hover:border-violet-500/30 transition-all py-2"
      >
        <!-- Author Info -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black text-violet-400 uppercase tracking-tighter">@{post.authorName.replace(/\s+/g, '_').toUpperCase()}</span>
            <span class="w-1 h-1 bg-white/10 rounded-full"></span>
            <span class="text-[9px] text-slate-600 font-mono italic">{formatTime(post.createdAt)}</span>
          </div>
          <div class="px-1.5 py-0.5 bg-white/5 text-[8px] font-black text-slate-500 uppercase tracking-widest">
            {post.type}
          </div>
        </div>

        <!-- Content -->
        <div class="text-sm text-slate-300 leading-relaxed break-words mb-4">
          {post.content}
        </div>

        <!-- Media/Thumbnail for Lichess Games -->
        {#if post.type === 'LICHESS_GAME' && getLichessThumbnail(post.content)}
          <div class="mb-4 border border-white/10 bg-black/40 overflow-hidden group-hover:border-violet-500/20 transition-colors">
            <img 
              src={getLichessThumbnail(post.content)} 
              alt="Lichess Preview" 
              class="w-full max-w-[240px] opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div class="p-2 bg-white/[0.03] border-t border-white/5 flex items-center justify-between">
              <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest">LICHESS_GAME_RENDER</span>
              <a href={post.content} target="_blank" class="text-[9px] font-black text-violet-400 hover:text-violet-300 underline">OPEN_LINK</a>
            </div>
          </div>
        {/if}

        <!-- Interactions -->
        <div class="flex items-center gap-4">
          <button 
            onclick={() => toggleReaction(post.id, '👍')}
            class="flex items-center gap-1.5 transition-colors {hasUserReacted(post, '👍') ? 'text-emerald-400' : 'text-slate-600 hover:text-emerald-400'}"
          >
            <ThumbsUp size={14} weight={hasUserReacted(post, '👍') ? 'fill' : 'regular'} />
            <span class="text-[10px] font-black">{getReactionCount(post, '👍')}</span>
          </button>
          <button 
            onclick={() => toggleReaction(post.id, '⚡')}
            class="flex items-center gap-1.5 transition-colors {hasUserReacted(post, '⚡') ? 'text-violet-400' : 'text-slate-600 hover:text-violet-400'}"
          >
            <Lightning size={14} weight={hasUserReacted(post, '⚡') ? 'fill' : 'regular'} />
            <span class="text-[10px] font-black">{getReactionCount(post, '⚡')}</span>
          </button>
          <button 
            onclick={() => toggleReaction(post.id, '🏆')}
            class="flex items-center gap-1.5 transition-colors {hasUserReacted(post, '🏆') ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'}"
          >
            <Trophy size={14} weight={hasUserReacted(post, '🏆') ? 'fill' : 'regular'} />
            <span class="text-[10px] font-black">{getReactionCount(post, '🏆')}</span>
          </button>
        </div>

        <!-- Decorative background effect on hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-violet-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    {:else}
      <div class="h-full flex flex-col items-center justify-center opacity-20 pointer-events-none">
        <ShareNetwork size={48} weight="thin" class="mb-4" />
        <p class="text-[10px] font-mono uppercase tracking-[0.3em]">WAITING_FOR_STREAM_DATA...</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
  }
  
  :global(.custom-scrollbar::-webkit-scrollbar) {
    width: 2px;
  }
  
  :global(.custom-scrollbar::-webkit-scrollbar-track) {
    background: transparent;
  }
  
  :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.05);
  }
  
  :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
