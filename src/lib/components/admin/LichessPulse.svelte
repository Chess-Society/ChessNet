<script lang="ts">
  import { t } from '$lib/i18n';
  import { ChartLineUp, Users, Pulse, Trophy, ArrowUpRight } from 'phosphor-svelte';
  import { fade } from 'svelte/transition';

  // Mock data for the demonstration of "Unified View"
  const stats = [
    { label: 'STUDENTS_SYNCED', value: '124', delta: '+12%', color: 'text-emerald-500' },
    { label: 'AVG_ELO_RATING', value: '1452', delta: '+45', color: 'text-blue-500' },
    { label: 'GAMES_LAST_24H', value: '842', delta: '+156', color: 'text-violet-500' },
    { label: 'ACTIVE_PUZZLES', value: '3.2k', delta: '+22%', color: 'text-amber-500' }
  ];

  const topPerformers = [
    { name: 'Alex M.', rating: 2105, games: 42, winRate: '68%' },
    { name: 'Elena R.', rating: 1980, games: 38, winRate: '72%' },
    { name: 'Marc V.', rating: 1850, games: 55, winRate: '54%' }
  ];
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
    <button class="px-4 py-2 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400">
      EXPORT_FULL_REPORT
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    {#each stats as stat}
      <div class="bg-zinc-900/50 border border-white/5 p-6 relative overflow-hidden group hover:border-white/10 transition-all">
        <!-- Background Accent -->
        <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <ChartLineUp size={100} weight="fill" />
        </div>

        <p class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
        <div class="flex items-end justify-between relative z-10">
          <h4 class="text-4xl font-black font-display italic text-white tracking-tighter">{stat.value}</h4>
          <div class="flex items-center gap-1 mb-1">
            <ArrowUpRight size={12} class={stat.color} />
            <span class="text-[10px] font-mono font-black {stat.color}">{stat.delta}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Top Students Grid -->
    <div class="lg:col-span-2 bg-[#02040a] border border-white/10 p-8 space-y-6">
      <div class="flex items-center justify-between">
        <p class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Trophy size={14} class="text-amber-500" />
          TOP_PERFORMERS_SNAPSHOT
        </p>
        <span class="text-[8px] font-mono font-black text-slate-700 uppercase">REALTIME_TRACKING</span>
      </div>

      <div class="space-y-1">
        {#each topPerformers as student}
          <div class="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-black text-sm text-slate-400">
                {student.name?.[0]}
              </div>
              <div>
                <p class="text-xs font-black text-white uppercase tracking-wider">{student.name}</p>
                <p class="text-[9px] font-mono font-black text-slate-600 uppercase mt-0.5">{student.games} GAMES // {student.winRate} WINRATE</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-black font-display italic text-amber-500 tracking-tighter">{student.rating}</p>
              <p class="text-[8px] font-mono font-black text-slate-700 uppercase">ELO_RATING</p>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Active Stream -->
    <div class="bg-[#02040a] border border-white/10 p-8 flex flex-col justify-between">
      <div class="space-y-6">
        <p class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Pulse size={14} class="text-blue-500 animate-pulse" />
          NETWORK_ACTIVITY
        </p>
        
        <div class="space-y-4">
          <div class="flex gap-3">
            <div class="w-1 bg-blue-500/30"></div>
            <div>
              <p class="text-[9px] font-mono font-black text-blue-400 uppercase tracking-tighter">LICHESS_HOOK_ESTABLISHED</p>
              <p class="text-[10px] text-slate-400 leading-tight mt-1">Sincronización masiva completada para el grupo 'A'. 24 nuevas partidas detectadas.</p>
            </div>
          </div>
          <div class="flex gap-3 opacity-50">
            <div class="w-1 bg-slate-800"></div>
            <div>
              <p class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-tighter">CACHE_UPDATE_PENDING</p>
              <p class="text-[10px] text-slate-500 leading-tight mt-1">Refrescando metadatos de puzzles para 12 alumnos.</p>
            </div>
          </div>
        </div>
      </div>

      <button class="w-full py-4 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all mt-8">
        MANUAL_FORCE_SYNC
      </button>
    </div>
  </div>
</div>
