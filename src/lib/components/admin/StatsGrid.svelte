<script lang="ts">
  import { t } from '$lib/i18n';
  import { 
    Users, 
    Student, 
    Buildings, 
    ChalkboardTeacher, 
    Crown, 
    TrendUp,
    Clock,
    Pulse,
    Target,
    CheckCircle
  } from 'phosphor-svelte';
  import { fade, slide } from 'svelte/transition';

  interface Props {
    stats: {
      totalUsers: number;
      totalStudents: number;
      totalSchools: number;
      totalClasses: number;
      premiumUsers: number;
      recentUsers: number;
      totalRevenue: number;
      totalMissions: number;
      totalAssignments: number;
    };
  }

  let { stats }: Props = $props();

  const primaryCards = $derived([
    {
      label: $t('admin.stats.total_revenue'),
      value: `${(stats.totalRevenue ?? 0).toLocaleString()}€`,
      icon: TrendUp,
      color: 'from-violet-400 to-indigo-500',
      description: $t('admin.stats.total_revenue_desc')
    },
    {
      label: $t('admin.stats.conversion_premium'),
      value: `${((stats.premiumUsers / (stats.totalUsers || 1)) * 100).toFixed(1)}%`,
      icon: Crown,
      color: 'from-amber-400 to-orange-500',
      description: $t('admin.stats.premium_users_desc', { count: stats.premiumUsers })
    }
  ]);

  const secondaryCards = $derived([
    {
      label: $t('admin.stats.teachers'),
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      sub: $t('admin.stats.teachers_sub', { count: stats.recentUsers })
    },
    {
      label: $t('admin.stats.students'),
      value: stats.totalStudents,
      icon: Student,
      color: 'from-fuchsia-500 to-pink-600',
      sub: $t('admin.stats.students_sub')
    },
    {
      label: $t('admin.stats.schools'),
      value: stats.totalSchools,
      icon: Buildings,
      color: 'from-violet-500 to-purple-600',
      sub: $t('admin.stats.schools_sub')
    },
    {
      label: $t('admin.stats.classes'),
      value: stats.totalClasses,
      icon: ChalkboardTeacher,
      color: 'from-slate-400 to-slate-600',
      sub: $t('admin.stats.classes_sub')
    }
  ]);

  const gamificationCards = $derived([
    {
      label: 'Misiones Totales',
      value: stats.totalMissions,
      icon: Target,
      color: 'from-amber-500 to-orange-600',
      sub: 'Modelos de desafíos creados'
    },
    {
      label: 'Desafíos Activos',
      value: stats.totalAssignments,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      sub: 'Alumnos en progreso real'
    }
  ]);
</script>

<div class="space-y-8">
  <!-- Primary Insights -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 shadow-2xl">
    {#each primaryCards as card, i}
      {@const Icon = card.icon}
      <div class="relative bg-[#02040a] p-10 group overflow-hidden" in:fade={{ delay: i * 150 }}>
        <!-- Background Decorative Element -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] border-l border-b border-white/5 -mr-16 -mt-16 rotate-45 transition-transform group-hover:scale-110"></div>
        
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-12">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-primary-500 transition-all group-hover:text-white">
                <Icon weight="bold" class="w-6 h-6" />
              </div>
              <div class="h-px w-8 bg-white/10"></div>
              <p class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em]">{card.label}</p>
            </div>
            
            <div class="flex items-center gap-2">
              <div class="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-[8px] font-mono font-black text-violet-400 uppercase tracking-widest">
                REALTIME_DATA
              </div>
            </div>
          </div>
          
          <div class="mt-auto">
            <h3 class="text-6xl md:text-8xl font-black font-display tracking-[-0.04em] text-white italic leading-none mb-4 group-hover:translate-x-2 transition-transform duration-500">
              {card.value}
            </h3>
            <div class="flex items-end justify-between">
               <p class="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest max-w-[200px] leading-relaxed italic">{card.description}</p>
               <div class="flex gap-1">
                 {#each Array(5) as _, j}
                   <div class="w-1 h-3 bg-primary-500/20 {j < 3 ? 'bg-primary-500' : ''}"></div>
                 {/each}
               </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Operational Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
    {#each secondaryCards as card, i}
      {@const Icon = card.icon}
      <div class="relative bg-[#02040a] p-8 group transition-all hover:bg-white/[0.01]" in:fade={{ delay: 300 + (i * 100) }}>
        <div class="flex flex-col gap-6">
          <div class="flex items-start justify-between">
            <div class="w-10 h-10 bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
              <Icon weight="bold" class="w-5 h-5" />
            </div>
            <p class="text-[10px] font-mono font-black text-slate-800 italic">0{i + 1}</p>
          </div>
          
          <div>
            <p class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{card.label}</p>
            <h4 class="text-4xl font-black font-display italic text-white leading-none">
               {(card.value ?? 0).toLocaleString()}
            </h4>
            <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest mt-4 flex items-center gap-2">
              <span class="w-1 h-1 bg-slate-800"></span>
              {card.sub}
            </p>
          </div>
        </div>
        
        <!-- Bottom Scanline decoration -->
        <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white/5 overflow-hidden">
          <div class="h-full bg-primary-500/40 w-1/3 animate-[shimmer_3s_infinite]"></div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Gamification Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
    {#each gamificationCards as card, i}
      {@const Icon = card.icon}
      <div class="relative bg-violet-500/[0.02] p-8 group transition-all hover:bg-violet-500/[0.05]" in:fade={{ delay: 600 + (i * 100) }}>
        <div class="flex items-center gap-8">
            <div class="w-14 h-14 bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all">
              <Icon weight="fill" class="w-7 h-7" />
            </div>
            
            <div class="flex-1">
              <p class="text-[9px] font-mono font-black text-violet-500 uppercase tracking-[0.3em] mb-1">{card.label}</p>
              <div class="flex items-baseline gap-4">
                <h4 class="text-5xl font-black font-display italic text-white leading-none">
                   {(card.value ?? 0).toLocaleString()}
                </h4>
                <div class="h-px flex-1 bg-white/5 hidden sm:block"></div>
                <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest italic">{card.sub}</p>
              </div>
            </div>
        </div>
      </div>
    {/each}
  </div>
</div>
