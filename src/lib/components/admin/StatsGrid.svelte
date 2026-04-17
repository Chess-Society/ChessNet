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
    };
  }

  let { stats }: Props = $props();

  const cards = $derived([
    {
      label: 'Usuarios Totales',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bg: 'blue',
      trend: `+${stats.recentUsers} esta semana`
    },
    {
      label: 'Profesores Premium',
      value: stats.premiumUsers,
      icon: Crown,
      color: 'from-amber-400 to-orange-500',
      bg: 'amber',
      trend: `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% conversión`
    },
    {
      label: 'Alumnos Activos',
      value: stats.totalStudents,
      icon: Student,
      color: 'from-emerald-400 to-teal-500',
      bg: 'emerald',
      trend: 'En crecimiento'
    },
    {
      label: 'Escuelas & Centros',
      value: stats.totalSchools,
      icon: Buildings,
      color: 'from-violet-500 to-purple-600',
      bg: 'violet',
      trend: `${stats.totalClasses} clases creadas`
    }
  ]);
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {#each cards as card, i}
    <div 
      class="relative group"
      in:fade={{ delay: i * 100 }}
    >
      <div class="absolute -inset-0.5 bg-gradient-to-r {card.color} rounded-[2.2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
      <div class="relative bg-[#0f172a]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-300 group-hover:translate-y-[-4px]">
        <!-- Gradient Mesh Backdrop -->
        <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gradient-to-br {card.color} opacity-[0.03] blur-3xl rounded-full"></div>
        
        <div class="flex items-start justify-between mb-6">
          <div class="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
            <card.icon weight="duotone" class="w-6 h-6 text-white" />
          </div>
          <div class="flex flex-col items-end">
             <div class="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
               <Pulse class="w-3 h-3" />
               Live
             </div>
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
          <h3 class="text-4xl font-black font-display tracking-tight text-white italic">
            {card.value.toLocaleString()}
          </h3>
        </div>

        <div class="mt-6 flex items-center gap-2">
          <span class="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-slate-400">
            {card.trend}
          </span>
        </div>
      </div>
    </div>
  {/each}
</div>
