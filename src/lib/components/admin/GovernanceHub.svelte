<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Globe, 
    Plus, 
    Target, 
    Coins, 
    Layout, 
    HandCoins, 
    ShieldCheckered, 
    Lightning, 
    Warning, 
    MagnifyingGlass, 
    User, 
    ArrowRight, 
    Pulse,
    Info,
    UserCircle,
    TrendUp,
    Clock,
    CheckCircle,
    PencilSimple,
    Trash
  } from 'phosphor-svelte';
  import { toast } from '$lib/stores/toast';
  import { db } from '$lib/firebase';
  import { collection, query, where, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
  import { appStore } from '$lib/stores/appStore';
  import { predictionApi } from '$lib/api/predictions';
  import { lichessApi } from '$lib/api/lichess';
  import { adminApi } from '$lib/api/admin';
  import { IMPACT_MILESTONES } from '$lib/constants/governance';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { uiStore } from '$lib/stores/uiStore';
  import CreateMarketModal from '$lib/components/social/CreateMarketModal.svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import type { PredictionMarket } from '$lib/types/governance';
  import { user as authUser } from '$lib/stores/auth';

  // --- State ---
  let markets = $state<PredictionMarket[]>([]);
  let isLoading = $state(true);
  let isProcessing = $state(false);
  let showCreateMarketModal = $state(false);
  let marketToEdit = $state<any>(null);
  
  // Minting State
  let mintUserId = $state('');
  let mintAmount = $state(100);
  let mintReason = $state('');
  let isMinting = $state(false);

  // Suggestions State
  let suggestions = $state<any[]>([]);
  let isFetchingSuggestions = $state(false);

  let isResolvingAuto = $state(false);
  let logs = $state<any[]>([]);
  let userSearchQuery = $state('');
  let filteredUsers = $state<any[]>([]);
  let isSearchingUsers = $state(false);

  const schoolId = $derived($appStore.settings?.schoolId || 'DEFAULT_SCHOOL');
  const userRole = $derived($appStore.settings?.role || 'user');
  const isAdminByEmail = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));
  const isSuperAdmin = $derived(userRole === 'admin' || isAdminByEmail);
  const canManageMarkets = $derived(isSuperAdmin); // En el futuro podría incluir directores con permisos específicos
  
  let isSyncingClaims = $state(false);
  let selectedSchoolId = $state<string | undefined>(undefined);

  $effect(() => {
    if (!selectedSchoolId && schoolId) {
      selectedSchoolId = isSuperAdmin ? 'ALL' : schoolId;
    }
  });

  onMount(async () => {
    await Promise.all([
      fetchMarkets(),
      fetchSuggestions(),
      fetchLogs()
    ]);
  });

  async function fetchMarkets() {
    isLoading = true;
    try {
      markets = await predictionApi.getMarkets(selectedSchoolId);
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  async function fetchSuggestions() {
    isFetchingSuggestions = true;
    try {
      const data = await lichessApi.getTopBroadcasts();
      suggestions = [
        ...data.active.map((b: any) => ({ ...b, status: 'ACTIVE' })),
        ...data.upcoming.map((b: any) => ({ ...b, status: 'UPCOMING' }))
      ].slice(0, 8);
    } catch (e) {
      console.error(e);
    } finally {
      isFetchingSuggestions = false;
    }
  }

  async function handleResolve(marketId: string, optionId: string) {
    const confirmed = await uiStore.confirm({
      title: 'Confirmar Resolución',
      message: '¿Estás seguro de que deseas resolver este hito? Se distribuirán los Nets a los ganadores.',
      type: 'warning'
    });

    if (!confirmed) return;
    
    isProcessing = true;
    try {
      await predictionApi.resolveMarket(marketId, optionId);
      toast.success('Mercado resuelto con éxito');
      await fetchMarkets();
      await fetchLogs();
    } catch (e: any) {
      toast.error(e.message || 'Error al resolver');
    } finally {
      isProcessing = false;
    }
  }

  async function handleDeleteMarket(id: string) {
    const confirmed = await uiStore.confirm({
      title: 'Eliminar Hito',
      message: '¿Estás seguro de que deseas eliminar este hito permanentemente? Esta acción no se puede deshacer.',
      type: 'danger'
    });

    if (!confirmed) return;

    console.log("[Governance] Deleting market:", id);
    try {
      await predictionApi.deleteMarket(id);
      toast.success('Hito eliminado correctamente');
      await fetchMarkets();
      await fetchLogs();
    } catch (e: any) {
      console.error("[Governance] Delete error:", e);
      toast.error('Error al eliminar: ' + e.message);
    }
  }

  async function handleSyncClaims() {
    isSyncingClaims = true;
    try {
      const response = await fetch('/api/admin/sync-claims', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        toast.success('Permisos sincronizados. Por favor, recarga la página.');
      } else {
        throw new Error(data.error || 'Fallo en la sincronización');
      }
    } catch (e: any) {
      toast.error('Error al sincronizar: ' + e.message);
    } finally {
      isSyncingClaims = false;
    }
  }

  function handleEditMarket(market: any) {
    console.log("[Governance] Editing market:", market.id);
    marketToEdit = {
      ...market,
      endDate: market.endDate ? new Date(market.endDate).toISOString().slice(0, 16) : ''
    };
    showCreateMarketModal = true;
  }

  async function handleMintNets() {
    if (!mintUserId || mintAmount <= 0 || !mintReason) {
      toast.error('Completa todos los campos');
      return;
    }

    isMinting = true;
    try {
      await adminApi.addNets(mintUserId, mintAmount, mintReason, 'confirmed', $authUser?.uid);
      toast.success(`Se han concedido ${mintAmount} Nets con éxito`);
      mintUserId = '';
      mintAmount = 100;
      mintReason = '';
      userSearchQuery = '';
    } catch (e: any) {
      toast.error(e.message || 'Error al conceder Nets');
    } finally {
      isMinting = false;
    }
  }

  async function handleAutoGenerateAll() {
    if (!confirm('¿Crear automáticamente hitos para los 8 torneos más importantes?')) return;
    
    isProcessing = true;
    let createdCount = 0;
    try {
      for (const s of suggestions) {
        const mapped = lichessApi.mapBroadcastToSuggestion(s);
        const marketData = {
          ...mapped,
          schoolId,
          creatorId: $authUser?.uid || 'SYSTEM',
          options: [
            { id: 'yes', text: 'Sí', totalStaked: 0, totalShares: 0 },
            { id: 'no', text: 'No', totalStaked: 0, totalShares: 0 }
          ],
          oracleConfig: {
            ...mapped.oracleConfig,
            externalId: mapped.oracleConfig.externalId || null,
            tournamentId: mapped.oracleConfig.tournamentId || null
          }
        };

        console.log("[Governance] Auto-generating market:", marketData);
        await predictionApi.createMarket(marketData as any);
        createdCount++;
      }
      toast.success(`Se han creado ${createdCount} hitos automáticamente`);
      await fetchMarkets();
    } catch (e: any) {
      toast.error('Error en creación masiva: ' + e.message);
    } finally {
      isProcessing = false;
    }
  }

  function handleUseSuggestion(suggestion: any) {
    const mapped = lichessApi.mapBroadcastToSuggestion(suggestion);
    marketToEdit = mapped;
    showCreateMarketModal = true;
  }

  async function handleAutoResolveAll() {
    isResolvingAuto = true;
    try {
      const result = await predictionApi.autoResolveAll(selectedSchoolId);
      if (result.resolved > 0) {
        toast.success(`Se han auto-resuelto ${result.resolved} hitos`);
        await fetchMarkets();
        await fetchLogs();
      } else {
        toast.info('No hay hitos pendientes de resolución automática');
      }
    } catch (e: any) {
      toast.error('Error en auto-resolución: ' + e.message);
    } finally {
      isResolvingAuto = false;
    }
  }

  async function searchUsers() {
    if (userSearchQuery.length < 3) {
      filteredUsers = [];
      return;
    }
    isSearchingUsers = true;
    try {
      filteredUsers = await adminApi.getUsersList(10, userSearchQuery);
    } catch (e) {
      console.error(e);
    } finally {
      isSearchingUsers = false;
    }
  }

  function selectUser(user: any) {
    mintUserId = user.id;
    userSearchQuery = user.email;
    filteredUsers = [];
  }

  async function fetchLogs() {
    try {
      const q = query(
        collection(db, 'system_logs'),
        where('category', 'in', ['GOVERNANCE', 'ECONOMY', 'RECOGNITION']),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      
      return onSnapshot(q, (snap) => {
        logs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      });
    } catch (e) {
      console.error('Error fetching logs:', e);
    }
  }

  const socPoints = "20,110 50,90 80,100 110,70 140,85 170,40 200,60 230,30 280,45";
</script>

<div class="space-y-8 selection:bg-primary-500/30" in:fade>
  <!-- WorldMonitor Header Status -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/[0.05] bg-zinc-950/50 backdrop-blur-md p-5">
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2.5">
        <div class="relative w-2 h-2">
          <div class="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
          <div class="relative w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
        <span class="text-[10px] font-black text-white uppercase tracking-[0.15em]">NÚCLEO_Gobernanza: ACTIVO</span>
      </div>
      <div class="hidden md:block h-4 w-px bg-white/10"></div>
      <div class="flex items-center gap-2.5">
        <Pulse class="w-3.5 h-3.5 text-primary-400" />
        <span class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em]">ORÁCULO_Sinc: OK</span>
      </div>
    </div>
    <div class="flex items-center gap-3">
        <div class="px-2 py-0.5 bg-zinc-900 border border-white/5">
            <span class="text-[8px] font-black text-zinc-600 uppercase tracking-[0.1em] font-mono">v1.2.0-PRO</span>
        </div>
        <div class="text-[9px] font-black text-zinc-700 uppercase tracking-[0.1em] font-mono">
          NODE_ID: {new Date().getTime().toString(16).toUpperCase()}
        </div>
    </div>
  </div>

  <!-- Stats Ribbon -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {#each [
      { label: 'Hitos Activos', val: markets.filter(m => m.status === 'OPEN').length, icon: Target, color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20' },
      { label: 'Volumen Global', val: markets.reduce((acc, m) => acc + (m.totalPool || 0), 0), icon: Coins, color: 'text-primary-400', bg: 'bg-primary-400/5', border: 'border-primary-400/20' },
      { label: 'Ratio Participación', val: '84.2%', icon: Layout, color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20' },
      { label: 'Nets en Circulación', val: '12.8k', icon: HandCoins, color: 'text-emerald-400', bg: 'bg-emerald-400/5', border: 'border-emerald-400/20' }
    ] as s, i}
      <div 
        class="bento-card group p-5 flex items-center justify-between {s.bg} {s.border} hover:bg-zinc-900/40 transition-all duration-500"
        in:fly={{ y: 20, delay: i * 100 }}
      >
        <div class="relative z-10">
          <p class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em] mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">{s.label}</p>
          <div class="flex items-baseline gap-1.5">
            <p class="text-3xl font-black text-white tracking-tighter font-outfit uppercase">{s.val}</p>
            {#if s.label.includes('Volumen')}
              <span class="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">NETS</span>
            {/if}
          </div>
        </div>
        
        <div class="relative shrink-0">
          <div class="absolute inset-0 {s.color.replace('text-', 'bg-')} blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div class="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:border-white/20 transition-all">
            <s.icon class="w-5 h-5 {s.color} group-hover:scale-110 transition-transform duration-500" weight="duotone" />
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Segmentation Selector (Superadmin only) -->
  {#if isSuperAdmin}
    <div class="flex items-center gap-4 bg-white/5 p-4 border border-white/5">
      <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Vista de Segmento:</span>
      <select 
        bind:value={selectedSchoolId} 
        onchange={fetchMarkets}
        class="bg-black border border-white/10 px-4 py-2 text-[10px] font-black text-white uppercase outline-none focus:border-violet-500/50"
      >
        <option value="ALL">TODAS LAS ACADEMIAS (GLOBAL)</option>
        {#each $appStore.schools as s}
          <option value={s.id}>{s.name.toUpperCase()}</option>
        {/each}
      </select>
    </div>
  {/if}

  <div class="grid grid-cols-1 xl:grid-cols-12 gap-10">
    <!-- Main Management Area -->
    <div class="xl:col-span-8 space-y-10">
      <!-- Live Lichess Feed -->
      <section class="space-y-4">
        <div class="flex items-center justify-between border-b border-white/[0.05] pb-4">
          <div class="flex items-center gap-3">
            <Globe class="w-4 h-4 text-primary-400" />
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-white">ORÁCULO // LICHESS_FEED</h3>
          </div>
          <div class="flex items-center gap-2">
            <button 
              onclick={handleAutoGenerateAll}
              disabled={isProcessing || suggestions.length === 0}
              class="px-4 py-1.5 border border-primary-500/30 bg-primary-500/5 text-primary-400 text-[9px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-black transition-all disabled:opacity-20"
            >
              GENERAR_LOTE
            </button>
            <button 
              onclick={fetchSuggestions}
              class="p-1.5 text-zinc-600 hover:text-primary-400 transition-all hover:rotate-180 duration-1000"
            >
              <Pulse class="w-4 h-4" />
            </button>
          </div>
        </div>

        {#if isFetchingSuggestions}
          <div class="h-48 border border-white/[0.05] bg-zinc-950/40 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
             <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"></div>
             <div class="w-5 h-5 border-2 border-primary-500/20 border-t-primary-500 animate-spin"></div>
             <span class="text-[8px] font-black text-primary-500/50 uppercase tracking-[0.2em]">SINC_REDS_BROADCAST...</span>
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.05] border border-white/[0.05] shadow-xl">
            {#each suggestions as s, i}
              <button 
                onclick={() => handleUseSuggestion(s)}
                class="group flex flex-col p-5 bg-zinc-950/80 hover:bg-zinc-900 transition-all text-left relative overflow-hidden"
                in:fade={{ delay: i * 50 }}
              >
                <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="absolute top-4 right-4 text-[7px] font-black text-zinc-700 bg-white/5 border border-white/10 px-2 py-0.5 group-hover:border-primary-500/30 group-hover:text-primary-400 transition-all">
                  TIER_{s.tour.tier}
                </div>
                
                <div class="flex items-center gap-2 mb-3">
                   <div class="w-1.5 h-1.5 {s.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-primary-500'}"></div>
                   <span class="text-[8px] font-black uppercase tracking-widest {s.status === 'ACTIVE' ? 'text-emerald-500' : 'text-primary-400'}">
                     {s.status === 'ACTIVE' ? 'EN_VIVO' : 'PROGRAMADO'}
                   </span>
                </div>
                
                <h4 class="text-[11px] font-black text-white/90 uppercase mb-1 leading-tight group-hover:translate-x-1 transition-transform">{s.tour.name}</h4>
                <p class="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{s.round.name}</p>
                
                <div class="mt-4 flex items-center gap-1.5 text-[8px] font-black text-zinc-600 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                  <span>CREAR_HITO</span>
                  <ArrowRight size={10} />
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </section>

      <!-- Active Markets Management -->
      <section class="space-y-6">
        <div class="flex items-center justify-between border-b border-white/[0.05] pb-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-amber-500/10 border border-amber-500/20">
              <ShieldCheckered class="w-4 h-4 text-amber-500" weight="bold" />
            </div>
            <div>
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-white">Gestión de Hitos Académicos</h3>
              <p class="text-[7px] text-zinc-500 font-black tracking-widest uppercase mt-0.5">CORE_PREDICTION_MARKETS</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button 
              onclick={handleAutoResolveAll}
              disabled={isResolvingAuto || isProcessing}
              class="flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-20 shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/10"
            >
              <Lightning weight="fill" size={12} class={isResolvingAuto ? 'animate-pulse' : ''} />
              AUTO-RESOLVER
            </button>
            <button 
              onclick={() => { marketToEdit = null; showCreateMarketModal = true; }}
              class="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-[0.15em] hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/0 hover:shadow-amber-500/20 active:scale-95"
            >
              <Plus weight="bold" size={12} />
              NUEVO_HITO
            </button>
          </div>
        </div>

        <div class="bg-zinc-950/40 border border-white/[0.05] overflow-x-auto shadow-2xl">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="border-b border-white/[0.05] bg-white/[0.02]">
                <th class="p-5 text-[9px] font-black text-zinc-500 uppercase tracking-wider">HITO / PREGUNTA</th>
                <th class="p-5 text-[9px] font-black text-zinc-500 uppercase tracking-wider text-center">ESTADO</th>
                <th class="p-5 text-[9px] font-black text-zinc-500 uppercase tracking-wider text-right">POOL_LIQUIDEZ</th>
                <th class="p-5 text-[9px] font-black text-zinc-500 uppercase tracking-wider text-right">ACCIONES_ORÁCULO</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.05]">
              {#each markets as m, i}
                <tr 
                  class="hover:bg-white/[0.01] transition-all group"
                  in:fade={{ delay: i * 30 }}
                >
                  <td class="p-5">
                    <div class="flex flex-col">
                      <p class="text-[11px] font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                        {m.question}
                      </p>
                      <div class="flex items-center gap-2 mt-1.5">
                        <span class="text-[7px] font-mono text-zinc-600 bg-white/5 px-1.5 py-0.5 border border-white/5 uppercase">HASH_{m.id.slice(0, 8)}</span>
                        <div class="h-px w-3 bg-zinc-800"></div>
                        <span class="text-[7px] font-black text-zinc-500 uppercase">{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td class="p-5">
                    <div class="flex justify-center">
                      <span class="px-2.5 py-1 {m.status === 'OPEN' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-zinc-800 text-zinc-500 border-white/5'} text-[8px] font-black border uppercase tracking-[0.2em] shadow-inner">
                        {m.status === 'OPEN' ? 'ACTIVO' : 'CERRADO'}
                      </span>
                    </div>
                  </td>
                  <td class="p-5 text-right">
                    <div class="flex flex-col items-end">
                      <span class="text-xs font-black text-white tabular-nums">{(m.totalPool ?? 0).toLocaleString()}</span>
                      <span class="text-[7px] text-zinc-600 font-black tracking-wider uppercase">NETS_TOTAL</span>
                    </div>
                  </td>
                  <td class="p-5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      {#if canManageMarkets}
                        {#if m.status === 'OPEN'}
                          <div class="flex items-center gap-1.5 mr-4 pr-4 border-r border-white/5">
                            {#each m.options as opt}
                              <button 
                                onclick={() => handleResolve(m.id, opt.id)}
                                class="px-3 py-1.5 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                                title={`Resolver como ${opt.text}`}
                              >
                                {opt.text}
                              </button>
                            {/each}
                          </div>
                        {/if}
                        
                        <button 
                          onclick={() => handleEditMarket(m)}
                          class="p-2 text-zinc-500 hover:text-amber-500 transition-colors"
                          title="Editar Hito"
                        >
                          <PencilSimple size={14} />
                        </button>
                        <button 
                          onclick={() => handleDeleteMarket(m.id)}
                          class="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                          title="Eliminar Hito"
                        >
                          <Trash size={14} />
                        </button>
                      {:else}
                        <span class="text-[8px] font-mono text-zinc-700 uppercase italic">Solo Lectura</span>
                      {/if}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Right Sidebar: Tools -->
    <div class="xl:col-span-4 space-y-10">
      <!-- Nets Distribution -->
      <section class="bento-card bg-primary-500/[0.02] border-primary-500/20 p-8 space-y-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[100px] pointer-events-none"></div>

        <div class="flex items-center gap-4 relative">
          <div class="w-11 h-11 bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
            <HandCoins weight="duotone" size={24} />
          </div>
          <div>
            <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-white">CONCESIÓN_NETS</h3>
            <p class="text-[8px] text-zinc-500 uppercase mt-1 tracking-widest font-black opacity-60">ADMIN_GRANT_PROTOCOL</p>
          </div>
        </div>

        <div class="space-y-6 relative">
          <div class="space-y-2.5 relative">
            <label for="mint-user-search" class="text-[9px] font-black text-zinc-500 uppercase tracking-widest opacity-60">Buscar Alumno/a</label>
            <div class="relative">
              <MagnifyingGlass class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                id="mint-user-search"
                type="text" 
                bind:value={userSearchQuery}
                oninput={searchUsers}
                placeholder="EMAIL O NOMBRE..."
                class="w-full bg-zinc-950 border border-white/10 px-11 py-3.5 text-[10px] font-black text-white focus:border-primary-500/50 outline-none uppercase placeholder:text-zinc-800 transition-all tracking-tight"
              />
              {#if isSearchingUsers}
                <div class="absolute right-4 top-1/2 -translate-y-1/2">
                   <div class="w-3 h-3 border border-primary-500 border-t-transparent animate-spin"></div>
                </div>
              {/if}
            </div>

            {#if filteredUsers.length > 0}
              <div class="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 shadow-2xl max-h-56 overflow-y-auto backdrop-blur-xl">
                {#each filteredUsers as u}
                  <button 
                    onclick={() => selectUser(u)}
                    class="w-full p-4 flex items-center gap-3 hover:bg-primary-500/10 text-left border-b border-white/5 last:border-0 transition-colors"
                  >
                    <div class="w-7 h-7 rounded-none bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <User class="w-3.5 h-3.5 text-primary-400" />
                    </div>
                    <div>
                      <p class="text-[10px] font-black text-white uppercase">{u.email}</p>
                      <p class="text-[7px] text-zinc-600 font-mono tracking-tighter uppercase">{u.id}</p>
                    </div>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2.5">
              <label for="mint-amount" class="text-[9px] font-black text-zinc-500 uppercase tracking-widest opacity-60">Cantidad</label>
              <input 
                id="mint-amount"
                type="number" 
                bind:value={mintAmount}
                class="w-full bg-zinc-950 border border-white/10 px-4 py-3.5 text-sm font-black text-white focus:border-primary-500/50 outline-none transition-all"
              />
            </div>
            <div class="flex items-end">
              <button 
                onclick={() => mintAmount = 500}
                class="w-full px-4 py-3.5 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-primary-500/20 hover:text-primary-400 transition-all text-zinc-600"
              >
                MÁX_QUOTA
              </button>
            </div>
          </div>

          <div class="space-y-2.5">
            <label for="mint-reason" class="text-[9px] font-black text-zinc-500 uppercase tracking-widest opacity-60">Motivo de la Concesión</label>
            <textarea 
              id="mint-reason"
              bind:value={mintReason}
              placeholder="DESCRIPCIÓN DE LA OPERACIÓN..."
              rows="2"
              class="w-full bg-zinc-950 border border-white/10 px-4 py-3.5 text-[10px] font-black text-white focus:border-primary-500/50 outline-none uppercase resize-none placeholder:text-zinc-800 transition-all"
            ></textarea>
          </div>

          <button 
            onclick={handleMintNets}
            disabled={isMinting || !mintUserId}
            class="w-full py-4.5 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.25em] hover:bg-primary-500 transition-all disabled:opacity-20 active:scale-[0.98] shadow-lg shadow-primary-600/0 hover:shadow-primary-600/20"
          >
            {isMinting ? 'PROCESANDO_TRANSFERENCIA...' : 'EJECUTAR_CONCESIÓN'}
          </button>
        </div>
      </section>

      <!-- Audit Log Mini -->
      <section class="bg-zinc-950/30 border border-white/[0.05] p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;"></div>
        
        <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-6">
            <h2 class="text-xs font-mono font-black text-zinc-500 uppercase tracking-[0.4em]">REGISTRO_AUDITORÍA</h2>
            <button 
              onclick={handleSyncClaims}
              disabled={isSyncingClaims}
              class="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-[8px] font-mono font-black text-violet-400 uppercase tracking-widest hover:bg-violet-500/20 transition-all disabled:opacity-50"
            >
              <ShieldCheckered class="w-3 h-3" />
              {isSyncingClaims ? 'SINCRONIZANDO...' : 'SINCRONIZAR PERMISOS'}
            </button>
          </div>
            <Pulse size={12} class="text-zinc-700" />
        </div>
        
        <div class="space-y-5 relative z-10">
          {#if logs.length === 0}
            <div class="py-10 text-center">
                <p class="text-[9px] text-zinc-700 uppercase italic font-black tracking-widest opacity-40">SIN_ACTIVIDAD_RECIENTE</p>
            </div>
          {/if}
          {#each logs as log}
            <div class="flex gap-4 group/log">
               <div class="w-0.5 h-10 {log.category === 'GOVERNANCE' ? 'bg-amber-500/30' : 'bg-primary-500/30'} group-hover:h-12 transition-all duration-500"></div>
               <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-[11px] font-black text-white uppercase italic tracking-tight">{log.action || 'Operación Sistema'}</p>
                    <span class="text-[7px] font-black text-zinc-700 font-mono uppercase">
                      {(() => {
                        const ts = log.timestamp?.toDate ? log.timestamp.toDate() : log.timestamp;
                        return ts ? new Date(ts).toLocaleTimeString() : '---';
                      })()}
                    </span>
                  </div>
                  <p class="text-[9px] text-zinc-500 uppercase tracking-tight leading-relaxed line-clamp-2">{log.message || log.details}</p>
               </div>
            </div>
          {/each}
        </div>
        
        <button class="w-full py-3 border border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-widest hover:bg-white/5 hover:text-zinc-400 transition-all mt-4">
            VER_LOGS_COMPLETOS
        </button>
      </section>

      <!-- Protocol Rules (Impact Milestones) -->
      <section class="bento-card bg-white/[0.01] border-white/5 p-8 space-y-8">
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
            <ShieldCheckered weight="duotone" size={24} />
          </div>
          <div>
            <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-white">REGLAS_DE_IMPACTO</h3>
            <p class="text-[8px] text-zinc-500 uppercase mt-1 tracking-widest font-black opacity-60">GOVERNANCE_MILESTONES</p>
          </div>
        </div>

        <div class="space-y-4">
          {#each IMPACT_MILESTONES as milestone}
            <div class="p-5 bg-zinc-950 border border-white/5 space-y-2 group hover:border-primary-500/30 transition-all">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <milestone.icon size={16} class="text-primary-500" />
                  <span class="text-[10px] font-black text-white uppercase tracking-tight">{milestone.label}</span>
                </div>
                <span class="text-[10px] font-black text-primary-400">+{milestone.percent}%</span>
              </div>
              <p class="text-[9px] text-zinc-500 font-bold uppercase leading-tight tracking-tighter opacity-60">{milestone.desc}</p>
            </div>
          {/each}
        </div>

        <div class="p-4 bg-primary-500/5 border border-primary-500/10 flex items-start gap-4">
           <Info size={16} class="text-primary-500 shrink-0 mt-0.5" />
           <p class="text-[8px] text-primary-400 font-black uppercase leading-relaxed tracking-wider">
             Estas reglas son globales y se aplican automáticamente según el progreso de cada docente en el sistema.
           </p>
        </div>
      </section>
    </div>
  </div>
</div>

{#if showCreateMarketModal}
  <CreateMarketModal 
    bind:show={showCreateMarketModal} 
    onClose={() => { showCreateMarketModal = false; marketToEdit = null; }}
    onSuccess={fetchMarkets}
    editMarket={marketToEdit} 
  />
{/if}
