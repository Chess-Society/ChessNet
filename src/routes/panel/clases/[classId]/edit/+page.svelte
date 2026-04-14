<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    CaretLeft,
    FloppyDisk,
    X,
    Warning,
    CheckCircle,
    Buildings,
    Clock,
    Users,
    CurrencyDollar,
    CalendarBlank,
    MapPin,
    BookOpen,
    Target,
    Eye,
    ArrowCounterClockwise,
    PencilSimple,
    CaretDown,
    GraduationCap
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let classData = $derived(data.class);
  let schools = $derived(data.schools || []);

  let formData = $state({
    name: '',
    description: '',
    school_id: '',
    schedule: '',
    max_students: 12,
    level: 'beginner'
  });

  $effect(() => {
    if (classData) {
      formData = {
        name: classData.name || '',
        description: classData.description || '',
        school_id: classData.school_id || '',
        schedule: classData.schedule || '',
        max_students: classData.max_students || 12,
        level: classData.level || 'beginner'
      };
    }
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const levelOptions = [
    { value: 'beginner', label: 'PRINCIPIANTE' },
    { value: 'intermediate', label: 'INTERMEDIO' },
    { value: 'advanced', label: 'AVANZADO' },
    { value: 'mixed', label: 'MIXTO' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.school_id) newErrors.school_id = 'Debes seleccionar un centro';
    if (formData.max_students < 1) newErrors.max_students = 'Capacidad mínima es 1';
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      isSubmitting = true;
      const response = await fetch(`/api/classes/${classData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al actualizar');
      goto(`/panel/clases/${classData.id}`);
    } catch (error) {
      alert('Error al guardar cambios');
    } finally {
      isSubmitting = false;
    }
  };
</script>

<svelte:head>
  <title>Editar {classData?.name} - ChessNet</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-6">
      <button 
        onclick={() => goto(`/panel/clases/${classData.id}`)}
        class="flex items-center gap-2 text-zinc-500 hover:text-white transition-all group text-[10px] font-black uppercase tracking-[0.2em]"
      >
        <CaretLeft weight="bold" class="w-3 h-3 transition-transform group-hover:-translate-x-1" />
        Volver a Clase
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <PencilSimple weight="duotone" class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase leading-none">Ajustes</h1>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            Configuración de <span class="text-white">{classData?.name}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button 
        onclick={() => goto(`/panel/clases/${classData.id}`)}
        class="px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all flex items-center gap-2"
        disabled={isSubmitting}
      >
        <X weight="bold" class="w-4 h-4" />
        Cancelar
      </button>
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting}
        class="bg-primary-500 text-black px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] flex items-center gap-3 disabled:opacity-50"
      >
        {#if isSubmitting}
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
          <span>Guardando...</span>
        {:else}
          <FloppyDisk weight="bold" class="w-4 h-4" />
          <span>Guardar Cambios</span>
        {/if}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <div class="lg:col-span-2 space-y-8">
      <!-- Main Settings Card -->
      <section class="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 lg:p-10 space-y-10 shadow-xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -mr-32 -mt-32"></div>
        
        <div class="flex items-center gap-4 relative z-10 border-b border-zinc-800 pb-6">
          <div class="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
            <BookOpen weight="duotone" class="w-6 h-6 text-primary-400" />
          </div>
          <h2 class="text-xl font-black text-white uppercase tracking-tight">Información General</h2>
        </div>

        <div class="space-y-8 relative z-10">
          <div class="space-y-3">
            <label for="name" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              Nombre del Grupo
              {#if errors.name}<span class="text-red-500">— {errors.name}</span>{/if}
            </label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              placeholder="Ej: Avanzados A"
              class={`w-full bg-zinc-950 border rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all placeholder:text-zinc-800 ${errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-800'}`}
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label for="school" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Buildings weight="duotone" class="w-3 h-3" />
                Centro Educativo
              </label>
              <div class="relative group/select">
                <select 
                  id="school"
                  bind:value={formData.school_id}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer appearance-none"
                >
                  {#each schools as s}
                    <option value={s.id}>{s.name.toUpperCase()}</option>
                  {/each}
                </select>
                <CaretDown weight="bold" class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none group-focus-within/select:text-primary-500 transition-colors" />
              </div>
            </div>

            <div class="space-y-3">
              <label for="level" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <GraduationCap weight="duotone" class="w-3 h-3" />
                Nivel Recomendado
              </label>
              <div class="relative group/select">
                <select 
                  id="level"
                  bind:value={formData.level}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer appearance-none"
                >
                  {#each levelOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                  {/each}
                </select>
                <CaretDown weight="bold" class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none group-focus-within/select:text-primary-500 transition-colors" />
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <label for="desc" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Descripción y Objetivos</label>
            <textarea
              id="desc"
              bind:value={formData.description}
              rows="4"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-5 text-white font-medium focus:border-primary-500/50 outline-none transition-all resize-none placeholder:text-zinc-800"
              placeholder="Detalla el enfoque pedagógico de este grupo..."
            ></textarea>
          </div>
        </div>
      </section>

      <!-- Logistics Card -->
      <section class="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 lg:p-10 space-y-10 shadow-xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32"></div>
        
        <div class="flex items-center gap-4 relative z-10 border-b border-zinc-800 pb-6">
          <div class="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
            <Clock weight="duotone" class="w-6 h-6 text-blue-400" />
          </div>
          <h2 class="text-xl font-black text-white uppercase tracking-tight">Calendario y Logística</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
           <div class="space-y-3">
              <label for="schedule" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Horario de Sesiones</label>
              <div class="relative group">
                 <Clock weight="duotone" class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-focus-within:text-blue-400 transition-colors" />
                 <input
                  id="schedule"
                  type="text"
                  bind:value={formData.schedule}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-16 pr-6 py-4 text-white font-bold focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-800"
                  placeholder="Ej: Lunes y Miércoles 18:00"
                />
              </div>
           </div>

           <div class="space-y-3">
              <label for="max" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Aforo Máximo</label>
              <div class="relative group">
                 <Users weight="duotone" class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-focus-within:text-blue-400 transition-colors" />
                 <input
                  id="max"
                  type="number"
                  bind:value={formData.max_students}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-16 pr-6 py-4 text-white font-bold focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
           </div>
        </div>
      </section>
    </div>

    <!-- Sidebar Info -->
    <div class="space-y-8">
       <div class="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px] space-y-8 shadow-xl">
          <h3 class="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <Warning weight="duotone" class="w-5 h-5 text-primary-500" />
            Importante
          </h3>
          <ul class="space-y-6">
             <li class="flex gap-4">
                <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                <p class="text-[11px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                  Los cambios de nivel afectarán a las sugerencias del <span class="text-white">temario inteligente</span>.
                </p>
             </li>
             <li class="flex gap-4">
                <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                <p class="text-[11px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                  Asegúrate de que el horario no genere <span class="text-white">conflictos</span> con otros grupos del mismo centro.
                </p>
             </li>
          </ul>
       </div>

       <div class="p-10 border border-zinc-800 rounded-[32px] bg-zinc-900/20 backdrop-blur-sm space-y-4">
          <div class="flex items-center gap-4 text-zinc-600 mb-2">
             <ArrowCounterClockwise weight="bold" class="w-6 h-6" />
             <h3 class="text-[10px] font-black uppercase tracking-[0.2em]">Historial</h3>
          </div>
          <p class="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">
            Al guardar, todos los informes y calendarios se actualizarán instantáneamente.
          </p>
          <div class="pt-4">
            <div class="w-full h-px bg-zinc-800"></div>
            <p class="text-[9px] text-zinc-800 font-black uppercase mt-4 text-center tracking-[0.3em]">ChessNet System v2</p>
          </div>
       </div>
    </div>
  </div>
</div>

<style lang="postcss">
  :global(.animate-fade-in) {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
