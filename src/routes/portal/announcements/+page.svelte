<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { Bell, Clock, Calendar, CaretRight, Info } from 'phosphor-svelte';

  let { data } = $props();
  const announcements = $derived(data.announcements);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const commonEmojis = ['👍', '❤️', '👏', '🔥'];

  const handleReaction = async (annId: string, emoji: string) => {
    try {
      const { communicationApi } = await import('$lib/api/communication');
      const userId = data.user.email;
      await communicationApi.reactToAnnouncement(annId, emoji, userId);
      // We should ideally use a store or re-fetch data, but for now we'll do a simple local update or invalidation
      const { invalidateAll } = await import('$app/navigation');
      invalidateAll();
    } catch (err) {
      console.error('Error reacting:', err);
    }
  };
</script>

<svelte:head>
  <title>Comunicados - ChessNet Portal</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-12">
  <header class="space-y-4" in:fly={{ y: -20, duration: 600 }}>
    <div class="flex items-center gap-4">
      <div class="p-3 bg-blue-600/10 rounded-2xl text-blue-400">
        <Bell size={28} weight="duotone" />
      </div>
      <div>
        <h1 class="text-4xl font-display font-black tracking-tighter text-white uppercase italic">Comunicados</h1>
        <p class="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">Historial de anuncios y noticias</p>
      </div>
    </div>
  </header>

  <div class="space-y-6">
    {#each announcements as ann, i}
      <div 
        class="bento-card group relative overflow-hidden"
        in:fly={{ y: 20, duration: 600, delay: i * 100 }}
      >
        <!-- Type Badge -->
        <div class="absolute top-0 right-0 px-4 py-2 bg-zinc-950 border-l border-b border-white/5 rounded-bl-2xl">
          <span class="text-[8px] font-black uppercase tracking-[0.2em] {ann.isGlobal ? 'text-blue-400' : 'text-indigo-400'}">
            {ann.isGlobal ? 'Comunicado Global' : 'Escuela / Clase'}
          </span>
        </div>

        <div class="space-y-6">
          <div class="flex items-center gap-2 text-zinc-500">
            <Calendar size={14} weight="duotone" />
            <span class="text-[10px] font-black uppercase tracking-widest">{formatDate(ann.createdAt)}</span>
          </div>

          <div class="space-y-3">
            <h2 class="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
              {ann.title}
            </h2>
            <div class="prose prose-invert max-w-none text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
              {ann.content}
            </div>
          </div>

          <div class="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/5">
            <div class="flex flex-wrap items-center gap-2">
              {#each commonEmojis as emoji}
                {@const users = ann.reactions?.[emoji] || []}
                {@const hasReacted = users.includes(data.user.email)}
                <button 
                  onclick={() => handleReaction(ann.id, emoji)}
                  class="px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2
                    {hasReacted 
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                      : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'}"
                >
                  <span class="text-sm">{emoji}</span>
                  {#if users.length > 0}
                    <span class="text-[10px] font-black">{users.length}</span>
                  {/if}
                </button>
              {/each}
            </div>

            <button class="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">
              Ver detalle completo
              <CaretRight size={14} />
            </button>
          </div>

          {#if ann.author}
            <div class="pt-4 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                <Info size={14} weight="duotone" class="text-zinc-500" />
              </div>
              <div>
                <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Publicado por</p>
                <p class="text-xs font-bold text-white">{ann.author}</p>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="text-center py-20 bg-zinc-950/50 border-2 border-dashed border-white/5 rounded-[2rem]">
        <Bell size={48} weight="thin" class="mx-auto text-zinc-800 mb-4 opacity-20" />
        <p class="text-zinc-500 font-bold italic uppercase tracking-widest">No hay comunicados disponibles</p>
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  .bento-card {
    @apply p-8 bg-[#121214]/60 backdrop-blur-xl border border-white/5 rounded-[2rem];
  }
</style>
