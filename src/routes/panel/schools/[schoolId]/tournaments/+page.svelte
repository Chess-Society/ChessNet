<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    Trophy, 
    Plus, 
    CaretLeft,
    Gear,
    Sword,
    UsersThree,
    ChartLineUp,
    ShieldCheck,
    ArrowRight,
    Sparkle
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { t } from '$lib/i18n';
  import { fade, fly } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  const goBack = () => {
    goto(`/panel/schools/${data.schoolId}`);
  };

  const handleCreateTournament = () => {
    goto(`/panel/tournaments/create?schoolId=${data.schoolId}`);
  };
</script>

<svelte:head>
  <title>{$t('tournaments.school_tournaments_title')} - ChessNet</title>
</svelte:head>

<div class="space-y-12 pb-20 px-6 max-w-7xl mx-auto" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-12">
    <div class="space-y-8">
      <button 
        onclick={goBack}
        class="flex items-center gap-2 text-slate-500 hover:text-violet-400 transition-all group text-[11px] font-bold uppercase tracking-[0.2em]"
      >
        <div class="p-1.5 bg-white/5 border border-white/10 rounded-none group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all">
          <CaretLeft size={16} weight="bold" class="transition-transform group-hover:-translate-x-1" />
        </div>
        {$t('back')}
      </button>

      <div class="flex items-center gap-8">
        <div class="relative">
          <div class="absolute inset-0 bg-violet-500/20 blur-2xl rounded-none"></div>
          <div class="w-20 h-20 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/40 rounded-none flex items-center justify-center text-violet-400 shadow-2xl backdrop-blur-xl relative z-10 rotate-2 hover:rotate-0 transition-all duration-500 group">
            <Trophy size={40} weight="duotone" class="group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-4xl md:text-5xl font-outfit font-black text-white tracking-tighter uppercase line-clamp-1">
              {$t('tournaments.hub_title')}
            </h1>
          </div>
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-none border border-white/5 inline-block">
            {$t('tournaments.school_id')}: <span class="text-violet-400">{data.schoolId}</span>
          </p>
        </div>
      </div>
    </div>

    <button 
      onclick={handleCreateTournament}
      class="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-5 rounded-none text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-violet-flare flex items-center gap-3 group ring-1 ring-white/20"
    >
      <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform" />
      {$t('tournaments.new_tournament_btn')}
    </button>
  </div>

  <!-- Status / Welcome Bento -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 bento-card p-10 relative overflow-hidden group">
      <!-- Background Effect -->
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-violet-500/5 blur-[100px] rounded-none transition-all duration-1000 group-hover:bg-violet-500/10"></div>
      
      <div class="relative z-10 space-y-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Gear size={28} weight="duotone" />
          </div>
          <div>
            <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight italic">{$t('tournaments.module_configuring')}</h3>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{$t('tournaments.module_configuring_subtitle')}</p>
          </div>
        </div>
        
        <p class="text-slate-400 text-sm leading-relaxed max-w-2xl font-jakarta">
          {$t('tournaments.module_description')}
        </p>

        <div class="flex flex-wrap gap-4 pt-4">
          <button 
            onclick={handleCreateTournament}
            class="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-violet-400 hover:text-white transition-all shadow-2xl"
          >
            {$t('tournaments.create_first_tournament')}
          </button>
          <button class="px-8 py-4 bg-zinc-900 border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-violet-500/30 hover:text-white transition-all">
            {$t('tournaments.view_docs')}
          </button>
        </div>
      </div>
    </div>

    <div class="bento-card p-10 bg-emerald-500/5 border-emerald-500/20 flex flex-col justify-center items-center text-center gap-6 group hover:border-emerald-500/40 transition-all">
      <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 relative">
        <div class="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <ShieldCheck size={32} weight="duotone" />
      </div>
      <div>
        <p class="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] mb-2">STATUS CHECK</p>
        <p class="text-sm font-outfit font-bold text-emerald-400 uppercase leading-tight">
          {$t('tournaments.module_active')}
        </p>
      </div>
    </div>
  </div>

  <!-- Features Grid -->
  <div class="space-y-8">
    <div class="flex items-center gap-4 border-b border-white/5 pb-6">
      <div class="h-[2px] w-12 bg-violet-500"></div>
      <h2 class="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">{$t('tournaments.competition_engine')}</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Swiss -->
      <div class="bento-card p-8 group hover:border-violet-500/40 transition-all duration-500">
        <div class="flex items-center gap-6 mb-8">
          <div class="p-4 bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
            <Sword size={24} weight="duotone" />
          </div>
          <div>
            <h3 class="text-lg font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.swiss_tournaments')}</h3>
            <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{$t('tournaments.auto_pairing')}</p>
          </div>
        </div>
        <button class="w-full py-4 border border-white/5 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:border-violet-500/30 group-hover:text-white transition-all flex items-center justify-center gap-2">
          {$t('tournaments.explore_format')}
          <ArrowRight size={12} weight="bold" />
        </button>
      </div>

      <!-- Elimination -->
      <div class="bento-card p-8 group hover:border-emerald-500/40 transition-all duration-500">
        <div class="flex items-center gap-6 mb-8">
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
            <Sparkle size={24} weight="duotone" />
          </div>
          <div>
            <h3 class="text-lg font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.elimination_tournaments')}</h3>
            <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{$t('tournaments.direct_competitions')}</p>
          </div>
        </div>
        <button class="w-full py-4 border border-white/5 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:border-emerald-500/30 group-hover:text-white transition-all flex items-center justify-center gap-2">
          {$t('tournaments.explore_format')}
          <ArrowRight size={12} weight="bold" />
        </button>
      </div>

      <!-- Teams -->
      <div class="bento-card p-8 group hover:border-amber-500/40 transition-all duration-500">
        <div class="flex items-center gap-6 mb-8">
          <div class="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
            <UsersThree size={24} weight="duotone" />
          </div>
          <div>
            <h3 class="text-lg font-outfit font-black text-white uppercase tracking-tight">{$t('tournaments.team_tournaments')}</h3>
            <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{$t('tournaments.group_competitions')}</p>
          </div>
        </div>
        <button class="w-full py-4 border border-white/5 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:border-amber-500/30 group-hover:text-white transition-all flex items-center justify-center gap-2">
          {$t('tournaments.explore_format')}
          <ArrowRight size={12} weight="bold" />
        </button>
      </div>
    </div>
  </div>

  <!-- Bottom Quote -->
  <div class="pt-12 flex flex-col items-center gap-6 opacity-30 group hover:opacity-100 transition-opacity duration-1000">
    <div class="h-px w-24 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
    <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] text-center max-w-sm italic leading-relaxed">
      {$t('tournaments.quote')}
    </p>
    <div class="h-px w-24 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
  </div>
</div>


