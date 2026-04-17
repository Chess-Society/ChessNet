<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { 
    ChatCircleDots, 
    Lightbulb, 
    Megaphone, 
    ArrowRight, 
    Plus, 
    Star, 
    ListChecks, 
    Clock, 
    UserCircle,
    PaperPlaneTilt,
    Lock,
    Crown,
    X,
    HandWaving,
    ChatTeardropDots,
    SealCheck,
    Lifebuoy
  } from 'phosphor-svelte';
  import { db } from '$lib/firebase';
  import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove, where } from 'firebase/firestore';
  import { user as authUser } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { t, locale } from '$lib/i18n';
  import { toast } from '$lib/stores/toast';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { INSIGNIAS } from '$lib/constants/insignias';

  // State
  let activeTab = $state(page.url.searchParams.get('tab') || 'suggestions'); // suggestions, announcements, support
  let showCreateModal = $state(false);
  let showAnnouncementModal = $state(false);
  let showSupportModal = $state(false);
  let isSubmitting = $state(false);
  
  let suggestions = $state<any[]>([]);
  let announcements = $state<any[]>([]);
  let myReports = $state<any[]>([]);
  
  let newSuggestion = $state({
    title: '',
    description: '',
    category: 'feature' // feature, bug, improvement
  });

  let newAnnouncement = $state({
    title: '',
    content: ''
  });

  let newReport = $state({
    title: '',
    content: '',
    type: 'bug' // bug, billing, general
  });

  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));

  onMount(() => {
    // Listen for suggestions
    const qS = query(collection(db, 'lobby_suggestions'), orderBy('createdAt', 'desc'));
    const unsubS = onSnapshot(qS, (snap) => {
      suggestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });

    // Listen for announcements
    const qA = query(collection(db, 'lobby_announcements'), orderBy('createdAt', 'desc'));
    const unsubA = onSnapshot(qA, (snap) => {
      announcements = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });

    // Listen for my reports
    let unsubR = () => {};
    if ($authUser) {
      const qR = isAdmin 
        ? query(collection(db, 'lobby_reports'), orderBy('createdAt', 'desc'))
        : query(collection(db, 'lobby_reports'), where('authorId', '==', $authUser.uid), orderBy('createdAt', 'desc'));
      
      unsubR = onSnapshot(qR, (snap) => {
        myReports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      });
    }

    return () => {
      unsubS();
      unsubA();
      unsubR();
    };
  });

  async function handleSubmitSuggestion() {
    if (!newSuggestion.title || !newSuggestion.description) return;
    if (plan !== 'premium' && !isAdmin) {
        toast.error("Sólo los usuarios Premium pueden enviar sugerencias");
        return;
    }

    isSubmitting = true;
    try {
      await addDoc(collection(db, 'lobby_suggestions'), {
        ...newSuggestion,
        authorId: $authUser?.uid,
        authorName: $appStore?.settings?.teacherName || $authUser?.displayName || 'Anónimo',
        authorAvatar: $appStore?.settings?.teacherAvatar || $authUser?.photoURL || null,
        authorInsignias: $appStore?.settings?.featuredInsignias || [],
        votes: [],
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      toast.success("¡Sugerencia enviada correctamente!");
      showCreateModal = false;
      newSuggestion = { title: '', description: '', category: 'feature' };
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleSubmitReport() {
    if (!newReport.title || !newReport.content) return;
    
    isSubmitting = true;
    try {
      await addDoc(collection(db, 'lobby_reports'), {
        ...newReport,
        authorId: $authUser?.uid,
        authorName: $appStore?.settings?.teacherName || $authUser?.displayName || 'Anónimo',
        authorEmail: $authUser?.email,
        status: 'open',
        createdAt: new Date().toISOString()
      });
      
      toast.success("Reporte enviado. Nos pondremos en contacto pronto.");
      showSupportModal = false;
      newReport = { title: '', content: '', type: 'bug' };
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleSubmitAnnouncement() {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    if (!isAdmin) return;

    isSubmitting = true;
    try {
      await addDoc(collection(db, 'lobby_announcements'), {
        ...newAnnouncement,
        createdAt: new Date().toISOString()
      });
      
      toast.success("Comunicado publicado");
      showAnnouncementModal = false;
      newAnnouncement = { title: '', content: '' };
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleVote(id: string, alreadyVoted: boolean) {
    if (plan !== 'premium' && !isAdmin) {
        toast.error("Mejora a Premium para votar propuestas");
        return;
    }
    try {
      const docRef = doc(db, 'lobby_suggestions', id);
      await updateDoc(docRef, {
        votes: alreadyVoted ? arrayRemove($authUser?.uid) : arrayUnion($authUser?.uid)
      });
    } catch (err: any) {
      console.error(err);
    }
  }

  function formatTime(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { 
      day: 'numeric', 
      month: 'short'
    });
  }
</script>

<svelte:head>
  <title>Lobby - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-10 space-y-12" in:fade>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
        <ChatCircleDots weight="fill" class="w-3 h-3" />
        COMMUNITY LOUNGE
      </div>
      <h1 class="text-6xl font-outfit font-black text-white tracking-tighter uppercase italic leading-[0.85]">
        El Lobby de<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Profesores</span>
      </h1>
      <p class="text-zinc-500 font-plus-jakarta text-lg max-w-xl">
        Donde los mejores profesores de ajedrez dan forma al futuro de ChessNet.
      </p>
    </div>

    <div class="flex items-center gap-4">
      <!-- Tabs Selector -->
      <div class="flex p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
        <button 
          onclick={() => activeTab = 'suggestions'}
          class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all {activeTab === 'suggestions' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-500 hover:text-zinc-300'}"
        >
          Lobby Comunidad
        </button>
        <button 
          onclick={() => activeTab = 'announcements'}
          class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all {activeTab === 'announcements' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-500 hover:text-zinc-300'}"
        >
          Novedades
        </button>
        <button 
          onclick={() => activeTab = 'support'}
          class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all {activeTab === 'support' ? 'bg-amber-600 text-black shadow-lg shadow-amber-600/20' : 'text-zinc-500 hover:text-zinc-300'}"
        >
          Soporte ChessNet
        </button>
      </div>

      {#if activeTab === 'suggestions'}
        <button 
          onclick={() => showCreateModal = true}
          class="h-12 px-6 bg-white hover:bg-violet-100 text-zinc-950 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest group"
        >
          <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
          Proponer
        </button>
      {:else if activeTab === 'announcements' && isAdmin}
        <button 
          onclick={() => showAnnouncementModal = true}
          class="h-12 px-6 bg-primary-500 text-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest group"
        >
          <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
          Anuncio
        </button>
      {:else if activeTab === 'support'}
        <button 
          onclick={() => showSupportModal = true}
          class="h-12 px-6 bg-white hover:bg-violet-100 text-zinc-950 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest group"
        >
          <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
          Reportar
        </button>
      {/if}
    </div>
  </div>

  <!-- Main Content -->
  {#if activeTab === 'suggestions' && plan !== 'premium' && !isAdmin}
    <!-- Restricted Access Notice for Suggestions -->
    <div class="bg-violet-600/10 border border-violet-500/20 rounded-[2.5rem] p-12 text-center space-y-6 relative overflow-hidden group">
        <div class="absolute -right-24 -top-24 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] group-hover:bg-violet-500/20 transition-all duration-700"></div>
        <div class="w-20 h-20 bg-violet-500/20 border border-violet-500/30 rounded-3xl flex items-center justify-center text-violet-400 mx-auto relative z-10">
            <Crown size={40} weight="duotone" />
        </div>
        <div class="space-y-3 relative z-10">
            <h2 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tight">Sugerencias Premium</h2>
            <p class="text-zinc-400 text-lg font-plus-jakarta max-w-lg mx-auto">
                Mejora a Premium para proponer nuevas funcionalidades, votar las propuestas de otros profesores y decidir el futuro de ChessNet.
            </p>
        </div>
        <button 
            onclick={() => goto('/panel/payments')}
            class="px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto relative z-10"
        >
            <Crown size={18} weight="bold" />
            Empieza tu prueba Premium
        </button>
    </div>
  {:else if activeTab === 'announcements' && plan !== 'premium' && !isAdmin}
    <!-- Restricted Access Notice for Announcements -->
    <div class="bg-violet-600/10 border border-violet-500/20 rounded-[2.5rem] p-12 text-center space-y-6 relative overflow-hidden group">
        <div class="absolute -right-24 -top-24 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] group-hover:bg-violet-500/20 transition-all duration-700"></div>
        <div class="w-20 h-20 bg-violet-500/20 border border-violet-500/30 rounded-3xl flex items-center justify-center text-violet-400 mx-auto relative z-10">
            <Crown size={40} weight="duotone" />
        </div>
        <div class="space-y-3 relative z-10">
            <h2 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tight">Comunidad Premium</h2>
            <p class="text-zinc-400 text-lg font-plus-jakarta max-w-lg mx-auto">
                Los anuncios de la comunidad y actualizaciones oficiales solo están disponibles para usuarios Premium.
            </p>
        </div>
        <button 
            onclick={() => goto('/panel/payments')}
            class="px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto relative z-10"
        >
            <Crown size={18} weight="bold" />
            Acceder ahora
        </button>
    </div>
  {:else}
    <!-- Tab Sections -->
    {#if activeTab === 'suggestions'}
      <div class="mb-12 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <h2 class="text-xl font-outfit font-black text-white uppercase italic tracking-wider mb-2">Lobby de la Comunidad</h2>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Este es el espacio para compartir tus ideas y peticiones con otros profesores. Las sugerencias con más votos serán priorizadas en nuestro roadmap de desarrollo.
        </p>
      </div>
    {:else if activeTab === 'announcements'}
      <div class="mb-12 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <h2 class="text-xl font-outfit font-black text-white uppercase italic tracking-wider mb-2">Novedades y Comunicados</h2>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Mantente al día con las últimas actualizaciones, mejoras de rendimiento y nuevas funcionalidades que llegan a ChessNet.
        </p>
      </div>
    {:else if activeTab === 'support'}
      <div class="mb-12 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <h2 class="text-xl font-outfit font-black text-white uppercase italic tracking-wider mb-2">Soporte ChessNet</h2>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed font-outfit italic tracking-wider opacity-60">
          ¿Tienes algún problema técnico, error o duda con tu suscripción? Nuestro equipo de soporte te ayudará directamente aquí.
        </p>
      </div>
    {/if}

    {#if activeTab === 'suggestions'}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each suggestions as s (s.id)}
          {@const hasVoted = s.votes?.includes($authUser?.uid)}
          <div 
            class="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden flex flex-col h-full"
            in:fly={{ y: 20, duration: 500 }}
          >
            <!-- Badge Status -->
            <div class="flex items-center justify-between mb-8">
               <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 
                {s.status === 'implemented' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                 s.status === 'planned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                 'bg-zinc-800 text-slate-500'}">
                 {s.status === 'implemented' ? 'Completado' : s.status === 'planned' ? 'Planificado' : 'En Revisión'}
               </span>
               <div class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <Clock weight="bold" />
                  {formatTime(s.createdAt)}
               </div>
            </div>

            <div class="space-y-4 mb-8 flex-1">
              <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight leading-tight group-hover:text-violet-400 transition-colors">
                {s.title}
              </h3>
              <p class="text-sm text-slate-400 line-clamp-4 leading-relaxed font-medium">
                {s.description}
              </p>
            </div>

            <div class="flex items-center justify-between pt-8 border-t border-white/5">
               <div class="flex items-center gap-3">
                  <div class="flex items-center -space-x-2 mr-3 group/badges">
                    {#each (s.authorInsignias || []).slice(0, 3) as insigniaId}
                      {@const insignia = INSIGNIAS.find(i => i.id === insigniaId)}
                      {#if insignia}
                        <div 
                          class="w-6 h-6 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center p-1 shadow-xl transition-all hover:-translate-y-1 hover:z-10 {insignia.color}"
                          title={$t(insignia.titleKey)}
                        >
                          <insignia.icon weight="duotone" class="w-full h-full" />
                        </div>
                      {/if}
                    {/each}
                  </div>
                  <div class="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-[10px] overflow-hidden">
                    {#if s.authorAvatar}
                      <img src={s.authorAvatar} alt="avatar" class="w-full h-full object-cover" />
                    {:else}
                      {s.authorName?.[0] || '?'}
                    {/if}
                  </div>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[100px]">{s.authorName || 'Anónimo'}</p>
               </div>

               <button 
                 onclick={() => handleVote(s.id, hasVoted)}
                 disabled={s.status === 'implemented'}
                 class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all border {hasVoted ? 'bg-violet-600 text-white border-violet-400 shadow-lg shadow-violet-600/20' : 'bg-white/5 text-slate-400 border-white/5 hover:border-violet-500/30'}"
               >
                  <Star weight={hasVoted ? "fill" : "bold"} class="w-4 h-4 {hasVoted ? 'text-white' : 'text-violet-500'}" />
                  <span class="text-xs font-black tabular-nums">{s.votes?.length || 0}</span>
               </button>
            </div>
          </div>
        {:else}
          <div class="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-6">
            <div class="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-600 mx-auto">
               <Lightbulb size={40} weight="duotone" />
            </div>
            <p class="text-slate-500 font-medium">No hay sugerencias todavía. ¡Sé el primero en proponer algo!</p>
          </div>
        {/each}
      </div>
    {:else if activeTab === 'announcements'}
      <!-- Announcements Section -->
      <div class="space-y-6">
        {#each announcements as a (a.id)}
          <div 
            class="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden flex flex-col md:flex-row gap-8"
            in:fly={{ x: 20, duration: 500 }}
          >
             <div class="w-16 h-16 bg-violet-600/10 border border-violet-500/20 rounded-3xl flex items-center justify-center text-violet-400 flex-shrink-0">
                <Megaphone size={30} weight="duotone" />
             </div>
             <div class="space-y-3 flex-1">
                <div class="flex items-center justify-between">
                   <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{a.title}</h3>
                   <span class="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">{formatTime(a.createdAt)}</span>
                </div>
                <p class="text-slate-400 leading-relaxed font-medium">
                  {a.content}
                </p>
             </div>
          </div>
        {:else}
          <div class="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-6">
            <div class="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-600 mx-auto">
               <Megaphone size={40} weight="duotone" />
            </div>
            <p class="text-slate-500 font-medium">No hay comunicaciones oficiales en este momento.</p>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Support Section -->
      <div class="space-y-6">
        {#each myReports as r (r.id)}
          <div 
            class="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden flex flex-col md:flex-row gap-8"
            in:fly={{ x: 20, duration: 500 }}
          >
             <div class="w-16 h-16 {r.status === 'open' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'} border rounded-3xl flex items-center justify-center flex-shrink-0">
                <Warning size={30} weight="duotone" />
             </div>
             <div class="space-y-3 flex-1">
                <div class="flex items-center justify-between">
                   <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{r.title}</h3>
                   <div class="flex items-center gap-4">
                      {#if isAdmin}
                        <span class="text-[9px] font-black text-violet-400 border border-violet-500/20 px-2 py-1 rounded-lg uppercase">{r.authorEmail}</span>
                      {/if}
                      <span class="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">{formatTime(r.createdAt)}</span>
                   </div>
                </div>
                <p class="text-slate-400 leading-relaxed font-medium">
                  {r.content}
                </p>
                <div class="flex items-center gap-2 pt-2">
                   <span class="px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest {r.status === 'open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}">
                     {r.status === 'open' ? 'Pendiente' : 'Cerrado'}
                   </span>
                </div>
             </div>
          </div>
        {:else}
          <div class="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-6">
            <div class="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-600 mx-auto">
               <HandWaving size={40} weight="duotone" />
            </div>
            <p class="text-slate-500 font-medium">No has enviado ningún reporte todavía. Estamos aquí para ayudarte.</p>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<!-- Create Suggestion Modal -->
{#if showCreateModal}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto" transition:fade>
    <div 
      class="bg-[#0a0a0c] w-full max-w-xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden relative"
      transition:scale
    >
      <div class="p-8 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">Nueva Sugerencia</h3>
        <button 
          onclick={() => showCreateModal = false}
          class="p-2 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X weight="bold" class="w-6 h-6" />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <div class="space-y-4">
          <label for="suggestion-title" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Título de la Idea</label>
          <input 
            id="suggestion-title"
            bind:value={newSuggestion.title}
            type="text" 
            placeholder="Ej: Modo multijugador para torneos"
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all placeholder:text-slate-700"
          />
        </div>

        <div class="space-y-4">
          <label for="suggestion-description" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Descripción Detallada</label>
          <textarea 
            id="suggestion-description"
            bind:value={newSuggestion.description}
            rows="5"
            placeholder="Explica cómo esta idea ayudaría a otros profesores..."
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all resize-none placeholder:text-slate-700"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showCreateModal = false}
             class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all"
           >
             Cancelar
           </button>
           <button 
             onclick={handleSubmitSuggestion}
             disabled={isSubmitting || !newSuggestion.title || !newSuggestion.description}
             class="py-4 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
           >
             {isSubmitting ? 'Enviando...' : 'Publicar Sugerencia'}
           </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Create Announcement Modal -->
{#if showAnnouncementModal}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto" transition:fade>
    <div 
      class="bg-[#0a0a0c] w-full max-w-xl rounded-[3rem] border border-violet-500/20 shadow-3xl overflow-hidden relative"
      transition:scale
    >
      <div class="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none"></div>
      <div class="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight flex items-center gap-4">
          <Megaphone size={24} weight="fill" class="text-violet-500" />
          Nuevo Comunicado
        </h3>
        <button 
          onclick={() => showAnnouncementModal = false}
          class="p-2 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X weight="bold" class="w-6 h-6" />
        </button>
      </div>

      <div class="p-8 space-y-8 relative z-10">
        <div class="space-y-4">
          <label for="announce-title" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Asunto del Comunicado</label>
          <input 
            id="announce-title"
            bind:value={newAnnouncement.title}
            type="text" 
            placeholder="Ej: Nueva actualización del sistema"
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all placeholder:text-slate-700"
          />
        </div>

        <div class="space-y-4">
          <label for="announce-content" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mensaje Oficial</label>
          <textarea 
            id="announce-content"
            bind:value={newAnnouncement.content}
            rows="5"
            placeholder="Escribe el contenido del anuncio para los profesores..."
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all resize-none placeholder:text-slate-700"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showAnnouncementModal = false}
             class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all"
           >
             Cancelar
           </button>
           <button 
             onclick={handleSubmitAnnouncement}
             disabled={isSubmitting || !newAnnouncement.title || !newAnnouncement.content}
             class="py-4 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
           >
             {isSubmitting ? 'Publicando...' : 'Publicar Ahora'}
           </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Support Report Modal -->
{#if showSupportModal}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto" transition:fade>
    <div 
      class="bg-[#0a0a0c] w-full max-w-xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden relative"
      transition:scale
    >
      <div class="p-8 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight flex items-center gap-4">
           <ChatTeardropDots size={24} weight="fill" class="text-amber-500" />
           Soporte Técnico
        </h3>
        <button 
          onclick={() => showSupportModal = false}
          class="p-2 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X weight="bold" class="w-6 h-6" />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <div class="space-y-4">
          <label for="report-title" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">¿Qué sucede?</label>
          <input 
            id="report-title"
            bind:value={newReport.title}
            type="text" 
            placeholder="Ej: Error al cargar alumnos"
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-amber-500 outline-none transition-all placeholder:text-slate-700"
          />
        </div>

        <div class="space-y-4">
          <label for="report-content" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Explícanos los detalles</label>
          <textarea 
            id="report-content"
            bind:value={newReport.content}
            rows="5"
            placeholder="Dinos qué estabas haciendo cuando ocurrió el error..."
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-amber-500 outline-none transition-all resize-none placeholder:text-slate-700"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showSupportModal = false}
             class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all"
           >
             Cerrar
           </button>
           <button 
             onclick={handleSubmitReport}
             disabled={isSubmitting || !newReport.title || !newReport.content}
             class="py-4 bg-amber-600 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
           >
             {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
           </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  /* Custom glass effects */
  :global(.animate-spin-slow) {
    animation: spin 8s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  .animate-float-delayed {
    animation: float 4s ease-in-out infinite 2s;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
</style>
