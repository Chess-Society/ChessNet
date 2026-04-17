<script lang="ts">
  import { uiStore } from '$lib/stores/uiStore';
  import { fade, scale } from 'svelte/transition';
  import { Warning, Info, Trash, Check } from 'phosphor-svelte';

  const getIcon = (type?: string) => {
    switch (type) {
      case 'danger': return Trash;
      case 'warning': return Warning;
      default: return Info;
    }
  };

  const getTypeClasses = (type?: string) => {
    switch (type) {
      case 'danger': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-primary-500/10 text-primary-500 border-primary-500/20';
    }
  };

  const getButtonClasses = (type?: string) => {
    switch (type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 shadow-red-900/20';
      case 'warning': return 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20';
      default: return 'bg-primary-600 hover:bg-primary-700 shadow-primary-900/20';
    }
  };
</script>

{#if $uiStore.confirmDialog}
  <div 
    class="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
    transition:fade={{ duration: 200 }}
  >
    <!-- Backdrop -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm"
      on:click={() => uiStore.closeConfirm()}
    ></div>

    <!-- Modal Card -->
    {#if $uiStore.confirmDialog}
      {@const dialog = $uiStore.confirmDialog}
      <div 
        class="relative w-full max-w-md overflow-hidden bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl"
        transition:scale={{ duration: 200, start: 0.95 }}
      >
        <!-- Premium background decor -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 p-3 rounded-xl border {getTypeClasses(dialog.type)}">
              <svelte:component this={getIcon(dialog.type)} weight="fill" size={24} />
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="text-xl font-semibold text-white tracking-tight">
                {dialog.title}
              </h3>
              <p class="mt-2 text-sm text-neutral-400 leading-relaxed">
                {dialog.message}
              </p>
            </div>
          </div>

          <div class="mt-8 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="button"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all active:scale-95 {getButtonClasses(dialog.type)}"
              on:click={() => dialog.onConfirm()}
            >
              <Check weight="bold" size={16} />
              {dialog.confirmText || 'Confirmar'}
            </button>
            
            <button
              type="button"
              class="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-95"
              on:click={() => dialog.onCancel()}
            >
              {dialog.cancelText || 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
