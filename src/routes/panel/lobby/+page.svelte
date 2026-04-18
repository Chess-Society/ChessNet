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
    Lifebuoy,
    Trash,
    Hash,
    CaretLeft,
    PaperPlane,
    Warning
  } from 'phosphor-svelte';
  import { db } from '$lib/firebase';
  import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, where, deleteDoc, limit } from 'firebase/firestore';
  import { user as authUser } from '$lib/stores/auth';
  import { appStore } from '$lib/stores/appStore';
  import { t, locale } from '$lib/i18n';
  import { toast } from '$lib/stores/toast';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { INSIGNIAS } from '$lib/constants/insignias';
  import { uiStore } from '$lib/stores/uiStore';
  import { parseDate, formatDate } from '$lib/utils/date';
  import UpdatePill from '$lib/components/common/UpdatePill.svelte';

  // State
  let showCreateModal = $state(false);
  let isSubmitting = $state(false);
  
  let communityAnnouncements = $state<any[]>([]);
  let globalAnnouncements = $state<any[]>([]);
  let announcements = $derived([...globalAnnouncements, ...communityAnnouncements].sort((a,b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
    const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
    return dateB - dateA;
  }));
  
  // Community Chat State
  let groups = $state<any[]>([]);
  let selectedGroupId = $state<string | null>(null);
  let selectedGroupName = $state('');
  let messages = $state<any[]>([]);
  let newMessage = $state('');
  let showCreateGroupModal = $state(false);
  
  let newGroup = $state({
    name: '',
    description: ''
  });
  
  let newSuggestion = $state({
    title: '',
    description: '',
    category: 'feature' // feature, bug, improvement
  });


  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));

  onMount(() => {
    // Plan Guardrail: Only premium users or admins can access the lobby
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
      return;
    }



    // Listen for community announcements
    const qA = query(collection(db, 'lobby_announcements'), orderBy('createdAt', 'desc'));
    const unsubA = onSnapshot(qA, (snap) => {
      communityAnnouncements = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }, (err) => console.error("Error announcements listener:", err));

    // Listen for global system announcements
    const qGlobal = query(collection(db, 'announcements'), where('is_global', '==', true), orderBy('created_at', 'desc'), limit(10));
    const unsubGlobal = onSnapshot(qGlobal, (snap) => {
      globalAnnouncements = snap.docs.map(d => ({ id: d.id, ...d.data(), isGlobal: true }));
    }, (err) => console.error("Error global announcements listener:", err));

    // Listen for groups
    const qG = query(collection(db, 'community_groups'), orderBy('name', 'asc'));
    const unsubG = onSnapshot(qG, (snap) => {
      groups = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // If no group is selected, select the first one by default if exists
      if (!selectedGroupId && groups.length > 0) {
        selectedGroupId = groups[0].id;
        selectedGroupName = groups[0].name;
      }
    }, (err) => console.error("Error groups listener:", err));

    return () => {
      unsubA();
      unsubGlobal();
      unsubG();
    };
  });

  // Watch selectedGroupId to fetch messages
  $effect(() => {
    if (selectedGroupId) {
      const qM = query(
        collection(db, 'community_messages'), 
        where('groupId', '==', selectedGroupId)
      );
      
      const unsubM = onSnapshot(qM, (snap) => {
        let loadedMessages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        messages = (loadedMessages as any[]).sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateA - dateB;
        });

        // Scroll to bottom
        setTimeout(() => {
          const container = document.getElementById('chat-container');
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            });
          }
        }, 100);
      }, (err) => {
        console.error("Error en listener de mensajes:", err);
      });
      
      return unsubM;
    }
  });

  // Clear notifications pulse when lobby is viewed
  $effect(() => {
    const now = Date.now().toString();
    localStorage.setItem('last_viewed_lobby_announcements', now);
    localStorage.setItem('last_viewed_announcements_global', now);
    if (isAdmin) {
      localStorage.setItem('last_viewed_lobby_suggestions', now);
    }
  });

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedGroupId) return;
    
    try {
      await addDoc(collection(db, 'community_messages'), {
        groupId: selectedGroupId,
        text: newMessage.trim(),
        authorId: $authUser?.uid,
        authorName: $appStore?.settings?.teacherName || $authUser?.displayName || 'Anónimo',
        authorAvatar: $appStore?.settings?.teacherAvatar || $authUser?.photoURL || null,
        authorInsignias: $appStore?.settings?.featuredInsignias || [],
        createdAt: new Date().toISOString()
      });
      newMessage = '';
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleCreateGroup() {
    if (!newGroup.name || !isAdmin) return;
    
    isSubmitting = true;
    try {
      await addDoc(collection(db, 'community_groups'), {
        ...newGroup,
        createdAt: new Date().toISOString()
      });
      toast.success("Grupo creado");
      showCreateGroupModal = false;
      newGroup = { name: '', description: '' };
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isSubmitting = false;
    }
  }

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


  async function handleDelete(collectionName: string, id: string) {
    if (!isAdmin) return;
    const confirmed = await uiStore.confirm({
        title: $t('common.delete'),
        message: $t('lobby.delete_confirm_desc'),
        type: 'danger'
    });
    if (!confirmed) return;
    
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success($t('common.deleted_success'));
    } catch (err: any) {
      toast.error($t('common.error_deleting') + ": " + err.message);
    }
  }



  function getAnnouncementColor(a: any) {
    if (a.isGlobal) return 'from-violet-600 to-indigo-700';
    if (a.type === 'feature') return 'from-emerald-500 to-teal-600';
    if (a.type === 'improvement') return 'from-amber-500 to-orange-600';
    if (a.type === 'critical') return 'from-red-500 to-rose-600';
    return 'from-blue-500 to-indigo-600';
  }
</script>

<svelte:head>
  <title>{$t('lobby.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-10 space-y-12" in:fade>
  
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4 lg:space-y-4">
      <div class="hidden lg:inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
        <ChatCircleDots weight="fill" class="w-3 h-3" />
        Lobby de Profesores
      </div>
      <h1 class="text-4xl lg:text-6xl font-outfit font-black text-white tracking-tighter uppercase italic leading-[0.85]">
        Comunidad<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">ChessNet</span>
      </h1>
      <p class="text-zinc-500 font-plus-jakarta text-sm lg:text-lg max-w-xl">
        {$t('lobby.subtitle')}
      </p>

      <!-- Pedagogical Bit - Teacher's Corner -->
      <div class="mt-6 p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4 max-w-xl group hover:bg-amber-500/10 transition-all duration-500">
        <div class="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
          <Lightbulb weight="duotone" size={20} />
        </div>
        <div class="space-y-1">
          <h4 class="text-[10px] font-black text-amber-500/80 uppercase tracking-widest italic leading-none">Rincón del Docente</h4>
          <p class="text-xs text-zinc-400 leading-relaxed font-medium">
            "El ajedrez no solo enseña estrategia, sino paciencia y resiliencia. En el aula, úsalo para fomentar la autoevaluación: pregunta a tus alumnos ¿por qué creéis que falló ese plan?"
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <!-- Tabs Selector -->
      <div class="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
        <div class="flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-white shadow-lg">
          {$t('lobby.community')}
        </div>
      </div>

      {#if isAdmin}
        <button 
          onclick={() => showCreateGroupModal = true}
          class="h-12 px-6 bg-white hover:bg-violet-100 text-zinc-950 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest group"
        >
          <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
          {$t('lobby.new_group')}
        </button>
      {/if}
    </div>
  </div>

  <!-- Main Content -->
  {#if plan !== 'premium' && !isAdmin}
    <!-- Restricted Access Notice -->
    <div class="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 text-center space-y-6 relative overflow-hidden group backdrop-blur-3xl">
        <div class="absolute -right-24 -top-24 w-60 h-60 bg-violet-600/10 rounded-full blur-[100px] group-hover:bg-violet-600/20 transition-all duration-700"></div>
        <div class="w-20 h-20 bg-violet-600/20 border border-violet-500/30 rounded-[1.5rem] flex items-center justify-center text-violet-400 mx-auto relative z-10 shadow-2xl shadow-violet-600/20">
            <Crown size={40} weight="duotone" />
        </div>
        <div class="space-y-3 relative z-10">
            <h2 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">Comunidad Premium</h2>
            <p class="text-zinc-400 text-lg font-plus-jakarta max-w-2xl mx-auto leading-relaxed">
                Únete a la élite docente: comparte metodologías, accede a recursos exclusivos y conecta con la red de profesores más influyente.
            </p>
        </div>
        <button 
            onclick={() => goto('/pricing')}
            class="px-12 py-6 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-2xl shadow-violet-600/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto relative z-10"
        >
            <Crown size={20} weight="bold" />
            Descubrir Planes
        </button>
    </div>
  {:else}
    <!-- Chat Section -->
    <div class="flex flex-col lg:flex-row gap-8 min-h-[700px]">
        <!-- Groups Sidebar -->
        <div class="w-full lg:w-80 space-y-6">
          <div class="bg-zinc-900/60 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl h-full flex flex-col">
            <h3 class="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-6 ml-2 flex items-center gap-2">
              <Hash size={14} class="text-violet-500" />
              SALA DE CANALES
            </h3>
            <div class="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 pb-4 lg:pb-0 scrollbar-hide flex-1">
              {#each groups as g (g.id)}
                <div class="relative group/group flex-shrink-0 lg:flex-shrink-0 lg:w-full">
                  <button 
                    onclick={() => { selectedGroupId = g.id; selectedGroupName = g.name; }}
                    class="w-full flex items-center justify-between p-4 rounded-2xl transition-all {selectedGroupId === g.id ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-transparent hover:border-white/10'}"
                  >
                    <div class="flex items-center gap-3 truncate">
                      <span class="font-outfit font-bold text-sm truncate uppercase tracking-tight">{g.name}</span>
                    </div>
                  </button>
                  {#if isAdmin && selectedGroupId === g.id}
                    <button 
                      onclick={(e) => { e.stopPropagation(); handleDelete('community_groups', g.id); }}
                      class="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block p-1.5 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-white transition-all z-10"
                    >
                      <Trash weight="bold" size={14} />
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col bg-zinc-950/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] min-h-[600px] lg:min-h-[700px] relative">
          {#if selectedGroupId}
            <!-- Chat Header -->
            <div class="p-6 lg:p-8 border-b border-white/5 bg-zinc-900/40 flex items-center justify-between backdrop-blur-3xl">
              <div class="flex items-center gap-4 lg:gap-6">
                <div class="w-12 h-12 lg:w-14 lg:h-14 bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-600/20">
                  <Hash size={24} weight="bold" />
                </div>
                <div>
                  <h3 class="font-outfit font-black text-lg lg:text-2xl text-white uppercase tracking-tight italic">#{selectedGroupName}</h3>
                  <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{groups.find(g => g.id === selectedGroupId)?.description || 'Canal de discusión'}</p>
                </div>
              </div>
            </div>

            <!-- Messages List -->
            <div 
              id="chat-container"
              class="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth"
            >
              {#each messages as m (m.id)}
                <div class="flex gap-5 {m.authorId === $authUser?.uid ? 'flex-row-reverse' : ''}" in:fade>
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-lg relative group/avatar">
                    {#if m.authorAvatar}
                      <img src={m.authorAvatar} alt="avatar" class="w-full h-full object-cover" />
                    {:else}
                      <span class="text-xs font-bold text-zinc-500">{m.authorName?.[0] || '?'}</span>
                    {/if}
                  </div>
                  <div class="flex flex-col max-w-[75%] {m.authorId === $authUser?.uid ? 'items-end' : ''}">
                    <div class="flex items-center gap-3 mb-2 px-1">
                      <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{m.authorName}</span>
                      
                      {#if m.authorInsignias && m.authorInsignias.length > 0}
                        <div class="flex items-center gap-1.5">
                          {#each m.authorInsignias as insId}
                            {@const ins = INSIGNIAS.find(i => i.id === insId)}
                            {#if ins}
                              {@const Icon = ins.icon}
                              <Icon size={12} weight="fill" class={ins.color} />
                            {/if}
                          {/each}
                        </div>
                      {/if}

                      <span class="text-[9px] text-zinc-600 font-bold">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div class="px-6 py-4 rounded-[2rem] text-sm font-medium leading-[1.6] shadow-xl {m.authorId === $authUser?.uid ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-white/5 text-zinc-300 rounded-tl-none border border-white/5'}">
                      {m.text}
                    </div>
                    {#if isAdmin}
                      <button 
                        onclick={() => handleDelete('community_messages', m.id)}
                        class="mt-2 text-[10px] font-bold text-red-500/40 hover:text-red-500 transition-colors uppercase tracking-widest px-2"
                      >
                        Eliminar
                      </button>
                    {/if}
                  </div>
                </div>
              {:else}
                <div class="h-full flex flex-col items-center justify-center opacity-20 scale-110">
                  <ChatTeardropDots size={80} weight="duotone" class="text-violet-500 shadow-violet-600/20" />
                  <p class="mt-6 font-outfit font-black uppercase tracking-[0.3em] text-lg italic">Sé el primero en hablar</p>
                </div>
              {/each}
            </div>

            <!-- Chat Input -->
            <div class="p-8 bg-zinc-900/40 border-t border-white/5 backdrop-blur-3xl">
              <form 
                class="relative flex items-center gap-4"
                onsubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              >
                <div class="relative flex-1 group">
                  <div class="absolute inset-0 bg-violet-600/5 rounded-2xl blur-xl transition-all group-focus-within:bg-violet-600/10"></div>
                  <input 
                    type="text"
                    bind:value={newMessage}
                    placeholder="Escribe algo interesante para la comunidad..."
                    class="relative w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-white font-medium focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-800"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  class="h-[60px] w-[60px] bg-white hover:bg-violet-100 text-zinc-950 rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale hover:scale-105 active:scale-95 shadow-2xl group"
                >
                  <PaperPlane size={28} weight="fill" class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          {:else}
            <div class="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-8 opacity-40">
              <div class="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center relative">
                <div class="absolute inset-0 bg-white/5 rounded-[3rem] animate-ping opacity-20"></div>
                <Hash size={64} weight="duotone" />
              </div>
              <div class="space-y-3">
                <h3 class="text-3xl font-outfit font-black uppercase tracking-tight italic">Selecciona un canal</h3>
                <p class="text-lg max-w-sm mx-auto font-medium">Únete a la conversación con profesores de todo el mundo.</p>
              </div>
            </div>
          {/if}
        </div>
      </div>
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
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">Proponer Mejora</h3>
        <button 
          onclick={() => showCreateModal = false}
          class="p-2 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X weight="bold" class="w-6 h-6 text-zinc-500" />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <div class="space-y-4">
          <label for="suggestion-title" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Título de la Idea</label>
          <input 
            id="suggestion-title"
            bind:value={newSuggestion.title}
            type="text" 
            placeholder="Ej: Modo multijugador para torneos"
            class="w-full py-5 px-8 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all placeholder:text-zinc-800 shadow-inner"
          />
        </div>

        <div class="space-y-4">
          <label for="suggestion-description" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Descripción Detallada</label>
          <textarea 
            id="suggestion-description"
            bind:value={newSuggestion.description}
            rows="5"
            placeholder="¿Cómo ayudaría esto a otros profesores?"
            class="w-full py-5 px-8 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all resize-none placeholder:text-zinc-800 shadow-inner"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showCreateModal = false}
             class="py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 transition-all"
           >
             Cancelar
           </button>
           <button 
             onclick={handleSubmitSuggestion}
             disabled={isSubmitting || !newSuggestion.title || !newSuggestion.description}
             class="py-5 bg-violet-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-violet-600/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
           >
             {isSubmitting ? 'Enviando...' : 'Publicar Idea'}
           </button>
        </div>
      </div>
    </div>
  </div>
{/if}


<!-- Create Group Modal -->
{#if showCreateGroupModal}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto" transition:fade>
    <div 
      class="bg-[#0a0a0c] w-full max-w-xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden relative"
      transition:scale
    >
      <div class="p-8 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">Nuevo Canal</h3>
        <button 
          onclick={() => showCreateGroupModal = false}
          class="p-2 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X weight="bold" class="w-6 h-6 text-zinc-500" />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <div class="space-y-4">
          <label for="group-name" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Nombre del Canal</label>
          <input 
            id="group-name"
            bind:value={newGroup.name}
            type="text" 
            placeholder="Ej: Metodología Avanzada"
            class="w-full py-5 px-8 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all placeholder:text-zinc-800 shadow-inner"
          />
        </div>

        <div class="space-y-4">
          <label for="group-desc" class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Propósito</label>
          <input 
            id="group-desc"
            bind:value={newGroup.description}
            type="text" 
            placeholder="¿De qué se hablará aquí?"
            class="w-full py-5 px-8 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all placeholder:text-zinc-800 shadow-inner"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showCreateGroupModal = false}
             class="py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 transition-all"
           >
             Cancelar
           </button>
           <button 
             onclick={handleCreateGroup}
             disabled={isSubmitting || !newGroup.name}
             class="py-5 bg-white text-zinc-950 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl transition-all disabled:opacity-50"
           >
             {isSubmitting ? 'Creando...' : 'Crear Canal'}
           </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<UpdatePill />

<style lang="postcss">
  :global(.scrollbar-hide::-webkit-scrollbar) {
    display: none;
  }
  :global(.scrollbar-hide) {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  /* Custom glass effects */
  :global(.animate-spin-slow) {
    animation: spin 8s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
</style>
