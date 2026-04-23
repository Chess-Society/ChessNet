<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin';
  import { ChartPieSlice, UsersThree, Info, Crown } from 'phosphor-svelte';
  import { fade, fly } from 'svelte/transition';

  let distribution = $state<{ name: string, prestige: number, id: string }[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      distribution = await adminApi.getPrestigeDistribution();
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
    }
  });

  let totalPrestige = $derived(distribution.reduce((acc, curr) => acc + curr.prestige, 0));
  
  // Sort by prestige
  let sortedDist = $derived([...distribution].sort((a, b) => b.prestige - a.prestige));

  const colors = [
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#6366f1', // Indigo
    '#ef4444', // Red
  ];
</script>

<div class="pro-card p-8 relative overflow-hidden">
  <!-- Header -->
  <div class="flex items-center justify-between mb-10 relative z-10">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
        <ChartPieSlice size={24} weight="duotone" />
      </div>
      <div>
        <h2 class="text-xl font-black text-white uppercase tracking-[0.2em]">Tabla de Influencia</h2>
        <p class="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Distribución del impacto profesional en el club</p>
      </div>
    </div>

    <div class="hidden md:flex items-center gap-6">
      <div class="text-right">
        <span class="block text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-1">Impacto Repartido</span>
        <span class="text-2xl font-black text-white">{totalPrestige}%</span>
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="h-64 flex flex-col items-center justify-center gap-4" in:fade>
      <div class="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 animate-spin"></div>
      <p class="text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse">Calculando distribución...</p>
    </div>
  {:else if distribution.length === 0}
    <div class="h-64 flex flex-col items-center justify-center gap-6 border border-dashed border-white/5 bg-white/[0.02] relative group overflow-hidden" in:fade>
      <!-- Silhouette of Objective -->
      <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] scale-150 group-hover:scale-[1.6] transition-transform duration-1000">
        <ChartPieSlice size={400} weight="fill" />
      </div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-4 text-zinc-700 group-hover:text-violet-500 transition-colors">
          <UsersThree size={32} weight="thin" />
        </div>
        <h3 class="text-xs font-black text-white uppercase tracking-[0.3em] mb-2">Prestigio Disponible: 100%</h3>
        <p class="text-zinc-500 text-[10px] uppercase tracking-widest font-bold text-center px-8 leading-relaxed max-w-sm">
          Aún no hay profesores con influencia asignada.<br/>
          <span class="text-violet-400">Usa el gestor de abajo para premiar a tus mejores profes.</span>
        </p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
      <!-- Visual Chart (Stack Bar) -->
      <div class="lg:col-span-5 space-y-8" in:fly={{ x: -20, duration: 600 }}>
        <div class="relative pt-2">
          <!-- Main Bar Container -->
          <div class="h-12 w-full bg-zinc-950 border border-white/10 flex overflow-hidden shadow-inner">
            {#each sortedDist as item, i}
              <div 
                class="h-full transition-all duration-1000 ease-out border-r border-zinc-950/20 last:border-0"
                style="width: {(item.prestige / totalPrestige) * 100}%; background-color: {colors[i % colors.length]}"
                title="{item.name}: {item.prestige}%"
              ></div>
            {/each}
          </div>
          
          <!-- Legend markers above -->
          <div class="absolute -top-6 left-0 right-0 flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-start gap-3 p-4 bg-white/5 border border-white/5">
            <Crown size={16} class="text-amber-500 shrink-0" />
            <p class="text-[10px] text-zinc-400 leading-relaxed italic">
              El Director retiene el <span class="text-white font-bold">{100 - totalPrestige}%</span> del impacto. Los profesores con influencia activa aparecen en esta lista por orden de relevancia.
            </p>
          </div>
        </div>
      </div>

      <!-- List Data -->
      <div class="lg:col-span-7" in:fly={{ x: 20, duration: 600 }}>
        <div class="space-y-2 max-h-[300px] overflow-y-auto pr-4 scrollbar-custom">
          {#each sortedDist as item, i}
            <div class="flex items-center justify-between p-4 bg-zinc-950/50 border border-white/5 hover:border-white/10 transition-all group">
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 flex items-center justify-center text-[10px] font-black text-white" style="background-color: {colors[i % colors.length]}">
                  #{i + 1}
                </div>
                <div>
                  <span class="block text-xs font-black text-white uppercase tracking-wider group-hover:text-violet-400 transition-colors">{item.name}</span>
                  <span class="text-[9px] text-zinc-600 uppercase tracking-widest">Socio Estratégico</span>
                </div>
              </div>
              <div class="text-right">
                <span class="block text-lg font-black text-white italic">{item.prestige}%</span>
                <div class="h-1 w-24 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <div class="h-full" style="width: {item.prestige}%; background-color: {colors[i % colors.length]}"></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Background Decoration -->
  <div class="absolute bottom-0 right-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
    <ChartPieSlice size={300} weight="thin" />
  </div>
</div>

<style>
  .scrollbar-custom::-webkit-scrollbar {
    width: 2px;
  }
  .scrollbar-custom::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
  }
  .scrollbar-custom::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
  }
  .scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.5);
  }
</style>
