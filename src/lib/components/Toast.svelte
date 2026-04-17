<script lang="ts">
  import { toasts, removeToast } from '$lib/stores/toast';
  import { CheckCircle, WarningCircle, Info, Warning, X, Bell } from 'phosphor-svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';

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
      in:fly={{ x: 100, opacity: 0, duration: 600, easing: quintOut }}
      out:fade={{ duration: 300 }}
      class="group pointer-events-auto relative min-w-[360px] max-w-[440px]"
    >
      <!-- Premium Glass Card -->
      <div class="relative overflow-hidden rounded-[2rem] border {theme.border} bg-neutral-950/80 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 hover:shadow-violet-500/20 hover:-translate-y-1">
        
        <!-- Gradient Background Glow -->
        <div class="absolute inset-0 bg-gradient-to-br {theme.glow} to-transparent opacity-20"></div>
        
        <!-- Animated Progress Line -->
        <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-{theme.icon.replace('text-', '')} to-transparent w-full opacity-30 animate-pulse"></div>

        <div class="relative p-5 flex items-start gap-5">
          <!-- Icon Sleeve -->
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl {theme.bg} border {theme.border} flex items-center justify-center {theme.icon} shadow-inner bg-opacity-20 animate-float">
            <svelte:component 
              this={getIcon(toast.type)} 
              weight="duotone"
              size={26} 
            />
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0 pt-1">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black uppercase tracking-[0.25em] {theme.icon} font-outfit italic">
                {theme.title}
              </span>
              <span class="text-[8px] font-black text-white/20 uppercase tracking-widest font-outfit">
                SYSTEM REV 2.5
              </span>
            </div>
            <p class="text-[14px] font-bold leading-relaxed text-white tracking-tight font-outfit">
              {toast.message}
            </p>
          </div>

          <!-- Close Button -->
          <button
            onclick={() => removeToast(toast.id)}
            class="flex-shrink-0 -mt-1 -mr-1 p-2.5 rounded-xl text-white/20 hover:text-white hover:bg-white/10 transition-all group/close"
            aria-label="Close"
          >
            <X size={16} weight="bold" class="transition-transform group-hover/close:rotate-90 group-hover/close:scale-110" />
          </button>
        </div>

        <!-- Inner Light Rim -->
        <div class="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none"></div>
      </div>

      <!-- Accent Flare -->
      <div class="absolute -left-1 top-4 bottom-4 w-[4px] rounded-full {theme.bg.replace('/10', '')} filter blur-[2px] opacity-40"></div>
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

