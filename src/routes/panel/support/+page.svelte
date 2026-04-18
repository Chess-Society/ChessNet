<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { 
    Lifebuoy, 
    Warning, 
    CheckCircle, 
    Clock, 
    Plus, 
    X, 
    Trash, 
    Envelope, 
    IdentificationCard,
    ArrowRight,
    HandWaving,
    PaperPlane
  } from 'phosphor-svelte';
  import { db } from '$lib/firebase';
  import { collection, addDoc, query, orderBy, onSnapshot, where, deleteDoc, doc } from 'firebase/firestore';
  import { user as authUser } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/stores/toast';
  import { onMount } from 'svelte';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { uiStore } from '$lib/stores/uiStore';
  import { formatDate } from '$lib/utils/date';

  // State
  let reports = $state<any[]>([]);
  let isSubmitting = $state(false);
  let showCreateModal = $state(false);

  let newReport = $state({
    title: '',
    content: '',
    type: 'bug' // bug, billing, general, suggestion
  });

  const isAdmin = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));

  onMount(() => {
    let unsubR = () => {};
    if ($authUser) {
      const qR = isAdmin 
        ? query(collection(db, 'lobby_reports'), orderBy('createdAt', 'desc'))
        : query(collection(db, 'lobby_reports'), where('authorId', '==', $authUser.uid), orderBy('createdAt', 'desc'));
      
      unsubR = onSnapshot(qR, (snap) => {
        reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }, (err) => {
        console.error("Error reports listener:", err);
        toast.error("Error al cargar los tickets de soporte");
      });
    }
    return () => unsubR();
  });

  async function handleSubmitReport() {
    if (!newReport.title || !newReport.content) {
      toast.error("Por favor, rellena todos los campos");
      return;
    }
    
    isSubmitting = true;
    try {
      await addDoc(collection(db, 'lobby_reports'), {
        ...newReport,
        authorId: $authUser?.uid,
        authorName: $appStore?.settings?.teacherName || $authUser?.displayName || 'Anónimo',
        authorEmail: $authUser?.email,
        authorAvatar: $authUser?.photoURL || null,
        status: 'open',
        createdAt: new Date().toISOString()
      });
      
      toast.success("Ticket enviado correctamente. Nos pondremos en contacto pronto.");
      showCreateModal = false;
      newReport = { title: '', content: '', type: 'bug' };
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(id: string) {
    const confirmed = await uiStore.confirm({
      title: "Eliminar Ticket",
      message: "¿Estás seguro de que deseas eliminar este ticket de soporte?",
      type: 'danger'
    });
    if (!confirmed) return;
    
    try {
      await deleteDoc(doc(db, 'lobby_reports', id));
      toast.success("Ticket eliminado");
    } catch (err: any) {
      toast.error("Error al eliminar: " + err.message);
    }
  }

  const stats = $derived({
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    closed: reports.filter(r => r.status === 'closed' || r.status === 'resolved').length
  });

</script>

<svelte:head>
  <title>{$t('support.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-10 space-y-12" in:fade>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4 lg:space-y-4">
      <div class="hidden lg:inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
        <Lifebuoy weight="fill" class="w-3 h-3" />
        {$t('support.title')}
      </div>
      <h1 class="text-4xl lg:text-6xl font-outfit font-black text-white tracking-tighter uppercase italic leading-[0.85]">
        Centro de<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Asistencia</span>
      </h1>
      <p class="text-zinc-500 font-plus-jakarta text-sm lg:text-lg max-w-xl">
        {$t('support.desc')}
      </p>
    </div>

    <button 
      onclick={() => showCreateModal = true}
      class="h-14 px-8 bg-white hover:bg-amber-100 text-zinc-950 rounded-2xl shadow-2xl shadow-white/5 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group"
    >
      <Plus size={20} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
      {$t('support.new_ticket')}
    </button>
  </div>

  <!-- Stats Bento Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400">
          <Clock weight="duotone" size={24} />
        </div>
        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('support.status.pending')}</span>
      </div>
      <div class="text-4xl font-outfit font-black text-white">{stats.open}</div>
    </div>

    <div class="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
          <CheckCircle weight="duotone" size={24} />
        </div>
        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('support.status.resolved')}</span>
      </div>
      <div class="text-4xl font-outfit font-black text-white">{stats.closed}</div>
    </div>

    <div class="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
          <Lifebuoy weight="duotone" size={24} />
        </div>
        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{$t('common.total')}</span>
      </div>
      <div class="text-4xl font-outfit font-black text-white">{stats.total}</div>
    </div>
  </div>

  <!-- Tickets List -->
  <div class="space-y-6">
    {#each reports as r (r.id)}
      <div 
        class="bg-zinc-950/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden flex flex-col md:flex-row gap-8 hover:bg-white/[0.02] transition-colors"
        in:fly={{ y: 20, duration: 500 }}
      >
        <div class="w-16 h-16 {r.status === 'open' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'} border rounded-3xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
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
                <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{r.title}</h3>
                <span class="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] {r.status === 'open' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'}">
                  {r.status === 'open' ? $t('support.status.pending') : $t('support.status.resolved')}
                </span>
              </div>
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  <Clock size={12} weight="bold" />
                  {formatDate(r.createdAt)}
                </span>
                {#if r.type}
                  <span class="text-[10px] font-black text-amber-500/60 uppercase tracking-widest bg-amber-500/5 px-2 py-0.5 rounded">
                    {$t(`support.category.${r.type}`)}
                  </span>
                {/if}
              </div>
            </div>

            <div class="flex items-center gap-3">
              {#if isAdmin}
                <div class="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                  <IdentificationCard size={14} class="text-violet-400" />
                  <span class="text-[9px] font-black text-violet-300 uppercase">{r.authorEmail}</span>
                </div>
              {/if}
              
              {#if isAdmin || r.status === 'open'}
                <button 
                  onclick={() => handleDelete(r.id)}
                  class="p-3 bg-red-500/10 hover:bg-red-500 text-zinc-400 hover:text-white rounded-2xl transition-all border border-red-500/10"
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
            <div class="mt-6 p-6 bg-violet-600/10 border border-violet-500/20 rounded-3xl space-y-3 relative group/response">
              <div class="flex items-center gap-3 text-violet-400">
                <Envelope weight="fill" size={16} />
                <span class="text-[10px] font-black uppercase tracking-[0.2em]">Respuesta de ChessNet</span>
              </div>
              <p class="text-sm text-zinc-300 italic">"{r.adminResponse}"</p>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-6 group">
        <div class="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-zinc-700 mx-auto transition-all group-hover:scale-110 group-hover:bg-amber-500/5 group-hover:text-amber-500/20">
          <Lifebuoy size={48} weight="duotone" />
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight italic">{$t('support.no_tickets')}</h3>
          <p class="text-zinc-500 font-medium max-w-xs mx-auto">{$t('support.desc')}</p>
        </div>
        <button 
          onclick={() => showCreateModal = true}
          class="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-black uppercase tracking-widest text-[10px] transition-all hover:gap-4"
        >
          {$t('support.new_ticket')} <ArrowRight weight="bold" size={14} />
        </button>
      </div>
    {/each}
  </div>

  <!-- Help Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
    <div class="bg-gradient-to-br from-violet-600 to-indigo-900 p-1 rounded-[2.5rem] shadow-2xl shadow-violet-900/20 group hover:scale-[1.02] transition-all duration-500">
      <div class="bg-zinc-950/40 backdrop-blur-xl h-full p-10 rounded-[2.3rem] space-y-6 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white">
            <HandWaving size={32} weight="duotone" />
          </div>
          <h3 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tighter">¿Necesitas ayuda rápida?</h3>
          <p class="text-violet-200/60 font-medium leading-relaxed">
            Revisa nuestra base de conocimientos para encontrar respuestas inmediatas a las preguntas más frecuentes.
          </p>
        </div>
        <a href="/faq" class="flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-[10px] group-hover:gap-5 transition-all">
          Ir a FAQ <ArrowRight weight="bold" size={16} />
        </a>
      </div>
    </div>

    <div class="bg-zinc-900 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all">
      <div class="absolute -right-24 -bottom-24 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all duration-700"></div>
      <div class="space-y-6 relative z-10">
        <div class="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
          <Envelope size={32} weight="duotone" />
        </div>
        <div class="space-y-2">
          <h3 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tighter">Correo Directo</h3>
          <p class="text-zinc-500 font-medium max-w-sm">
            Si prefieres el método tradicional o no puedes acceder al panel, escríbenos a:
          </p>
        </div>
        <div class="text-xl font-outfit font-black text-amber-500 uppercase tracking-tight">
          support@chessnet.com
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Create Ticket Modal -->
{#if showCreateModal}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto" transition:fade>
    <div 
      class="bg-[#0a0a0c] w-full max-w-xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden relative"
      transition:scale
    >
      <div class="p-8 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('support.create_ticket')}</h3>
        <button 
          onclick={() => showCreateModal = false}
          class="p-2 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X weight="bold" class="w-6 h-6 text-zinc-500" />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <div class="space-y-6">
          <div class="space-y-3">
            <span class="block text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2">{$t('support.category')}</span>
            <div class="grid grid-cols-2 gap-3">
              {#each ['bug', 'billing', 'general', 'improvement'] as type}
                <button 
                  onclick={() => newReport.type = type}
                  class="py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all {newReport.type === type ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20'}"
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
              placeholder="Ej: No puedo subir el logo del centro"
              class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-amber-500 outline-none transition-all placeholder:text-zinc-800"
            />
          </div>

          <div class="space-y-3">
            <label for="report-content" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">{$t('support.ticket_desc')}</label>
            <textarea 
              id="report-content"
              bind:value={newReport.content}
              rows="5"
              placeholder="Describe qué ha ocurrido y cómo podemos reproducirlo..."
              class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-amber-500 outline-none transition-all resize-none placeholder:text-zinc-800"
            ></textarea>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showCreateModal = false}
             class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 transition-all"
           >
             {$t('common.cancel')}
           </button>
           <button 
             onclick={handleSubmitReport}
             disabled={isSubmitting || !newReport.title || !newReport.content}
             class="py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {#if isSubmitting}
                <div class="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
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
