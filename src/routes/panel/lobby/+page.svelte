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
  import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove, where, deleteDoc, limit } from 'firebase/firestore';
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

  // State
  let activeTab = $state(page.url.searchParams.get('tab') || 'suggestions'); // suggestions, announcements, support
  let showCreateModal = $state(false);
  let showAnnouncementModal = $state(false);
  let showSupportModal = $state(false);
  let isSubmitting = $state(false);
  
  let suggestions = $state<any[]>([]);
  let communityAnnouncements = $state<any[]>([]);
  let globalAnnouncements = $state<any[]>([]);
  let announcements = $derived([...globalAnnouncements, ...communityAnnouncements].sort((a,b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
    const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
    return dateB - dateA;
  }));
  let myReports = $state<any[]>([]);
  
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
    // Plan Guardrail: Only premium users or admins can access the lobby
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
      return;
    }

    // Listen for suggestions
    const qS = query(collection(db, 'lobby_suggestions'), orderBy('createdAt', 'desc'));
    const unsubS = onSnapshot(qS, (snap) => {
      suggestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }, (err) => console.error("Error suggestions listener:", err));

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

    // Listen for my reports
    let unsubR = () => {};
    if ($authUser) {
      const qR = isAdmin 
        ? query(collection(db, 'lobby_reports'), orderBy('createdAt', 'desc'))
        : query(collection(db, 'lobby_reports'), where('authorId', '==', $authUser.uid), orderBy('createdAt', 'desc'));
      
      unsubR = onSnapshot(qR, (snap) => {
        myReports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }, (err) => console.error("Error reports listener:", err));
    }

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
      unsubS();
      unsubA();
      unsubGlobal();
      unsubR();
      unsubG();
    };
  });

  // Watch selectedGroupId to fetch messages
  $effect(() => {
    if (selectedGroupId) {
      // Simplificamos la query eliminando el orderBy para evitar errores de índices ausentes
      // Ordenamos en memoria para garantizar tiempo real inmediato sin bloqueos de Firebase
      const qM = query(
        collection(db, 'community_messages'), 
        where('groupId', '==', selectedGroupId)
      );
      
      const unsubM = onSnapshot(qM, (snap) => {
        let loadedMessages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Ordenar en memoria por createdAt
        messages = (loadedMessages as any[]).sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateA - dateB;
        });

        // Scroll to bottom (optional, but good UX)
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
        toast.error("Error al cargar mensajes: Verifique los índices de Firestore.");
      });
      
      return unsubM;
    }
  });

  // Clear notifications pulse when relevant tab is viewed
  $effect(() => {
    if (activeTab === 'announcements') {
      const now = Date.now().toString();
      localStorage.setItem('last_viewed_lobby_announcements', now);
      localStorage.setItem('last_viewed_announcements_global', now);
    } else if (activeTab === 'suggestions' && isAdmin) {
      localStorage.setItem('last_viewed_lobby_suggestions', Date.now().toString());
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
      
      toast.success($t('lobby.announcement_published'));
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
        toast.error($t('lobby.premium_required_vote'));
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
        {$t('lobby.title')}
      </div>
      <h1 class="text-4xl lg:text-6xl font-outfit font-black text-white tracking-tighter uppercase italic leading-[0.85]">
        {$t('lobby.title_prefix')}<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">{$t('lobby.title_suffix')}</span>
      </h1>
      <p class="text-zinc-500 font-plus-jakarta text-sm lg:text-lg max-w-xl">
        {$t('lobby.subtitle')}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <!-- Tabs Selector (Segmented Control style) -->
      <div class="flex p-1 bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-xl lg:rounded-2xl shadow-2xl">
        <button 
          onclick={() => activeTab = 'suggestions'}
          class="flex-1 px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all {activeTab === 'suggestions' ? 'bg-violet-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}"
        >
          {$t('lobby.chat')}
        </button>
        <button 
          onclick={() => activeTab = 'announcements'}
          class="flex-1 px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all {activeTab === 'announcements' ? 'bg-violet-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}"
        >
          {$t('lobby.news')}
        </button>
        <button 
          onclick={() => activeTab = 'support'}
          class="flex-1 px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all {activeTab === 'support' ? 'bg-amber-600 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}"
        >
          {$t('lobby.support')}
        </button>
      </div>

      {#if activeTab === 'suggestions' && isAdmin}
        <button 
          onclick={() => showCreateGroupModal = true}
          class="h-12 px-6 bg-white hover:bg-violet-100 text-zinc-950 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest group"
        >
          <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
          {$t('lobby.new_group')}
        </button>
      {:else if activeTab === 'announcements' && isAdmin}
        <button 
          onclick={() => showAnnouncementModal = true}
          class="h-12 px-6 bg-primary-500 text-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest group"
        >
          <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
          {$t('lobby.new_announcement')}
        </button>
      {:else if activeTab === 'support'}
        <button 
          onclick={() => showSupportModal = true}
          class="h-12 px-6 bg-white hover:bg-violet-100 text-zinc-950 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest group"
        >
          <Plus size={18} weight="bold" class="group-hover:rotate-90 transition-transform duration-300" />
          {$t('lobby.report')}
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
            <h2 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('lobby.premium_title')}</h2>
            <p class="text-zinc-400 text-lg font-plus-jakarta max-w-lg mx-auto">
                {$t('lobby.premium_desc')}
            </p>
        </div>
        <button 
            onclick={() => goto('/pricing')}
            class="px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto relative z-10"
        >
            <Crown size={18} weight="bold" />
            {$t('lobby.premium_btn')}
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
            <h2 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('lobby.premium_title')}</h2>
            <p class="text-zinc-400 text-lg font-plus-jakarta max-w-lg mx-auto">
                {$t('lobby.news_restriction')}
            </p>
        </div>
        <button 
            onclick={() => goto('/pricing')}
            class="px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto relative z-10"
        >
            <Crown size={18} weight="bold" />
            {$t('lobby.access_now')}
        </button>
    </div>
  {:else}
    <!-- Tab Sections -->
    {#if activeTab === 'suggestions'}
      <div class="mb-6 lg:mb-12 bg-white/[0.02] border border-white/5 rounded-2xl lg:rounded-3xl p-4 lg:p-8 backdrop-blur-xl">
        <h2 class="text-base lg:text-xl font-outfit font-black text-white uppercase italic tracking-wider mb-1 lg:mb-2">{$t('lobby.community_title')}</h2>
        <p class="text-xs lg:text-sm text-slate-400 max-w-2xl leading-relaxed">
          {$t('lobby.community_desc')}
        </p>
      </div>
    {:else if activeTab === 'announcements'}
      <div class="mb-6 lg:mb-12 bg-white/[0.02] border border-white/5 rounded-2xl lg:rounded-3xl p-4 lg:p-8 backdrop-blur-xl">
        <h2 class="text-base lg:text-xl font-outfit font-black text-white uppercase italic tracking-wider mb-1 lg:mb-2">{$t('lobby.news_title')}</h2>
        <p class="text-xs lg:text-sm text-slate-400 max-w-2xl leading-relaxed">
          {$t('lobby.news_desc')}
        </p>
      </div>
    {:else if activeTab === 'support'}
      <div class="mb-6 lg:mb-12 bg-white/[0.02] border border-white/5 rounded-2xl lg:rounded-3xl p-4 lg:p-8 backdrop-blur-xl">
        <h2 class="text-base lg:text-xl font-outfit font-black text-white uppercase italic tracking-wider mb-1 lg:mb-2">{$t('lobby.support_title')}</h2>
        <p class="text-xs lg:text-sm text-slate-400 max-w-2xl leading-relaxed font-outfit italic tracking-wider opacity-60">
          {$t('lobby.support_desc')}
        </p>
      </div>
    {/if}

    {#if activeTab === 'suggestions'}
      <div class="flex flex-col lg:flex-row gap-8 min-h-[600px]">
        <!-- Groups Sidebar (Compact on mobile) -->
        <div class="w-full lg:w-80 space-y-4">
          <div class="bg-zinc-900/60 border border-white/5 rounded-2xl lg:rounded-[2rem] p-4 lg:p-6 backdrop-blur-xl">
            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 lg:mb-6 ml-2">{$t('lobby.subgroups')}</h3>
            <div class="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 scrollbar-hide">
              {#each groups as g (g.id)}
                <div 
                  role="button"
                  tabindex="0"
                  onclick={() => { selectedGroupId = g.id; selectedGroupName = g.name; }}
                  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedGroupId = g.id; selectedGroupName = g.name; } }}
                  class="flex-shrink-0 lg:flex-shrink lg:w-full flex items-center justify-between p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all group/group cursor-pointer {selectedGroupId === g.id ? 'bg-violet-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}"
                >
                  <div class="flex items-center gap-3 truncate">
                    <Hash weight={selectedGroupId === g.id ? 'bold' : 'duotone'} class="w-4 h-4 {selectedGroupId === g.id ? 'text-white' : 'text-violet-500'}" />
                    <span class="font-outfit font-bold text-xs lg:text-sm truncate uppercase tracking-tight">{g.name}</span>
                  </div>
                  {#if isAdmin && selectedGroupId === g.id}
                     <button 
                      onclick={(e) => { e.stopPropagation(); handleDelete('community_groups', g.id); }}
                      class="hidden lg:block p-1.5 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash weight="bold" size={12} />
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col bg-zinc-950/40 border border-white/5 rounded-2xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px] lg:min-h-[600px]">
          {#if selectedGroupId}
            <!-- Chat Header -->
            <div class="p-4 lg:p-6 border-b border-white/5 bg-zinc-900/40 flex items-center justify-between backdrop-blur-md">
              <div class="flex items-center gap-3 lg:gap-4">
                <div class="w-8 h-8 lg:w-10 lg:h-10 bg-violet-600/20 border border-violet-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center text-violet-400">
                  <Hash size={18} weight="bold" />
                </div>
                <div>
                  <h3 class="font-outfit font-black text-sm lg:text-base text-white uppercase tracking-tight">{selectedGroupName}</h3>
                  <p class="text-[8px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{groups.find(g => g.id === selectedGroupId)?.description || 'Comunidad'}</p>
                </div>
              </div>
            </div>

            <!-- Messages List -->
            <div 
              id="chat-container"
              class="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
            >
              {#each messages as m (m.id)}
                <div class="flex gap-4 {m.authorId === $authUser?.uid ? 'flex-row-reverse' : ''}" in:fade>
                  <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {#if m.authorAvatar}
                      <img src={m.authorAvatar} alt="avatar" class="w-full h-full object-cover" />
                    {:else}
                      <span class="text-xs font-bold text-slate-500">{m.authorName?.[0] || '?'}</span>
                    {/if}
                  </div>
                  <div class="flex flex-col max-w-[70%] {m.authorId === $authUser?.uid ? 'items-end' : ''}">
                    <div class="flex items-center gap-2 mb-1.5 px-1">
                      <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{m.authorName}</span>
                      
                      <!-- Author Insignias -->
                      {#if m.authorInsignias && m.authorInsignias.length > 0}
                        <div class="flex items-center gap-1">
                          {#each m.authorInsignias as insId}
                            {@const ins = INSIGNIAS.find(i => i.id === insId)}
                            {#if ins}
                              {@const Icon = ins.icon}
                              <div class="group/ins relative">
                                <Icon size={11} weight="fill" class={ins.color} />
                                <!-- Tooltip naming insignia -->
                                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-[8px] font-black text-white uppercase tracking-tighter rounded border border-white/10 opacity-0 group-hover/ins:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                  {$t(ins.titleKey)}
                                </div>
                              </div>
                            {/if}
                          {/each}
                        </div>
                      {/if}

                      <span class="text-[8px] text-zinc-600 font-medium">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div class="p-4 rounded-3xl text-sm font-medium leading-relaxed {m.authorId === $authUser?.uid ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none'}">
                      {m.text}
                    </div>
                    {#if isAdmin}
                      <button 
                        onclick={() => handleDelete('community_messages', m.id)}
                        class="mt-1 p-1 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash size={10} />
                      </button>
                    {/if}
                  </div>
                </div>
              {:else}
                <div class="h-full flex flex-col items-center justify-center opacity-20">
                  <ChatTeardropDots size={48} weight="duotone" />
                  <p class="mt-4 font-outfit font-bold uppercase tracking-widest text-sm">{$t('lobby.start_conversation')}</p>
                </div>
              {/each}
            </div>

            <!-- Chat Input -->
            <div class="p-6 bg-zinc-900/40 border-t border-white/5 backdrop-blur-md">
              <form 
                class="relative flex items-center gap-4"
                onsubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              >
                <input 
                  type="text"
                  bind:value={newMessage}
                  placeholder="Escribe un mensaje..."
                  class="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white font-medium focus:border-violet-500 outline-none transition-all placeholder:text-slate-700"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  class="h-14 w-14 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale hover:scale-105 active:scale-95 shadow-xl shadow-violet-600/20"
                >
                  <PaperPlane size={24} weight="fill" />
                </button>
              </form>
            </div>
          {:else}
            <div class="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-40">
              <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center">
                <Hash size={40} weight="duotone" />
              </div>
              <h3 class="text-xl font-outfit font-black uppercase tracking-tight">Selecciona un grupo</h3>
              <p class="text-sm max-w-xs">Elige una sala de chat de la lista de la izquierda para empezar a hablar con la comunidad.</p>
            </div>
          {/if}
        </div>
      </div>
    {:else if activeTab === 'announcements'}
      <!-- Announcements Section -->
      <div class="space-y-6">
        {#each announcements as a (a.id)}
          <div 
            class="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden flex flex-col md:flex-row gap-8"
            in:fly={{ x: 20, duration: 500 }}
          >
             {#if a.isGlobal}
               <div class="absolute top-0 right-0 px-4 py-1.5 bg-violet-600 text-[9px] font-black uppercase tracking-widest text-white rounded-bl-2xl">
                 OFICIAL CHESSNET
               </div>
             {/if}
             <div class="w-16 h-16 {a.isGlobal ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'bg-violet-600/10 text-violet-400 border-violet-500/20'} border-2 rounded-3xl flex items-center justify-center flex-shrink-0 animate-float">
                <Megaphone size={30} weight="duotone" />
             </div>
             <div class="space-y-3 flex-1">
                <div class="flex items-center justify-between">
                   <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{a.title}</h3>
                   <div class="flex items-center gap-3">
                      <span class="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">{formatDate(a.createdAt || a.created_at)}</span>
                      {#if isAdmin}
                        <button 
                          onclick={() => handleDelete(a.isGlobal ? 'announcements' : 'lobby_announcements', a.id)}
                          class="p-1.5 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash weight="bold" size={14} />
                        </button>
                      {/if}
                   </div>
                </div>
                <p class="text-slate-400 leading-relaxed font-outfit font-light">
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
                      <span class="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">{formatDate(r.createdAt)}</span>
                      {#if isAdmin}
                        <button 
                          onclick={() => handleDelete('lobby_reports', r.id)}
                          class="p-1.5 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash weight="bold" size={14} />
                        </button>
                      {/if}
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
      <div class="p-8 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('lobby.announcement_modal_title')}</h3>
        <button 
          onclick={() => showAnnouncementModal = false}
          class="p-2 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X weight="bold" class="w-6 h-6" />
        </button>
      </div>

      <div class="p-8 space-y-8 relative z-10">
        <div class="space-y-4">
          <label for="announce-title" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{$t('lobby.announcement_title')}</label>
          <input 
            id="announce-title"
            bind:value={newAnnouncement.title}
            type="text" 
            placeholder={$t('lobby.announcement_placeholder')}
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all placeholder:text-slate-700"
          />
        </div>

        <div class="space-y-4">
          <label for="announce-content" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{$t('lobby.announcement_content')}</label>
          <textarea 
            id="announce-content"
            bind:value={newAnnouncement.content}
            rows="5"
            placeholder={$t('lobby.announcement_message_placeholder')}
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all resize-none placeholder:text-slate-700"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showAnnouncementModal = false}
             class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all"
           >
             {$t('lobby.cancel')}
           </button>
           <button 
             onclick={handleSubmitAnnouncement}
             disabled={isSubmitting || !newAnnouncement.title || !newAnnouncement.content}
             class="py-4 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
           >
             {isSubmitting ? $t('lobby.publishing') : $t('lobby.publish')}
           </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Support Report Modal -->
{#if showCreateGroupModal}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto" transition:fade>
    <div 
      class="bg-[#0a0a0c] w-full max-w-xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden relative"
      transition:scale
    >
      <div class="p-8 border-b border-white/5 flex items-center justify-between">
        <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('lobby.group_modal_title')}</h3>
        <button 
          onclick={() => showCreateGroupModal = false}
          class="p-2 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X weight="bold" class="w-6 h-6" />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <div class="space-y-4">
          <label for="group-name" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{$t('lobby.group_name')}</label>
          <input 
            id="group-name"
            bind:value={newGroup.name}
            type="text" 
            placeholder={$t('lobby.group_placeholder')}
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all placeholder:text-slate-700"
          />
        </div>

        <div class="space-y-4">
          <label for="group-description" class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{$t('lobby.group_description')}</label>
          <textarea 
            id="group-description"
            bind:value={newGroup.description}
            rows="3"
            placeholder={$t('lobby.group_desc_placeholder')}
            class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-medium focus:border-violet-500 outline-none transition-all resize-none placeholder:text-slate-700"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <button 
             onclick={() => showCreateGroupModal = false}
             class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all"
           >
             {$t('lobby.cancel')}
           </button>
           <button 
             onclick={handleCreateGroup}
             disabled={isSubmitting || !newGroup.name}
             class="py-4 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
           >
             {isSubmitting ? $t('lobby.creating') : $t('lobby.create_group_btn')}
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

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
</style>
