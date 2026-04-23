<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { 
    ChatCircleDots, 
    Lightbulb, 
    Plus, 
    Star, 
    Crown,
    X,
    CalendarBlank,
    HandCoins,
    Buildings,
    Target,
    Pulse,
    ChartBar
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
  import { globalAnnouncements as globalAnnouncementsStore } from '$lib/stores/configStore';
  import PredictionCard from '$lib/components/social/PredictionCard.svelte';
  import CreateMarketModal from '$lib/components/social/CreateMarketModal.svelte';
  import { predictionApi } from '$lib/api/predictions';

  // State
  let showCreateMarketModal = $state(false);
  let marketToEdit = $state<any>(null);
  let markets = $state<any[]>([]);
  let selectedCategory = $state('Todos');
  const categories = ['Todos', 'Torneos', 'Mejoras', 'Docencia', 'Academia'];
  let filteredMarkets = $derived(selectedCategory === 'Todos' ? markets : markets.filter(m => m.category === selectedCategory));


  
  onMount(() => {
    // Listen for markets
    const qM = query(collection(db, 'prediction_markets'), orderBy('createdAt', 'desc'), limit(12));
    const unsubM = onSnapshot(qM, (snap) => {
      markets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });

    return () => {
      unsubM();
    };
  });


  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.email ? ADMIN_EMAILS.includes($authUser.email.toLowerCase()) : false);

  onMount(() => {
    // Plan Guardrail
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
      return;
    }
  });

  // Default group selection removed (Comunidad disabled)


  // Clear notifications pulse when lobby is viewed
  $effect(() => {
    const now = Date.now().toString();
    localStorage.setItem('last_viewed_lobby_announcements', now);
    localStorage.setItem('last_viewed_announcements_global', now);
    if (isAdmin) {
      localStorage.setItem('last_viewed_lobby_suggestions', now);
    }
  });




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
    if (a.type === 'feature') return 'from-violet-500 to-indigo-600';
    if (a.type === 'improvement') return 'from-amber-500 to-orange-600';
    if (a.type === 'critical') return 'from-red-500 to-rose-600';
    return 'from-blue-500 to-indigo-600';
  }
</script>

<svelte:head>
  <title>{$t('lobby.title')} - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12" in:fade>
  
  <!-- Header Section: OPS CENTER -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
    <div class="space-y-4">
       <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-none text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">
        <Pulse weight="fill" class="w-3 h-3 animate-pulse" />
        SISTEMA DE OPERACIONES - v4.2
      </div>
      <h1 class="text-4xl sm:text-5xl lg:text-7xl font-outfit font-black text-white tracking-tighter uppercase leading-[0.9] italic">
        OPS <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-500">CENTER</span>
      </h1>
      <p class="text-zinc-500 font-plus-jakarta text-sm lg:text-base max-w-xl">
        Gestión estratégica, impacto comunitario y desarrollo de la red docente.
      </p>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <div class="bg-zinc-900/80 border border-white/5 p-4 flex items-center gap-6 backdrop-blur-xl">
        <div class="space-y-1">
          <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Estado del Pulso</p>
          <p class="text-xs font-black text-emerald-400 uppercase tracking-tighter flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            OPERATIVO
          </p>
        </div>
      </div>
    </div>
  </div>

    {#if isAdmin}
      <button 
        onclick={() => showCreateMarketModal = true}
        class="h-12 px-8 bg-primary-500 hover:bg-primary-400 text-black rounded-none shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest group"
      >
        <Plus size={18} weight="bold" />
        Nuevo Hito Académico
      </button>
    {/if}

  <div class="h-px w-full bg-white/5"></div>

  <!-- Main Content -->
  {#if plan !== 'premium' && !isAdmin}
    <!-- Restricted Access Notice -->
    <div class="bg-zinc-900/40 border border-white/5 rounded-none p-6 sm:p-10 text-center space-y-6 relative overflow-hidden group backdrop-blur-3xl">
        <div class="absolute -right-24 -top-24 w-60 h-60 bg-violet-600/10 rounded-none blur-[100px] group-hover:bg-violet-600/20 transition-all duration-700"></div>
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 mx-auto relative z-10 shadow-2xl shadow-violet-600/20">
            <Crown size={32} weight="duotone" class="sm:hidden" />
            <Crown size={40} weight="duotone" class="hidden sm:block" />
        </div>
        <div class="space-y-2 sm:space-y-3 relative z-10">
            <h2 class="text-xl sm:text-2xl font-outfit font-black text-white uppercase tracking-tight">{$t('lobby.premium_community')}</h2>
            <p class="text-zinc-400 text-sm sm:text-lg font-plus-jakarta max-w-2xl mx-auto leading-relaxed">
                {$t('lobby.premium_community_desc')}
            </p>
        </div>
        <button 
            onclick={() => goto('/pricing')}
            class="px-12 py-6 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-none shadow-2xl shadow-violet-600/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto relative z-10"
        >
            <Crown size={20} weight="bold" />
            {$t('lobby.discover_plans')}
        </button>
    </div>
  {:else}
      <!-- Hitos de Pronóstico (Polymarket Style) -->
      <div class="space-y-8" in:fade>
        <div class="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {#each categories as cat}
            <button 
              onclick={() => selectedCategory = cat}
              class="px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border {selectedCategory === cat ? 'bg-primary-500 text-black border-primary-500' : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/10'}"
            >
              {cat}
            </button>
          {/each}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {#each filteredMarkets as market (market.id)}
            <PredictionCard {market} onEdit={(m) => { marketToEdit = m; showCreateMarketModal = true; }} />
          {:else}
            <div class="col-span-full py-20 bg-zinc-900/40 border border-white/5 border-dashed flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div class="p-6 bg-white/5 rounded-none">
                <ChartBar size={48} weight="duotone" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl font-black text-white uppercase tracking-tight">Sin hitos activos</h3>
                <p class="text-xs text-zinc-500 font-bold uppercase tracking-widest">Espera a que la dirección proponga nuevos retos académicos</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
</div>




<CreateMarketModal 
  show={showCreateMarketModal} 
  onClose={() => { showCreateMarketModal = false; marketToEdit = null; }}
  editMarket={marketToEdit}
/>

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
  @keyframes progress-stripe {
    from { background-position: 1rem 0; }
    to { background-position: 0 0; }
  }

  :global(.animate-progress-stripe) {
    animation: progress-stripe 1s linear infinite;
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

