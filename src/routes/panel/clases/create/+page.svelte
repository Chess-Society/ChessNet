<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    GraduationCap, 
    ArrowLeft,
    Save,
    X,
    School,
    Sparkles,
    Check,
    Info
  } from 'lucide-svelte';
  import { showToast, showError } from '$lib/utils/toast';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let formData = $state({
    name: '',
    college_id: ''
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const schools = $derived(data.schools || []);
  
  const collegeIdFromUrl = $derived($page.url.searchParams.get('college_id'));
  const isPreSelectedCollege = $derived(!!collegeIdFromUrl);
  
  $effect(() => {
    if (collegeIdFromUrl && schools.length > 0) {
      const collegeExists = (schools as any[]).find(s => s.id === collegeIdFromUrl);
      if (collegeExists) formData.college_id = collegeIdFromUrl;
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.college_id) newErrors.college_id = 'Debes seleccionar un centro';
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
      goto('/classes');
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

<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={() => goto('/classes')}
        class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Volver a Clases
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <GraduationCap class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase">Crear Nueva Clase</h1>
          <p class="text-surface-500 text-sm font-medium">Define un nuevo grupo de entrenamiento.</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => goto('/classes')}
        class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        disabled={isSubmitting}
      >
        <X class="w-4 h-4" />
        Cancelar
      </button>
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting}
        class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3"
      >
        {#if isSubmitting}
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
          <span>Creando...</span>
        {:else}
          <Save class="w-4 h-4" />
          <span>Registrar Clase</span>
        {/if}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <div class="lg:col-span-2 space-y-8">
      <section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500">
        <div class="space-y-6">
          <div class="space-y-2">
            <label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre de la Clase</label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              placeholder="Ej: Avanzados Lunes 17:00"
              class={`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-surface-800'}`}
            />
          </div>

          <div class="space-y-2">
            <label for="college" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Centro Asignado</label>
            {#if isPreSelectedCollege}
              <div class="w-full bg-surface-900 border border-primary-500/30 rounded-xl px-5 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <School class="w-5 h-5 text-primary-400" />
                  <span class="text-white font-bold uppercase text-xs">{getSchoolName(formData.college_id)}</span>
                </div>
                <span class="text-[8px] font-black text-primary-500 uppercase tracking-widest bg-primary-500/10 px-2 py-1 rounded">Pre-seleccionado</span>
              </div>
            {:else}
              <div class="relative group">
                <School class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-700 pointer-events-none transition-colors group-focus-within:text-primary-400" />
                <select 
                  id="college"
                  bind:value={formData.college_id}
                  class={`w-full bg-surface-950 border rounded-xl pl-12 pr-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer appearance-none ${errors.college_id ? 'border-red-500' : 'border-surface-800'}`}
                >
                  <option value="">SELECCIONA UN CENTRO</option>
                  {#each (schools as any[]) as s}
                    <option value={s.id}>{s.name.toUpperCase()}</option>
                  {/each}
                </select>
              </div>
            {/if}
          </div>
        </div>
      </section>

      {#if formData.name && formData.college_id}
        <div class="glass-panel p-6 bg-primary-500/5 border-dashed relative overflow-hidden group" transition:fly={{ y: 20 }}>
          <div class="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <GraduationCap class="w-40 h-40" />
          </div>
          <h3 class="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-4">Vista Previa de Ficha</h3>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-surface-950 border border-surface-800 flex items-center justify-center text-primary-400">
               <Check class="w-6 h-6" />
            </div>
            <div>
              <p class="text-white font-black uppercase tracking-tight text-lg">{formData.name}</p>
              <p class="text-surface-500 text-[10px] font-bold uppercase tracking-widest">{getSchoolName(formData.college_id)}</p>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Info column -->
    <div class="space-y-6">
      <div class="glass-panel p-8 space-y-4">
        <h3 class="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Info class="w-4 h-4 text-primary-400" />
          Recomendaciones
        </h3>
        <ul class="space-y-4">
          <li class="flex gap-3">
             <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div>
             <p class="text-xs text-surface-400 leading-relaxed font-medium">Usa nombres que incluyan nivel o horario para mayor claridad.</p>
          </li>
          <li class="flex gap-3">
             <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div>
             <p class="text-xs text-surface-400 leading-relaxed font-medium">Cada clase hereda las habilidades configuradas para el centro.</p>
          </li>
        </ul>
      </div>

      <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5">
        <p class="text-[10px] font-black text-surface-500 uppercase text-center tracking-widest">
          Presiona <kbd class="bg-surface-900 px-2 py-1 rounded text-primary-400 border border-surface-800 shadow-sm">CTRL+ENTER</kbd> para guardar
        </p>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  /* Class create styles */
</style>
