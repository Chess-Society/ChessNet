<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CircleCheck,
    ArrowRight,
    BookOpen,
    Users,
    Trophy,
    ChevronRight,
    School,
    Sparkles,
    Shield,
    Zap,
    BarChart3,
    Calendar,
    LayoutDashboard,
    Globe2,
    Command,
    Lock
  } from "lucide-svelte";
  import Logo from "$lib/components/Logo.svelte";
  import InsigniaBadge from "$lib/components/ui/InsigniaBadge.svelte";
  import { t, locale } from '$lib/i18n';
  import { INSIGNIAS } from '$lib/constants/insignias';

  let { data } = $props();
  let scrollY = $state(0);

  function goToLogin() {
    goto("/login");
  }
</script>

<svelte:head>
  <title>ChessNet | {$t('landing.hero.tag')}</title>
  <meta name="title" content="ChessNet | {$t('landing.hero.tag')}" />
  <meta name="description" content="{$t('landing.hero.desc')}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ChessNet" />
  <meta name="robots" content="index, follow" />
</svelte:head>

<svelte:window bind:scrollY />

<div class="relative min-h-screen bg-[#02040a] text-slate-200 selection:bg-primary-500/30 font-sans overflow-x-hidden">
  
  <!-- Pro Background Architecture -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute inset-0 bg-[#02040a]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.12)_0%,transparent_70%)]"></div>
    <!-- Technical Grid -->
    <div class="absolute inset-0 opacity-[0.03]" 
         style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 50px 50px;">
    </div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02040a_100%)]"></div>
  </div>

  <!-- Navbar -->
  <header
    class={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrollY > 20 ? "bg-[#02040a]/90 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-6"}`}
  >
    <nav class="flex items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="flex items-center gap-4 group">
          <div class="relative">
            <div class="absolute -inset-2 bg-primary-500/20 rounded-none blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Logo size="w-9 h-9" iconSize="w-5.5 h-5.5" />
          </div>
          <span class="text-xl font-display font-bold tracking-[-0.02em] text-white uppercase">ChessNet</span>
        </a>
      </div>
      
      <div class="hidden lg:flex lg:gap-x-12 items-center">
        <a href="#features" class="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors font-mono">01. {$t('nav.features')}</a>
        <a href="/pricing" class="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors font-mono">02. {$t('nav.pricing')}</a>
        <a href="/roadmap" class="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors font-mono">03. {$t('nav.roadmap')}</a>
      </div>

      <div class="flex lg:flex-1 lg:justify-end gap-6 items-center">
        <button onclick={goToLogin} class="hidden sm:block text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors font-mono">
          {$t('nav.login')}
        </button>
        <button onclick={goToLogin} class="bg-white hover:bg-primary-500 hover:text-white text-black transition-all rounded-none px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em]">
          {$t('nav.startFree')}
        </button>
      </div>
    </nav>
  </header>

  <main class="relative z-10">
    <!-- Hero Section -->
    <section class="relative pt-40 sm:pt-56 lg:pt-72 pb-40 px-6 overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-white/10 via-transparent to-transparent -z-10"></div>
      
      <div class="max-w-6xl mx-auto flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-3 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[9px] font-bold uppercase tracking-[0.3em] mb-12 animate-fade-in font-mono rounded-none">
          <span class="w-1 h-1 bg-primary-500 rounded-none"></span>
          <span>ESTADO SISTEMA</span>
          <span class="text-primary-900">/</span>
          <span class="text-primary-500/50">ESTABLE</span>
        </div>
        
        <h1 class="text-[clamp(2rem,6vw,5rem)] font-display font-bold tracking-[-0.03em] text-white mb-10 leading-[0.9] animate-slide-up uppercase">
          {@html $t('landing.hero.title').replace('y clubes', '<br /><span class="text-slate-500">y clubes</span>')}
        </h1>
        
        <p class="max-w-2xl text-base md:text-xl text-slate-500 leading-relaxed mb-16 animate-slide-up font-medium" style="animation-delay: 100ms">
          {$t('landing.hero.subtitle')}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-px animate-slide-up bg-white/5 border border-white/10 p-px" style="animation-delay: 200ms">
          <button onclick={goToLogin} class="bg-white hover:bg-primary-500 text-black hover:text-white px-12 py-6 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 transition-all w-full sm:w-auto rounded-none">
            EMPEZAR AHORA
            <ArrowRight class="w-4 h-4" />
          </button>
          <a href="#features" class="px-12 py-6 text-[10px] font-bold uppercase tracking-[0.3em] bg-black hover:bg-white/5 text-white transition-all w-full sm:w-auto border-l border-white/10 rounded-none">
            EXPLORAR SISTEMA
          </a>
        </div>
      </div>
    </section>

    <!-- Pro Visual Section -->
    <section class="max-w-7xl mx-auto px-6 mb-40">
        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/10 border border-white/10 overflow-hidden">
            <div class="lg:col-span-7 bg-[#02040a] p-1 shadow-inner relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.05)_0%,transparent_50%)]"></div>
                <div class="relative aspect-video bg-black/40 border border-white/5 flex flex-col">
                    <div class="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                        <div class="flex gap-1.5">
                            <div class="w-2 h-2 rounded-none bg-white/10"></div>
                            <div class="w-2 h-2 rounded-none bg-white/10"></div>
                            <div class="w-2 h-2 rounded-none bg-white/10"></div>
                        </div>
                        <div class="mx-auto bg-white/5 px-3 py-1 rounded-none text-[8px] text-slate-600 border border-white/5 font-mono">
                            chessnet.app/dashboard/analytics
                        </div>
                    </div>
                    <div class="flex-1 p-8 grid grid-cols-3 gap-6">
                        <div class="col-span-2 space-y-6">
                            <div class="h-8 bg-white/5 rounded-none w-1/3 border border-white/5"></div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="h-24 bg-white/[0.02] border border-white/5 rounded-none p-4 flex flex-col justify-between">
                                    <div class="w-4 h-4 bg-primary-500/20 rounded-none"></div>
                                    <div class="h-2 bg-white/5 w-1/2 rounded-none"></div>
                                </div>
                                <div class="h-24 bg-white/[0.02] border border-white/5 rounded-none p-4 flex flex-col justify-between">
                                    <div class="w-4 h-4 bg-indigo-500/20 rounded-none"></div>
                                    <div class="h-2 bg-white/5 w-1/2 rounded-none"></div>
                                </div>
                            </div>
                            <div class="h-40 bg-white/[0.02] border border-white/5 rounded-none relative overflow-hidden">
                                <div class="absolute bottom-0 left-0 w-full h-1/2 bg-primary-500/5 blur-3xl"></div>
                                <div class="flex items-end gap-1 px-4 pb-4 h-full">
                                    {#each Array(12) as _, i}
                                        <div class="flex-1 bg-primary-500/20 border-t border-primary-500/40" style="height: {20 + Math.random() * 60}%"></div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="h-8 bg-white/5 rounded-none w-full border border-white/5"></div>
                            {#each Array(5) as _}
                                <div class="h-12 bg-white/[0.02] border border-white/5 rounded-none flex items-center gap-3 px-3">
                                    <div class="w-6 h-6 bg-white/5 rounded-none"></div>
                                    <div class="space-y-2 flex-1">
                                        <div class="h-1 bg-white/10 w-1/2 rounded-none"></div>
                                        <div class="h-1 bg-white/5 w-1/3 rounded-none"></div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
            <div class="lg:col-span-5 bg-[#02040a] p-12 flex flex-col justify-center">
                <div class="flex items-center gap-3 mb-8">
                    <div class="w-8 h-8 rounded-none bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                      <Trophy class="w-4 h-4" />
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 font-mono">System Integrity</span>
                </div>
                <h2 class="text-4xl font-display font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase italic">
                    {@html $t('badges.evolve_prestige')}
                </h2>
                <p class="text-slate-500 text-sm font-medium leading-relaxed mb-10">
                    {$t('badges.header_desc')}
                </p>
                <div class="space-y-4">
                    {#each [
                        'Real-time synchronization',
                        'Multi-school support',
                        'Automated achievement engine'
                    ] as label}
                        <div class="flex items-center gap-4 text-[10px] font-black text-white uppercase tracking-widest font-mono">
                            <div class="w-1.5 h-px bg-white/20"></div>
                            {label}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <!-- Trust Stats -->
    <section class="py-32 border-y border-white/10 bg-black/40">
       <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            <div class="bg-[#02040a] py-16 px-8 text-center space-y-4 group">
               <span class="text-5xl font-display font-black text-white tracking-[-0.05em] block group-hover:text-primary-500 transition-colors">100%</span>
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono italic">SYST.SECURITY</p>
            </div>
            <div class="bg-[#02040a] py-16 px-8 text-center space-y-4 group">
               <span class="text-5xl font-display font-black text-white tracking-[-0.05em] block group-hover:text-indigo-500 transition-colors">ALPHA</span>
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono italic">DEPLOY.STATUS</p>
            </div>
            <div class="bg-[#02040a] py-16 px-8 text-center space-y-4 group">
               <span class="text-5xl font-display font-black text-white tracking-[-0.05em] block group-hover:text-primary-500 transition-colors">LIVE</span>
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono italic">SYNC.ENGINE</p>
            </div>
            <div class="bg-[#02040a] py-16 px-8 text-center space-y-4 group">
               <span class="text-5xl font-display font-black text-white tracking-[-0.05em] block group-hover:text-indigo-500 transition-colors">MODERN</span>
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono italic">CORE.ARCH</p>
            </div>
          </div>
       </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-56 px-6 relative">
      <div class="max-w-7xl mx-auto">
        <div class="mb-32 text-center">
            <div class="inline-block px-4 py-1.5 bg-white/[0.03] border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 font-mono italic">Capabilities</div>
          <h2 class="text-6xl md:text-8xl font-display font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.8]">{$t('landing.features.title')}</h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto font-medium">{$t('landing.features.desc')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          <div class="p-16 bg-[#02040a] hover:bg-white/[0.02] transition-all group flex flex-col">
            <div class="w-12 h-px bg-primary-500 mb-10 group-hover:w-full transition-all duration-700"></div>
            <h3 class="text-2xl font-black text-white mb-6 uppercase italic tracking-tight">{$t('landing.features.journal.title')}</h3>
            <p class="text-slate-500 leading-relaxed font-medium text-sm">{$t('landing.features.journal.desc')}</p>
            <div class="mt-auto pt-10 text-[9px] font-black text-primary-500 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase italic">Module_01 // Integrated</div>
          </div>

          <div class="p-16 bg-[#02040a] hover:bg-white/[0.02] transition-all group flex flex-col border-x border-white/10">
            <div class="w-12 h-px bg-indigo-500 mb-10 group-hover:w-full transition-all duration-700"></div>
            <h3 class="text-2xl font-black text-white mb-6 uppercase italic tracking-tight">{$t('nav.achievements')}</h3>
            <p class="text-slate-500 leading-relaxed font-medium text-sm">{$t('badges.header_desc')}</p>
            <div class="mt-auto pt-10 text-[9px] font-black text-indigo-500 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase italic">Module_02 // Integrated</div>
          </div>

          <div class="p-16 bg-[#02040a] hover:bg-white/[0.02] transition-all group flex flex-col">
            <div class="w-12 h-px bg-violet-500 mb-10 group-hover:w-full transition-all duration-700"></div>
            <h3 class="text-2xl font-black text-white mb-6 uppercase italic tracking-tight">{$t('landing.features.tournaments.title')}</h3>
            <p class="text-slate-500 leading-relaxed font-medium text-sm">{$t('landing.features.tournaments.desc')}</p>
            <div class="mt-auto pt-10 text-[9px] font-black text-violet-500 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase italic">Module_03 // Integrated</div>
          </div>

          <div class="p-16 bg-[#02040a] hover:bg-white/[0.02] transition-all group lg:col-span-2 flex items-center gap-16 border-t border-white/10">
              <div class="flex-1">
                <div class="w-12 h-px bg-primary-500 mb-10 group-hover:w-full transition-all duration-700"></div>
                <h3 class="text-2xl font-black text-white mb-6 uppercase italic tracking-tight">{$t('landing.features.crm.title')}</h3>
                <p class="text-slate-500 leading-relaxed font-medium text-sm">{$t('landing.features.crm.desc')}</p>
              </div>
              <div class="hidden md:flex w-64 h-32 bg-black border border-white/5 items-center justify-center relative overflow-hidden group-hover:border-primary-500/20 transition-colors">
                  <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]"></div>
                  <Users class="w-8 h-8 text-slate-800" />
              </div>
          </div>

          <div class="p-16 bg-[#02040a] hover:bg-white/[0.02] transition-all group flex flex-col border-l border-t border-white/10">
            <div class="w-12 h-px bg-amber-500 mb-10 group-hover:w-full transition-all duration-700"></div>
            <h3 class="text-2xl font-black text-white mb-6 uppercase italic tracking-tight">{$t('landing.features.technical.title')}</h3>
            <p class="text-slate-500 leading-relaxed font-medium text-sm">{$t('landing.features.technical.desc')}</p>
            <div class="mt-auto pt-10 text-[9px] font-black text-amber-500 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase italic">Module_05 // Core</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-56 px-6 bg-black/40 border-y border-white/10">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-32">
            <div class="inline-block px-4 py-1.5 bg-white/[0.03] border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 font-mono italic">Access models</div>
          <h2 class="text-6xl md:text-8xl font-display font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.8]">{$t('landing.pricing.title')}</h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto font-medium">{$t('landing.pricing.desc')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
          <div class="p-20 bg-[#02040a] flex flex-col items-center text-center group">
            <h3 class="text-[10px] font-black text-slate-600 mb-12 uppercase tracking-[0.4em] font-mono">{$t('pricing.free.title')}</h3>
            <div class="flex items-baseline gap-2 mb-16">
              <span class="text-8xl font-display font-black text-white tracking-tighter">{$t('pricing.free.price')}</span>
              <span class="text-slate-700 font-bold uppercase text-[10px] font-mono tracking-widest italic">{$t('pricing.free.period')}</span>
            </div>
            <ul class="space-y-6 mb-20 text-slate-500 font-medium text-sm text-left w-full max-w-xs">
              {#each [1, 2, 3, 4] as i}
                <li class="flex items-center gap-4">
                  <div class="w-1 h-1 bg-slate-800 rounded-none"></div>
                  <span>{$t(`pricing.free.feat${i}`)}</span>
                </li>
              {/each}
            </ul>
            <button onclick={goToLogin} class="w-full py-6 rounded-none bg-white/5 border border-white/10 hover:bg-white/[0.02] hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em]">{$t('landing.hero.cta.free')}</button>
          </div>

          <div class="p-20 bg-[#02040a] flex flex-col items-center text-center relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-8">
              <Sparkles class="w-6 h-6 text-primary-500 opacity-20" />
            </div>
            <h3 class="text-[10px] font-black text-primary-400 mb-12 uppercase tracking-[0.4em] font-mono">{$t('pricing.premium.title')}</h3>
            <div class="flex items-baseline gap-2 mb-16">
              <span class="text-8xl font-display font-black text-white tracking-tighter">{$t('pricing.premium.price')}</span>
              <span class="text-primary-500/40 font-bold uppercase text-[10px] font-mono tracking-widest italic">{$t('pricing.premium.period')}</span>
            </div>
            <ul class="space-y-6 mb-20 text-slate-300 font-medium text-sm text-left w-full max-w-xs">
              {#each [1, 2, 3, 4] as i}
                <li class="flex items-center gap-4">
                  <div class="w-4 h-px bg-primary-500"></div>
                  <span>{$t(`pricing.premium.feat${i}`)}</span>
                </li>
              {/each}
            </ul>
            <button onclick={goToLogin} class="w-full py-6 rounded-none bg-primary-600 hover:bg-primary-500 text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary-500/20">{$t('pricing.premium.cta')}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-64 px-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.03)_0%,transparent_70%)]"></div>
      <div class="max-w-5xl mx-auto text-center relative z-10">
        <h2 class="text-6xl md:text-9xl font-display font-black text-white mb-12 uppercase tracking-[-0.05em] leading-[0.8] italic">
           {$t('landing.cta.title')}
        </h2>
        <p class="text-xl text-slate-500 mb-20 font-medium max-w-2xl mx-auto leading-relaxed">{$t('landing.cta.desc')}</p>
        <button onclick={goToLogin} class="bg-white text-black hover:bg-primary-500 hover:text-white rounded-none px-16 py-8 text-xs font-black uppercase tracking-[0.4em] transition-all shadow-2xl inline-flex items-center gap-6">
          {$t('landing.cta.button')}
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </section>
  </main>

  <footer class="py-32 px-6 border-t border-white/10 bg-[#02040a]">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
      <div class="space-y-10">
        <a href="/" class="flex items-center gap-4">
          <Logo size="w-10 h-10" iconSize="w-6 h-6" />
          <span class="text-2xl font-display font-black tracking-[-0.05em] text-white uppercase italic">ChessNet</span>
        </a>
        <p class="text-slate-600 max-w-xs text-[9px] font-black uppercase tracking-[0.3em] leading-relaxed italic">
           {$t('landing.footer.slogan')}
        </p>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-24">
         <div class="space-y-8">
           <h4 class="text-[10px] font-black text-white uppercase tracking-[0.3em] font-mono italic">Platform</h4>
           <div class="flex flex-col gap-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
             <a href="#features" class="hover:text-white transition-colors">{$t('nav.features')}</a>
             <a href="/pricing" class="hover:text-white transition-colors">{$t('nav.pricing')}</a>
             <a href="/roadmap" class="hover:text-white transition-colors">{$t('nav.roadmap')}</a>
           </div>
         </div>
         <div class="space-y-8">
           <h4 class="text-[10px] font-black text-white uppercase tracking-[0.3em] font-mono italic">Governance</h4>
           <div class="flex flex-col gap-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <a href="/faq" class="hover:text-white transition-colors">FAQ_SYS</a>
              <a href="/panel/support" class="hover:text-white transition-colors">{$t('support.title') || 'Support'}</a>
              <a href="/legal/terms" class="hover:text-white transition-colors">{$t('nav.terms')}</a>
              <a href="/legal/privacy" class="hover:text-white transition-colors">{$t('nav.privacy')}</a>
           </div>
         </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
       <p class="text-slate-700 text-[9px] font-black uppercase tracking-[0.4em] font-mono">© {new Date().getFullYear()} CHESSNET_SYSTEMS. V4.0.0_PRODUCTION</p>
       <div class="flex items-center gap-6 text-slate-700 text-[9px] font-black uppercase tracking-[0.2em] italic font-mono">
          <span class="flex items-center gap-2 underline underline-offset-4 decoration-primary-500/30">Latency: 24ms</span>
          <span class="flex items-center gap-2 underline underline-offset-4 decoration-indigo-500/30">Stable: Tier-1</span>
       </div>
    </div>
  </footer>
</div>

<style lang="postcss">
  :global(html) {
    scroll-behavior: smooth;
    background: #02040a;
  }

  :global(.font-display) {
    font-family: 'Outfit', sans-serif;
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>

