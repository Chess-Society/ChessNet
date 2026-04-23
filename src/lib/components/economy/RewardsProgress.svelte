<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Trophy, Star, Medal, Crown, CaretRight } from 'phosphor-svelte';

  interface Props {
    nets: number;
    currentRange: 'Bronce' | 'Plata' | 'Oro' | 'Platino';
  }

  let { nets, currentRange }: Props = $props();

  const ranges = [
    { name: 'Bronce', min: 0, max: 1000, icon: Trophy, color: 'text-amber-700', bg: 'bg-amber-700/10' },
    { name: 'Plata', min: 1000, max: 5000, icon: Medal, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
    { name: 'Oro', min: 5000, max: 15000, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Platino', min: 15000, max: 50000, icon: Crown, color: 'text-cyan-400', bg: 'bg-cyan-400/10' }
  ];

  const currentRangeIdx = $derived(ranges.findIndex(r => r.name === currentRange));
  const nextRange = $derived(ranges[currentRangeIdx + 1]);
  
  const progress = $derived(() => {
    if (!nextRange) return 100;
    const current = ranges[currentRangeIdx];
    const rangeSize = nextRange.min - current.min;
    const relativeNets = nets - current.min;
    return Math.min(Math.round((relativeNets / rangeSize) * 100), 100);
  });

  const netsToNext = $derived(nextRange ? nextRange.min - nets : 0);
  const CurrentIcon = $derived(ranges[currentRangeIdx]?.icon || Trophy);
</script>

<div class="pro-card p-8 mb-8 relative overflow-hidden" transition:fade>
  <!-- Background Decoration -->
  <div class="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl -mr-16 -mt-16"></div>

  <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
    <div class="flex items-center gap-6">
      <div class="relative">
        <div class="w-16 h-16 bg-zinc-950 border border-white/5 flex items-center justify-center relative z-10">
          <CurrentIcon size={32} weight="bold" class={ranges[currentRangeIdx]?.color} />
        </div>
        <div class="absolute inset-0 bg-violet-500/20 blur-xl opacity-50"></div>
      </div>
      
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Rango Actual</span>
          <div class="h-[1px] w-8 bg-zinc-800"></div>
        </div>
        <h3 class="text-xl font-black text-white uppercase tracking-tighter italic">Nivel {currentRange}</h3>
        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
          {nets.toLocaleString()} Prestigio Acumulado
        </p>
      </div>
    </div>

    {#if nextRange}
      <div class="flex-1 max-w-md">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-[9px] font-black text-white uppercase tracking-widest">Siguiente Rango: {nextRange.name}</span>
          </div>
          <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">
            Faltan {netsToNext.toLocaleString()} NETS
          </span>
        </div>
        
        <div class="h-2 bg-zinc-950 border border-white/5 p-0.5 overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-1000 ease-out"
            style="width: {progress()}%"
          ></div>
        </div>

        <div class="flex justify-between mt-2">
          <span class="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">0%</span>
          <span class="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">{progress()}% completado</span>
          <span class="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">100%</span>
        </div>
      </div>

      <div class="hidden lg:flex flex-col items-center justify-center p-4 bg-zinc-950 border border-white/5">
        <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Recompensa</span>
        <div class="p-2 bg-violet-500/10 border border-violet-500/20">
          <Trophy size={20} class="text-violet-400" />
        </div>
      </div>
    {:else}
      <div class="px-6 py-4 bg-zinc-950 border border-white/5">
        <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Máximo Rango Alcanzado</span>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Professional monitor aesthetics */
  .pro-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, #8b5cf6, transparent);
  }
</style>
