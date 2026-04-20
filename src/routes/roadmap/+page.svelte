<script lang="ts">
  import { Map, Lock, Cloud, Cog, Smartphone, Zap, School, ArrowLeft, ArrowRight, Sparkles } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { t, locale } from '$lib/i18n';


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
      <div class="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-white/10 to-transparent"></div>

      <div class="space-y-24 relative">
        <!-- Phase 1 -->
        <div class="flex flex-col md:flex-row gap-8 items-start relative" in:fly={{ y: 50, duration: 800, delay: 200 }}>
          <div class="hidden md:flex flex-1 justify-end pt-2 pr-12 text-right">
            <span class="text-sm font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-4 py-1.5 rounded-none border border-primary-500/20 shadow-lg shadow-primary-500/5">{$t('roadmap.status_current')}</span>
          </div>
          <div class="absolute left-[-4px] md:left-1/2 md:ml-[-5px] top-6 w-2.5 h-2.5 rounded-none bg-primary-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] z-20"></div>
          <div class="flex-1 pl-8 md:pl-12 w-full">
            <div class="md:hidden mb-4">
              <span class="text-xs font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-none">{$t('roadmap.status_current')}</span>
            </div>
            <div class="bento-card !bg-primary-500/[0.02] border-white/5 p-8 md:p-10 hover:border-primary-500/40 transition-all group relative overflow-hidden">
              <div class="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <School class="w-40 h-40" />
              </div>
              <div class="flex items-center gap-5 mb-8">
                <div class="p-4 rounded-none bg-primary-500/10 text-primary-400 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/10">
                  <School class="w-7 h-7" />
                </div>
                <h3 class="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase italic ">{$t('roadmap.phase1_title')}</h3>
              </div>
              <ul class="space-y-4">
                <li class="flex items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-primary-500/50 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase1_desc1')}</span>
                </li>
                <li class="flex items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-primary-500/50 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase1_desc2')}</span>
                </li>
                <li class="flex items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-primary-500/50 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase1_desc3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Phase 2 -->
        <div class="flex flex-col md:flex-row-reverse gap-8 items-start relative" in:fly={{ y: 50, duration: 800, delay: 300 }}>
          <div class="hidden md:flex flex-1 justify-start pt-2 pl-12">
            <span class="text-sm font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-none border border-blue-500/20 shadow-lg shadow-blue-500/5">{$t('roadmap.status_next')}</span>
          </div>
          <div class="absolute left-[-4px] md:left-1/2 md:ml-[-5px] top-6 w-2.5 h-2.5 rounded-none bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"></div>
          <div class="flex-1 pr-0 md:pr-12 pl-8 md:pl-0 w-full text-right md:text-left">
             <div class="md:hidden mb-4">
              <span class="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-none">{$t('roadmap.status_next')}</span>
            </div>
            <div class="bento-card !bg-blue-500/[0.02] border-white/5 p-8 md:p-10 hover:border-blue-500/40 transition-all group relative overflow-hidden">
               <div class="absolute -left-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <Zap class="w-40 h-40" />
              </div>
              <div class="flex flex-row-reverse md:flex-row items-center gap-5 mb-8">
                <div class="p-4 rounded-none bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                  <Zap class="w-7 h-7" />
                </div>
                <h3 class="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase italic">{$t('roadmap.phase2_title')}</h3>
              </div>
              <ul class="space-y-4 text-right md:text-left">
                <li class="flex flex-row-reverse md:flex-row items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase2_desc1')}</span>
                </li>
                <li class="flex flex-row-reverse md:flex-row items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase2_desc2')}</span>
                </li>
                <li class="flex flex-row-reverse md:flex-row items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase2_desc3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Phase 3 -->
        <div class="flex flex-col md:flex-row gap-8 items-start relative" in:fly={{ y: 50, duration: 800, delay: 400 }}>
          <div class="hidden md:flex flex-1 justify-end pt-2 pr-12 text-right">
            <span class="text-sm font-black text-violet-400 uppercase tracking-widest bg-violet-500/10 px-4 py-1.5 rounded-none border border-violet-500/20 shadow-lg shadow-violet-500/5">{$t('roadmap.status_future')}</span>
          </div>
          <div class="absolute left-[-4px] md:left-1/2 md:ml-[-5px] top-6 w-2.5 h-2.5 rounded-none bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] z-20"></div>
          <div class="flex-1 pl-8 md:pl-12 w-full">
            <div class="md:hidden mb-4">
              <span class="text-xs font-black text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-none">{$t('roadmap.status_future')}</span>
            </div>
            <div class="bento-card !bg-violet-500/[0.02] border-white/5 p-8 md:p-10 hover:border-violet-500/40 transition-all group relative overflow-hidden">
              <div class="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <Smartphone class="w-40 h-40" />
              </div>
              <div class="flex items-center gap-5 mb-8">
                <div class="p-4 rounded-none bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/10">
                  <Smartphone class="w-7 h-7" />
                </div>
                <h3 class="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase italic">{$t('roadmap.phase3_title')}</h3>
              </div>
              <ul class="space-y-4">
                <li class="flex items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-violet-500/50 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase3_desc1')}</span>
                </li>
                <li class="flex items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-violet-500/50 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase3_desc2')}</span>
                </li>
                <li class="flex items-center gap-4 text-surface-400">
                  <div class="w-2 h-2 rounded-none bg-violet-500/50 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                  <span class="font-bold tracking-tight text-sm md:text-base">{$t('roadmap.phase3_desc3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Final CTA -->
    <div class="mt-32 text-center" in:fade={{ delay: 600 }}>
      <div class="bento-card border-primary-500/20 bg-primary-500/5 p-12 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles class="w-24 h-24 text-primary-500" />
        </div>
        <h2 class="text-3xl font-display font-black text-white mb-6 italic">{$t('roadmap.cta_title')}</h2>
        <p class="text-surface-400 mb-10 font-medium">{$t('roadmap.cta_desc')}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://discord.gg/G7SrFtJHnr" target="_blank" class="px-8 py-4 rounded-none bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-3 group">
            {$t('roadmap.discord')}
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="/login" class="px-8 py-4 rounded-none bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            {$t('roadmap.start')}
          </a>
        </div>
      </div>
    </div>
  </main>
</div>

