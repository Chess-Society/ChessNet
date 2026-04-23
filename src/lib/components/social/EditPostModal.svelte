<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { X } from 'phosphor-svelte';
  import PostCreator from './PostCreator.svelte';
  import type { SocialPost } from '$lib/types';

  let { post, show = $bindable(false) } = $props<{ post: SocialPost, show: boolean }>();

  function close() {
    show = false;
  }
</script>

{#if show}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <button 
      class="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm cursor-default" 
      onclick={close}
      aria-label="Cerrar"
      in:fade={{ duration: 200 }}
    ></button>

    <!-- Modal Content -->
    <div 
      class="relative w-full max-w-4xl bg-zinc-950 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
      in:fly={{ y: 20, duration: 300 }}
    >
      <button 
        class="absolute top-4 right-4 z-50 text-zinc-500 hover:text-white transition-colors"
        onclick={close}
      >
        <X size={24} />
      </button>

      <div class="p-2">
        <PostCreator {post} onComplete={close} />
      </div>
    </div>
  </div>
{/if}
