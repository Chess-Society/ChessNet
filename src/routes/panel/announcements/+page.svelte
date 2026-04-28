<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { goto } from '$app/navigation';
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
    PencilSimple,
    Crown
  } from 'phosphor-svelte';
  import { t } from '$lib/i18n';
  import { enhance } from '$app/forms';
  import { toast } from '$lib/stores/toast';
  import { user as authUser } from '$lib/stores/auth';
  import { uiStore } from '$lib/stores/uiStore';
  import { appStore } from '$lib/stores/appStore';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  
  let announcements = $derived(data.announcements ?? []);
  let schools = $derived($appStore.schools ?? []);
  let classes = $derived(data.classes ?? []);
  let userUid = $derived($authUser?.uid);
  
  let targetType = $state('school'); // 'school' or 'class'
  let isCreating = $state(false);
  let isSubmitting = $state(false);
  
  const isOwner = (item: any) => {
    return item.ownerId === userUid || item.ownerId === userUid || item._type === 'sent';
  };
  
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
          Mantén informados a los padres y alumnos sobre el progreso y novedades.
        </p>
      </div>
    </div>

    <div class="flex flex-col items-end gap-4">
      {#if data.isAdmin}
        <div class="flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
          <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
          Modo Administrador (Bypass de Límites)
        </div>
      {/if}

      {#if data.planAccess?.allowed}
        {#if schools.length === 0 && classes.length === 0}
          <div class="group relative">
            <button 
              disabled
              class="h-16 px-10 bg-zinc-800 text-zinc-500 font-black flex items-center gap-4 cursor-not-allowed uppercase text-[10px] tracking-[0.2em]"
            >
              <Warning weight="bold" size={20} />
              Sin destinos disponibles
            </button>
            <div class="absolute bottom-full right-0 mb-2 w-64 p-3 bg-zinc-950 border border-white/10 text-[9px] text-zinc-400 font-bold uppercase tracking-widest hidden group-hover:block z-50">
              Debes crear al menos un centro o una clase antes de emitir comunicados.
            </div>
          </div>
        {:else}
          <button 
            onclick={() => isCreating = true}
            class="h-16 px-10 bg-white text-black font-black hover:bg-primary-500 hover:text-white transition-all flex items-center gap-4 shadow-2xl active:scale-95 uppercase text-[10px] tracking-[0.2em]"
          >
            <Plus weight="bold" size={20} />
            Emitir nuevo aviso
          </button>
        {/if}
      {:else}
        <button 
          onclick={() => goto('/panel/upgrade')}
          class="h-16 px-10 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black hover:scale-105 transition-all flex items-center gap-4 shadow-2xl active:scale-95 uppercase text-[10px] tracking-[0.2em] group"
        >
          <Crown weight="fill" size={20} class="text-white group-hover:rotate-12 transition-transform" />
          Mejorar plan para avisos
        </button>
      {/if}
    </div>
  </header>

  {#if data.error}
    <div class="mb-12 p-6 bg-red-500/10 border border-red-500/20 flex items-start gap-4" in:fade>
      <Warning size={24} weight="bold" class="text-red-400 shrink-0 mt-1" />
      <div>
        <h3 class="text-red-400 font-black uppercase text-xs tracking-widest mb-1">Error de Sistema</h3>
        <p class="text-red-400/80 text-sm font-medium">
          No se han podido cargar los comunicados existentes. Esto suele deberse a un índice de base de datos faltante. 
          <br/>
          <span class="text-[10px] opacity-50 font-mono mt-2 block">{data.error}</span>
        </p>
      </div>
    </div>
  {/if}

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
              <span class="px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border {getPriorityColor(item.priority)}">
                {item.priority}
              </span>
              {#if !isOwner(item)}
                <span class="px-2 py-0.5 bg-primary-500 text-black text-[8px] font-black uppercase tracking-widest">
                  Recibido
                </span>
              {:else if !item.isPublished}
                <span class="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-widest">
                  Borrador
                </span>
              {/if}
              <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <Buildings size={12} /> {getSchoolName(item.schoolId)}
              </span>
            </div>
            
            <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight italic group-hover:text-primary-400 transition-colors">
              {item.title}
            </h3>
            <p class="text-zinc-500 text-sm line-clamp-2 font-medium max-w-3xl">
              {item.content}
            </p>
          </div>

        <div class="flex items-center gap-3 w-full lg:w-auto">
          <div class="flex items-center gap-2">
            {#if isOwner(item)}
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
            {:else}
              <div class="px-4 py-2 bg-zinc-950 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">
                Solo lectura
              </div>
            {/if}
          </div>
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

        {#if schools.length === 0 && classes.length === 0}
          <div class="py-12 text-center space-y-6">
            <div class="w-20 h-20 bg-zinc-900 border border-white/5 mx-auto flex items-center justify-center text-zinc-500">
              <Buildings size={40} weight="duotone" />
            </div>
            <div class="space-y-2">
              <h3 class="text-xl font-outfit font-black text-white uppercase italic tracking-tight">No hay destinos</h3>
              <p class="text-zinc-500 text-sm font-medium max-w-xs mx-auto">
                No tienes ningún centro o clase registrada a la que enviar este comunicado.
              </p>
            </div>
            <div class="pt-6 border-t border-white/5 flex flex-col gap-3">
              <button 
                onclick={() => goto('/panel/centers')}
                class="h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-primary-500 hover:text-white transition-all"
              >
                Crear primer centro
              </button>
              <button 
                onclick={() => isCreating = false}
                class="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        {:else}
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
        {/if}
      </div>
    </div>
  {/if}

</div>

<style lang="postcss">
  .bento-card {
    @apply relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/5;
  }
</style>
