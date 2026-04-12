<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Target, 
    Plus, 
    Edit, 
    Trash2,
    BookOpen,
    Trophy,
    ChevronRight,
    Search,
    Layers
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  let searchQuery = $state('');

  // Datos reactivos desde el store
  let skills = $derived($appStore.skills || []);

  const filteredSkills = $derived(() => {
    return skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const deleteSkill = (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (confirm(`¿Eliminar la habilidad/tema ${skill?.name}?`)) {
      appStore.removeSkill(id);
    }
  };
</script>

<svelte:head>
  <title>Temarios y Habilidades - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Temarios y Habilidades</h1>
          <p class="text-slate-400 text-sm">Define las competencias y el progreso curricular de tus alumnos.</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => goto('/panel/habilidades/create')}
      class="bg-yellow-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-900/20 flex items-center gap-2"
    >
      <Plus class="w-4 h-4" />
      Nueva Habilidad
    </button>
  </div>

  <div class="relative group mb-8">
    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
    <input
      type="text"
      placeholder="Buscar tema o habilidad..."
      bind:value={searchQuery}
      class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-yellow-500/50 outline-none transition-all backdrop-blur-xl"
    />
  </div>

  {#if filteredSkills().length === 0}
    <div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6">
      <div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">
        <Target class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">No hay habilidades configuradas</h2>
        <p class="text-slate-500 text-sm">Define los temas (aperturas, finales, táctica) para llevar el control de tus clases.</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredSkills() as skill, i}
        <div 
          class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-yellow-500/30 transition-all group relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <div class="flex items-center justify-between mb-6 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-yellow-500 font-bold text-lg group-hover:scale-110 transition-all">
                {skill.name[0].toUpperCase()}
              </div>
              <div>
                <h3 class="text-white font-bold leading-tight group-hover:text-yellow-400 transition-colors">{skill.name}</h3>
                <p class="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">{skill.category || 'General'}</p>
              </div>
            </div>

            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onclick={() => goto(`/panel/habilidades/${skill.id}/edit`)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-yellow-400 hover:border-yellow-500/30 transition-all"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteSkill(skill.id)}
                  class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
            </div>
          </div>

          <div class="space-y-3 mb-6 relative z-10">
             <div class="flex items-center gap-2 text-xs text-slate-400">
                <Layers class="w-3.5 h-3.5" />
                Nivel: {skill.level || 'Básico'}
             </div>
             {#if skill.description}
               <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {skill.description}
               </p>
             {/if}
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10">
            <button 
              onclick={() => goto(`/panel/habilidades/${skill.id}`)}
              class="flex items-center gap-1 text-[10px] font-bold text-yellow-500 uppercase tracking-wider hover:text-white transition-all group/btn"
            >
              DETALLES DEL TEMA
              <ChevronRight class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
