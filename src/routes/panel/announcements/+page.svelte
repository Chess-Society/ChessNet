<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { 
    Megaphone, 
    Plus, 
    Trash, 
    PaperPlaneTilt, 
    Eye, 
    EyeSlash,
    Clock,
    Target,
    Warning,
    ChatCircleDots,
    CaretRight,
    Users,
    Buildings,
    CheckCircle,
    PencilSimple
  } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { enhance } from '$app/forms';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { appStore } from '$lib/stores/appStore';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  
  let announcements = $derived(data.announcements || []);
  let schools = $derived($appStore.schools || []);
  let classes = $derived(data.classes || []);
  
  let targetType = $state('school'); // 'school' or 'class'
  let isCreating = $state(false);
  let isSubmitting = $state(false);
  
  const getSchoolName = (id: string) => {
    if (id === 'all') return $t('common.all_schools');
    return schools.find(s => s.id === id)?.name || id;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'normal': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await uiStore.confirm({
      title: '¿Eliminar comunicado?',
      message: 'Esta acción no se puede deshacer.',
      type: 'danger'
    });
    
    if (confirmed) {
      const formData = new FormData();
      formData.append('id', id);
      // We use a hidden form or fetch, but here we can just use the actions
    }
  };

</script>

<svelte:head>
  <title>Comunicados - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-12" in:fade>
  
  <!-- Header -->
  <header class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
    <div class="flex items-center gap-8">
      <div class="w-20 h-20 bg-zinc-950 border border-white/10 flex items-center justify-center text-primary-400 shadow-2xl relative group overflow-hidden">
        <div class="absolute inset-0 bg-primary-500/10 group-hover:scale-110 transition-transform"></div>
        <Megaphone size={40} weight="duotone" class="relative z-10" />
      </div>
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-[10px] font-black text-primary-400 uppercase tracking-widest">
            Portal de Comunicación
          </span>
          <span class="w-1.5 h-1.5 bg-zinc-800"></span>
          <span class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            {announcements.length} comunicados emitidos
          </span>
        </div>
        <h1 class="text-5xl lg:text-7xl font-outfit font-black text-white tracking-tighter uppercase italic leading-none">
          Comunicados<span class="text-primary-500">.</span>
        </h1>
        <p class="text-zinc-500 font-medium text-lg mt-2 max-w-xl">
          {#if data.role === 'parent'}
            Recibe información directa de los clubes y profesores de tus hijos.
          {:else}
            Mantén informados a los padres y alumnos sobre el progreso y novedades.
          {/if}
        </p>
      </div>
    </div>

    {#if data.role !== 'parent'}
      <button 
        onclick={() => isCreating = true}
        class="h-16 px-10 bg-white text-black font-black hover:bg-primary-500 hover:text-white transition-all flex items-center gap-4 shadow-2xl active:scale-95 uppercase text-[10px] tracking-[0.2em]"
      >
        <Plus weight="bold" size={20} />
        Emitir nuevo aviso
      </button>
    {/if}
  </header>

  <!-- Announcements List -->
  <div class="grid grid-cols-1 gap-6">
    {#each announcements as item (item.id)}
      <div 
        class="bento-card !p-8 flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-primary-500/30 transition-all"
        in:fly={{ y: 20 }}
      >
        <div class="flex items-start gap-8 w-full">
          <div class="w-16 h-16 bg-zinc-950 border border-white/5 flex flex-col items-center justify-center shrink-0">
             <span class="text-[10px] font-black text-zinc-500 uppercase leading-none mb-1">
               {new Date(item.createdAt).toLocaleDateString('es', { month: 'short' })}
             </span>
             <span class="text-2xl font-outfit font-black text-white leading-none">
               {new Date(item.createdAt).getDate()}
             </span>
          </div>
          
          <div class="space-y-3 flex-1">
            <div class="flex items-center gap-3">
              <span class="px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border {getPriorityColor(item.priority)}">
                {item.priority}
              </span>
              <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <Buildings size={12} /> {getSchoolName(item.schoolId)}
              </span>
              {#if !item.isPublished}
                <span class="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-widest">
                  Borrador
                </span>
              {/if}
            </div>
            
            <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight italic group-hover:text-primary-400 transition-colors">
              {item.title}
            </h3>
            <p class="text-zinc-500 text-sm line-clamp-2 font-medium max-w-3xl">
              {item.content}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full lg:w-auto">
          {#if data.role !== 'parent'}
            <div class="flex items-center gap-2">
              {#if !item.isPublished}
                <form method="POST" action="?/publish" use:enhance>
                  <input type="hidden" name="id" value={item.id} />
                  <button class="w-12 h-12 bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-primary-400 transition-all" title="Publicar">
                    <PaperPlaneTilt size={20} />
                  </button>
                </form>
              {/if}
              <button class="w-12 h-12 bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all" title="Editar">
                <PencilSimple size={20} />
              </button>
              <form method="POST" action="?/delete" use:enhance>
                <input type="hidden" name="id" value={item.id} />
                <button class="w-12 h-12 bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-all" title="Eliminar">
                  <Trash size={20} />
                </button>
              </form>
            </div>
          {:else}
            <button class="px-6 h-12 border border-white/10 text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Marcar como leído
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <div class="bento-card !p-32 text-center border-dashed border-white/10 opacity-50">
        <Megaphone size={64} weight="duotone" class="mx-auto mb-6 text-zinc-700" />
        <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight italic">Sin comunicados</h3>
        <p class="text-zinc-500 font-medium mt-2">Crea tu primer comunicado para informar a la comunidad.</p>
      </div>
    {/each}
  </div>

  <!-- Create Modal -->
  {#if isCreating}
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-6" in:fade>
      <button 
        class="absolute inset-0 bg-black/80 backdrop-blur-md w-full h-full border-none cursor-default" 
        onclick={() => isCreating = false}
        aria-label="Cerrar"
      ></button>
      
      <div 
        class="relative w-full max-w-2xl bg-zinc-950 border border-white/10 p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
        in:fly={{ y: 50 }}
      >
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tight">Nuevo Comunicado</h2>
          <button onclick={() => isCreating = false} class="text-zinc-500 hover:text-white transition-colors">
            <Plus size={32} weight="bold" class="rotate-45" />
          </button>
        </div>

        <form 
          method="POST" 
          action="?/create" 
          use:enhance={() => {
            isSubmitting = true;
            return async ({ result }) => {
              isSubmitting = false;
              if (result.type === 'success') {
                isCreating = false;
                toast.success('Comunicado creado correctamente');
              }
            }
          }} 
          class="space-y-8"
        >
          <div class="space-y-2">
            <label for="title" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Título del Comunicado</label>
            <input 
              id="title"
              name="title" 
              required
              placeholder="Ej: Nuevos horarios de Mayo"
              class="w-full bg-zinc-900 border border-white/5 p-4 text-white font-bold outline-none focus:border-primary-500/50 transition-all"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Destino</span>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onclick={() => targetType = 'school'}
                  class="p-4 text-[10px] font-black uppercase tracking-widest border transition-all {targetType === 'school' ? 'bg-primary-500 text-white border-primary-500' : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10'}"
                >
                  Escuela
                </button>
                <button 
                  type="button"
                  onclick={() => targetType = 'class'}
                  class="p-4 text-[10px] font-black uppercase tracking-widest border transition-all {targetType === 'class' ? 'bg-primary-500 text-white border-primary-500' : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10'}"
                >
                  Clase
                </button>
              </div>
              <input type="hidden" name="targetType" value={targetType} />
            </div>

            <div class="space-y-2">
              {#if targetType === 'school'}
                <label for="schoolId" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Seleccionar Escuela</label>
                <select id="schoolId" name="schoolId" class="w-full bg-zinc-900 border border-white/5 p-4 text-white font-bold outline-none appearance-none">
                  <option value="all">Todas mis Escuelas</option>
                  {#each schools as school}
                    <option value={school.id}>{school.name}</option>
                  {/each}
                </select>
              {:else}
                <label for="classId" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Seleccionar Clase</label>
                <select id="classId" name="classId" required class="w-full bg-zinc-900 border border-white/5 p-4 text-white font-bold outline-none appearance-none">
                  <option value="" disabled selected>Selecciona una clase</option>
                  {#each classes as cls}
                    <option value={cls.id}>{cls.name}</option>
                  {/each}
                </select>
              {/if}
            </div>

            <div class="space-y-2 md:col-span-2">
              <label for="priority" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Prioridad</label>
              <select id="priority" name="priority" class="w-full bg-zinc-900 border border-white/5 p-4 text-white font-bold outline-none appearance-none">
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label for="content" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Contenido</label>
            <textarea 
              id="content"
              name="content" 
              required
              rows="6"
              placeholder="Escribe aquí el mensaje para los padres y alumnos..."
              class="w-full bg-zinc-900 border border-white/5 p-6 text-white font-medium outline-none focus:border-primary-500/50 transition-all resize-none"
            ></textarea>
          </div>

          <div class="flex items-center gap-4 p-4 bg-primary-500/5 border border-primary-500/10">
            <input type="checkbox" name="isPublished" value="true" id="publish-now" class="w-5 h-5 accent-primary-500" checked />
            <label for="publish-now" class="text-xs font-bold text-white uppercase tracking-widest cursor-pointer">
              Publicar inmediatamente al guardar
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            class="w-full h-16 bg-primary-500 text-white font-black hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/20 uppercase text-[10px] tracking-[0.2em] disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Comunicado'}
          </button>
        </form>
      </div>
    </div>
  {/if}

</div>

<style lang="postcss">
  .bento-card {
    @apply relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/5;
  }
</style>
