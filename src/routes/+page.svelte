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
    Languages,
    BarChart3,
    Calendar,
    LayoutDashboard,
    Globe2,
    Command
  } from "lucide-svelte";
  import Logo from "$lib/components/Logo.svelte";
  import { t, locale, toggleLocale } from '$lib/i18n';
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

<div class="relative min-h-screen bg-[#020617] text-slate-200 selection:bg-primary-500/30 font-sans overflow-x-hidden">
  
  <!-- Sleek Professional Background -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(67,56,202,0.15)_0%,rgba(2,6,23,1)_80%)]"></div>
    <div class="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
         style="background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px); background-size: 80px 80px;">
    </div>
  </div>

  <!-- Navbar -->
  <header
    class={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrollY > 20 ? "bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}
  >
    <nav class="flex items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="flex items-center gap-3">
          <Logo size="w-10 h-10" iconSize="w-6 h-6" />
          <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
        </a>
      </div>
      
      <div class="hidden lg:flex lg:gap-x-10 items-center">
        <a href="#features" class="text-sm font-bold text-slate-400 hover:text-primary-400 transition-colors">{$t('nav.features')}</a>
        <a href="/pricing" class="text-sm font-bold text-slate-400 hover:text-primary-400 transition-colors">{$t('nav.pricing')}</a>
        <a href="/roadmap" class="text-sm font-bold text-slate-400 hover:text-primary-400 transition-colors">Roadmap</a>
      </div>

      <div class="flex lg:flex-1 lg:justify-end gap-5 items-center">
        <button 
          onclick={toggleLocale}
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black tracking-widest text-slate-300"
        >
          <Languages class="w-3.5 h-3.5" />
          { $locale === 'en' ? 'EN' : 'ES' }
        </button>
        <button onclick={goToLogin} class="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition-colors">
          {$t('nav.login')}
        </button>
        <button onclick={goToLogin} class="bg-primary-600 hover:bg-primary-500 text-white transition-all rounded-xl px-6 py-2.5 text-sm font-black shadow-lg shadow-primary-600/20">
          {$t('nav.startFree')}
        </button>
      </div>
    </nav>
  </header>

  <main class="relative z-10">
    <!-- Hero Section -->
    <section class="relative pt-64 pb-32 px-6">
      <div class="max-w-5xl mx-auto flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12 animate-fade-in">
          <Sparkles class="w-3.5 h-3.5" />
          <span>{$t('landing.hero.tag')}</span>
        </div>
        
        <h1 class="text-[clamp(3rem,8vw,6.5rem)] font-display font-black tracking-tighter text-white mb-8 leading-[0.9] animate-slide-up">
          {$t('landing.hero.title1')} <br />
          <span class="text-primary-500">{$t('landing.hero.title2')}</span>
        </h1>
        
        <p class="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed mb-12 animate-slide-up font-medium" style="animation-delay: 100ms">
          {$t('landing.hero.desc')}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-5 animate-slide-up mb-32" style="animation-delay: 200ms">
          <button onclick={goToLogin} class="bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 text-lg font-black rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-primary-600/20">
            {$t('landing.hero.cta.free')}
            <ArrowRight class="w-5 h-5" />
          </button>
          <a href="#features" class="px-10 py-5 text-lg font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-2xl">
            {$t('landing.hero.cta.features')}
          </a>
        </div>

        <!-- Product Preview -->
        <div class="relative w-full animate-slide-up-large" style="animation-delay: 300ms">
          <div class="absolute -inset-10 bg-primary-500/10 rounded-[3rem] blur-[80px]"></div>
          <div class="relative rounded-[32px] p-2 bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden">
            <img 
              src="/images/dashboard-mockup.png" 
              alt="ChessNet Dashboard Preview" 
              class="w-full h-auto rounded-[24px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Stats -->
    <section class="py-24 border-y border-white/5 bg-white/[0.01]">
       <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div class="space-y-2">
               <span class="text-4xl font-display font-black text-white">100%</span>
               <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Cloud</p>
            </div>
            <div class="space-y-2">
               <span class="text-4xl font-display font-black text-white">Global</span>
               <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessibility</p>
            </div>
            <div class="space-y-2">
               <span class="text-4xl font-display font-black text-white">Real-Time</span>
               <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sync & Control</p>
            </div>
            <div class="space-y-2">
               <span class="text-4xl font-display font-black text-white">Modern</span>
               <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Management</p>
            </div>
          </div>
       </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-48 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-24 text-center">
          <h2 class="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tighter uppercase">{$t('landing.features.title')}</h2>
          <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium">{$t('landing.features.desc')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Journal -->
          <div class="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-primary-500/20 hover:bg-white/[0.04] transition-all group">
            <div class="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-8">
              <LayoutDashboard class="w-7 h-7" />
            </div>
            <h3 class="text-2xl font-black text-white mb-4">{$t('landing.features.journal.title')}</h3>
            <p class="text-slate-400 leading-relaxed font-medium">{$t('landing.features.journal.desc')}</p>
          </div>

          <!-- Achievements -->
          <div class="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-violet-500/20 hover:bg-white/[0.04] transition-all group lg:row-span-2">
            <div class="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-8">
              <Trophy class="w-7 h-7" />
            </div>
            <h3 class="text-2xl font-black text-white mb-4">{$t('nav.achievements')}</h3>
            <p class="text-slate-400 leading-relaxed font-medium mb-8">{$t('badges.header_desc')}</p>
            
            <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {#each INSIGNIAS.slice(0, 10) as badge}
                {@const Icon = badge.icon}
                <div 
                  class="group/insignia relative flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-violet-500/30 transition-all cursor-help"
                  title={$t(badge.titleKey)}
                >
                  <div class="relative w-10 h-10 flex items-center justify-center {badge.color}">
                    <div class="absolute inset-0 {badge.glowColor} opacity-0 group-hover/insignia:opacity-20 blur-xl transition-opacity"></div>
                    <Icon weight="duotone" class="w-6 h-6" />
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Tournaments -->
          <div class="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.04] transition-all group">
            <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8">
              <Calendar class="w-7 h-7" />
            </div>
            <h3 class="text-2xl font-black text-white mb-4">{$t('landing.features.tournaments.title')}</h3>
            <p class="text-slate-400 leading-relaxed font-medium">{$t('landing.features.tournaments.desc')}</p>
          </div>

          <!-- CRM -->
          <div class="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-green-500/20 hover:bg-white/[0.04] transition-all group lg:col-span-2">
            <div class="flex flex-col md:flex-row gap-10 items-center">
              <div class="flex-1">
                <div class="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-8">
                  <Users class="w-7 h-7" />
                </div>
                <h3 class="text-2xl font-black text-white mb-4">{$t('landing.features.crm.title')}</h3>
                <p class="text-slate-400 leading-relaxed font-medium">{$t('landing.features.crm.desc')}</p>
              </div>
              <div class="w-full md:w-64 h-40 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center">
                 <BarChart3 class="w-12 h-12 text-slate-700" />
              </div>
            </div>
          </div>

          <!-- Technical -->
          <div class="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-primary-500/20 hover:bg-white/[0.04] transition-all group">
            <div class="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-8">
              <Lock class="w-7 h-7" />
            </div>
            <h3 class="text-2xl font-black text-white mb-4">Focus on Teaching</h3>
            <p class="text-slate-400 leading-relaxed font-medium">We take care of the technical side so you can focus on your students.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-48 px-6 bg-white/[0.01]">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-24">
          <h2 class="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tighter uppercase">{$t('landing.pricing.title')}</h2>
          <p class="text-xl text-slate-400 font-medium">{$t('landing.pricing.desc')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Free -->
          <div class="p-12 rounded-[48px] border border-white/5 bg-white/[0.02] flex flex-col items-center text-center">
            <h3 class="text-sm font-black text-slate-500 mb-8 uppercase tracking-widest">{$t('pricing.free.title')}</h3>
            <div class="flex items-baseline gap-2 mb-10">
              <span class="text-7xl font-black text-white">{$t('pricing.free.price')}</span>
              <span class="text-slate-600 font-bold uppercase text-[10px]">{$t('pricing.free.period')}</span>
            </div>
            <ul class="space-y-4 mb-12 text-slate-400 font-medium text-sm">
              {#each [1, 2, 3, 4] as i}
                <li class="flex items-center gap-3">
                  <CircleCheck class="w-4 h-4 text-slate-700" />
                  <span>{$t(`pricing.free.feat${i}`)}</span>
                </li>
              {/each}
            </ul>
            <button onclick={goToLogin} class="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm">{$t('landing.hero.cta.free')}</button>
          </div>

          <!-- Premium -->
          <div class="p-12 rounded-[48px] border border-primary-500/20 bg-primary-500/[0.03] flex flex-col items-center text-center relative overflow-hidden">
            <div class="absolute top-0 right-0 p-6">
              <Sparkles class="w-5 h-5 text-primary-400 opacity-30" />
            </div>
            <h3 class="text-sm font-black text-primary-400 mb-8 uppercase tracking-widest">{$t('pricing.premium.title')}</h3>
            <div class="flex items-baseline gap-2 mb-10">
              <span class="text-7xl font-black text-white">{$t('pricing.premium.price')}</span>
              <span class="text-primary-500/40 font-bold uppercase text-[10px]">{$t('pricing.premium.period')}</span>
            </div>
            <ul class="space-y-4 mb-12 text-slate-200 font-medium text-sm">
              {#each [1, 2, 3, 4] as i}
                <li class="flex items-center gap-3">
                  <Shield class="w-4 h-4 text-primary-500" />
                  <span>{$t(`pricing.premium.feat${i}`)}</span>
                </li>
              {/each}
            </ul>
            <button onclick={goToLogin} class="w-full py-4 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white transition-all font-black text-sm shadow-xl shadow-primary-500/20">{$t('pricing.premium.cta')}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-48 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-5xl md:text-7xl font-display font-black text-white mb-10 uppercase tracking-tighter leading-[0.9]">
           {$t('landing.cta.title')}
        </h2>
        <p class="text-xl text-slate-400 mb-12 font-medium opacity-70">{$t('landing.cta.desc')}</p>
        <button onclick={goToLogin} class="bg-white text-black hover:bg-slate-200 rounded-2xl px-12 py-6 text-xl font-black uppercase tracking-widest transition-all shadow-2xl">
          {$t('landing.cta.button')}
        </button>
      </div>
    </section>
  </main>

  <footer class="py-24 px-6 border-t border-white/5 bg-black/20">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
      <div class="space-y-8">
        <a href="/" class="flex items-center gap-3">
          <Logo size="w-10 h-10" iconSize="w-6 h-6" />
          <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
        </a>
        <p class="text-slate-500 max-w-xs text-xs font-bold uppercase tracking-widest leading-relaxed opacity-60">
           The high-performance ecosystem for chess education.
        </p>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-16">
         <div class="space-y-6">
           <h4 class="text-[10px] font-black text-white uppercase tracking-widest">Platform</h4>
           <div class="flex flex-col gap-4 text-xs font-bold text-slate-500">
             <a href="#features" class="hover:text-white transition-colors">Features</a>
             <a href="/pricing" class="hover:text-white transition-colors">Pricing</a>
             <a href="/roadmap" class="hover:text-white transition-colors">Roadmap</a>
           </div>
         </div>
         <div class="space-y-6">
           <h4 class="text-[10px] font-black text-white uppercase tracking-widest">Company</h4>
           <div class="flex flex-col gap-4 text-xs font-bold text-slate-500">
             <a href="/legal/terms" class="hover:text-white transition-colors">Terms</a>
             <a href="/legal/privacy" class="hover:text-white transition-colors">Privacy</a>
             <a href="mailto:contact@chessnet.com" class="hover:text-white transition-colors">Contact</a>
           </div>
         </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
       <p class="text-slate-600 text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} ChessNet. Alpha 4.0.0</p>
       <div class="flex items-center gap-4 text-slate-500 text-xs font-medium italic">
          <span>{$t('landing.footer.crafted').replace('{passion}', 'focus')}</span>
       </div>
    </div>
  </footer>
</div>

<style lang="postcss">
  :global(html) {
    scroll-behavior: smooth;
    background: #020617;
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

  .animate-slide-up-large {
    animation: slideUpLarge 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

  @keyframes slideUpLarge {
    from { transform: translateY(60px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>
