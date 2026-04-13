<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    Users, 
    ArrowLeft,
    Save,
    X,
    User,
    FileText,
    Plus, 
    Activity, 
    BookOpen, 
    UserCircle,
    Zap
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { appStore } from '$lib/stores/appStore';

  let { data } = $props<{ data: PageData }>();

  let plan = $derived($appStore.settings.plan || 'free');
  let studentsCount = $derived($appStore.students.length);
  let isLimitReached = $derived(plan === 'free' && studentsCount >= 12);

  let formData = $state({
    first_name: '',
    last_name: '',
    notes: ''
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  // Data mapping
  const schools = $derived(data.schools || []);
  const classes = $derived(data.classes || []);

  // URL context
  const classId = $derived($page.url.searchParams.get('classId'));
  const schoolId = $derived($page.url.searchParams.get('schoolId'));
  const returnTo = $derived($page.url.searchParams.get('returnTo'));
  const isFromClass = $derived(!!classId);

  const handleGoBack = () => {
    if (returnTo) goto(returnTo);
    else if (isFromClass && classId) goto(`/panel/clases/${classId}`);
    else goto('/panel/alumnos');
  };

  const validateForm = () => {
    errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'El nombre es obligatorio';
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (isLimitReached) {
      goto('/precios');
      return;
    }
    if (!validateForm() || isSubmitting) return;

    try {
      isSubmitting = true;
      const studentData = {
        name: `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim(),
        first_name: formData.first_name.trim() || null,
        last_name: formData.last_name.trim() || null,
        notes: formData.notes.trim() || null,
        school_id: schoolId || null
      };
      
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Error');
      
      // Auto-enroll if from class
      if (isFromClass && classId && result.student) {
        await fetch('/api/class-students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ class_id: classId, student_id: result.student.id }),
        });
      }
      
      goto(returnTo || (isFromClass ? `/panel/clases/${classId}` : '/panel/alumnos'));
    } catch (error) {
      alert('❌ Error al crear el estudiante');
    } finally {
      isSubmitting = false;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      handleSubmit();
    }
  };
</script>

<svelte:head>
  <title>Nueva Matrícula - ChessNet</title>
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20" in:fade>
  {#if classes.length === 0}
    <div class="max-w-4xl mx-auto py-20 text-center space-y-8" in:fade>
      <div class="w-32 h-32 bg-primary-500/10 rounded-[3rem] flex items-center justify-center mx-auto border border-primary-500/20 text-primary-400 animate-bounce-subtle">
        <Users class="w-16 h-16" />
      </div>
      <div class="space-y-4">
        <h2 class="text-3xl font-black text-white uppercase tracking-tighter">Matrícula Detenida</h2>
        <p class="text-surface-500 text-lg max-w-md mx-auto">No puedes matricular alumnos si no has creado ninguna clase todavía.</p>
      </div>
      <button 
        onclick={() => goto('/panel/clases/create')}
        class="bg-primary-600 hover:bg-primary-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-900/40 flex items-center gap-3 mx-auto"
      >
        <Plus class="w-5 h-5" />
        CREAR MI PRIMERA CLASE
      </button>
    </div>
  {:else}
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="space-y-4">
        <button 
          onclick={handleGoBack}
          class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Regresar
        </button>

        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
            <UserCircle class="w-8 h-8" />
          </div>
          <div>
            <h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Matriculación</h1>
            <p class="text-surface-500 text-sm font-medium uppercase tracking-widest mt-1">Nuevo Registro de Alumno</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          onclick={handleGoBack}
          class="bg-surface-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-surface-700 transition-all flex items-center gap-2"
        >
          <X class="w-4 h-4" />
          Cancelar
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/10 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isSubmitting}
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
          {:else}
            <Save class="w-4 h-4" />
          {/if}
          Confirmar Alta
        </button>
      </div>
    </div>

    {#if isLimitReached}
      <div class="bg-indigo-950/30 border border-indigo-500/50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 animate-pulse shadow-2xl shadow-indigo-500/10" in:fly={{ y: 20 }}>
        <div class="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
          <Zap class="w-8 h-8 fill-indigo-400/20" />
        </div>
        <div class="flex-grow text-center md:text-left">
          <h3 class="text-xl font-black text-white uppercase tracking-tight">¡Límite del Plan Gratuito alcanzado!</h3>
          <p class="text-indigo-200/60 text-sm mt-1 font-medium">Has alcanzado el máximo de 12 alumnos. Mejora a Premium para gestionar una academia ilimitada y desbloquear informes avanzados.</p>
        </div>
        <a 
          href="/precios"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 whitespace-nowrap active:scale-95"
        >
          Mejorar Ahora
        </a>
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Main Form Section -->
      <div class="lg:col-span-2 space-y-8">
        {#if isFromClass}
          <div class="glass-panel p-6 border-l-4 border-blue-500 flex items-center gap-4 animate-bounce-subtle">
             <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                <Activity class="w-5 h-5" />
             </div>
             <div>
                <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Inscripción Activa</p>
                <p class="text-[10px] font-bold text-surface-500 uppercase tracking-tight">El alumno será añadido a la clase automáticamente</p>
             </div>
          </div>
        {/if}

        <section class="glass-panel p-10 space-y-10">
          <div class="flex items-center gap-3 border-b border-surface-900 pb-6">
             <User class="w-5 h-5 text-primary-400" />
             <h2 class="text-lg font-black text-white uppercase tracking-tight">Identificación del Alumno</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div class="space-y-3">
                <label for="first_name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre(s) *</label>
                <input
                  id="first_name"
                  type="text"
                  bind:value={formData.first_name}
                  placeholder="EJ: JUAN CARLOS"
                  class={`w-full bg-surface-950 border rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white outline-none transition-all placeholder:text-surface-800 ${errors.first_name ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-surface-900 focus:border-primary-500/50'}`}
                />
                {#if errors.first_name}
                  <p class="text-red-400 text-[10px] font-bold uppercase tracking-tight ml-4">{errors.first_name}</p>
                {/if}
             </div>

             <div class="space-y-3">
                <label for="last_name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Apellidos</label>
                <input
                  id="last_name"
                  type="text"
                  bind:value={formData.last_name}
                  placeholder="EJ: PÉREZ RODRÍGUEZ"
                  class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-800"
                />
             </div>
          </div>
        </section>

        <section class="glass-panel p-10 space-y-10">
           <div class="flex items-center gap-3 border-b border-surface-900 pb-6">
              <FileText class="w-5 h-5 text-primary-400" />
              <h2 class="text-lg font-black text-white uppercase tracking-tight">Expediente y Notas</h2>
           </div>

           <div class="space-y-3">
              <label for="notes" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Resumen Inicial</label>
              <textarea
                id="notes"
                bind:value={formData.notes}
                placeholder="Escribe aquí observaciones iniciales, nivel estimado o cualquier dato relevante para su seguimiento..."
                class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white h-48 resize-none focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-800"
              ></textarea>
           </div>
        </section>
      </div>

      <!-- Stats/Guidance Column -->
      <div class="space-y-8">
         <section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500">
            <div class="flex items-center gap-3">
               <BookOpen class="w-5 h-5 text-primary-400" />
               <h3 class="text-sm font-black text-white uppercase tracking-tighter">Guía de Registro</h3>
            </div>

            <div class="space-y-6">
               <div class="flex gap-4">
                  <div class="w-8 h-8 bg-surface-950 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-400 border border-surface-800">01</div>
                  <p class="text-[10px] font-bold text-surface-500 uppercase tracking-tight leading-relaxed">
                     Usa <span class="text-white">MAYÚSCULAS</span> para mantener la consistencia en el sistema.
                  </p>
               </div>
               <div class="flex gap-4">
                  <div class="w-8 h-8 bg-surface-950 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-400 border border-surface-800">02</div>
                  <p class="text-[10px] font-bold text-surface-500 uppercase tracking-tight leading-relaxed">
                     Puedes dejar campos vacíos y editarlos más tarde desde el <span class="text-white">perfil del alumno</span>.
                  </p>
               </div>
               <div class="flex gap-4">
                  <div class="w-8 h-8 bg-surface-950 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-400 border border-surface-800">03</div>
                  <p class="text-[10px] font-bold text-surface-500 uppercase tracking-tight leading-relaxed">
                     Presiona <span class="text-white">CTRL + ENTER</span> para finalizar el registro rápidamente.
                  </p>
               </div>
            </div>
         </section>

         <!-- Preview Card -->
         <section class="glass-panel p-8 space-y-6">
            <h3 class="text-xs font-black text-surface-500 uppercase tracking-widest border-b border-surface-900 pb-4 italic">Vista Previa</h3>
            <div class="p-6 bg-surface-950 rounded-2xl border border-surface-900 space-y-4">
               <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-surface-900 rounded-xl flex items-center justify-center text-primary-400 font-black">
                     {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-white uppercase truncate max-w-[120px]">
                      {formData.first_name || 'SIN NOMBRE'} {formData.last_name || ''}
                    </p>
                    <p class="text-[8px] font-black text-primary-400 uppercase tracking-widest">NUEVO ASPIRANTE</p>
                  </div>
               </div>
            </div>
         </section>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Student creation specialized layout */
</style>
