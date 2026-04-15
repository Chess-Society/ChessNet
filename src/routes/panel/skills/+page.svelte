<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Target, 
    Plus, 
    PencilSimple, 
    Trash,
    BookOpen,
    Trophy,
    CaretRight,
    MagnifyingGlass,
    Stack,
    Star,
    Sparkle
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  let searchQuery = $state('');

  // Reactive data from the store
  let skills = $derived($appStore.skills || []);

  const filteredSkills = $derived(
    skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const deleteSkill = (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (confirm(`Delete the skill/topic "${skill?.name}"?`)) {
      appStore.removeSkill(id);
    }
  };
</script>

<svelte:head>
  <title>Curriculum & Skills - ChessNet</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 pb-24" in:fade={{ duration: 300 }}>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div class="flex items-center gap-5">
      <div class="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-[22px] flex items-center justify-center text-violet-500 shadow-lg shadow-violet-500/5">
        <Target weight="duotone" class="w-8 h-8" />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Curriculum & Skills</h1>
        <p class="text-zinc-500 text-sm font-medium">Define the curriculum and key competencies for your students.</p>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/skills/create')}
      class="px-6 py-3 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 text-sm font-bold group"
    >
      <Plus weight="bold" class="w-5 h-5 group-hover:rotate-90 transition-transform" />
      New Skill
    </button>
  </div>

  <!-- Search and Filters Section -->
  <div class="relative group">
    <MagnifyingGlass weight="bold" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
    <input
      type="text"
      placeholder="Search topic, opening or tactic..."
      bind:value={searchQuery}
      class="w-full bg-zinc-900/50 border border-zinc-800 rounded-[20px] pl-14 pr-6 py-4 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-600"
    />
  </div>

  {#if filteredSkills.length === 0}
    <div class="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[32px] p-24 text-center flex flex-col items-center gap-6" in:fade>
      <div class="w-20 h-20 bg-zinc-800/50 rounded-[28px] flex items-center justify-center text-zinc-600">
        <Sparkle weight="duotone" class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">No skills configured</h2>
        <p class="text-zinc-500 text-sm max-w-xs mx-auto">Create specific topics like openings, tactics or endgames to evaluate your students' real progress.</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredSkills as skill, i (skill.id)}
        <div 
          class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/50"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-zinc-800 border border-zinc-700/50 rounded-2xl flex items-center justify-center text-violet-400 font-bold text-xl group-hover:scale-105 group-hover:text-white group-hover:bg-zinc-700 transition-all duration-300">
                {skill.name[0].toUpperCase()}
              </div>
              <div class="flex flex-col">
                <h3 class="text-white font-bold leading-tight group-hover:text-violet-400 transition-colors uppercase tracking-tight line-clamp-1">{skill.name}</h3>
                <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  {skill.category || 'General Competency'}
                </span>
              </div>
            </div>

            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <button 
                onclick={() => goto(`/panel/skills/${skill.id}/edit`)}
                class="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:bg-violet-600 transition-all"
                title="Edit topic"
              >
                <PencilSimple weight="bold" class="w-4 h-4" />
              </button>
              <button 
                onclick={() => deleteSkill(skill.id)}
                class="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:bg-red-600 transition-all"
                title="Delete topic"
              >
                <Trash weight="bold" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Card Content -->
          <div class="space-y-4 mb-8">
             <div class="flex items-center gap-1.5">
                {#each Array(5) as _, starIndex}
                    <Star 
                        weight={starIndex < (skill.difficulty || 1) ? 'fill' : 'regular'} 
                        class="w-3.5 h-3.5 {starIndex < (skill.difficulty || 1) ? 'text-violet-400' : 'text-zinc-800'}" 
                    />
                {/each}
                <span class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Level {skill.difficulty || 1}</span>
             </div>
             {#if skill.description}
               <p class="text-sm text-zinc-400 leading-relaxed line-clamp-2 italic">
                  "{skill.description}"
               </p>
             {/if}
          </div>

          <!-- Card Footer -->
          <div class="pt-6 border-t border-zinc-800">
            <button 
              onclick={() => goto(`/panel/skills/${skill.id}`)}
              class="w-full bg-zinc-800/50 hover:bg-violet-600 text-zinc-300 hover:text-white flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group/btn"
            >
              Explore content
              <CaretRight weight="bold" class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>

          <!-- Subtle Glow effect -->
          <div class="absolute -bottom-16 -right-16 w-32 h-32 bg-violet-600/5 blur-[80px] rounded-full group-hover:bg-violet-600/20 transition-all duration-500"></div>
        </div>
      {/each}
    </div>
  {/if}
</div>

