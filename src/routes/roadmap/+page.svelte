<script lang="ts">
  import { 
    Map, 
    Zap, 
    School, 
    ArrowLeft, 
    ArrowRight, 
    Sparkles,
    CheckCircle2,
    Clock3,
    Construction,
    Lightbulb,
    Target,
    Users,
    CreditCard,
    LayoutDashboard,
    Smartphone
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
  const votedFeatures = [
    { title: 'Generador de torneos suizos automático', votes: 124, category: 'roadmap.cat_tournaments' },
    { title: 'Generador de informes PDF avanzados', votes: 106, category: 'roadmap.cat_reports' },
    { title: 'Sistema de mensajería masiva por correo', votes: 82, category: 'roadmap.cat_admin' },
    { title: 'Calendario de eventos interactivo', votes: 75, category: 'roadmap.cat_core' }
  ];

  let voted = $state(new Set());

  const handleVote = (id: number) => {
    if (voted.has(id)) {
      voted.delete(id);
    } else {
      voted.add(id);
    }
  };
</script>

<svelte:head>
  <title>{$t('nav.roadmap')} | ChessNet</title>
  <meta name="description" content={$t('roadmap.subtitle')} />
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
    <!-- Decorative Background Glows -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 rounded-none blur-[140px] animate-pulse"></div>
        <div class="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-none blur-[120px]"></div>
    </div>

  <!-- Nav -->
  <nav class="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-primary-500/20 rounded-none blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    <div class="flex items-center gap-6 relative z-10">


      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {$t('roadmap.back')}
      </a>
    </div>
  </nav>

  <!-- Content -->
  <main class="relative z-10 max-w-5xl mx-auto px-6 py-20">
    <div class="text-center mb-24" in:fade={{ duration: 1000 }}>
      <div class="inline-flex items-center justify-center p-4 rounded-none bg-primary-500/10 text-primary-500 mb-8 border border-primary-500/20 shadow-xl shadow-primary-500/10">
        <Map class="w-10 h-10" />
      </div>
      
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white/5 border border-white/10 text-surface-400 text-[10px] font-black uppercase tracking-widest mb-6">
        <Sparkles class="w-3.5 h-3.5 text-primary-400" />
        <span>{$t('roadmap.feedback')}</span>
      </div>

      <h1 class="text-4xl md:text-6xl font-display font-black tracking-tight text-white mb-6">{$t('roadmap.title')}</h1>
      <p class="text-lg md:text-xl text-surface-400 leading-relaxed max-w-2xl mx-auto font-medium mb-10">
        {$t('roadmap.subtitle')}
      </p>
      
      <div class="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-5 py-2.5 rounded-none border border-yellow-500/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
        <Zap class="w-4 h-4" />
        {$t('roadmap.subject_feedback')}
      </div>
    </div>

    <div class="relative">
      <!-- Vertical Timeline Line -->
      <div class="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-white/5 to-transparent hidden md:block"></div>

      <div class="space-y-16 relative">
        {#each roadmapItems as phase, i}
          {@const StatusIcon = getStatusIcon(phase.status)}
          {@const ItemIcon = phase.icon}
          {@const isEven = i % 2 === 0}

          <div 
            class="flex flex-col md:flex-row gap-8 items-start relative {isEven ? '' : 'md:flex-row-reverse'}" 
            in:fly={{ y: 30, duration: 800, delay: 200 + (i * 100) }}
          >
            <!-- Desktop Status Side -->
            <div class="hidden md:flex flex-1 pt-2 {isEven ? 'justify-end pr-12 text-right' : 'justify-start pl-12 text-left'}">
              <div class="inline-flex flex-col {isEven ? 'items-end' : 'items-start'}">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-none 
                  {phase.status === 'released' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                   phase.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                   'bg-white/5 text-surface-400 border border-white/10'}"
                >
                  {$t(getStatusLabel(phase.status))}
                </span>
                <p class="text-[8px] font-mono text-surface-500 uppercase tracking-widest">ChessNet OS v{1 + (i*0.2)}.0</p>
              </div>
            </div>

            <!-- Timeline Node -->
            <div class="absolute left-[-4px] md:left-1/2 md:ml-[-8px] top-6 w-4 h-4 rounded-none border-2 border-[#02040a] shadow-xl z-20 
              {phase.status === 'released' ? 'bg-emerald-500 shadow-emerald-500/20' : 
               phase.status === 'in-progress' ? 'bg-blue-500 shadow-blue-500/20' : 
               'bg-zinc-800 shadow-white/5'}"></div>

            <!-- Content Card -->
            <div class="flex-1 {isEven ? 'pl-8 md:pl-12' : 'pr-0 md:pr-12 pl-8 md:pl-0'} w-full">
              <div class="md:hidden mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-none
                  {phase.status === 'released' ? 'bg-emerald-500/10 text-emerald-400' : 
                   phase.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' : 
                   'bg-white/5 text-surface-400'}">
                  {$t(getStatusLabel(phase.status))}
                </span>
              </div>

              <div class="bento-card border-white/5 p-8 md:p-10 hover:border-white/20 transition-all group relative overflow-hidden bg-white/[0.01]">
                <div class="absolute -right-8 -top-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                  <ItemIcon class="w-40 h-40" />
                </div>

                <div class="flex items-center gap-5 mb-8">
                  <div class="w-14 h-14 bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/20 transition-all">
                    <ItemIcon class="w-6 h-6" />
                  </div>
                  <div>
                    <h3 class="text-2xl font-display font-black text-white tracking-tight uppercase italic ">{$t(phase.title)}</h3>
                    <div class="flex items-center gap-2 mt-1">
                      <StatusIcon class="w-3 h-3 {phase.status === 'released' ? 'text-emerald-500' : 'text-surface-500'}" />
                      <span class="text-[8px] font-mono font-bold uppercase tracking-widest text-surface-500">
                        {phase.status === 'released' ? 'Despliegue completado' : 
                         phase.status === 'in-progress' ? 'En fase de desarrollo' : 'Priorizado para Q3/Q4'}
                      </span>
                    </div>
                  </div>
                </div>

                <ul class="space-y-5">
                  {#each phase.items as item}
                    <li class="flex items-start gap-4 group/item">
                      <div class="mt-1.5 w-1 h-1 rounded-none transition-all 
                        {phase.status === 'released' ? 'bg-emerald-500' : 'bg-surface-600 group-hover/item:bg-white'}"></div>
                      <span class="font-medium tracking-tight text-sm md:text-base text-surface-400 group-hover/item:text-white transition-colors">
                        {$t(item)}
                      </span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Community Voting Section -->
    <div class="mt-32 max-w-4xl mx-auto" in:fly={{ y: 30, duration: 800, delay: 600 }}>
      <div class="text-center mb-12">
        <h2 class="text-3xl font-display font-black text-white tracking-tighter uppercase italic mb-4">{$t('roadmap.cta_title')}</h2>
        <p class="text-surface-400 max-w-xl mx-auto">{$t('roadmap.cta_desc')}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each votedFeatures as feature, i}
          <button 
            onclick={() => handleVote(i)}
            class="group flex items-center justify-between p-6 bento-card border-white/5 hover:border-primary-500/30 transition-all text-left bg-white/[0.01]"
          >
            <div class="flex flex-col gap-1">
              <span class="text-[9px] font-mono text-primary-500 font-bold uppercase tracking-widest">{$t(feature.category)}</span>
              <span class="text-white font-medium group-hover:text-primary-400 transition-colors">{feature.title}</span>
            </div>
            <div class="flex flex-col items-center gap-1 pl-4 border-l border-white/5">
              <div class="p-2 rounded-none transition-all {voted.has(i) ? 'bg-primary-500 text-white' : 'bg-white/5 text-surface-400 group-hover:bg-white/10'}">
                <Sparkles class="w-4 h-4" />
              </div>
              <span class="text-[10px] font-mono font-bold {voted.has(i) ? 'text-primary-400' : 'text-surface-500'}">
                {feature.votes + (voted.has(i) ? 1 : 0)}
              </span>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Final Support/Discord CTA -->
    <div class="mt-32 pb-32 text-center" in:fade={{ duration: 1000, delay: 800 }}>
      <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-none mb-8">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-xs font-mono font-bold uppercase tracking-tighter text-surface-400">Soporte técnico activo 24/7</span>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-center gap-6">
        <a 
          href="https://discord.gg/G7SrFtJHnr" 
          target="_blank"
          class="group flex items-center gap-4 px-8 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all shadow-xl shadow-indigo-500/10"
        >
          <div class="p-2 bg-white/10">
            <Users class="w-6 h-6" />
          </div>
          <div class="text-left">
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-70">Únete a la comunidad</p>
            <p class="text-lg font-black tracking-tight italic uppercase">Acceder al Discord</p>
          </div>
          <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>

        <a 
          href="/" 
          class="group flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all"
        >
          <div class="p-2 bg-white/5">
            <LayoutDashboard class="w-6 h-6" />
          </div>
          <div class="text-left">
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-70">{$t('roadmap.back')}</p>
            <p class="text-lg font-black tracking-tight italic uppercase">Volver al Panel</p>
          </div>
        </a>
      </div>
    </div>
  </main>
</div>

