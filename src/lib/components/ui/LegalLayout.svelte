<script lang="ts">
  import { ArrowLeft, Sparkles } from 'lucide-svelte';
  import Logo from '$lib/components/Logo.svelte';
  import { t } from '$lib/i18n';
  import { fade } from 'svelte/transition';

  let { children, title, subtitle, icon: Icon, updatedDate } = $props<{
    children: any,
    title: string,
    subtitle: string,
    icon: any,
    updatedDate?: string
  }>();
</script>

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
        <Icon class="w-4 h-4 text-primary-400" />
        <span class="text-xs font-bold text-white uppercase tracking-widest">{subtitle}</span>
      </div>
      <a href="/" class="flex items-center gap-2 text-surface-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {$t('common.home') || 'Home'}
      </a>
    </div>
  </header>

  <main class="relative z-10 max-w-4xl mx-auto px-6 py-12" in:fade>
    <div class="bento-card border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl">
      <div class="prose prose-invert prose-primary max-w-none">
        <div class="flex items-center gap-3 text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
          <Sparkles class="w-3.5 h-3.5 text-primary-500" />
          {updatedDate ? `${$t('legal.updated') || 'Updated'}: ${updatedDate}` : 'Official Protocol'}
        </div>

        <h1 class="text-4xl font-display font-black text-white mb-12 tracking-tight uppercase italic">{title}</h1>

        {@render children()}
      </div>
    </div>
  </main>

  <footer class="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center text-surface-600 text-[10px] font-black uppercase tracking-[0.3em]">
    &copy; {new Date().getFullYear()} ChessNet • Legal Department
  </footer>
</div>
