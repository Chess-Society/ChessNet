<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    ArrowLeft,
    Save,
    User,
    RotateCcw,
    ChevronRight,
    School,
    FileText,
    Activity,
    UserCircle
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let studentData = $derived(data.student);
  let schools = $derived(data.schools || []);

  let formData = $state({
    name: '',
    first_name: '',
    last_name: '',
    school_id: '',
    notes: ''
  });

  $effect(() => {
    if (studentData) {
      formData = {
        name: studentData.name || '',
        first_name: studentData.first_name || '',
        last_name: studentData.last_name || '',
        school_id: studentData.school_id || '',
        notes: studentData.notes || ''
      };
    }
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const validateForm = () => {
    errors = {};
    if (!formData.name.trim()) errors.name = 'El nombre completo es obligatorio';
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    try {
      isSubmitting = true;
      const response = await fetch(`/api/students/${studentData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const returnTo = $page.url.searchParams.get('return_to');
        goto(returnTo || '/panel/alumnos');
      } else {
        throw new Error('Error saving');
      }
    } catch (error) {
      alert('❌ Error al actualizar');
    } finally {
      isSubmitting = false;
    }
  };

  const hasChanges = $derived(
    formData.name !== (studentData?.name || '') ||
    formData.first_name !== (studentData?.first_name || '') ||
    formData.last_name !== (studentData?.last_name || '') ||
    formData.school_id !== (studentData?.school_id || '') ||
    formData.notes !== (studentData?.notes || '')
  );

  const resetToOriginal = () => {
    formData = {
      name: studentData?.name || '',
      first_name: studentData?.first_name || '',
      last_name: studentData?.last_name || '',
      school_id: studentData?.school_id || '',
      notes: studentData?.notes || ''
    };
    errors = {};
  };
</script>

<svelte:head>
  <title>Editar Alumno - {studentData?.name} - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={() => goto('/panel/alumnos')}
        class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Regresar a Lista
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <UserCircle class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Editar Alumno</h1>
          <p class="text-surface-500 text-sm font-medium uppercase tracking-widest mt-1">Configuración del Perfil</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      {#if hasChanges}
        <button 
          onclick={resetToOriginal}
          class="bg-surface-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-surface-700 transition-all flex items-center gap-2"
        >
          <RotateCcw class="w-4 h-4" />
          Descartar
        </button>
      {/if}
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting || !hasChanges}
        class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/10 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if isSubmitting}
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
        {:else}
          <Save class="w-4 h-4" />
        {/if}
        Guardar Cambios
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <!-- Left Column: Primary Information -->
    <div class="lg:col-span-2 space-y-8">
      <section class="glass-panel p-10 space-y-10">
        <div class="flex items-center gap-3 border-b border-surface-900 pb-6">
           <User class="w-5 h-5 text-primary-400" />
           <h2 class="text-lg font-black text-white uppercase tracking-tight">Información Personal</h2>
        </div>

        <div class="grid grid-cols-1 gap-8">
           <div class="space-y-3">
              <label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre Completo (Obligatorio)</label>
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                placeholder="EJ: JUAN PÉREZ GARCÍA"
                class={`w-full bg-surface-950 border rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white outline-none transition-all placeholder:text-surface-800 ${errors.name ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-surface-900 focus:border-primary-500/50'}`}
              />
              {#if errors.name}
                <p class="text-red-400 text-[10px] font-bold uppercase tracking-tight ml-4">{errors.name}</p>
              {/if}
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                 <label for="first_name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre(s)</label>
                 <input
                   id="first_name"
                   type="text"
                   bind:value={formData.first_name}
                   class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all"
                 />
              </div>
              <div class="space-y-3">
                 <label for="last_name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Apellidos</label>
                 <input
                   id="last_name"
                   type="text"
                   bind:value={formData.last_name}
                   class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all"
                 />
              </div>
           </div>
        </div>
      </section>

      <section class="glass-panel p-10 space-y-10">
         <div class="flex items-center gap-3 border-b border-surface-900 pb-6">
            <FileText class="w-5 h-5 text-primary-400" />
            <h2 class="text-lg font-black text-white uppercase tracking-tight">Observaciones Académicas</h2>
         </div>

         <div class="space-y-3">
            <label for="notes" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Notas del Instructor</label>
            <textarea
              id="notes"
              bind:value={formData.notes}
              placeholder="Añade comentarios sobre su estilo de juego, aperturas favoritas o áreas de mejora..."
              class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white h-48 resize-none focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-800"
            ></textarea>
         </div>
      </section>
    </div>

    <!-- Right Column: Context/Preview -->
    <div class="space-y-8">
       <section class="glass-panel p-8 space-y-8 border-t-4 border-blue-500">
          <div class="flex items-center gap-3">
             <School class="w-5 h-5 text-blue-400" />
             <h3 class="text-sm font-black text-white uppercase tracking-tighter">Centro Asociado</h3>
          </div>

          <div class="space-y-4">
             <select
               bind:value={formData.school_id}
               class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
             >
               <option value="">SIN ASIGNAR</option>
               {#each schools as school}
                 <option value={school.id}>{school.name.toUpperCase()}</option>
               {/each}
             </select>
             
             <p class="text-[9px] font-black text-surface-600 uppercase tracking-[0.2em] leading-relaxed italic">
                La asociación a un centro educativo permite incluir al alumno en las clases correspondientes y generar informes institucionales.
             </p>
          </div>
       </section>

       <!-- Quick Preview -->
       <section class="glass-panel p-8 space-y-6">
          <h3 class="text-xs font-black text-surface-500 uppercase tracking-widest border-b border-surface-900 pb-4 italic">Vista Previa del Perfil</h3>
          
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-surface-950 border border-surface-900 rounded-xl flex items-center justify-center text-primary-400 font-black">
                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
             </div>
             <div>
                <p class="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[150px]">{formData.name || 'SIN NOMBRE'}</p>
                <p class="text-[8px] font-black text-primary-400 uppercase tracking-widest">ALUMNO ACTIVO</p>
             </div>
          </div>
       </section>
    </div>
  </div>
</div>

<style lang="postcss">
  /* Student edit specific styles */
</style>
