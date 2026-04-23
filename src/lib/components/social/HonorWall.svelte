<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api/admin';
  import { Trophy, Star, Crown, TrendUp, Medal } from 'phosphor-svelte';
  import { fade, fly } from 'svelte/transition';

  let ranking = $state<{ name: string; prestige: number; id: string; photoURL?: string }[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const data = await adminApi.getPrestigeDistribution();
      // Mock some photos if missing for aesthetics
      ranking = data.map((u, i) => ({
        ...u,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`
      }));
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  });

  function getRankColor(index: number) {
    if (index === 0) return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
    if (index === 1) return 'text-slate-300 border-slate-300/20 bg-slate-300/5';
    if (index === 2) return 'text-amber-700 border-amber-700/20 bg-amber-700/5';
    return 'text-slate-500 border-white/5 bg-white/[0.02]';
  }

  function getRankIcon(index: number) {
    if (index === 0) return Crown;
    if (index === 1) return Medal;
    if (index === 2) return Star;
    return Trophy;
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between border-b border-white/10 pb-4">
    <div>
      <h3 class="text-2xl font-black font-display italic uppercase tracking-tighter text-white">Muro de Honor</h3>
      <p class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mt-1">Cédula de Apoyo & Prestigio</p>
    </div>
    <div class="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20">
      <TrendUp size={14} class="text-violet-400" />
      <span class="text-[10px] font-mono font-black text-violet-400 uppercase tracking-tighter">Ranking en Vivo</span>
    </div>
  </div>

  {#if loading}
    <div class="space-y-4">
      {#each Array(5) as _}
        <div class="h-16 bg-white/5 animate-pulse border border-white/5"></div>
      {/each}
    </div>
  {:else if ranking.length === 0}
    <div class="p-12 text-center border border-dashed border-white/10 bg-white/[0.02]">
      <p class="text-slate-500 font-mono text-xs uppercase tracking-widest">No hay registros de prestigio aún</p>
    </div>
  {:else}
    <div class="grid gap-2">
      {#each ranking as user, i (user.id)}
        {@const Icon = getRankIcon(i)}
        <div 
          in:fly={{ y: 20, delay: i * 50 }}
          class="group flex items-center gap-4 p-4 border transition-all duration-300 hover:translate-x-1 {getRankColor(i)}"
        >
          <!-- Rank Number -->
          <div class="w-8 text-center font-display italic font-black text-xl opacity-50 group-hover:opacity-100">
            {i + 1}
          </div>

          <!-- Avatar -->
          <div class="relative">
            <div class="w-10 h-10 bg-black border border-current p-0.5 relative z-10 overflow-hidden">
              <img src={user.photoURL} alt={user.name} class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div class="absolute -top-1 -right-1 z-20">
              <Icon weight="fill" size={14} class="drop-shadow-lg" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h4 class="font-black font-display italic uppercase tracking-tight text-white group-hover:text-current transition-colors truncate">
              {user.name}
            </h4>
            <p class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-[0.1em]">Socio Propietario</p>
          </div>

          <!-- Score -->
          <div class="text-right">
            <div class="flex items-baseline justify-end gap-1">
              <span class="text-2xl font-black font-display italic leading-none">{user.prestige}</span>
              <span class="text-[10px] font-mono font-black opacity-50 uppercase">%</span>
            </div>
            <p class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-tighter">Participación</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .font-display { font-family: 'Outfit', sans-serif; }
</style>
