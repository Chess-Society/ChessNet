<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Calendar,
    Target,
    PieChart,
    ArrowUpRight,
    Search
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  // Datos reactivos
  let students = $derived($appStore.students || []);
  let centers = $derived($appStore.centers || []);
  let attendance = $derived($appStore.attendance || []);

  const stats = $derived(() => {
    const totalStudents = students.length;
    const totalCenters = centers.length;
    
    // Distribución por nivel
    const levels: Record<string, number> = {};
    students.forEach(s => {
      const level = s.level || 'Sin nivel';
      levels[level] = (levels[level] || 0) + 1;
    });

    return { totalStudents, totalCenters, levels };
  });

  // Datos para gráfico de barras de alumnos por centro
  const studentsPerCenter = $derived(() => {
    return centers.map(c => ({
      name: c.name,
      count: students.filter(s => s.centerId === c.id).length
    })).sort((a,b) => b.count - a.count);
  });

</script>

<svelte:head>
  <title>Informes y Estadísticas - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500">
          <BarChart3 class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Informes Avanzados</h1>
          <p class="text-slate-400 text-sm">Analiza el crecimiento y el rendimiento métrico de tu comunidad.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <!-- Resumen General -->
      <div class="lg:col-span-1 space-y-6">
          <div class="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
              <h3 class="text-white font-bold mb-6 flex items-center gap-2">
                  <PieChart class="w-5 h-5 text-cyan-500" />
                  Distribución por Nivel
              </h3>
              <div class="space-y-4">
                  {#each Object.entries(stats().levels) as [level, count]}
                      <div class="space-y-1.5">
                          <div class="flex justify-between text-xs font-bold uppercase tracking-widest">
                              <span class="text-slate-400">{level}</span>
                              <span class="text-white">{count} ({Math.round((count / stats().totalStudents) * 100)}%)</span>
                          </div>
                          <div class="h-2 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                class="h-full bg-cyan-500 transition-all duration-1000" 
                                style="width: {(count / stats().totalStudents) * 100}%"
                              ></div>
                          </div>
                      </div>
                  {/each}
                  {#if Object.keys(stats().levels).length === 0}
                      <p class="text-center text-slate-500 text-sm py-4">Sin datos de niveles.</p>
                  {/if}
              </div>
          </div>

          <div class="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-8 rounded-3xl border border-cyan-500/20 text-center">
              <TrendingUp class="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 class="text-white font-black text-xl mb-1">Crecimiento Mensual</h4>
              <p class="text-cyan-200 text-sm mb-6">Tu academia ha crecido un 8% respecto al trimestre anterior.</p>
              <div class="flex items-center justify-center gap-2 text-2xl font-black text-white">
                  <ArrowUpRight class="w-6 h-6 text-emerald-500" />
                  +{Math.round(stats().totalStudents * 0.08)} Alumnos
              </div>
          </div>
      </div>

      <!-- Gráfico Principal -->
      <div class="lg:col-span-2 bg-[#1e293b] p-8 rounded-3xl border border-slate-800">
          <div class="flex justify-between items-center mb-8">
              <h3 class="text-white font-bold flex items-center gap-2 text-lg">
                  <Users class="w-6 h-6 text-indigo-500" />
                  Alumnos por Centro
              </h3>
          </div>

          <div class="space-y-8">
              {#if studentsPerCenter().length === 0}
                  <div class="h-64 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 italic">
                      No hay datos suficientes para generar el desglose.
                  </div>
              {:else}
                  {#each studentsPerCenter() as center}
                      <div class="group">
                          <div class="flex justify-between items-end mb-2">
                              <div>
                                  <p class="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{center.name}</p>
                                  <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{center.count} Alumnos activos</p>
                              </div>
                              <span class="text-xl font-black text-slate-800 group-hover:text-indigo-900/40 transition-colors">{Math.round((center.count / stats().totalStudents) * 100)}%</span>
                          </div>
                          <div class="h-4 bg-slate-900 rounded-xl overflow-hidden p-1">
                              <div 
                                class="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg transition-all duration-1000 shadow-lg shadow-indigo-500/20" 
                                style="width: {(center.count / stats().totalStudents) * 100}%"
                              ></div>
                          </div>
                      </div>
                  {/each}
              {/if}
          </div>

          <div class="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 gap-8">
              <div>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Promedio Asistencia</p>
                  <p class="text-3xl font-black text-white">92%</p>
              </div>
              <div>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Satisfacción (NPS)</p>
                  <p class="text-3xl font-black text-emerald-400">4.9/5</p>
              </div>
          </div>
      </div>
  </div>

</div>
