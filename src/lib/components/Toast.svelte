<script lang="ts">
  import { toasts, removeToast } from '$lib/stores/toast';
  import { CheckCircle, WarningCircle, Info, Warning, X, Bell } from 'phosphor-svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return WarningCircle;
      case 'warning': return Warning;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getTheme = (type: string) => {
    switch (type) {
      case 'success': return {
        border: 'border-indigo-500/30',
        glow: 'from-indigo-500/20',
        icon: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        title: 'SUCCESS'
      };
      case 'error': return {
        border: 'border-rose-500/30',
        glow: 'from-rose-500/20',
        icon: 'text-rose-400',
        bg: 'bg-rose-500/10',
        title: 'SYSTEM ERROR'
      };
      case 'warning': return {
        border: 'border-amber-500/30',
        glow: 'from-amber-500/20',
        icon: 'text-amber-400',
        bg: 'bg-amber-500/10',
        title: 'ALERT'
      };
      case 'info':
      default: return {
        border: 'border-violet-500/30',
        glow: 'from-violet-500/20',
        icon: 'text-violet-400',
        bg: 'bg-violet-500/10',
        title: 'NOTIFICATION'
      };
    }
  };
</script>

<div class="fixed top-8 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
  {#each $toasts as toast (toast.id)}
    {@const theme = getTheme(toast.type)}
    <div 
      animate:flip={{ duration: 400 }}
      in:fly={{ x: 100, opacity: 0, duration: 500 }}
      out:fade={{ duration: 300 }}
      class="group pointer-events-auto relative min-w-[340px] max-w-[420px]"
    >
      <!-- Premium Glass Card -->
      <div class="relative overflow-hidden rounded-2xl border {theme.border} bg-neutral-900/40 backdrop-blur-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:shadow-violet-500/10 group-hover:-translate-y-0.5">
        
        <!-- Gradient Background Glow -->
        <div class="absolute inset-0 bg-gradient-to-br {theme.glow} to-transparent opacity-30"></div>
        
        <!-- Animated Progress Line -->
        <div class="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"></div>

        <div class="relative p-4 flex items-start gap-4">
          <!-- Icon Sleeve -->
          <div class="flex-shrink-0 w-10 h-10 rounded-xl {theme.bg} border {theme.border} flex items-center justify-center {theme.icon} shadow-inner">
            <svelte:component 
              this={getIcon(toast.type)} 
              weight="duotone"
              size={22} 
            />
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0 pt-0.5">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[9px] font-black uppercase tracking-[0.2em] {theme.icon} font-outfit">
                {theme.title}
              </span>
              <span class="text-[9px] font-medium text-white/20 font-jakarta">
                Just now
              </span>
            </div>
            <p class="text-[13px] font-medium leading-relaxed text-white/90 font-jakarta line-clamp-2">
              {toast.message}
            </p>
          </div>

          <!-- Close Button -->
          <button
            on:click={() => removeToast(toast.id)}
            class="flex-shrink-0 -mt-1 -mr-1 p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all group/close"
            aria-label="Close"
          >
            <X size={14} weight="bold" class="transition-transform group-hover/close:rotate-90 group-hover/close:scale-110" />
          </button>
        </div>

        <!-- Inner Light Rim -->
        <div class="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none"></div>
      </div>

      <!-- Accent Flare -->
      <div class="absolute -left-1 top-1 bottom-1 w-[3px] rounded-full bg-gradient-to-b {theme.icon.replace('text', 'bg')} filter blur-[1px] opacity-50"></div>
    </div>
  {/each}
</div>

<style>
  /* Noise pattern integration */
  .backdrop-blur-3xl {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    background-size: 100px 100px;
    background-repeat: repeat;
    background-blend-mode: overlay;
  }
</style>

