<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { 
    ChartBar, 
    TrendUp, 
    Users, 
    CalendarBlank,
    Target,
    ChartPieSlice,
    ChartLine,
    ArrowUpRight,
    MagnifyingGlass,
    Star,
    Quotes
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { user as authUser } from '$lib/stores/auth';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));

  onMount(() => {
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
    }
  });

  // Datos reactivos
  let students = $derived($appStore.students || []);
  let schools = $derived($appStore.schools || []);
  let attendance = $derived($appStore.attendance || []);

  // Tasa de asistencia real
  const attendanceRate = $derived(() => {
    if (attendance.length === 0) return 0;
    const present = attendance.filter(a => a.status === 'P' || a.status === 'L').length;
    return Math.round((present / attendance.length) * 100);
  });

  // Cálculo de crecimiento (estudiantes creados en los últimos 30 días)
  const growthStats = $derived(() => {
    if (students.length === 0) return { count: 0, percent: 0 };
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newStudents = students.filter(s => {
      const createdAt = s.created_at ? new Date(s.created_at) : new Date(0);
      return createdAt > thirtyDaysAgo;
    }).length;

    const previousTotal = students.length - newStudents;
    const percent = previousTotal > 0 ? (newStudents / previousTotal) * 100 : 100;

    return { count: newStudents, percent: Math.round(percent) };
  });

  const stats = $derived(() => {
    const totalStudents = students.length;
    const totalSchools = schools.length;
    
    // Distribución por nivel
    const levels: Record<string, number> = {};
    students.forEach(s => {
      const level = s.grade || s.level || 'No level';
      levels[level] = (levels[level] || 0) + 1;
    });

    return { totalStudents, totalSchools, levels };
  });

  // Datos para gráfico de barras de alumnos por centro
  const studentsPerCenter = $derived(() => {
    return schools.map(s => ({
      name: s.name,
      count: students.filter(student => student.school_id === s.id).length
    })).sort((a,b) => b.count - a.count);
  });

</script>

<svelte:head>
  <title>Reports and Statistics - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-8" transition:fade>
  
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-500 shadow-lg shadow-violet-500/5">
        <ChartBar weight="duotone" class="w-8 h-8" />
      </div>
      <div>
        <h1 class="text-3xl font-outfit font-extrabold text-white tracking-tight">{$t('reports.title')}</h1>
        <p class="text-zinc-500 font-plus-jakarta text-sm">{$t('reports.subtitle')}</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      <!-- Sidebar Column -->
      <div class="lg:col-span-1 space-y-6">
          <!-- Level Distribution -->
          <div class="bento-card p-8">
              <h3 class="text-white font-outfit font-bold mb-8 flex items-center gap-3">
                  <ChartPieSlice weight="duotone" class="w-6 h-6 text-violet-400" />
                  {$t('reports.levels')}
              </h3>
              <div class="space-y-6">
                  {#each Object.entries(stats().levels) as [level, count]}
                      <div class="space-y-2">
                          <div class="flex justify-between items-end">
                              <span class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{level}</span>
                              <span class="text-sm font-outfit font-bold text-white">{count} <span class="text-slate-500 font-medium ml-1">({Math.round((count / stats().totalStudents) * 100)}%)</span></span>
                          </div>
                          <div class="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                class="h-full bg-violet-500 rounded-full transition-all duration-1000" 
                                style="width: {(count / stats().totalStudents) * 100}%"
                              ></div>
                          </div>
                      </div>
                  {/each}
                  {#if Object.keys(stats().levels).length === 0}
                      <p class="text-center text-slate-500 font-plus-jakarta text-sm py-4">{$t('reports.no_levels')}</p>
                  {/if}
              </div>
          </div>

          <!-- Growth Highlight -->
          <div class="bento-card bg-gradient-to-br from-violet-600/10 to-transparent p-8 text-center relative overflow-hidden group">
              <div class="absolute -top-6 -right-6 w-24 h-24 bg-violet-500/10 blur-2xl rounded-full"></div>
              <TrendUp weight="duotone" class="w-14 h-14 text-violet-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-outfit font-black text-2xl mb-2 tracking-tight">{$t('reports.growth')}</h4>
              <p class="text-violet-200/60 font-plus-jakarta text-sm mb-8">{$t('reports.growth_desc')}</p>
              <div class="flex items-center justify-center gap-2 text-4xl font-outfit font-black text-white">
                  <ArrowUpRight weight="bold" class="w-8 h-8 text-violet-400" />
                  +{growthStats().count}
              </div>
              <p class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest mt-2">{$t('reports.new_students')}</p>
          </div>
      </div>

      <!-- Main Statistics Content -->
      <div class="lg:col-span-2 bento-card p-10 flex flex-col">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <h3 class="text-white font-outfit font-bold flex items-center gap-3 text-xl tracking-tight">
                  <Users weight="duotone" class="w-8 h-8 text-violet-500" />
                  {$t('reports.students_per_center')}
              </h3>
              <div class="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-outfit font-bold text-slate-400 uppercase tracking-widest">
                  {$t('reports.updated_today')}
              </div>
          </div>

          <div class="space-y-10 flex-grow">
              {#if studentsPerCenter().length === 0}
                  <div class="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] text-slate-500 font-plus-jakarta gap-4">
                      <ChartLine weight="duotone" class="w-12 h-12 text-slate-700" />
                      <p class="italic">{$t('reports.no_center_data')}</p>
                  </div>
              {:else}
                  {#each studentsPerCenter() as center}
                      <div class="group">
                          <div class="flex justify-between items-end mb-3">
                              <div class="flex flex-col gap-1">
                                  <p class="text-sm font-outfit font-black text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{center.name}</p>
                                  <p class="text-[10px] text-zinc-500 font-outfit font-bold uppercase tracking-widest">{center.count} {$t('reports.enrolled')}</p>
                              </div>
                              <span class="text-3xl font-outfit font-black text-zinc-900 group-hover:text-violet-900/20 transition-colors">{Math.round((center.count / stats().totalStudents) * 100)}%</span>
                          </div>
                          <div class="h-4 bg-zinc-900 rounded-2xl overflow-hidden p-1.5 shadow-inner">
                              <div 
                                class="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                                style="width: {(center.count / stats().totalStudents) * 100}%"
                              ></div>
                          </div>
                      </div>
                  {/each}
              {/if}
          </div>

          <!-- Bottom Grid KPI -->
          <div class="mt-16 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-10">
              <div>
                  <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-2">{$t('reports.attendance')}</p>
                  <p class="text-4xl font-outfit font-black text-white">{attendanceRate()}%</p>
                  <div class="flex items-center gap-1 mt-1 text-violet-400">
                      <ArrowUpRight weight="bold" class="w-3 h-3" />
                      <span class="text-[10px] font-bold">Real-time</span>
                  </div>
              </div>
              <div>
                  <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-2">{$t('reports.retention')}</p>
                  <p class="text-4xl font-outfit font-black text-white">98%</p>
                  <div class="flex items-center gap-1 mt-1 text-violet-400">
                      <ArrowUpRight weight="bold" class="w-3 h-3" />
                      <span class="text-[10px] font-bold">Estimated</span>
                  </div>
              </div>
              <div>
                  <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-2">{$t('reports.satisfaction')}</p>
                  <p class="text-4xl font-outfit font-black text-violet-500 flex items-baseline">4.9<span class="text-lg text-slate-700 ml-1">/5</span></p>
                  <div class="flex gap-0.5 mt-1">
                      {#each Array(5) as _}
                          <Star weight="fill" class="w-2.5 h-2.5 text-violet-500" />
                      {/each}
                  </div>
              </div>
              <div>
                  <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-2">{$t('reports.subscriptions')}</p>
                  <p class="text-4xl font-outfit font-black text-white">{stats().totalStudents}</p>
                  <p class="text-[10px] font-medium text-slate-600 mt-1 italic">{$t('reports.active_now')}</p>
              </div>
          </div>
      </div>
  </div>

</div>
