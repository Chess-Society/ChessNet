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
    ShieldCheck,
    Zap,
    Languages
  } from "lucide-svelte";
  import Logo from "$lib/components/Logo.svelte";
  import { t, locale, toggleLocale } from "$lib/i18n/translations";

  let { data } = $props();

  let scrollY = $state(0);

  function goToLogin() {
    goto("/login");
  }
</script>

<svelte:head>
  <title>ChessNet - {$t('landing.hero.tag')}</title>
  <meta
    name="title"
    content="ChessNet - {$t('landing.hero.tag')}"
  />
  <meta
    name="description"
    content="{$t('landing.hero.desc')}"
  />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ChessNet" />
  <meta name="robots" content="index, follow" />
</svelte:head>

<svelte:window bind:scrollY />

<div class="relative min-h-screen bg-bento-bg text-surface-200 selection:bg-primary-500/30 font-sans overflow-x-hidden">
  
  <!-- Decorative Background Glows -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-500/15 rounded-full blur-[140px] animate-pulse"></div>
    <div class="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[10%] left-[20%] w-[35%] h-[35%] bg-violet-500/8 rounded-full blur-[110px]"></div>
  </div>

  <!-- Navbar -->
  <header
    class={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrollY > 20 ? "bg-bento-bg/70 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-transparent py-6"}`}
  >
    <nav class="flex items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
          <div class="relative">
            <div class="absolute -inset-2 bg-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <Logo size="w-10 h-10" iconSize="w-6 h-6" />
          </div>
          <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
        </a>
      </div>
      
      <div class="hidden lg:flex lg:gap-x-10">
        <a href="#features" class="text-sm font-semibold text-surface-400 hover:text-white transition-colors">{$locale === 'es' ? 'Funciones' : 'Features'}</a>
        <a href="/pricing" class="text-sm font-semibold text-surface-400 hover:text-white transition-colors">{$t('nav.pricing')}</a>
        <a href="/roadmap" class="text-sm font-semibold text-surface-400 hover:text-white transition-colors">Roadmap</a>
      </div>

      <div class="flex lg:flex-1 lg:justify-end gap-4 items-center">
        <button 
          onclick={toggleLocale}
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold text-surface-300"
        >
          <Languages class="w-3.5 h-3.5" />
          { $locale === 'en' ? 'EN' : 'ES' }
        </button>
        <button onclick={goToLogin} class="hidden sm:block text-sm font-bold text-surface-400 hover:text-white transition-colors px-4">
          {$t('nav.login')}
        </button>
        <button onclick={goToLogin} class="btn-primary py-2.5 text-sm">
          {$t('nav.startFree')}
        </button>
      </div>
    </nav>
  </header>

  <main class="relative z-10">
    <!-- Hero Section -->
    <section class="relative pt-44 pb-32 px-6 overflow-hidden">
      <div class="max-w-5xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <Sparkles class="w-3.5 h-3.5" />
          <span>{$t('landing.hero.tag')}</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-display font-black tracking-tight text-white mb-8 leading-[0.9] animate-slide-up">
          {$t('landing.hero.title1')} <br />
          <span class="bg-gradient-to-r from-primary-400 via-violet-400 to-blue-400 bg-clip-text text-transparent italic">{$t('landing.hero.title2')}</span>
        </h1>
        
        <p class="max-w-2xl mx-auto text-lg md:text-xl text-surface-400 leading-relaxed mb-12 animate-slide-up" style="animation-delay: 100ms">
          {$t('landing.hero.desc')}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style="animation-delay: 200ms">
          <button onclick={goToLogin} class="btn-primary px-10 py-5 text-lg group">
            {$t('landing.hero.cta.free')}
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="#features" class="btn-secondary px-10 py-5 text-lg">
            {$t('landing.hero.cta.features')}
          </a>
        </div>

        <!-- Hero Graphic -->
        <div class="mt-24 relative max-w-6xl mx-auto animate-slide-up" style="animation-delay: 300ms">
          <div class="absolute -inset-1 bg-gradient-to-b from-primary-500/20 to-transparent rounded-[32px] blur-2xl"></div>
          <div class="relative bg-[#0A0A0B] border border-white/5 rounded-[32px] aspect-[16/9] shadow-2xl overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-blue-500/5"></div>
            <!-- Mockup Interface Elements -->
            <div class="absolute top-8 left-8 right-8 bottom-0 bg-[#121214] rounded-t-2xl border-t border-x border-white/5 p-6">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 rounded-xl bg-primary-500/20 animate-pulse"></div>
                <div class="space-y-2">
                  <div class="w-32 h-4 bg-white/10 rounded-full"></div>
                  <div class="w-20 h-2 bg-white/5 rounded-full"></div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-6">
                <div class="h-32 rounded-2xl bg-white/5 border border-white/5"></div>
                <div class="h-32 rounded-2xl bg-white/5 border border-white/5"></div>
                <div class="h-32 rounded-2xl bg-white/5 border border-white/5"></div>
              </div>
            </div>
            <!-- Glass Overlay on Hover -->
            <div class="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 transition-colors duration-700 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Features -->
    <section id="features" class="py-32 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-20">
          <h2 class="text-4xl md:text-5xl font-display font-black text-white mb-6">{$t('landing.features.title')}</h2>
          <p class="text-lg text-surface-400 max-w-xl">{$t('landing.features.desc')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
          <!-- Main Task Card -->
          <div class="md:col-span-3 bento-card">
            <div class="bento-card-inner">
              <div class="mb-auto">
                <div class="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-6">
                  <BookOpen class="w-6 h-6" />
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">{$t('landing.features.journal.title')}</h3>
                <p class="text-surface-400 leading-relaxed">{$t('landing.features.journal.desc')}</p>
              </div>
              <div class="mt-8 pt-6 border-t border-white/5 flex gap-4">
                <div class="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-bold uppercase tracking-widest">Real-time</div>
                <div class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest">Automation</div>
              </div>
            </div>
          </div>

          <!-- Small Card -->
          <div class="md:col-span-3 bento-card border-primary-500/20 bg-primary-500/[0.02]">
            <div class="bento-card-inner">
              <div class="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6">
                <Trophy class="w-6 h-6" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">{$t('landing.features.tournaments.title')}</h3>
              <p class="text-surface-400 leading-relaxed">{$t('landing.features.tournaments.desc')}</p>
            </div>
          </div>

          <!-- Long Card -->
          <div class="md:col-span-4 bento-card">
             <div class="bento-card-inner md:flex-row gap-10 items-center">
                <div class="flex-1">
                  <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                    <Users class="w-6 h-6" />
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-3">{$t('landing.features.crm.title')}</h3>
                  <p class="text-surface-400 leading-relaxed">{$t('landing.features.crm.desc')}</p>
                </div>
                <div class="w-full md:w-48 aspect-square rounded-2xl bg-white/5 border border-white/5 animate-pulse"></div>
             </div>
          </div>

          <!-- Another Card -->
          <div class="md:col-span-2 bento-card overflow-hidden">
            <div class="bento-card-inner">
               <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                <Zap class="w-6 h-6" />
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">{$t('landing.features.multischool.title')}</h3>
              <p class="text-surface-400">{$t('landing.features.multischool.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-32 px-6 relative">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-display font-black text-white mb-6">{$t('landing.pricing.title')}</h2>
        <p class="text-lg text-surface-400 mb-16 max-w-xl mx-auto">{$t('landing.pricing.desc')}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <!-- Free -->
          <div class="bento-card !rounded-[32px]">
            <div class="p-10">
              <h3 class="text-xl font-bold text-white mb-2">{$t('pricing.free.title')}</h3>
              <div class="flex items-baseline gap-1 mb-8">
                <span class="text-5xl font-black text-white italic">{$t('pricing.free.price')}</span>
                <span class="text-surface-500 font-bold uppercase tracking-widest text-xs">{$t('pricing.free.period')}</span>
              </div>
              <ul class="space-y-4 mb-10 text-surface-400 font-medium">
                {#each [1, 2, 3, 4] as i}
                  <li class="flex items-center gap-3">
                    <CircleCheck class="w-5 h-5 text-surface-600" />
                    <span>{$t(`pricing.free.feat${i}`)}</span>
                  </li>
                {/each}
              </ul>
              <button onclick={goToLogin} class="btn-secondary w-full py-4 font-bold">{$t('landing.hero.cta.free')}</button>
            </div>
          </div>

          <!-- Premium -->
          <div class="bento-card !rounded-[32px] border-primary-500/50 bg-primary-500/[0.03] relative overflow-hidden">
            <div class="absolute top-0 right-0 px-6 py-2 bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">BETA PROMO</div>
            <div class="p-10">
              <h3 class="text-xl font-bold text-primary-400 mb-2">{$t('pricing.premium.title')}</h3>
              <div class="flex items-baseline gap-1 mb-8">
                <span class="text-5xl font-black text-white italic">{$t('pricing.premium.price')}</span>
                <span class="text-primary-500/60 font-bold uppercase tracking-widest text-xs">{$t('pricing.premium.period')}</span>
              </div>
              <ul class="space-y-4 mb-10 text-surface-200 font-medium">
                {#each [1, 2, 3, 4] as i}
                  <li class="flex items-center gap-3">
                    <ShieldCheck class="w-5 h-5 text-primary-400" />
                    <span>{$t(`pricing.premium.feat${i}`)}</span>
                  </li>
                {/each}
              </ul>
              <button onclick={goToLogin} class="btn-primary w-full py-4 font-bold">{$t('pricing.premium.cta')}</button>
            </div>
          </div>
        </div>
        
        <p class="mt-12 text-[10px] text-surface-600 uppercase tracking-widest font-bold">
          { $locale === 'es' ? '* Precio promocional para primeros usuarios. Sin compromiso.' : '* Promotional price for early adopters. No commitment.' }
        </p>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-32 px-6">
      <div class="max-w-7xl mx-auto bento-card bg-gradient-to-br from-primary-600/20 to-bento-card border-primary-500/20 p-12 md:p-24 text-center">
        <h2 class="text-4xl md:text-7xl font-display font-black text-white mb-8 leading-tight">{$t('landing.cta.title')}</h2>
        <p class="text-xl text-surface-300 max-w-2xl mx-auto mb-12 italic">{$t('landing.cta.desc')}</p>
        <button onclick={goToLogin} class="btn-primary px-12 py-6 text-xl shadow-2xl shadow-primary-500/40">
          {$t('landing.cta.button')}
        </button>
      </div>
    </section>
  </main>

  <footer class="py-12 px-6 border-t border-white/5 relative z-10">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div class="flex items-center gap-3">
        <Logo size="w-8 h-8" iconSize="w-5 h-5" />
        <span class="text-xl font-display font-black tracking-tighter text-white">ChessNet</span>
      </div>
      <p class="text-surface-500 text-sm font-medium">© {new Date().getFullYear()} ChessNet. {$t('landing.footer.crafted')}</p>
      <div class="flex flex-wrap justify-center gap-6">
        <a href="/pricing" class="text-surface-500 hover:text-white transition-colors text-sm">{$t('nav.pricing')}</a>
        <a href="/roadmap" class="text-surface-500 hover:text-white transition-colors text-sm">Roadmap</a>
        <a href="/donate" class="text-surface-500 hover:text-white transition-colors text-sm">Donate</a>
        <a href="/legal/terms" class="text-surface-500 hover:text-white transition-colors text-sm">Terms</a>
        <a href="/legal/privacy" class="text-surface-500 hover:text-white transition-colors text-sm">Privacy</a>
      </div>
    </div>
  </footer>
</div>

<style lang="postcss">
  :global(html) {
    scroll-behavior: smooth;
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
