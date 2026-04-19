<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Insignia } from '$lib/constants/insignias';
  import { scale } from 'svelte/transition';
  import { Question } from 'phosphor-svelte';

  interface Props {
    insignia: Insignia;
    unlocked?: boolean;
    showDescription?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xs';
  }

  let { insignia, unlocked = false, showDescription = false, size = 'md' }: Props = $props();

  const isSecret = $derived(insignia.secret && !unlocked);

  const sizeMap = {
    xs: { base: 'w-10 h-10', icon: 16, gap: 'gap-0', title: 'hidden', desc: 'hidden', blur: '4px', rounded: 'rounded-lg', padding: 'p-1.5' },
    sm: { base: 'w-[84px] h-[84px]', icon: 28, gap: 'gap-1', title: 'text-[8px]', desc: 'hidden', blur: '8px', rounded: 'rounded-[18px]', padding: 'p-2.5' },
    md: { base: 'w-[104px] h-[104px]', icon: 34, gap: 'gap-1.5', title: 'text-[9px]', desc: 'hidden', blur: '10px', rounded: 'rounded-[22px]', padding: 'p-3.5' },
    lg: { base: 'w-[124px] h-[124px]', icon: 40, gap: 'gap-2', title: 'text-[10px]', desc: 'text-[8px]', blur: '12px', rounded: 'rounded-[26px]', padding: 'p-4.5' },
    xl: { base: 'w-[150px] h-[150px]', icon: 48, gap: 'gap-3', title: 'text-[11px]', desc: 'text-[9px]', blur: '14px', rounded: 'rounded-[30px]', padding: 'p-6' }
  };

  const config = $derived(sizeMap[size] || sizeMap.md);

  const tierLabels = {
    bronze: 'BRONCE',
    silver: 'PLATA',
    gold: 'ORO',
    platinum: 'PLATINO',
    legendary: 'LEYENDA'
  };

  const isLegendary = $derived(insignia.tier === 'legendary');

</script>

<div class="insignia-wrapper {config.base} relative group" 
     class:unlocked={unlocked}
     class:locked={!unlocked}
     class:is-secret={isSecret}
     class:legendary={isLegendary}
     in:scale={{ duration: 600, start: 0.9 }}
>
  <!-- Main Collectible Card -->
  <div 
    class="card-frame relative w-full h-full {config.padding} {config.rounded} transition-all duration-700 overflow-hidden flex flex-col items-center justify-center {config.gap} group-hover:scale-[1.05]"
    style="
        background: {unlocked 
            ? (isLegendary ? 'linear-gradient(135deg, #0f172a 0%, #020617 100%)' : 'rgba(15, 23, 42, 0.4)') 
            : (isSecret ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.02)')};
        border: 1px solid {unlocked 
            ? (isLegendary ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)') 
            : 'rgba(255,255,255,0.05)'};
        backdrop-filter: blur({config.blur});
    "
  >
    <!-- Legendary Iridescent Layer -->
    {#if isLegendary && unlocked}
        <div class="absolute inset-0 opacity-20 bg-gradient-to-tr from-violet-500 via-indigo-500 to-cyan-500 mix-blend-overlay animate-iridescent"></div>
    {/if}

    <!-- Glass Refraction Edge -->
    <div class="absolute inset-0 border border-white/10 rounded-inherit pointer-events-none"></div>
    <div class="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

    <!-- Glow Effect -->
    {#if unlocked}
        <div 
            class="absolute -inset-10 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none blur-3xl"
            style="background: radial-gradient(circle, {insignia.color} 0%, transparent 70%)"
        ></div>
    {/if}

    <!-- Background Texture -->
    <div class="absolute inset-0 bg-noise opacity-[0.05]"></div>
    
    {#if unlocked}
      <!-- Tier Badge Tag -->
      <div 
        class="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md z-20"
      >
        <div class="w-1 h-1 rounded-full {isLegendary ? 'animate-ping' : ''}" style="background: {insignia.color}"></div>
        <span class="text-[5px] font-black tracking-[0.2em] text-white/50 uppercase">{tierLabels[insignia.tier]}</span>
      </div>
    {/if}

    <!-- Content Wrapper -->
    <div class="relative z-10 flex flex-col items-center gap-2.5">
        <!-- Icon Shell -->
        <div 
          class="icon-shell p-2 rounded-2xl transition-all duration-700 group-hover:scale-110"
          style="
            background: {unlocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'}; 
            border: 1px solid {unlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'};
            box-shadow: {unlocked ? `0 8px 16px -4px ${insignia.color}44` : 'none'};
          "
        >
          <div 
            class="transition-all duration-500 flex items-center justify-center"
            style="
                color: {unlocked ? insignia.color : 'rgba(255,255,255,0.1)'}; 
                filter: {unlocked ? `drop-shadow(0 0 10px ${insignia.color}88)` : 'none'};
                opacity: {unlocked ? 1 : (isSecret ? 0.1 : 0.3)};
            "
          >
            {#if isSecret}
              <Question size={config.icon} weight="thin" class="opacity-40" />
            {:else}
              <insignia.icon size={config.icon} weight={unlocked ? 'duotone' : 'thin'} />
            {/if}
          </div>
        </div>

        {#if size !== 'xs'}
            <div class="text-center space-y-0.5 mt-1 overflow-hidden">
                <span 
                    class="{config.title} font-black uppercase tracking-[0.05em] leading-[1.1] block text-center overflow-hidden px-1 line-clamp-2"
                    style="color: {unlocked ? 'white' : 'rgba(255,255,255,0.2)'};"
                >
                    {isSecret ? $t('badges.secret_title') : $t(insignia.titleKey)}
                </span>
                {#if showDescription}
                    <p class="{config.desc} text-slate-400/50 font-medium leading-[1.2] max-w-[90%] mx-auto line-clamp-2">
                        {#if isSecret}
                            <span class="italic text-[8px] text-indigo-400/60 tracking-tight">
                                {insignia.hintKey ? `"${$t(insignia.hintKey)}"` : $t('badges.secret_desc')}
                            </span>
                        {:else}
                            {$t(insignia.descKey)}
                        {/if}
                    </p>
                {/if}
            </div>
        {/if}
    </div>

    <!-- Enamel Refraction -->
    <div class="refraction"></div>
    <div class="flare"></div>
  </div>

  <!-- Status Overlay (Premium Shadow) -->
  {#if !unlocked}
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div class="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 scale-90 group-hover:scale-100">
            <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">
                {isSecret ? $t('common.mystery') : $t('common.locked')}
            </span>
        </div>
    </div>
  {/if}
</div>

<style>
  .insignia-wrapper {
    perspective: 1000px;
    user-select: none;
    cursor: default;
  }

  .card-frame {
    transform-style: preserve-3d;
    box-shadow: 
        0 8px 24px -12px rgba(0,0,0,0.8),
        inset 0 0 12px rgba(255,255,255,0.01);
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease;
  }

  .locked .card-frame {
    filter: grayscale(0.8) contrast(1.1);
  }

  .is-secret .card-frame {
    filter: brightness(0.6) contrast(1.2);
  }

  .flare {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 45%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0) 55%,
        rgba(255, 255, 255, 0) 100%
    );
    z-index: 5;
    background-size: 250% 250%;
    transition: background-position 0.6s ease;
    pointer-events: none;
    opacity: 0;
  }

  .insignia-wrapper:hover .flare {
    opacity: 1;
    animation: shine 1.8s infinite;
  }

  .refraction {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 60%);
    pointer-events: none;
    z-index: 6;
  }

  @keyframes shine {
    0% { background-position: 250% 250%; }
    100% { background-position: -250% -250%; }
  }

  @keyframes iridescent {
    0% { filter: hue-rotate(0deg) brightness(1); }
    50% { filter: hue-rotate(180deg) brightness(1.4); }
    100% { filter: hue-rotate(360deg) brightness(1); }
  }

  .animate-iridescent {
    animation: iridescent 12s linear infinite;
  }

  .bg-noise {
    /* Grainy noise texture removed per user request */
  }

  .insignia-wrapper:hover .card-frame {
    transform: translateY(-4px) rotateX(4deg) rotateY(4deg);
    box-shadow: 
        0 20px 40px -20px rgba(0,0,0,0.9),
        inset 0 0 15px rgba(255,255,255,0.03);
  }

  .unlocked.legendary:hover .card-frame {
    box-shadow: 
        0 20px 50px -15px rgba(139, 92, 246, 0.4),
        inset 0 0 20px rgba(255,255,255,0.05);
  }
</style>
