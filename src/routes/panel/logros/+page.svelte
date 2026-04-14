<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Trophy, 
    Medal, 
    Star, 
    Users, 
    CalendarBlank,
    CheckCircle,
    Lock,
    MagicWand,
    EnvelopeSimple
  } from 'phosphor-svelte';
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
      color: 'text-violet-400'
    },
    {
      id: 'first_class',
      title: 'Primer Grupo',
      desc: 'Crea tu primera clase o grupo.',
      condition: classes.length > 0,
      icon: Users,
      color: 'text-violet-400'
    },
    {
      id: 'mentor',
      title: 'Mentor de Talentos',
      desc: 'Ten al menos 10 alumnos matriculados.',
      condition: students.length >= 10,
      icon: Medal,
      color: 'text-violet-400'
    },
    {
      id: 'tournament_master',
      title: 'Organizador Jefe',
      desc: 'Organiza y completa 3 torneos.',
      condition: tournaments.filter(t => t.status === 'completed').length >= 3,
      icon: Trophy,
      color: 'text-violet-400'
    },
    {
      id: 'expert_mentor',
      title: 'Mentor Experto',
      desc: 'Ten al menos 50 alumnos matriculados.',
      condition: students.length >= 50,
      icon: Medal,
      color: 'text-violet-400'
    }
  ]);

  let unlockedCount = $derived(achievements.filter(a => a.condition).length);

</script>

<svelte:head>
  <title>Mis Logros - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-8" transition:fade>
  
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-500 shadow-lg shadow-violet-500/5">
        <Trophy weight="duotone" class="w-8 h-8" />
      </div>
      <div>
        <h1 class="text-3xl font-outfit font-extrabold text-white tracking-tight">Centro de Logros</h1>
        <p class="text-slate-400 font-plus-jakarta text-sm">Reconoce tu trayectoria y desbloquea hitos exclusivos.</p>
      </div>
    </div>

    <div class="bento-card p-1 border-violet-500/20 shadow-violet-500/5">
        <div class="bg-zinc-950/50 rounded-[20px] px-8 py-4 flex items-center gap-8">
             <div>
                 <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                 <p class="text-xl font-outfit font-black text-white">{unlockedCount >= 3 ? 'Leyenda' : 'Iniciado'}</p>
             </div>
             <div class="w-px h-10 bg-white/5"></div>
             <div class="text-right">
                 <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest mb-1">Completado</p>
                 <p class="text-xl font-outfit font-black text-violet-500">{unlockedCount} / {achievements.length}</p>
             </div>
        </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each achievements as achievement, i}
      <div 
        class="bento-card p-10 relative overflow-hidden group transition-all duration-500 {achievement.condition ? '' : 'opacity-40 grayscale'}"
        in:fly={{ y: 30, delay: i * 100 }}
      >
        {#if !achievement.condition}
           <div class="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="bg-zinc-900 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shadow-2xl">
                  <Lock weight="bold" class="w-5 h-5 text-slate-500" />
              </div>
           </div>
        {/if}

        <!-- Glow effect for unlocked -->
        {#if achievement.condition}
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 blur-[80px] rounded-full group-hover:bg-violet-600/20 transition-colors"></div>
        {/if}

        <div class="flex flex-col items-center text-center relative z-20">
            <div class="w-24 h-24 rounded-[32px] bg-zinc-950 border border-white/5 flex items-center justify-center mb-8 {achievement.condition ? 'shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] border-violet-500/20 scale-105' : ''} group-hover:scale-110 transition-all duration-500">
                <achievement.icon weight="duotone" class="w-12 h-12 {achievement.condition ? 'text-violet-400' : 'text-slate-600'}" />
            </div>
            
            <h3 class="text-xl font-outfit font-bold {achievement.condition ? 'text-white' : 'text-slate-500'} mb-3 tracking-tight">{achievement.title}</h3>
            <p class="text-sm text-slate-400 font-plus-jakarta px-4 leading-relaxed line-clamp-2">{achievement.desc}</p>
            
            <div class="mt-8">
              {#if achievement.condition}
                  <div class="flex items-center gap-2 text-[10px] font-outfit font-black text-violet-400 uppercase tracking-[0.15em] bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20 shadow-sm shadow-violet-500/10">
                      <CheckCircle weight="fill" class="w-4 h-4" />
                      Conseguido
                  </div>
              {:else}
                  <div class="text-[10px] font-outfit font-black text-slate-600 uppercase tracking-[0.2em] py-2">Bloqueado</div>
              {/if}
            </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-20 bento-card p-12 text-center relative overflow-hidden">
      <div class="absolute top-0 right-0 p-10 opacity-10 rotate-12">
        <MagicWand weight="duotone" class="w-40 h-40 text-violet-500" />
      </div>
      
      <div class="relative z-10">
        <h3 class="text-3xl font-outfit font-extrabold text-white mb-4 tracking-tight">¿Tienes ideas para nuevos hitos?</h3>
        <p class="text-slate-400 font-plus-jakarta max-w-2xl mx-auto mb-10 text-lg">Queremos que ChessNet celebre cada uno de tus logros. Envíanos tus propuestas para medallas y reconocimientos.</p>
        
        <a href="mailto:logros@chessnet.app" class="btn-pill bg-violet-600 hover:bg-violet-500 py-4 px-10 text-white shadow-violet-flare inline-flex items-center gap-3 group">
          <EnvelopeSimple weight="bold" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          Proponer Logros
        </a>
      </div>
  </div>
</div>
