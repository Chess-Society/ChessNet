<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    ChalkboardTeacher,
    CaretLeft,
    FloppyDisk,
    X,
    Buildings,
    Sparkle,
    CheckCircle,
    Info,
    PlusCircle,
    ArrowRight
  } from 'phosphor-svelte';
  import { showToast, showError } from '$lib/utils/toast';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let formData = $state({
    name: '',
    school_id: ''
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const schools = $derived(data.schools || []);
  
  const schoolIdFromUrl = $derived($page.url.searchParams.get('schoolId'));
  const isPreSelectedSchool = $derived(!!schoolIdFromUrl);
  
  $effect(() => {
    if (schoolIdFromUrl && schools.length > 0) {
      const schoolExists = (schools as any[]).find(s => s.id === schoolIdFromUrl);
      if (schoolExists) formData.school_id = schoolIdFromUrl;
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.school_id) newErrors.school_id = 'Debes seleccionar un centro';
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      isSubmitting = true;
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al crear la clase');
 
       showToast.success(`Clase creada exitosamente`);
       goto('/panel/clases');
     } catch (error) {
       showError(error);
     } finally {
       isSubmitting = false;
     }
   };
 
   const getSchoolName = (schoolId: string) => {
     return (schools as any[]).find(s => s.id === schoolId)?.name || '';
   };
</script>

<svelte:head>
  <title>Nueva Clase - ChessNet</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20" in:fade>
  {#if schools.length === 0}
    <div class="max-w-2xl mx-auto py-24 text-center space-y-8 bento-card rounded-24 p-12" in:fade>
      <div class="w-32 h-32 bg-violet-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-violet-600/20 text-violet-400">
        <Buildings weight="duotone" size={64} />
      </div>
      <div class="space-y-4">
        <h2 class="text-3xl font-black text-white tracking-tighter font-outfit uppercase">Centro Requerido</h2>
        <p class="text-zinc-400 text-lg max-w-md mx-auto font-jakarta">Para crear una clase, primero debes registrar una institución o centro escolar.</p>
      </div>
      <button 
        onclick={() => goto('/panel/centros/create')}
        class="btn-pill bg-violet-600 hover:bg-violet-500 text-white px-10 py-4 font-bold transition-all flex items-center gap-3 mx-auto shadow-flare shadow-violet-600/20"
      >
        <PlusCircle weight="duotone" size={20} />
        REGISTRAR PRIMER CENTRO
      </button>
    </div>
  {:else}
    <!-- Content Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="space-y-4 text-center md:text-left">
        <button 
          onclick={() => goto('/panel/clases')}
          class="flex items-center gap-2 text-zinc-500 hover:text-violet-400 transition-colors group text-[10px] font-black uppercase tracking-[0.2em] font-outfit"
        >
          <CaretLeft weight="bold" class="transition-transform group-hover:-translate-x-1" />
          VOLVER AL LISTADO
        </button>

        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="w-16 h-16 bg-violet-600/10 border border-violet-600/20 rounded-2xl flex items-center justify-center text-violet-400 shadow-xl shadow-violet-600/5">
            <ChalkboardTeacher weight="duotone" size={32} />
          </div>
          <div>
            <h1 class="text-4xl font-black text-white tracking-tighter font-outfit uppercase">Nueva Clase</h1>
            <p class="text-zinc-500 text-sm font-medium font-jakarta">Define un nuevo grupo de entrenamiento para tus alumnos.</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-4 bg-zinc-900/50 p-2 rounded-full border border-zinc-800">
        <button 
          onclick={() => goto('/panel/clases')}
          class="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors font-outfit"
          disabled={isSubmitting}
        >
          DESCARTAR
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="btn-pill bg-white text-black px-8 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-xl flex items-center gap-3 font-outfit"
        >
          {#if isSubmitting}
            <div class="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent"></div>
            <span>GUARDANDO...</span>
          {:else}
            <FloppyDisk weight="duotone" size={18} />
            <span>CREAR CLASE</span>
          {/if}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Main Form -->
      <div class="lg:col-span-8 space-y-8">
        <div class="bento-card rounded-24 p-8 space-y-8">
          <div class="flex items-center gap-4 border-b border-zinc-800 pb-6">
            <div class="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800">
              <Sparkle weight="duotone" size={20} />
            </div>
            <h3 class="text-lg font-bold text-white font-outfit">Información Básica</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label for="name" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 font-outfit">Nombre de la Clase</label>
              <div class="relative group">
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  placeholder="Ej: Avanzados Lunes 17:00"
                  class={`w-full bg-zinc-900/50 border rounded-2xl px-5 py-4 text-white font-bold font-jakarta focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600/50 outline-none transition-all placeholder:text-zinc-700 ${errors.name ? 'border-red-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
                />
                {#if errors.name}
                  <p class="text-[10px] text-red-400 font-bold mt-2 ml-1">{errors.name}</p>
                {/if}
              </div>
            </div>

            <div class="space-y-2">
              <label for="school" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 font-outfit">Centro Asignado</label>
              {#if isPreSelectedSchool}
                <div class="w-full bg-zinc-900/80 border border-violet-600/30 rounded-2xl px-5 py-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Buildings weight="duotone" size={20} class="text-violet-400" />
                    <span class="text-white font-bold uppercase text-xs font-jakarta">{getSchoolName(formData.school_id)}</span>
                  </div>
                  <span class="text-[8px] font-black text-violet-400 uppercase tracking-widest bg-violet-600/10 px-2 py-1 rounded-md">VINCULADO</span>
                </div>
              {:else}
                <div class="relative group">
                  <Buildings weight="duotone" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none transition-colors group-focus-within:text-violet-400" size={20} />
                  <select 
                    id="school"
                    bind:value={formData.school_id}
                    class={`w-full bg-zinc-900/50 border rounded-2xl pl-12 pr-10 py-4 text-white font-bold font-jakarta focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600/50 outline-none transition-all cursor-pointer appearance-none ${errors.school_id ? 'border-red-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <option value="" disabled selected>SELECCIONA UN CENTRO</option>
                    {#each (schools as any[]) as s}
                      <option value={s.id}>{s.name.toUpperCase()}</option>
                    {/each}
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                    <PlusCircle weight="bold" size={16} />
                  </div>
                </div>
                {#if errors.school_id}
                  <p class="text-[10px] text-red-400 font-bold mt-2 ml-1">{errors.school_id}</p>
                {/if}
              {/if}
            </div>
          </div>
        </div>

        <!-- Preview Card -->
        {#if formData.name}
          <div class="bento-card rounded-24 p-8 overflow-hidden relative group border-2 border-dashed border-zinc-800/50 hover:border-violet-600/30 transition-all" transition:fly={{ y: 20 }}>
            <div class="absolute -right-12 -bottom-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <ChalkboardTeacher weight="duotone" size={240} />
            </div>
            
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                 <h3 class="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] font-outfit">Vista Previa</h3>
                 <div class="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-[8px] font-black text-zinc-500 tracking-widest uppercase">Borrador</div>
              </div>

              <div class="flex items-center gap-6">
                <div class="w-20 h-20 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-500">
                   <CheckCircle weight="duotone" size={40} />
                </div>
                <div class="space-y-1">
                  <p class="text-white font-black uppercase tracking-tighter text-3xl font-outfit">{formData.name}</p>
                  <div class="flex items-center gap-2">
                    <Buildings weight="duotone" size={14} class="text-zinc-500" />
                    <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-jakarta">
                      {formData.school_id ? getSchoolName(formData.school_id) : 'CENTRO NO ASIGNADO'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Right Column: Tips & Info -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bento-card rounded-24 p-8 space-y-6">
          <div class="flex items-center gap-3">
            <Info weight="duotone" size={24} class="text-violet-400" />
            <h3 class="text-[10px] font-black text-white uppercase tracking-[0.2em] font-outfit">Guía Rápida</h3>
          </div>
          
          <div class="space-y-6">
            <div class="space-y-2 group">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-violet-500 transition-all group-hover:scale-150"></div>
                <p class="text-[11px] font-black text-zinc-300 uppercase tracking-wider font-outfit">Claridad</p>
              </div>
              <p class="text-xs text-zinc-500 leading-relaxed font-jakarta pl-3.5">
                Usa nombres descriptivos como <span class="text-zinc-300">"Iniciación A - Miércoles"</span> para facilitar el filtrado posterior.
              </p>
            </div>

            <div class="space-y-2 group">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-violet-500 transition-all group-hover:scale-150"></div>
                <p class="text-[11px] font-black text-zinc-300 uppercase tracking-wider font-outfit">Sincronización</p>
              </div>
              <p class="text-xs text-zinc-500 leading-relaxed font-jakarta pl-3.5">
                Al asignar un centro, la clase heredará automáticamente el sistema de evaluación y habilidades de dicho centro.
              </p>
            </div>
          </div>
        </div>

        <div class="bento-card rounded-24 p-6 bg-violet-600/5 border-violet-600/10 text-center">
          <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-outfit">
            ¿Dudas técnicas?
          </p>
          <button class="mt-4 text-violet-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 mx-auto group">
            Consultar ayuda
            <ArrowRight weight="bold" class="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  :global(.animate-fade-in) {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .btn-pill {
    @apply rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .shadow-flare {
    box-shadow: 0 0 20px -5px currentColor;
  }
</style>
