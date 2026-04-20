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
    Pulse
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
      totalInsignias: number;
      totalRevenue: number;
    };
  }

  let { stats }: Props = $props();

  const primaryCards = $derived([
    {
      label: $t('admin.stats.total_revenue'),
      value: `${stats.totalRevenue.toLocaleString()}€`,
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
      label: $t('admin.stats.insignias'),
      value: stats.totalInsignias || 0,
       icon: Crown,
      color: 'from-amber-400 to-orange-500',
      sub: $t('admin.stats.insignias_sub')
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
</script>

<div class="space-y-8">
  <!-- Primary Insights -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
    {#each primaryCards as card, i}
      {@const Icon = card.icon}
      <div class="relative group" in:fade={{ delay: i * 150 }}>
        <div class="absolute -inset-1 bg-gradient-to-r {card.color} rounded-none opacity-10 group-hover:opacity-20 transition duration-500 blur-xl"></div>
        <div class="relative bg-black/40 backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-none overflow-hidden">
          <div class="flex items-center justify-between mb-4 md:mb-8">
            <div class="p-3 md:p-4 bg-white/5 rounded-none border border-white/10">
              <Icon weight="duotone" class="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div class="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-none">
              <span class="w-1.5 h-1.5 rounded-none bg-violet-500 animate-pulse"></span>
              <span class="text-[8px] font-black text-violet-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
          
          <div class="space-y-1">
            <p class="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{card.label}</p>
            <h3 class="text-4xl md:text-6xl font-black font-display tracking-tighter text-white italic leading-none">
              {card.value}
            </h3>
            <p class="text-[10px] md:text-xs font-bold text-slate-400 mt-4 tracking-tight">{card.description}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Operational Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
    {#each secondaryCards as card, i}
      {@const Icon = card.icon}
      <div class="relative group" in:fade={{ delay: 300 + (i * 100) }}>
        <div class="bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 p-8 rounded-none transition-all duration-300">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-2.5 bg-white/5 rounded-none border border-white/10 group-hover:scale-110 transition-transform">
              <Icon weight="duotone" class="w-5 h-5 text-white/70" />
            </div>
            <div>
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{card.label}</p>
              <p class="text-[8px] font-bold text-slate-600 uppercase italic leading-none">{card.sub}</p>
            </div>
          </div>
          <h4 class="text-3xl font-black font-display italic text-white/90">
             {card.value.toLocaleString()}
          </h4>
        </div>
      </div>
    {/each}
  </div>
</div>
