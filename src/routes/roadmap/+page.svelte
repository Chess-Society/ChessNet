<script lang="ts">
  import { 
    Map, 
    Zap, 
    Sparkles,
    CheckCircle2,
    Clock3,
    Construction,
    Lightbulb,
    Target,
    Users,
    LayoutDashboard,
    ArrowLeft,
    Trophy,
    GraduationCap,
    Puzzle
  } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { t, locale } from '$lib/i18n';

  const roadmapItems = [
    {
      status: 'released',
      title: 'roadmap.phase1_title',
      icon: LayoutDashboard,
      color: 'emerald',
      items: [
        'roadmap.phase1_desc1',
        'roadmap.phase1_desc2',
        'roadmap.phase1_desc3'
      ]
    },
    {
      status: 'in-progress',
      title: 'roadmap.phase2_title',
      icon: Zap,
      color: 'blue',
      items: [
        'roadmap.phase2_desc1',
        'roadmap.phase2_desc2',
        'roadmap.phase2_desc3'
      ]
    },
    {
      status: 'planned',
      title: 'roadmap.phase3_title',
      icon: Target,
      color: 'violet',
      items: [
        'roadmap.phase3_desc1',
        'roadmap.phase3_desc2',
        'roadmap.phase3_desc3'
      ]
    },
    {
      status: 'research',
      title: 'roadmap.ai_title',
      icon: Sparkles,
      color: 'amber',
      items: [
        'roadmap.ai_desc1',
        'roadmap.ai_desc2',
        'roadmap.ai_desc3'
      ]
    }
  ];

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'released': return 'admin.logs.success';
      case 'in-progress': return 'roadmap.status_current';
      case 'planned': return 'roadmap.status_next';
      case 'research': return 'roadmap.status_future';
      default: return 'roadmap.status_future';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'released': return CheckCircle2;
      case 'in-progress': return Construction;
      case 'planned': return Clock3;
      case 'research': return Lightbulb;
      default: return Lightbulb;
    }
  };

  const partners = [
    { name: 'Rexher Cup', logo: '/images/rexher-cup-logo.png', desc: 'Socio oficial de torneos élite' },
    { name: 'MindChess App', logo: '/images/mindchess-logo.png', desc: 'Plataforma líder en entrenamiento mental' }
  ];
</script>

<svelte:head>
  <title>{$t('nav.roadmap')} | ChessNet</title>
  <meta name="description" content={$t('roadmap.subtitle')} />
</svelte:head>

<div class="min-h-screen bg-[#02040a] text-zinc-300 font-sans selection:bg-primary-500/30 overflow-x-hidden">
    <!-- Premium Background Effects -->
    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div class="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[140px]"></div>
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

  <!-- Header / Nav -->
  <nav class="relative z-10 p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto border-b border-white/5 backdrop-blur-md bg-black/20">
    <a href="/" class="flex items-center gap-4 group">
      <div class="relative w-10 h-10 flex items-center justify-center">
        <div class="absolute -inset-2 bg-primary-500/20 rounded-none blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-full h-full" />
      </div>
      <span class="text-2xl font-black tracking-tighter text-white uppercase italic">ChessNet <span class="text-primary-500">OS</span></span>
    </a>
    
    <a href="/" class="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-[0.2em] transition-all group">
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {$t('roadmap.back')}
    </a>
  </nav>

  <!-- Hero Section -->
  <main class="relative z-10 max-w-7xl mx-auto px-6 py-24">
    <div class="max-w-3xl mb-32">
        <div class="inline-flex items-center gap-3 px-4 py-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Product Vision 2026</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.85] uppercase italic">
            El futuro del <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-primary-600">Ajedrez Profesional</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-2xl mb-12">
            Estamos construyendo la plataforma definitiva para academias y clubes. Descubre los próximos hitos en nuestra misión de digitalizar el ajedrez.
        </p>

        <div class="flex flex-wrap gap-12">
            <div class="space-y-1">
                <p class="text-4xl font-black text-white italic">v2.4</p>
                <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Versión Actual</p>
            </div>
            <div class="space-y-1">
                <p class="text-4xl font-black text-white italic">99.9%</p>
                <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Uptime Garantizado</p>
            </div>
            <div class="space-y-1">
                <p class="text-4xl font-black text-white italic">1.2k</p>
                <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Usuarios Activos</p>
            </div>
        </div>
    </div>

    <!-- Bento Roadmap Grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
        
        <!-- Big Active Phase Card -->
        {#each roadmapItems as phase, i}
          {@const StatusIcon = getStatusIcon(phase.status)}
          {@const isMajor = i === 1} <!-- Phase 2 as the major focus -->
          
          <div class="group relative overflow-hidden bg-[#0a0a0c] border border-white/5 hover:border-primary-500/30 transition-all duration-700
            {isMajor ? 'md:col-span-8 md:row-span-2' : 'md:col-span-4'}">
            
            <!-- Subtle Hover Gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="relative p-8 h-full flex flex-col">
                <div class="flex justify-between items-start mb-auto">
                    <div class="w-14 h-14 bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all">
                        <svelte:component this={phase.icon} class="w-7 h-7 text-zinc-500 group-hover:text-primary-400 transition-colors" />
                    </div>
                    
                    <div class="px-3 py-1 text-[8px] font-black uppercase tracking-widest border 
                        {phase.status === 'released' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                         phase.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                         'bg-white/5 text-zinc-600 border-white/10'}">
                        {$t(getStatusLabel(phase.status))}
                    </div>
                </div>

                <div class="mt-8">
                    <h3 class="text-3xl font-black text-white tracking-tighter uppercase italic mb-4">{$t(phase.title)}</h3>
                    <ul class="space-y-3">
                        {#each phase.items as item}
                            <li class="flex items-center gap-3 text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                <div class="w-1.5 h-1.5 {phase.status === 'released' ? 'bg-emerald-500' : 'bg-zinc-800 group-hover:bg-primary-500'} transition-colors"></div>
                                {$t(item)}
                            </li>
                        {/each}
                    </ul>
                </div>

                {#if isMajor}
                    <div class="mt-12 pt-8 border-t border-white/5">
                        <div class="flex items-center gap-4">
                            <div class="flex -space-x-2">
                                {#each Array(4) as _, i}
                                    <div class="w-8 h-8 rounded-none border border-[#02040a] bg-zinc-800 flex items-center justify-center text-[8px] font-black">
                                        USR
                                    </div>
                                {/each}
                            </div>
                            <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">+42 desarrolladores han votado esta fase</p>
                        </div>
                    </div>
                {/if}
            </div>
          </div>
        {/each}

        <!-- Community Card -->
        <div class="md:col-span-12 md:row-span-1 bg-gradient-to-r from-primary-600 to-indigo-900 p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 group overflow-hidden">
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10 text-center md:text-left">
                <h3 class="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic mb-2">Construyamos juntos</h3>
                <p class="text-white/70 font-medium max-w-xl">Nuestra comunidad en Discord es el epicentro de la innovación en ChessNet. Únete y propón tus propias funciones.</p>
            </div>
            <a href="https://discord.gg/G7SrFtJHnr" target="_blank" class="relative z-10 px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Unirse al Discord
            </a>
        </div>
    </div>

    <!-- Official Partners Section -->
    <section class="mt-40 border-t border-white/5 pt-24">
        <div class="text-center mb-20">
            <div class="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6">
                Official Ecosystem
            </div>
            <h2 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">Aliados Estratégicos</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {#each partners as partner}
                <div class="group relative p-12 bg-[#0a0a0c] border border-white/5 hover:border-primary-500/30 transition-all duration-500 flex flex-col items-center text-center overflow-hidden">
                    <!-- Background Glow -->
                    <div class="absolute -inset-24 bg-primary-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    <div class="relative w-56 h-56 mb-10 bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/5 group-hover:border-primary-500/20 transition-all duration-700 shadow-2xl">
                        <img src={partner.logo} alt={partner.name} class="max-w-[80%] max-h-[80%] object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                    </div>
                    
                    <div class="relative z-10">
                        <h3 class="text-3xl font-black text-white uppercase italic tracking-tight mb-4 group-hover:text-primary-400 transition-colors">{partner.name}</h3>
                        <p class="text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">{partner.desc}</p>
                    </div>

                    <!-- Decorative Corner -->
                    <div class="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/10 group-hover:border-primary-500/40 transition-colors"></div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Footer Footer -->
    <div class="mt-40 text-center pb-20">
        <p class="text-[10px] font-black text-zinc-700 uppercase tracking-[0.6em] mb-8">ChessNet Professional Operating System</p>
        <div class="flex justify-center gap-8 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <a href="/" class="hover:text-white transition-colors">Home</a>
            <a href="/pricing" class="hover:text-white transition-colors">Planes</a>
            <a href="mailto:soporte@chessnet.io" class="hover:text-white transition-colors">Soporte</a>
        </div>
    </div>
  </main>
</div>

<style>
    :global(.bento-card) {
        position: relative;
        background-color: #0a0a0c;
        border: 1px solid rgba(255, 255, 255, 0.05);
        overflow: hidden;
        transition: all 0.5s;
    }
</style>


