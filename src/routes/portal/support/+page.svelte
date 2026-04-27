<script lang="ts">
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { 
    Lifebuoy, 
    Warning, 
    CheckCircle, 
    Clock, 
    Plus, 
    X, 
    Trash, 
    Envelope, 
    ArrowRight,
    HandWaving,
    PaperPlane,
    ChatCircleDots
  } from 'phosphor-svelte';
  import { db } from '$lib/firebase';
  import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
  import { user as authUser } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/stores/toast';
  import { goto } from '$app/navigation';
  import { uiStore } from '$lib/stores/uiStore';
  import { formatDate } from '$lib/utils/date';

  // State
  let reports = $derived(($appStore.reports || []).filter(r => r.authorEmail === $authUser?.email));
  let isSubmitting = $state(false);
  let showCreateModal = $state(false);

  let newReport = $state({
    title: '',
    content: '',
    type: 'general' // bug, billing, general, suggestion
  });

  async function handleSubmitReport() {
    if (!newReport.title || !newReport.content) {
      toast.error($t('support.toast_fill_all'));
      return;
    }
    
    isSubmitting = true;
    try {
      const role = $appStore.settings?.role || 'user';
      const roleLabel = role === 'student' ? '[ALUMNO]' : role === 'family' ? '[FAMILIAR]' : '[PORTAL]';
      const authorName = `${roleLabel} ${$authUser?.displayName || $authUser?.email?.split('@')[0] || 'Usuario'}`;

      await addDoc(collection(db, 'lobby_reports'), {
        ...newReport,
        authorId: $authUser?.uid,
        authorName,
        authorEmail: $authUser?.email,
        authorAvatar: $authUser?.photoURL || null,
        status: 'open',
        priority: 'normal',
        source: 'portal',
        createdAt: new Date().toISOString()
      });
      
      toast.success($t('support.toast_sent_success'));
      showCreateModal = false;
      newReport = { title: '', content: '', type: 'general' };
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(id: string) {
    const confirmed = await uiStore.confirm({
      title: $t('support.delete_title'),
      message: $t('support.delete_confirm'),
      type: 'danger'
    });
    if (!confirmed) return;
    
    try {
      await deleteDoc(doc(db, 'lobby_reports', id));
      toast.success($t('support.toast_deleted'));
    } catch (err: any) {
      toast.error($t('support.error_delete', { error: err.message }));
    }
  }

  const stats = $derived({
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    closed: reports.filter(r => r.status === 'closed' || r.status === 'resolved').length
  });

</script>

<svelte:head>
  <title>{$t('support.title')} - ChessNet Portal</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-10 space-y-12" in:fade>
  
  <!-- Back Action -->
  <div class="flex">
    <button 
      onclick={() => goto('/portal')}
      class="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-blue-400 transition-all group"
    >
      <div class="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:text-blue-500 transition-all">
        <ArrowRight weight="bold" class="w-3 h-3 rotate-180" />
      </div>
      VOLVER AL PORTAL
    </button>
  </div>

  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4 lg:space-y-4">
      <div class="hidden lg:inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-none text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
        <Lifebuoy weight="fill" class="w-3 h-3" />
        CENTRO DE SOPORTE
      </div>
      <h1 class="text-4xl lg:text-6xl font-outfit font-black text-white tracking-tighter uppercase leading-none italic">
        PORTAL DE<br/><span class="pb-1 inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">AYUDA FAMILIAR</span>
      </h1>
      <p class="text-zinc-500 font-plus-jakarta text-sm lg:text-lg max-w-xl">
        ¿Tienes alguna duda o problema? Estamos aquí para ayudarte. Envíanos un ticket y te responderemos lo antes posible.
      </p>
    </div>

    <div class="flex items-center gap-6">
      <button 
        onclick={() => showCreateModal = true}
        class="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-none shadow-2xl shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group"
      >
        <Plus size={20} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
        {$t('support.new_ticket')}
      </button>
    </div>
  </div>

  <!-- Stats Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-zinc-900/40 border border-white/5 p-8 rounded-none backdrop-blur-xl relative overflow-hidden group">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/5 rounded-none blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-blue-500/10 rounded-none flex items-center justify-center text-blue-400">
          <Clock weight="duotone" size={24} />
        </div>
        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('support.status.pending')}</span>
      </div>
      <div class="text-4xl font-outfit font-black text-white">{stats.open}</div>
    </div>

    <div class="bg-zinc-900/40 border border-white/5 p-8 rounded-none backdrop-blur-xl relative overflow-hidden group">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/5 rounded-none blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-emerald-500/10 rounded-none flex items-center justify-center text-emerald-400">
          <CheckCircle weight="duotone" size={24} />
        </div>
        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('support.status.resolved')}</span>
      </div>
      <div class="text-4xl font-outfit font-black text-white">{stats.closed}</div>
    </div>

    <div class="bg-zinc-900/40 border border-white/5 p-8 rounded-none backdrop-blur-xl relative overflow-hidden group">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/5 rounded-none blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-indigo-500/10 rounded-none flex items-center justify-center text-indigo-400">
          <ChatCircleDots weight="duotone" size={24} />
        </div>
        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">TUS TICKETS</span>
      </div>
      <div class="text-4xl font-outfit font-black text-white">{stats.total}</div>
    </div>
  </div>

  <!-- Tickets List -->
  <div class="space-y-6">
    {#each reports as r (r.id)}
      <div 
        class="bg-zinc-950/40 border border-white/5 p-8 rounded-none shadow-2xl relative group overflow-hidden flex flex-col md:flex-row gap-8 hover:bg-white/[0.02] transition-colors"
        in:fly={{ y: 20, duration: 500 }}
      >
        <div class="w-16 h-16 {r.status === 'open' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'} border rounded-none flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
          {#if r.status === 'open'}
            <Warning size={30} weight="duotone" class="animate-pulse" />
          {:else}
            <CheckCircle size={30} weight="duotone" />
          {/if}
        </div>

        <div class="flex-1 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">{r.title}</h3>
                <span class="px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] {r.status === 'open' ? 'bg-blue-500 text-black' : 'bg-emerald-500 text-black'}">
                  {r.status === 'open' ? $t('support.status.pending') : $t('support.status.resolved')}
                </span>
              </div>
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  <Clock size={12} weight="bold" />
                  {formatDate(r.createdAt)}
                </span>
                {#if r.type}
                  <span class="text-[10px] font-black text-blue-500/60 uppercase tracking-widest bg-blue-500/5 px-2 py-0.5 rounded-none">
                    {$t(`support.category.${r.type}`)}
                  </span>
                {/if}
              </div>
            </div>

            <div class="flex items-center gap-3">
              {#if r.status === 'open'}
                <button 
                  onclick={() => handleDelete(r.id)}
                  class="p-3 bg-red-500/10 hover:bg-red-500 text-zinc-400 hover:text-white rounded-none transition-all border border-red-500/10"
                >
                  <Trash weight="bold" size={16} />
                </button>
              {/if}
            </div>
          </div>

          <p class="text-zinc-400 font-plus-jakarta leading-relaxed max-w-3xl">
            {r.content}
          </p>

          {#if r.adminResponse}
            <div class="mt-6 p-6 bg-blue-600/10 border border-blue-500/20 rounded-none space-y-3 relative group/response">
              <div class="flex items-center gap-3 text-blue-400">
                <Envelope weight="fill" size={16} />
                <span class="text-[10px] font-black uppercase tracking-[0.2em]">RESPUESTA DEL EQUIPO</span>
              </div>
              <p class="text-sm text-zinc-300">"{r.adminResponse}"</p>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="py-32 text-center border-2 border-dashed border-white/5 rounded-none space-y-6 group">
        <div class="w-24 h-24 bg-white/5 rounded-none flex items-center justify-center text-zinc-700 mx-auto transition-all group-hover:scale-110 group-hover:bg-blue-500/5 group-hover:text-blue-500/20">
          <Lifebuoy size={48} weight="duotone" />
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight">SIN TICKETS ACTIVOS</h3>
          <p class="text-zinc-500 font-medium max-w-xs mx-auto">No tienes ningún ticket de soporte abierto actualmente.</p>
        </div>
        <button 
          onclick={() => showCreateModal = true}
          class="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest text-[10px] transition-all hover:gap-4"
        >
          {$t('support.new_ticket')} <ArrowRight weight="bold" size={14} />
        </button>
      </div>
    {/each}
  </div>

  <!-- Help Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
    <div class="bg-gradient-to-br from-blue-600 to-indigo-900 p-1 rounded-none shadow-2xl shadow-blue-900/20 group hover:scale-[1.02] transition-all duration-500">
      <div class="bg-zinc-950/40 backdrop-blur-xl h-full p-10 rounded-none space-y-6 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="w-14 h-14 bg-white/10 rounded-none flex items-center justify-center text-white">
            <HandWaving size={32} weight="duotone" />
          </div>
          <h3 class="text-3xl font-outfit font-black text-white uppercase tracking-tighter">¿NECESITAS AYUDA RÁPIDA?</h3>
          <p class="text-blue-200/60 font-medium leading-relaxed">
            Consulta nuestra sección de preguntas frecuentes para resolver tus dudas al instante.
          </p>
        </div>
        <a href="/faq" class="flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-[10px] group-hover:gap-5 transition-all">
          VER PREGUNTAS FRECUENTES <ArrowRight weight="bold" size={16} />
        </a>
      </div>
    </div>
  </div>
</div>

<!-- Create Ticket Modal -->
{#if showCreateModal}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto" transition:fade>
    <div 
      class="bg-[#0a0a0c] w-full max-w-xl rounded-none border border-white/10 shadow-3xl overflow-hidden relative"
      transition:scale
    >
      <div class="p-8 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tight">{$t('support.create_ticket')}</h3>
        <button 
          onclick={() => showCreateModal = false}
          class="p-2 hover:bg-white/5 rounded-none transition-all"
        >
          <X weight="bold" class="w-6 h-6 text-zinc-500" />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <div class="space-y-6">
          <div class="space-y-3">
            <span class="block text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2">{$t('support.category')}</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {#each ['bug', 'billing', 'general', 'improvement'] as type}
                <button 
                  onclick={() => newReport.type = type}
                  class="py-3 px-4 rounded-none border text-[10px] font-black uppercase tracking-widest transition-all {newReport.type === type ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20'}"
                >
                  {$t(`support.category.${type === 'improvement' ? 'feature' : type}`)}
                </button>
              {/each}
            </div>
          </div>

          <div class="space-y-3">
            <label for="report-title" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">{$t('support.ticket_title')}</label>
            <input 
              id="report-title"
              bind:value={newReport.title}
              type="text" 
              placeholder="Ej: Problema con el acceso al curso"
              class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-none text-white font-medium focus:border-blue-500 outline-none transition-all placeholder:text-zinc-800"
            />
          </div>

          <div class="space-y-3">
            <label for="report-content" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">{$t('support.ticket_desc')}</label>
            <textarea 
              id="report-content"
              bind:value={newReport.content}
              rows="5"
              placeholder="Describe detalladamente tu problema o sugerencia..."
              class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-none text-white font-medium focus:border-blue-500 outline-none transition-all resize-none placeholder:text-zinc-800"
            ></textarea>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showCreateModal = false}
             class="py-4 rounded-none text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 transition-all"
           >
             {$t('common.cancel')}
           </button>
           <button 
             onclick={handleSubmitReport}
             disabled={isSubmitting || !newReport.title || !newReport.content}
             class="py-4 bg-blue-600 text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {#if isSubmitting}
                <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-none animate-spin"></div>
                {$t('common.sending')}
             {:else}
                <PaperPlane size={16} weight="bold" />
                {$t('support.create_ticket')}
             {/if}
           </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">

</style>
