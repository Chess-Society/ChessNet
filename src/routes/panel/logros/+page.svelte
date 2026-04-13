<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Trophy, 
    Award, 
    Medal, 
    Star, 
    Users, 
    Calendar,
    CheckCircle,
    Lock
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  // Datos reactivos
  let students = $derived($appStore.students || []);
  let classes = $derived($appStore.classes || []);
  let tournaments = $derived($appStore.tournaments || []);

  const achievements = $derived([
    {
      id: 'pioneer',
      title: 'Maestro Pionero',
      desc: 'Regístrate en la plataforma ChessNet.',
      condition: true,
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      id: 'first_class',
      title: 'Primer Grupo',
      desc: 'Crea tu primera clase o grupo.',
      condition: classes.length > 0,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      id: 'mentor',
      title: 'Mentor de Talentos',
      desc: 'Ten al menos 10 alumnos matriculados.',
      condition: students.length >= 10,
      icon: Award,
      color: 'text-emerald-400'
    },
    {
      id: 'tournament_master',
      title: 'Organizador Jefe',
      desc: 'Organiza y completa 3 torneos.',
      condition: tournaments.filter(t => t.status === 'completed').length >= 3,
      icon: Trophy,
      color: 'text-orange-400'
    },
    {
      id: 'expert_mentor',
      title: 'Mentor Experto',
      desc: 'Ten al menos 50 alumnos matriculados.',
      condition: students.length >= 50,
      icon: Medal,
      color: 'text-purple-400'
    }
  ]);

  let unlockedCount = $derived(achievements.filter(a => a.condition).length);

</script>

<svelte:head>
  <title>Mis Logros - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
          <Trophy class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Mis Logros</h1>
          <p class="text-slate-400 text-sm">Desbloquea medallas y reconoce tu progresión como docente.</p>
        </div>
      </div>
    </div>

    <div class="bg-amber-500 p-[2px] rounded-2xl shadow-lg shadow-amber-900/20">
        <div class="bg-[#0f172a] rounded-[14px] px-6 py-3 flex items-center gap-4">
             <div>
                 <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nivel de Instructor</p>
                 <p class="text-lg font-bold text-white">{unlockedCount >= 3 ? 'Avanzado' : 'Iniciado'}</p>
             </div>
             <div class="w-px h-8 bg-slate-800"></div>
             <div class="text-right">
                 <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Desbloqueados</p>
                 <p class="text-lg font-bold text-amber-400">{unlockedCount} / {achievements.length}</p>
             </div>
        </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each achievements as achievement, i}
      <div 
        class="bg-[#1e293b] border {achievement.condition ? 'border-amber-500/30' : 'border-slate-800 opacity-60'} rounded-3xl p-8 relative overflow-hidden group transition-all"
        in:fly={{ y: 20, delay: i * 50 }}
      >
        {#if !achievement.condition}
           <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="bg-slate-800 p-3 rounded-full border border-slate-700 shadow-xl">
                  <Lock class="w-6 h-6 text-slate-500" />
              </div>
           </div>
        {/if}

        <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 {achievement.condition ? 'shadow-2xl shadow-amber-500/10 scale-110' : ''} transition-transform">
                <achievement.icon class="w-10 h-10 {achievement.condition ? achievement.color : 'text-slate-600'}" />
            </div>
            
            <h3 class="text-xl font-bold {achievement.condition ? 'text-white' : 'text-slate-500'} mb-2">{achievement.title}</h3>
            <p class="text-sm text-slate-400 px-4 leading-relaxed">{achievement.desc}</p>
            
            {#if achievement.condition}
                <div class="mt-6 flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                    <CheckCircle class="w-3.5 h-3.5" />
                    Obtenido
                </div>
            {:else}
                <div class="mt-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Bloqueado</div>
            {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-16 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-10 text-center">
      <h3 class="text-2xl font-bold text-white mb-4">¿Tienes sugerencias para más logros?</h3>
      <p class="text-slate-300 max-w-2xl mx-auto mb-8">Queremos que ChessNet reconozca todo tu esfuerzo. Si crees que falta algún hito importante en la carrera de un profesor de ajedrez, cuéntanoslo.</p>
      <a href="mailto:logros@chessnet.app" class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block shadow-lg shadow-indigo-900/20">Enviar Sugerencia</a>
  </div>
</div>
