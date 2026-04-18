<script lang="ts">
  import { uiStore } from '$lib/stores/uiStore';
  import { fade, scale } from 'svelte/transition';
  import { Warning, Info, Trash, Check, X } from 'phosphor-svelte';
  import { quintOut } from 'svelte/easing';
  import { t } from '$lib/i18n';


  const getTypeStyles = (type?: string) => {
    switch (type) {
      case 'danger': return {
        iconBg: 'bg-red-500/10 text-red-500 border-red-500/20',
        button: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-900/40',
        accent: 'bg-red-500/20'
      };
      case 'warning': return {
        iconBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        button: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-900/40',
        accent: 'bg-amber-500/20'
      };
      default: return {
        iconBg: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
        button: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-primary-900/40',
        accent: 'bg-primary-500/20'
      };
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'danger': return Trash;
      case 'warning': return Warning;
      default: return Info;
    }
  };
</script>

{#if $uiStore.confirmDialog}
  <div 
    class="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 sm:pb-24"
    transition:fade={{ duration: 300, easing: quintOut }}
  >
    <!-- Backdrop with enhanced blur -->
    <div 
      class="absolute inset-0 bg-black/80 backdrop-blur-md"
      onclick={() => uiStore.closeConfirm()}
      onkeydown={(e) => e.key === 'Escape' && uiStore.closeConfirm()}
      role="button"
      tabindex="-1"
    ></div>

    <!-- Modal Card -->
    {#if $uiStore.confirmDialog}
      {@const dialog = $uiStore.confirmDialog}
      {@const styles = getTypeStyles(dialog.type)}
      <div 
        class="relative w-full max-w-md overflow-hidden bg-[#121214]/90 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)]"
        transition:scale={{ duration: 450, start: 0.92, easing: quintOut }}
      >
        <!-- Glossy Rim -->
        <div class="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none"></div>
        <div class="absolute inset-[1px] rounded-[2.4rem] border border-white/[0.03] pointer-events-none"></div>

        <!-- Premium background decor -->
        <div class="absolute -top-32 -right-32 w-64 h-64 {styles.accent} blur-[100px] rounded-full pointer-events-none opacity-40"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none opacity-20"></div>
        
        <!-- Header / Close button -->
        <div class="flex justify-end p-6 absolute top-0 right-0 z-10">
          <button 
            class="p-2 text-neutral-500 hover:text-white transition-all hover:bg-white/5 rounded-xl"
            onclick={() => uiStore.closeConfirm()}
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div class="p-10 pt-12">
          <div class="flex flex-col items-center text-center gap-8">
            <div class="flex-shrink-0 p-6 rounded-[2rem] border-2 {styles.iconBg} animate-float shadow-2xl relative">
              <div class="absolute inset-0 blur-xl {styles.accent} opacity-50"></div>
              <svelte:component this={getIcon(dialog.type)} weight="duotone" size={44} class="relative z-10" />
            </div>
            
            <div class="space-y-4">
              <h3 class="text-3xl font-black text-white tracking-widest font-outfit uppercase italic leading-none">
                {dialog.title}
              </h3>
              <p class="text-slate-400 leading-relaxed font-outfit font-medium text-sm px-2">
                {dialog.message}
              </p>
            </div>
          </div>

          <div class="mt-12 flex flex-col gap-3">
            <button
              type="button"
              class="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-[10px] font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] {styles.button}"
              onclick={() => dialog.onConfirm()}
            >
              <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Check weight="bold" size={18} class="relative z-10" />
              <span class="relative z-10">{dialog.confirmText || $t('common.confirm')}</span>
            </button>
            
            <button
              type="button"
              class="inline-flex items-center justify-center px-8 py-5 rounded-2xl text-[10px] font-black text-slate-500 bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:text-white transition-all active:scale-95 uppercase tracking-[0.2em]"
              onclick={() => {
                if (dialog.onCancel) {
                  dialog.onCancel();
                } else {
                  uiStore.closeConfirm();
                }
              }}
            >
              {dialog.cancelText || $t('common.cancel')}
            </button>
          </div>
        </div>
        
        <!-- Bottom Accent bar -->
        <div class="h-1 w-full bg-gradient-to-r from-transparent via-{styles.iconBg.split(' ')[1]} to-transparent opacity-30"></div>
      </div>
    {/if}
  </div>
{/if}

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
</style>
