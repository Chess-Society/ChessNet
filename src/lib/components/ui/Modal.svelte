<script lang="ts">
  import { X } from 'phosphor-svelte';
  import { fade, scale } from 'svelte/transition';

  interface Props {
    show: boolean;
    title: string;
    onClose: () => void;
    children?: import('svelte').Snippet;
  }

  let { show, title, onClose, children }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && show) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if show}
  <div 
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
    transition:fade={{ duration: 200 }}
  >
    <!-- Backdrop -->
    <button 
      class="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default w-full h-full border-none"
      onclick={onClose}
      aria-label="Cerrar modal"
    ></button>

    <!-- Modal Content -->
    <div 
      class="relative w-full max-w-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden"
      transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/5">
        <h3 class="text-xl font-outfit font-black text-white uppercase italic tracking-tight">{title}</h3>
        <button 
          onclick={onClose}
          class="p-2 text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
  }
</style>
