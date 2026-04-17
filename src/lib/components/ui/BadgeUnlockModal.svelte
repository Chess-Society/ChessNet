<script lang="ts">
  import { fade, scale, fly } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import type { Insignia } from '$lib/constants/insignias';
  import { Sparkle, Confetti, X, ShareNetwork, Trophy } from 'phosphor-svelte';
  import InsigniaBadge from './InsigniaBadge.svelte';

  interface Props {
    insignia: Insignia;
    show: boolean;
    onClose: () => void;
  }

  let { insignia, show = false, onClose }: Props = $props();

  const tierLabels = $derived({
    bronze: $t('badges.tier_bronze') || 'BRONCE',
    silver: $t('badges.tier_silver') || 'PLATA',
    gold: $t('badges.tier_gold') || 'ORO',
    platinum: $t('badges.tier_platinum') || 'PLATINO',
    legendary: $t('badges.tier_legendary') || 'LEYENDA'
  });

</script>

{#if show}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" in:fade={{ duration: 300 }}>
    <!-- Backdrop -->
    <button 
      class="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-default" 
      onclick={onClose}
      aria-label="Close modal"
    ></button>

    <!-- Modal Content -->
    <div 
      class="relative w-full max-w-lg bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      in:scale={{ duration: 500, start: 0.9, opacity: 0 }}
    >
      <!-- Glow Effect -->
      <div 
        class="absolute -top-24 -left-24 w-64 h-64 blur-[100px] opacity-30 rounded-full"
        style="background: {insignia.glowColor};"
      ></div>
      <div 
        class="absolute -bottom-24 -right-24 w-64 h-64 blur-[100px] opacity-20 rounded-full"
        style="background: {insignia.glowColor};"
      ></div>

      <!-- Close Button -->
      <button 
        class="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all z-20"
        onclick={onClose}
      >
        <X size={20} />
      </button>

      <div class="p-10 pt-16 flex flex-col items-center text-center space-y-8 relative z-10">
        <!-- New Badge Celebration -->
        <div class="space-y-2">
            <div class="flex items-center justify-center gap-3 text-amber-400 font-black text-[9px] tracking-[0.4em] uppercase">
                <Sparkle size={12} weight="fill" class="animate-pulse" />
                <span>{$t('badges.new_unlocked')}</span>
                <Sparkle size={12} weight="fill" class="animate-pulse" />
            </div>
            <h2 class="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase italic">
                ¡ENHORABUENA!
            </h2>
        </div>

        <!-- The Badge itself -->
        <div class="py-4">
            <InsigniaBadge {insignia} unlocked={true} size="xl" />
        </div>

        <!-- Info -->
        <div class="space-y-2">
            <span class="text-[10px] font-black tracking-widest uppercase opacity-60" style="color: {insignia.color}">
                {tierLabels[insignia.tier]}
            </span>
          <h3 class="text-3xl font-black text-white tracking-tight">{$t(insignia.titleKey)}</h3>
          <p class="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
            {$t(insignia.descKey)}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col w-full gap-3 pt-4">
            <button 
                class="w-full flex items-center justify-center gap-3 py-5 px-8 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                style="background: {insignia.color}; color: white; box-shadow: 0 15px 35px {insignia.color}55"
            >
                <ShareNetwork size={18} weight="bold" />
                <span>COMPARTIR MÉRITO</span>
            </button>
            <button 
                class="w-full py-5 px-8 rounded-[2rem] bg-white/5 border border-white/10 font-black text-[10px] text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all"
                onclick={onClose}
            >
                CONTINUAR AL PANEL
            </button>
        </div>
      </div>

      <!-- Decorative pattern -->
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  </div>
{/if}

<style>
  div {
    font-family: 'Inter', sans-serif;
  }
</style>
