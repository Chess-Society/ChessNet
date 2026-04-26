<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { 
    Users, 
    Bell, 
    ChartLineUp, 
    Calendar,
    CaretRight,
    Trophy,
    GraduationCap,
    Clock
  } from 'phosphor-svelte';
  import { t } from '$lib/i18n';

  let { data } = $props();
  const students = $derived(data.students);
  const announcements = $derived(data.announcements);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  };

  const commonEmojis = ['👍', '❤️', '👏', '🔥'];

  const handleReaction = async (annId: string, emoji: string) => {
    try {
      const { communicationApi } = await import('$lib/api/communication');
      const userId = data.user.email;
      await communicationApi.reactToAnnouncement(annId, emoji, userId);
      const { invalidateAll } = await import('$app/navigation');
      invalidateAll();
    } catch (err) {
      console.error('Error reacting:', err);
    }
  };
</script>

<svelte:head>
  <title>Portal Familiar - ChessNet</title>
</svelte:head>

<div class="space-y-12">
  <!-- Header Section -->
  <header class="space-y-4" in:fly={{ y: -20, duration: 600 }}>
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
      <Users class="w-3 h-3" />
      <span>Vista Familiar</span>
    </div>
    <h1 class="text-4xl lg:text-5xl font-display font-black tracking-tighter text-white uppercase italic">
      Bienvenido al <span class="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Portal ChessNet</span>
    </h1>
    <p class="text-zinc-400 text-lg max-w-2xl font-medium leading-relaxed">
      Aquí podrás seguir de cerca el progreso de tus hijos y estar al tanto de los últimos comunicados de la escuela.
    </p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Left Column: Students List -->
    <div class="lg:col-span-2 space-y-8">
      <div class="flex items-center justify-between border-b border-white/5 pb-6">
        <h2 class="text-2xl font-display font-black text-white uppercase tracking-tight italic">Alumnos Registrados</h2>
        <span class="px-3 py-1 bg-zinc-900 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest">{students.length}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each students as student, i}
          <div 
            class="bento-card group hover:scale-[1.02] transition-all duration-500 overflow-hidden relative"
            in:fly={{ y: 20, duration: 600, delay: i * 100 }}
          >
            <!-- Background accent -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[40px] rounded-full group-hover:bg-blue-600/10 transition-colors"></div>

            <div class="flex items-start gap-6 relative z-10">
              <div class="w-20 h-20 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-xl group-hover:border-blue-500/50 transition-colors">
                {#if student.avatar}
                  <img src={student.avatar} alt={student.firstName} class="w-full h-full object-cover" />
                {:else}
                  <GraduationCap size={32} class="text-zinc-500 group-hover:text-blue-400 transition-colors" />
                {/if}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-display font-black text-white truncate group-hover:text-blue-400 transition-colors italic uppercase tracking-tight">
                  {student.firstName} {student.lastName}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Activo</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-6">
                  <div class="space-y-1">
                    <p class="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nivel Técnico</p>
                    <div class="flex items-center gap-1.5 text-blue-400">
                      <Trophy size={14} weight="fill" />
                      <span class="text-sm font-black italic">{student.elo || 1200}</span>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <p class="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Asistencia</p>
                    <div class="flex items-center gap-1.5 text-indigo-400">
                      <Calendar size={14} weight="fill" />
                      <span class="text-sm font-black italic">95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a 
              href="/portal/progress?studentId={student.id}"
              class="mt-8 w-full py-4 bg-zinc-900 group-hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/5 group-hover:border-blue-400"
            >
              Ver Informe Detallado
              <CaretRight size={14} class="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        {:else}
          <div class="col-span-full p-12 text-center bg-zinc-950/50 border border-dashed border-white/10 rounded-3xl">
             <GraduationCap size={48} class="mx-auto text-zinc-700 mb-4" />
             <p class="text-zinc-500 font-bold italic">No se han encontrado alumnos vinculados a su cuenta.</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Right Column: Announcements -->
    <div class="space-y-8">
      <div class="flex items-center justify-between border-b border-white/5 pb-6">
        <h2 class="text-2xl font-display font-black text-white uppercase tracking-tight italic">Comunicados</h2>
        <Bell class="w-5 h-5 text-blue-500 animate-bounce" />
      </div>

      <div class="space-y-4">
        {#each announcements as ann, i}
          <div 
            class="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-900 transition-colors relative overflow-hidden group"
            in:fly={{ x: 20, duration: 600, delay: i * 100 }}
          >
            {#if ann.isGlobal}
              <div class="absolute top-0 right-0 px-3 py-1 bg-blue-600/20 text-blue-400 text-[8px] font-black uppercase tracking-widest border-l border-b border-blue-500/20 rounded-bl-xl">
                Global
              </div>
            {/if}
            
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-zinc-500">
                <Clock size={12} />
                <span class="text-[10px] font-black uppercase tracking-widest">{formatDate(ann.createdAt)}</span>
              </div>
              <h3 class="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                {ann.title}
              </h3>
              <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {ann.content}
              </p>
              <div class="flex flex-wrap items-center gap-1.5 pt-2">
                {#each commonEmojis as emoji}
                  {@const users = ann.reactions?.[emoji] || []}
                  {@const hasReacted = users.includes(data.user.email)}
                  <button 
                    onclick={(e) => { e.preventDefault(); handleReaction(ann.id, emoji); }}
                    class="px-2 py-1 rounded-lg border transition-all flex items-center gap-1
                      {hasReacted 
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                        : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'}"
                  >
                    <span class="text-xs">{emoji}</span>
                    {#if users.length > 0}
                      <span class="text-[8px] font-black">{users.length}</span>
                    {/if}
                  </button>
                {/each}
              </div>
              <a href="/portal/announcements" class="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline pt-2 flex items-center gap-1">
                Leer más <CaretRight size={12} />
              </a>
            </div>
          </div>
        {:else}
          <div class="p-8 text-center bg-zinc-950/30 rounded-2xl border border-white/5">
             <p class="text-zinc-600 text-xs font-bold italic">Sin comunicados recientes.</p>
          </div>
        {/each}

        {#if announcements.length > 0}
          <a href="/portal/announcements" class="block w-full py-4 text-center text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-dashed border-white/10 rounded-xl hover:border-white/20">
            Ver todos los comunicados
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .bento-card {
    @apply p-8 bg-[#121214]/60 backdrop-blur-xl border border-white/5 rounded-[2rem];
  }
</style>
