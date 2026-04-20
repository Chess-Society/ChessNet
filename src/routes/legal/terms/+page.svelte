<script lang="ts">
  import { ArrowLeft, AlertTriangle, FileText, Sparkles } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
  import { t } from '$lib/i18n';
</script>

<svelte:head>
  <title>{$t('legal.terms.title')} | ChessNet Premium</title>
</svelte:head>

<div class="min-h-screen bg-bento-bg text-surface-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
  
  <!-- Premium Background Effects -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 rounded-none blur-[140px] "></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-none blur-[100px]"></div>
  </div>

  <!-- Header -->
  <header class="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 sm:gap-8">
    <a href="/" class="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
      <div class="relative">
        <div class="absolute -inset-2 bg-primary-500/20 rounded-none blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3 px-4 py-2 rounded-none bg-white/5 border border-white/10">
        <FileText class="w-4 h-4 text-primary-400" />
        <span class="text-xs font-bold text-white uppercase tracking-widest">{$t('legal_terms')}</span>
      </div>
      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {$t('home')}
      </a>
    </div>
  </header>

  <main class="relative z-10 max-w-4xl mx-auto px-6 py-12">
    <!-- Beta Warning -->
    <div class="bento-card border-yellow-500/20 bg-yellow-500/5 p-6 mb-16 shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 inset-x-0 h-0.5 bg-yellow-500/30"></div>
      <div class="flex items-start gap-5">
        <div class="p-3 rounded-none bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 group-hover:scale-110 transition-transform">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-yellow-300 mb-2 flex items-center gap-2">
            {$t('legal.terms.beta_notice.title')}
            <span class="text-[10px] bg-yellow-500/20 px-2 py-0.5 rounded-none">{$t('legal.terms.beta_notice.tag')}</span>
          </h3>
          <p class="text-yellow-200/80 text-sm leading-relaxed">
            {@html $t('legal.terms.beta_notice.desc').replace('ChessNet', '<strong class="text-white">ChessNet</strong>')}
          </p>
        </div>
      </div>
    </div>

    <!-- Content Card -->
    <div class="bento-card border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl">
      <div class="prose prose-invert prose-primary max-w-none">
        <div class="flex items-center gap-3 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          <Sparkles class="w-3.5 h-3.5 text-primary-500" />
          {$t('legal.terms.updated')}: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <section class="mb-12">
          <h2 class="text-2xl font-display font-black text-white mb-6">{$t('legal.terms.section1.title')}</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            {@html $t('legal.terms.section1.desc').replace('ChessNet', '<span class="text-white font-bold">ChessNet</span>')}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-display font-black text-white mb-6">{$t('legal.terms.section2.title')}</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-6">
            {$t('legal.terms.section2.desc')}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            {#each [1, 2, 3, 4, 5, 6] as item}
              <div class="flex items-center gap-3 px-4 py-3 rounded-none bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm">
                <div class="w-1.5 h-1.5 rounded-none bg-primary-500"></div>
                {$t(`legal.terms.features.${item}`)}
              </div>
            {/each}
          </div>
        </section>

        <section class="mb-12 border-l-4 border-primary-500/30 pl-8 py-2 bg-primary-500/[0.02] rounded-r-2xl">
          <h2 class="text-2xl font-display font-black text-white mb-6">{$t('legal.terms.section3.title')}</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            {@html $t('legal.terms.section3.desc').replace(/30/g, '<span class="text-white font-bold">30</span>')}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-display font-black text-white mb-6">{$t('legal.terms.section4.title')}</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            {$t('legal.terms.section4.desc')}
          </p>
        </section>

        <section class="mt-16 pt-12 border-t border-white/10">
          <div class="text-center">
            <h3 class="text-xl font-bold text-white mb-6">{$t('legal.terms.support.title')}</h3>
            <p class="text-surface-400 mb-8 font-medium">{$t('legal.terms.support.desc')}</p>
            <a href="mailto:chessnetappweb@gmail.com" class="inline-flex items-center gap-3 px-6 py-3 rounded-none bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all group">
              {$t('legal.terms.support.button')}
              <ArrowLeft class="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center text-surface-600 text-[10px] font-black uppercase tracking-[0.3em]">
    &copy; {new Date().getFullYear()} {$t('legal.terms.footer')}
  </footer>
</div>

