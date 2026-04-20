<script lang="ts">
  import { ArrowLeft, Shield, Eye, Database, Lock, Sparkles, CheckCircle2 } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
  import { t } from '$lib/i18n';
</script>

<svelte:head>
  <title>{$t('legal.privacy.title')} | ChessNet Premium</title>
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
        <div class="absolute -inset-2 bg-violet-500/20 rounded-none blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <Logo size="w-10 h-10" iconSize="w-6 h-6" />
      </div>
      <span class="text-2xl font-display font-black tracking-tighter text-white">ChessNet</span>
    </a>
    
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3 px-4 py-2 rounded-none bg-white/5 border border-white/10">
        <Shield class="w-4 h-4 text-violet-400" />
        <span class="text-xs font-bold text-white uppercase tracking-widest">{$t('privacy_data')}</span>
      </div>
      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {$t('back')}
      </a>
    </div>
  </header>

  <main class="relative z-10 max-w-4xl mx-auto px-6 py-12">
    <div class="bento-card border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl">
      <div class="prose prose-invert prose-violet max-w-none">
        <div class="flex items-center gap-3 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          <Sparkles class="w-3.5 h-3.5 text-violet-500" />
          {$t('legal.privacy.protocol')}: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <section class="mb-16">
          <h2 class="text-3xl font-display font-black text-white mb-8 tracking-tight">{$t('legal.privacy.section1.title')}</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-10">
            {@html $t('legal.privacy.section1.desc').replace('ChessNet', '<span class="text-white font-bold">ChessNet</span>')}
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
            <div class="p-6 rounded-none bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Database class="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">{$t('legal.privacy.cards.identity.title')}</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• {$t('legal.privacy.cards.identity.item1')}</li>
                <li>• {$t('legal.privacy.cards.identity.item2')}</li>
                <li>• {$t('legal.privacy.cards.identity.item3')}</li>
              </ul>
            </div>
            <div class="p-6 rounded-none bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Eye class="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">{$t('legal.privacy.cards.usage.title')}</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• {$t('legal.privacy.cards.usage.item1')}</li>
                <li>• {$t('legal.privacy.cards.usage.item2')}</li>
                <li>• {$t('legal.privacy.cards.usage.item3')}</li>
              </ul>
            </div>
            <div class="p-6 rounded-none bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
              <Lock class="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 class="text-white font-bold mb-3">{$t('legal.privacy.cards.technical.title')}</h4>
              <ul class="text-xs text-surface-500 space-y-2 font-medium">
                <li>• {$t('legal.privacy.cards.technical.item1')}</li>
                <li>• {$t('legal.privacy.cards.technical.item2')}</li>
                <li>• {$t('legal.privacy.cards.technical.item3')}</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-display font-black text-white mb-6">{$t('legal.privacy.section2.title')}</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-6">{$t('legal.privacy.section2.desc')}</p>
          <div class="space-y-4 not-prose">
            {#each [1, 2, 3, 4] as item}
              <div class="flex items-center gap-4 text-surface-400 font-bold text-xs uppercase tracking-widest">
                <CheckCircle2 class="w-4 h-4 text-violet-500" />
                {$t(`legal.privacy.purpose.item${item}`)}
              </div>
            {/each}
          </div>
        </section>

        <section class="mb-16 border-l-4 border-violet-500/30 pl-8 py-2 bg-violet-500/[0.02] rounded-r-2xl">
          <h2 class="text-2xl font-display font-black text-white mb-6">{$t('legal.privacy.section3.title')}</h2>
          <p class="text-surface-400 font-medium leading-relaxed">
            {@html $t('legal.privacy.section3.desc').replace('Zero-Selling', '<span class="text-violet-400 font-bold italic">Zero-Selling</span>')}
          </p>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-display font-black text-white mb-6">{$t('legal.privacy.section4.title')}</h2>
          <p class="text-surface-400 font-medium leading-relaxed mb-8">{$t('legal.privacy.section4.desc')}</p>
          <div class="flex flex-wrap gap-2 not-prose">
            {#each [1, 2, 3, 4, 5] as item}
              <span class="px-3 py-1.5 rounded-none bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white tracking-wider">
                {$t(`legal.privacy.rights.item${item}`)}
              </span>
            {/each}
          </div>
        </section>

        <section class="mt-20 pt-12 border-t border-white/10 text-center">
          <h3 class="text-xl font-bold text-white mb-6">{$t('legal.privacy.sovereignty.title')}</h3>
          <p class="text-surface-400 mb-8 font-medium italic">{$t('legal.privacy.sovereignty.desc')}</p>
          <div class="inline-flex flex-col items-center gap-3">
             <span class="text-[10px] font-black text-surface-600 uppercase tracking-widest">{$t('legal.privacy.sovereignty.role')}</span>
             <a href="mailto:chessnetappweb@gmail.com" class="text-violet-400 font-bold hover:text-violet-300 transition-colors">chessnetappweb@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center text-surface-600 text-[10px] font-black uppercase tracking-[0.3em]">
    {$t('legal.privacy.footer')}
  </footer>
</div>

