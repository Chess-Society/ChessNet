<script lang="ts">
  import { t } from '$lib/i18n';
  import { ChartLineUp, Users, Pulse, Trophy, ArrowUpRight } from 'phosphor-svelte';
  import { fade } from 'svelte/transition';

  // Production: Data will be fetched from Lichess Oracle service
  const stats = [];
  const topPerformers = [];
  const isDataPending = true;
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div class="space-y-1">
      <div class="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[8px] font-mono font-black text-blue-400 uppercase tracking-widest">
        <Pulse size={10} weight="bold" />
        LICHESS_GLOBAL_PULSE
      </div>
      <h3 class="text-2xl font-black font-display uppercase italic tracking-tighter text-white">{$t('admin.stats.performance_title')}</h3>
    </div>
    <div class="px-4 py-2 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-slate-600">
      SYSTEM_NOMINAL
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    {#each Array(4) as _}
      <div class="bg-zinc-900/50 border border-white/5 p-6 relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-[0.02]">
          <ChartLineUp size={100} weight="fill" />
        </div>
        <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-[0.2em] mb-4">METRIC_PENDING</p>
        <div class="flex items-end justify-between relative z-10">
          <h4 class="text-4xl font-black font-display italic text-white/10 tracking-tighter">--</h4>
          <div class="flex items-center gap-1 mb-1 opacity-20">
            <ArrowUpRight size={12} class="text-slate-500" />
            <span class="text-[10px] font-mono font-black text-slate-500">0%</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Top Students Grid (Placeholder) -->
    <div class="lg:col-span-2 bg-[#02040a] border border-white/10 p-8 space-y-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.02)_0%,transparent_100%)]"></div>
      <div class="flex items-center justify-between relative z-10">
        <p class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Trophy size={14} class="text-amber-500/20" />
          TOP_PERFORMERS_SNAPSHOT
        </p>
        <span class="text-[8px] font-mono font-black text-slate-800 uppercase">NO_ACTIVE_DATA</span>
      </div>

      <div class="h-48 flex flex-col items-center justify-center border border-dashed border-white/5 relative z-10">
         <p class="text-[9px] font-mono font-black text-slate-800 uppercase tracking-widest">Waiting for Lichess Oracle feed...</p>
      </div>
    </div>

    <!-- Active Stream (Placeholder) -->
    <div class="bg-[#02040a] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden">
      <div class="space-y-6 relative z-10">
        <p class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Pulse size={14} class="text-blue-500/20" />
          NETWORK_ACTIVITY
        </p>
        
        <div class="space-y-4 opacity-30">
          <div class="flex gap-3">
            <div class="w-1 bg-slate-800"></div>
            <div>
              <p class="text-[9px] font-mono font-black text-slate-700 uppercase tracking-tighter">LISTENING_FOR_EVENTS</p>
              <p class="text-[10px] text-slate-800 leading-tight mt-1">Conexión con Lichess establecida. Esperando eventos del oráculo...</p>
            </div>
          </div>
        </div>
      </div>

      <button disabled class="w-full py-4 bg-white/5 border border-white/10 text-slate-700 text-[10px] font-black uppercase tracking-widest mt-8 cursor-not-allowed">
        FORCE_SYNC_DISABLED
      </button>
    </div>
  </div>
</div>
