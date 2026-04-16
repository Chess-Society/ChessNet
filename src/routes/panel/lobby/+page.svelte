<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import { appStore } from '$lib/stores/appStore';
  import { user } from '$lib/stores/auth';
  import { db } from '$lib/firebase';
  import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    updateDoc, 
    doc, 
    arrayUnion, 
    arrayRemove,
    serverTimestamp,
    deleteDoc
  } from 'firebase/firestore';
  import { 
    ChatCircleDots, 
    Megaphone, 
    Lightbulb, 
    Plus, 
    Heart, 
    Trash, 
    Lock,
    Crown,
    ArrowRight,
    PaperPlaneTilt
  } from 'phosphor-svelte';
  import { fade, slide, scale } from 'svelte/transition';
  import { ADMIN_EMAILS } from '$lib/constants';

  let activeTab = $state('suggestions'); // 'suggestions' | 'announcements'
  let suggestions = $state<any[]>([]);
  let announcements = $state<any[]>([]);
  
  let newSuggestion = $state({ title: '', content: '' });
  let newAnnouncement = $state({ title: '', content: '' });
  
  let isSaving = $state(false);
  let showForm = $state(false);

  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($user?.email && ADMIN_EMAILS.includes($user.email.toLowerCase()));
  const isPremium = $derived(plan === 'premium' || isAdmin);

  onMount(() => {
    // Escuchar sugerencias
    const qS = query(collection(db, 'lobby_suggestions'), orderBy('createdAt', 'desc'));
    const unsubS = onSnapshot(qS, (snap) => {
      suggestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });

    // Escuchar comunicados
    const qA = query(collection(db, 'lobby_announcements'), orderBy('createdAt', 'desc'));
    const unsubA = onSnapshot(qA, (snap) => {
      announcements = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });

    return () => {
      unsubS();
      unsubA();
    };
  });

  async function handleAddSuggestion() {
    if (!newSuggestion.title || !newSuggestion.content || isSaving) return;
    isSaving = true;
    try {
      await addDoc(collection(db, 'lobby_suggestions'), {
        title: newSuggestion.title,
        content: newSuggestion.content,
        authorId: $user?.uid,
        authorName: $appStore?.settings?.teacherName || $user?.displayName || 'Anónimo',
        authorAvatar: $appStore?.settings?.teacherAvatar || $user?.photoURL || null,
        votes: [],
        status: 'pending',
        createdAt: serverTimestamp()
      });
      newSuggestion = { title: '', content: '' };
      showForm = false;
    } catch (e) {
      console.error(e);
    } finally {
      isSaving = false;
    }
  }

  async function handleAddAnnouncement() {
    if (!isAdmin || !newAnnouncement.title || !newAnnouncement.content || isSaving) return;
    isSaving = true;
    try {
      await addDoc(collection(db, 'lobby_announcements'), {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        createdAt: serverTimestamp()
      });
      newAnnouncement = { title: '', content: '' };
      activeTab = 'announcements';
    } catch (e) {
      console.error(e);
    } finally {
      isSaving = false;
    }
  }

  async function toggleVote(suggestionId: string, votes: string[]) {
    const userId = $user?.uid;
    if (!userId) return;
    
    const docRef = doc(db, 'lobby_suggestions', suggestionId);
    if (votes.includes(userId)) {
      await updateDoc(docRef, { votes: arrayRemove(userId) });
    } else {
      await updateDoc(docRef, { votes: arrayUnion(userId) });
    }
  }

  async function deleteItem(collectionName: string, id: string) {
    if (!isAdmin) return;
    if (confirm('¿Eliminar este elemento?')) {
      await deleteDoc(doc(db, collectionName, id));
    }
  }

  function formatDate(ts: any) {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Teacher Lobby - ChessNet</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-6 py-10 space-y-12 min-h-[90vh] animate-fade-in">
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5 relative">
    <div class="absolute -top-20 -left-20 w-64 h-64 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>
    
    <div class="space-y-4 text-center md:text-left relative z-10">
      <div class="inline-flex items-center gap-2.5 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full">
        <Crown weight="fill" class="w-3.5 h-3.5 text-violet-400" />
        <span class="text-[9px] font-outfit font-black text-violet-400 uppercase tracking-[0.3em]">Exclusive Premium Lounge</span>
      </div>
      <h1 class="text-4xl md:text-6xl font-outfit font-black text-white tracking-tighter uppercase italic leading-none">
        Teacher <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Lobby</span>
      </h1>
      <p class="text-slate-500 text-sm md:text-base font-medium max-w-xl">
        {$t('lobby.description') || 'Un espacio privado para que los maestros den forma al futuro de ChessNet. Reporta errores, sugiere funciones y vota las mejores ideas.'}
      </p>
    </div>

    {#if !isPremium}
      <div class="bg-violet-600 p-8 rounded-[2.5rem] shadow-2xl shadow-violet-600/20 flex flex-col items-center gap-6 max-w-sm text-center border-4 border-violet-400/20 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center relative">
          <Lock weight="fill" class="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 class="text-white font-outfit font-black uppercase text-xl">Acceso Restringido</h3>
          <p class="text-violet-100 text-xs mt-2 font-medium opacity-80">El Lobby es una función exclusiva para usuarios Premium Master.</p>
        </div>
        <a href="/panel/pricing" class="w-full py-4 bg-white text-violet-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-xl">
          Actualizar a Premium
        </a>
      </div>
    {/if}
  </div>

  {#if isPremium}
    <!-- Content Tabs and Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      <!-- Sidebar / Navigation -->
      <div class="lg:col-span-3 space-y-4">
        <button 
          onclick={() => activeTab = 'suggestions'}
          class="w-full flex items-center justify-between px-6 py-5 rounded-3xl border transition-all {activeTab === 'suggestions' ? 'bg-violet-600/10 border-violet-500/50 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'}"
        >
          <div class="flex items-center gap-4">
            <Lightbulb weight="duotone" class="w-6 h-6" />
            <span class="text-xs font-outfit font-black uppercase tracking-widest">Sugerencias</span>
          </div>
          <span class="text-[10px] font-black opacity-50">{suggestions.length}</span>
        </button>

        <button 
          onclick={() => activeTab = 'announcements'}
          class="w-full flex items-center justify-between px-6 py-5 rounded-3xl border transition-all {activeTab === 'announcements' ? 'bg-violet-600/10 border-violet-500/50 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'}"
        >
          <div class="flex items-center gap-4">
            <Megaphone weight="duotone" class="w-6 h-6" />
            <span class="text-xs font-outfit font-black uppercase tracking-widest">Comunicados</span>
          </div>
          <span class="text-[10px] font-black opacity-50">{announcements.length}</span>
        </button>

        {#if isAdmin}
          <div class="pt-6 mt-6 border-t border-white/5">
             <div class="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 class="text-[10px] font-outfit font-black text-primary-400 uppercase tracking-[0.2em] px-1">Admin Tools</h3>
                <input 
                  bind:value={newAnnouncement.title}
                  placeholder="Título del comunicado..." 
                  class="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-primary-500 outline-none transition-all placeholder:text-slate-600"
                />
                <textarea 
                  bind:value={newAnnouncement.content}
                  placeholder="Mensaje para los profesores..." 
                  class="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-primary-500 outline-none transition-all resize-none h-32 placeholder:text-slate-600"
                ></textarea>
                <button 
                  onclick={handleAddAnnouncement}
                  disabled={isSaving || !newAnnouncement.title}
                  class="w-full py-4 bg-primary-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary-500/20"
                >
                   <PaperPlaneTilt weight="bold" class="w-4 h-4" />
                   {isSaving ? 'Publicando...' : 'Publicar'}
                </button>
             </div>
          </div>
        {/if}
      </div>

      <!-- Main Feed -->
      <div class="lg:col-span-9 space-y-8">
        
        {#if activeTab === 'suggestions'}
          <!-- Suggestions Feed -->
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-outfit font-black text-white uppercase italic tracking-wider">Feed de Ideas</h2>
            <button 
              onclick={() => showForm = !showForm}
              class="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-400 hover:text-white transition-all shadow-xl"
            >
              <Plus weight="bold" class="w-4 h-4" />
              Nueva Sugerencia
            </button>
          </div>

          {#if showForm}
            <div class="bg-violet-600/5 border border-violet-500/20 p-8 rounded-[2.5rem] space-y-6" transition:slide>
              <div class="grid grid-cols-1 gap-6">
                <div class="space-y-2">
                  <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">¿Qué tienes en mente?</span>
                  <input 
                    bind:value={newSuggestion.title}
                    placeholder="Resumen corto de la idea..."
                    class="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-violet-500 outline-none transition-all font-medium"
                  />
                </div>
                <div class="space-y-2">
                  <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Explica el detalle</span>
                  <textarea 
                    bind:value={newSuggestion.content}
                    placeholder="Cuéntanos cómo esta mejora ayudaría a tu academia..."
                    class="w-full bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-violet-500 outline-none transition-all h-32 resize-none font-medium"
                  ></textarea>
                </div>
                <div class="flex justify-end gap-3">
                  <button 
                    onclick={() => showForm = false}
                    class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onclick={handleAddSuggestion}
                    disabled={isSaving || !newSuggestion.title}
                    class="bg-violet-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:bg-violet-500 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {isSaving ? 'Enviando...' : 'Enviar Sugerencia'}
                  </button>
                </div>
              </div>
            </div>
          {/if}

          <div class="grid grid-cols-1 gap-6">
            {#each suggestions as s (s.id)}
              <div class="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all relative group overflow-hidden" in:fade>
                <div class="flex items-start justify-between gap-6 relative z-10">
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center font-outfit font-black text-violet-400 text-xs overflow-hidden shadow-inner">
                        {#if s.authorAvatar}
                          <img src={s.authorAvatar} alt="Author" class="w-full h-full object-cover" />
                        {:else}
                          {s.authorName?.[0]}
                        {/if}
                      </div>
                      <div>
                        <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest">{s.authorName}</p>
                        <p class="text-[9px] text-slate-600 font-bold mt-0.5">{formatDate(s.createdAt)}</p>
                      </div>
                    </div>
                    <h3 class="text-xl font-outfit font-black text-white uppercase tracking-tight leading-tight">{s.title}</h3>
                    <p class="text-sm text-slate-400 leading-relaxed max-w-2xl">{s.content}</p>
                    
                    <div class="flex items-center gap-6 pt-2">
                       <button 
                        onclick={() => toggleVote(s.id, s.votes || [])}
                        class="flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all {s.votes?.includes($user?.uid) ? 'bg-violet-600 border-violet-500 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-violet-500/30 hover:text-violet-400'}"
                       >
                         <Heart weight={s.votes?.includes($user?.uid) ? 'fill' : 'bold'} class="w-4 h-4" />
                         <span class="text-xs font-black">{s.votes?.length || 0}</span>
                       </button>

                       {#if s.status}
                        <div class="px-4 py-2 border rounded-full text-[9px] font-black uppercase tracking-widest {
                          s.status === 'implemented' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                          s.status === 'planned' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
                          'border-slate-800 text-slate-500 bg-white/5'
                        }">
                          {s.status === 'implemented' ? 'Completado' : s.status === 'planned' ? 'Planificado' : 'En Revisión'}
                        </div>
                       {/if}
                    </div>
                  </div>

                  {#if isAdmin}
                    <button 
                      onclick={() => deleteItem('lobby_suggestions', s.id)}
                      class="p-4 bg-red-500/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-400 rounded-2xl border border-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash weight="bold" class="w-5 h-5" />
                    </button>
                  {/if}
                </div>
              </div>
            {/each}

            {#if suggestions.length === 0}
               <div class="py-20 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                  <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <ChatCircleDots weight="duotone" class="w-10 h-10 text-slate-700" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-white font-outfit font-black uppercase text-lg">No hay sugerencias aún</p>
                    <p class="text-slate-600 text-xs font-medium">Sé el primero en proponer una mejora para la comunidad.</p>
                  </div>
               </div>
            {/if}
          </div>

        {:else if activeTab === 'announcements'}
          <!-- Announcements Feed -->
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-outfit font-black text-white uppercase italic tracking-wider">Comunicados Oficiales</h2>
          </div>

          <div class="grid grid-cols-1 gap-8">
            {#each announcements as a (a.id)}
              <div class="relative pl-10 border-l border-white/10 space-y-6 pb-4" in:fade>
                <div class="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                <div class="space-y-4">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{formatDate(a.createdAt)}</p>
                  <div class="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-4 hover:border-primary-500/20 transition-all">
                    <h3 class="text-2xl font-outfit font-black text-white uppercase tracking-tighter italic">{a.title}</h3>
                    <div class="text-slate-400 text-sm leading-relaxed prose prose-invert font-medium">
                      {a.content}
                    </div>
                    {#if isAdmin}
                      <button 
                        onclick={() => deleteItem('lobby_announcements', a.id)}
                        class="flex items-center gap-2 text-[9px] font-black text-red-500/60 hover:text-red-400 pt-4 uppercase tracking-widest transition-colors"
                      >
                        <Trash weight="bold" class="w-3.5 h-3.5" /> Eliminar Comunicado
                      </button>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}

            {#if announcements.length === 0}
              <div class="py-20 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                  <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Megaphone weight="duotone" class="w-10 h-10 text-slate-700" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-white font-outfit font-black uppercase text-lg">Sin anuncios oficiales</p>
                    <p class="text-slate-600 text-xs font-medium">No hay comunicados del equipo de ChessNet en este momento.</p>
                  </div>
               </div>
            {/if}
          </div>
        {/if}

      </div>

    </div>
  {/if}

</div>

<style>
  .animate-fade-in {
    animation: fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .prose {
    white-space: pre-wrap;
  }
</style>
