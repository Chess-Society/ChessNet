<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Save,
    X,
    AlertTriangle,
    CheckCircle,
    School,
    Clock,
    Users,
    DollarSign,
    Calendar,
    MapPin,
    BookOpen,
    Target,
    Eye,
    RotateCcw,
    Edit3
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let classData = $derived(data.class);
  let schools = $derived(data.schools || []);

  let formData = $state({
    name: '',
    description: '',
    college_id: '',
    schedule: '',
    max_students: 12,
    level: 'beginner'
  });

  $effect(() => {
    if (classData) {
      formData = {
        name: classData.name || '',
        description: classData.description || '',
        college_id: classData.college_id || '',
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
    if (!formData.college_id) newErrors.college_id = 'Debes seleccionar un centro';
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
      goto(`/classes/${classData.id}`);
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

<div class="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={() => goto(`/classes/${classData.id}`)}
        class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Regresar a Clase
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <Edit3 class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase">Editar Grupo</h1>
          <p class="text-surface-500 text-sm font-medium uppercase tracking-widest">Ajustando detalles de {classData?.name}</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => goto(`/classes/${classData.id}`)}
        class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        disabled={isSubmitting}
      >
        <X class="w-4 h-4" />
        Descartar
      </button>
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting}
        class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3"
      >
        {#if isSubmitting}
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
          <span>Guardando...</span>
        {:else}
          <Save class="w-4 h-4" />
          <span>Guardar Cambios</span>
        {/if}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <div class="lg:col-span-2 space-y-8">
      <!-- Main Settings -->
      <section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500">
        <h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">
          <BookOpen class="w-5 h-5 text-primary-400" />
          Información Curricular
        </h2>

        <div class="space-y-6">
          <div class="space-y-2">
            <label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre del Grupo</label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              class={`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-surface-800'}`}
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="college" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Centro Educativo</label>
              <select 
                id="college"
                bind:value={formData.college_id}
                class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer"
              >
                {#each schools as s}
                  <option value={s.id}>{s.name.toUpperCase()}</option>
                {/each}
              </select>
            </div>

            <div class="space-y-2">
              <label for="level" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nivel Recomendado</label>
              <select 
                id="level"
                bind:value={formData.level}
                class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer"
              >
                {#each levelOptions as opt}
                  <option value={opt.value}>{opt.label}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label for="desc" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Descripción del Enfoque</label>
            <textarea
              id="desc"
              bind:value={formData.description}
              rows="3"
              class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-medium focus:border-primary-500/50 outline-none transition-all resize-none"
              placeholder="Ej: Orientado a la táctica básica y finales elementales..."
            ></textarea>
          </div>
        </div>
      </section>

      <!-- Logistics -->
      <section class="glass-panel p-8 space-y-8 border-t-4 border-blue-500">
        <h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">
          <Clock class="w-5 h-5 text-blue-400" />
          Logística y Horarios
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div class="space-y-2">
              <label for="schedule" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Horario de Sesiones</label>
              <div class="relative group">
                 <Clock class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700" />
                 <input
                  id="schedule"
                  type="text"
                  bind:value={formData.schedule}
                  class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all"
                  placeholder="Ej: Martes 17:00 - 18:30"
                />
              </div>
           </div>

           <div class="space-y-2">
              <label for="max" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Capacidad Máxima (Alumnos)</label>
              <div class="relative group">
                 <Users class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700" />
                 <input
                  id="max"
                  type="number"
                  bind:value={formData.max_students}
                  class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all"
                />
              </div>
           </div>
        </div>
      </section>
    </div>

    <!-- Sidebar Tips -->
    <div class="space-y-8">
       <div class="glass-panel p-8 space-y-6">
          <h3 class="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle class="w-4 h-4 text-primary-400" />
            Consideraciones
          </h3>
          <ul class="space-y-4">
             <li class="flex gap-3">
                <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div>
                <p class="text-[10px] text-surface-400 font-bold uppercase tracking-wider leading-relaxed">Cambiar el nivel actualizará los objetivos sugeridos para el grupo.</p>
             </li>
             <li class="flex gap-3">
                <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div>
                <p class="text-[10px] text-surface-400 font-bold uppercase tracking-wider leading-relaxed">La capacidad afecta al cálculo de ingresos estimados del centro.</p>
             </li>
          </ul>
       </div>

       <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5 space-y-4">
          <div class="flex items-center gap-4 text-primary-400 mb-2">
             <RotateCcw class="w-6 h-6" />
             <h3 class="text-xs font-black uppercase tracking-widest">Historial</h3>
          </div>
          <p class="text-[10px] text-surface-500 font-bold uppercase leading-relaxed">
            Puedes revertir cambios si no has guardado todavía. Una vez guardados, los reportes se generarán con la nueva información.
          </p>
       </div>
    </div>
  </div>
</div>

<style lang="postcss">
  /* Class edit styles */
</style>
