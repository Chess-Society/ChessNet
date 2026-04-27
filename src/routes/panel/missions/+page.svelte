<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import confetti from 'canvas-confetti';
  import { 
    Target, 
    Plus, 
    Users, 
    Buildings, 
    GraduationCap, 
    Trophy, 
    CheckCircle, 
    X,
    Lightning,
    ArrowRight,
    PuzzlePiece,
    ChartLineUp,
    Clock,
    ArrowsClockwise,
    IdentificationBadge
  } from 'phosphor-svelte';
  import { enhance } from '$app/forms';
  import { toast } from '$lib/stores/toast';
  import type { PageData } from './$types';
  import Modal from '$lib/components/ui/Modal.svelte';

  let { data }: { data: PageData } = $props();

  let isCreating = $state(false);
  let isAssigning = $state(false);
  let isVerifyingAll = $state(false);
  let isSyncing = $state(false);
  let selectedMission = $state<any>(null);
  
  let syncForm: HTMLFormElement;
  
  let activeTab = $state('library'); // 'library' or 'tracking'

  const missionTypes = [
    { id: 'puzzles', name: 'Lichess Puzzles', icon: PuzzlePiece, color: 'text-primary-400' },
    { id: 'games', name: 'Partidas Jugadas', icon: Lightning, color: 'text-amber-400' },
    { id: 'win_streak', name: 'Racha de Victorias', icon: Trophy, color: 'text-emerald-400' }
  ];

  const getMissionTypeLabel = (type: string) => {
    return missionTypes.find(t => t.id === type)?.name || type;
  };

  const getStudentName = (id: string) => {
    return data.students.find(s => s.id === id)?.name || 'Desconocido';
  };

  const getMissionTitle = (id: string) => {
    return data.missions.find(m => m.id === id)?.title || 'Misión';
  };

  const getMissionDetails = (id: string) => {
    return data.missions.find(m => m.id === id);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8b5cf6', '#6366f1']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  onMount(() => {
    // Auto-sync if there are active assignments
    if (data.assignedMissions.some(m => !m.completed)) {
      setTimeout(() => {
        syncForm?.requestSubmit();
      }, 1000);
    }
  });
</script>

<div class="p-4 md:p-12 space-y-12 max-w-[1600px] mx-auto pb-32">
  <header class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
          <Target size={24} weight="duotone" />
        </div>
        <h1 class="text-4xl lg:text-6xl font-outfit font-black text-white uppercase tracking-tighter italic">
          Centro de <span class="text-primary-500">Misiones</span>
        </h1>
      </div>
      <p class="text-zinc-500 font-medium max-w-xl text-lg">
        Controla el progreso en tiempo real y asigna nuevos desafíos automáticos vinculados a Lichess.
      </p>
    </div>

    <div class="flex items-center gap-4">
      <form 
        method="POST" 
        action="?/verifyAll"
        bind:this={syncForm}
        use:enhance={() => {
          isVerifyingAll = true;
          return ({ result }) => {
            isVerifyingAll = false;
            if (result.type === 'success') {
              const data = result.data as any;
              if (data?.newlyCompleted?.length > 0) {
                triggerConfetti();
                toast.success(`¡${data.newlyCompleted.length} misiones completadas!`);
              } else {
                toast.success('Estado actualizado correctamente');
              }
            }
          };
        }}
      >
        <button 
          type="submit"
          disabled={isVerifyingAll}
          class="h-16 px-8 border border-white/10 text-white font-black hover:bg-white hover:text-black transition-all flex items-center gap-4 active:scale-95 uppercase text-[10px] tracking-[0.2em] disabled:opacity-50 relative group/sync overflow-hidden"
        >
          <div class="absolute inset-0 bg-primary-500/10 translate-y-full group-hover/sync:translate-y-0 transition-transform duration-300"></div>
          <ArrowsClockwise weight="bold" size={20} class="relative z-10 {isVerifyingAll ? 'animate-spin' : 'group-hover/sync:rotate-180 transition-transform duration-700'}" />
          <span class="relative z-10">{isVerifyingAll ? 'Sinc...' : 'Sincronizar'}</span>
        </button>
      </form>

      <button 
        onclick={() => isCreating = true}
        class="h-16 px-10 bg-white text-black font-black hover:bg-primary-500 hover:text-white transition-all flex items-center gap-4 shadow-2xl active:scale-95 uppercase text-[10px] tracking-[0.2em]"
      >
        <Plus weight="bold" size={20} />
        Crear nuevo desafío
      </button>
    </div>
  </header>

  <!-- Navigation Tabs -->
  <div class="flex border-b border-white/5 gap-8">
    <button 
      onclick={() => activeTab = 'library'}
      class="pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative {activeTab === 'library' ? 'text-primary-400' : 'text-zinc-500 hover:text-white'}"
    >
      Biblioteca de Misiones
      {#if activeTab === 'library'}
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-primary-500" in:scale></div>
      {/if}
    </button>
    <button 
      onclick={() => activeTab = 'tracking'}
      class="pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative {activeTab === 'tracking' ? 'text-primary-400' : 'text-zinc-500 hover:text-white'}"
    >
      Seguimiento Activo
      {#if activeTab === 'tracking'}
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-primary-500" in:scale></div>
      {/if}
    </button>
  </div>

  {#if activeTab === 'library'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" in:fade>
      {#each data.missions as mission}
        <div class="bento-card !p-8 group relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div class="space-y-6">
            <div class="flex items-start justify-between">
              <div class="p-4 bg-zinc-950 border border-white/5 text-primary-400">
                <PuzzlePiece size={32} weight="duotone" />
              </div>
              <div class="text-right">
                <span class="text-[8px] font-black px-2 py-1 bg-primary-500/10 text-primary-400 uppercase tracking-widest border border-primary-500/20">
                  {getMissionTypeLabel(mission.type)}
                </span>
                <p class="text-xl font-outfit font-black text-white mt-2">+{mission.reward} XP</p>
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{mission.title}</h3>
              <p class="text-zinc-500 text-sm font-medium line-clamp-2">{mission.description}</p>
            </div>
          </div>

          <div class="pt-8 flex items-center gap-4">
            <button 
              onclick={() => { selectedMission = mission; isAssigning = true; }}
              class="flex-1 h-12 bg-primary-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn"
            >
              Asignar Desafío <ArrowRight size={14} class="group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <form method="POST" action="?/deleteMission" use:enhance={() => {
              return ({ result }) => {
                if (result.type === 'success') toast.success('Misión eliminada');
              };
            }}>
              <input type="hidden" name="id" value={mission.id} />
              <button 
                type="submit"
                class="w-12 h-12 bg-white/5 border border-white/10 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      {:else}
        <div class="col-span-full py-12 md:py-32 flex flex-col items-center justify-center text-center space-y-6 bg-zinc-950/50 border border-dashed border-white/10">
          <Target size={64} class="text-zinc-800" weight="thin" />
          <div class="space-y-2">
            <h3 class="text-2xl font-outfit font-black text-white uppercase italic">No hay misiones creadas</h3>
            <p class="text-zinc-500 max-w-md mx-auto font-medium">Comienza creando tu primera misión para motivar a tus estudiantes.</p>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="space-y-4" in:fade>
      {#each data.assignedMissions as assignment}
        {@const student = data.students.find(s => s.id === assignment.student_id)}
        {@const details = getMissionDetails(assignment.mission_id)}
        <div class="bento-card !p-6 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white/10 transition-all">
          <div class="flex items-center gap-6 flex-1 min-w-0">
            <div class="w-16 h-16 bg-zinc-950 border border-white/5 flex items-center justify-center shrink-0 relative">
               {#if assignment.completed}
                 <div class="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                 <CheckCircle weight="fill" size={32} class="text-emerald-500 relative z-10" />
               {:else}
                 <ChartLineUp weight="duotone" size={32} class="text-primary-400 animate-pulse" />
               {/if}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[8px] font-black px-2 py-0.5 bg-zinc-900 text-zinc-400 uppercase border border-white/5">{details?.type || 'Misión'}</span>
                <span class="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={10} /> {new Date(assignment.assignedAt).toLocaleDateString()}
                </span>
              </div>
              <h4 class="text-xl font-outfit font-black text-white uppercase italic tracking-tight truncate">
                {student?.name || 'Alumno'} <span class="text-zinc-600 px-2">/</span> <span class="text-primary-400">{details?.title || 'Cargando...'}</span>
              </h4>
              
              <div class="mt-4 space-y-2 max-w-md">
                <div class="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                  <span>Progreso del desafío</span>
                  <span>{assignment.progress} / {details?.target || 0}</span>
                </div>
                <div class="h-1 bg-white/5 overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-1000" 
                    style="width: {(assignment.progress / (details?.target || 1)) * 100}%"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 shrink-0">
            {#if assignment.completed}
               <div class="flex flex-col items-end">
                 <div class="px-3 py-1 bg-emerald-500 text-black text-[8px] font-black uppercase tracking-[0.2em] mb-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]">COMPLETADO</div>
                 <p class="text-[10px] font-bold text-emerald-400">+{details?.reward} XP</p>
               </div>
            {:else}
              <div class="flex flex-col items-end">
                <div class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[8px] font-black uppercase tracking-[0.2em] mb-1">EN PROGRESO</div>
                <p class="text-[9px] text-zinc-500 font-medium italic">Sincronizando...</p>
              </div>
            {/if}

            <form method="POST" action="?/deleteAssignment" use:enhance={() => {
              return ({ result }) => {
                if (result.type === 'success') toast.success('Asignación cancelada');
              };
            }}>
              <input type="hidden" name="id" value={assignment.id} />
              <button 
                type="submit"
                class="w-10 h-10 bg-white/5 border border-white/10 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all flex items-center justify-center"
                title="Cancelar asignación"
              >
                <X size={14} />
              </button>
            </form>
          </div>
        </div>
      {:else}
        <div class="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-zinc-950/50 border border-dashed border-white/10">
          <ChartLineUp size={64} class="text-zinc-800" weight="thin" />
          <div class="space-y-2">
            <h3 class="text-2xl font-outfit font-black text-white uppercase italic">No hay actividad reciente</h3>
            <p class="text-zinc-500 max-w-md mx-auto font-medium">Asigna misiones a tus alumnos para ver su progreso aquí.</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Create Mission Modal -->
<Modal show={isCreating} title="NUEVO DESAFÍO" onClose={() => isCreating = false}>
  <form 
    method="POST" 
    action="?/createMission" 
    class="space-y-8"
    use:enhance={() => {
      return ({ result }) => {
        if (result.type === 'success') {
          toast.success('Misión creada correctamente');
          isCreating = false;
        }
      };
    }}
  >
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]" for="title">Título del desafío</label>
        <input 
          id="title"
          name="title" 
          type="text" 
          required 
          placeholder="Ej: Maestro de Puzzles I"
          class="w-full h-14 bg-zinc-950 border border-white/10 px-6 text-white font-outfit font-bold focus:border-primary-500 outline-none transition-all placeholder:text-zinc-700" 
        />
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]" for="description">Instrucciones</label>
        <textarea 
          id="description"
          name="description" 
          rows="3"
          required
          placeholder="¿Qué debe hacer el alumno?"
          class="w-full bg-zinc-950 border border-white/10 p-6 text-white font-outfit font-bold focus:border-primary-500 outline-none transition-all placeholder:text-zinc-700"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]" for="type">Tipo de actividad</label>
          <select 
            id="type"
            name="type" 
            class="w-full h-14 bg-zinc-950 border border-white/10 px-6 text-white font-outfit font-bold focus:border-primary-500 outline-none transition-all"
          >
            {#each missionTypes as type}
              <option value={type.id}>{type.name}</option>
            {/each}
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]" for="target">Objetivo (Cantidad)</label>
          <input 
            id="target"
            name="target" 
            type="number" 
            min="1"
            required 
            class="w-full h-14 bg-zinc-950 border border-white/10 px-6 text-white font-outfit font-bold focus:border-primary-500 outline-none transition-all" 
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]" for="reward">Recompensa (XP)</label>
        <input 
          id="reward"
          name="reward" 
          type="number" 
          min="10"
          required 
          class="w-full h-14 bg-zinc-950 border border-white/10 px-6 text-amber-400 font-outfit font-bold focus:border-amber-500 outline-none transition-all" 
        />
      </div>
    </div>

    <button 
      type="submit"
      class="w-full h-16 bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-500 hover:text-white transition-all shadow-xl"
    >
      Publicar Desafío
    </button>
  </form>
</Modal>

<!-- Assign Mission Modal -->
<Modal show={isAssigning} title="ASIGNAR DESAFÍO" onClose={() => isAssigning = false}>
  {#if selectedMission}
    <form 
      method="POST" 
      action="?/assignMission" 
      class="space-y-8"
      use:enhance={() => {
        return ({ result }) => {
          if (result.type === 'success') {
            toast.success(`Desafío asignado correctamente`);
            isAssigning = false;
          }
        };
      }}
    >
      <input type="hidden" name="missionId" value={selectedMission.id} />
      
      <div class="space-y-6">
        <div class="p-6 bg-zinc-950 border border-white/5 space-y-2">
          <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Misión seleccionada</p>
          <p class="text-xl font-outfit font-black text-white italic uppercase tracking-tight">{selectedMission.title}</p>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]" for="targetType">¿A quién va dirigido?</label>
          <div class="grid grid-cols-3 gap-2">
            {#each [
              { id: 'student', label: 'Alumno', icon: GraduationCap },
              { id: 'class', label: 'Clase', icon: Users },
              { id: 'school', label: 'Colegio', icon: Buildings }
            ] as opt}
              <label class="relative group cursor-pointer">
                <input type="radio" name="targetType" value={opt.id} class="peer sr-only" required />
                <div class="h-20 flex flex-col items-center justify-center gap-2 border border-white/10 bg-zinc-950 group-hover:border-white/30 peer-checked:border-primary-500 peer-checked:bg-primary-500/5 transition-all">
                  <opt.icon size={20} class="peer-checked:text-primary-500" />
                  <span class="text-[8px] font-black uppercase tracking-widest">{opt.label}</span>
                </div>
              </label>
            {/each}
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]" for="targetId">Seleccionar destino</label>
          <select 
            id="targetId"
            name="targetId" 
            required
            class="w-full h-14 bg-zinc-950 border border-white/10 px-6 text-white font-outfit font-bold focus:border-primary-500 outline-none transition-all"
          >
            <option value="">Selecciona una opción...</option>
            <optgroup label="Alumnos">
              {#each data.students as s}
                <option value={s.id}>{s.name}</option>
              {/each}
            </optgroup>
            <optgroup label="Clases">
              {#each data.classes as c}
                <option value={c.id}>{c.name}</option>
              {/each}
            </optgroup>
            <optgroup label="Colegios">
              {#each data.schools as sc}
                <option value={sc.id}>{sc.name}</option>
              {/each}
            </optgroup>
          </select>
        </div>
      </div>

      <button 
        type="submit"
        class="w-full h-16 bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-500 hover:text-white transition-all shadow-xl"
      >
        Confirmar Asignación
      </button>
    </form>
  {/if}
</Modal>
