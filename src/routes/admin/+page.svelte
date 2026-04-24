<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { db } from '$lib/firebase';
  import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    onSnapshot,
  } from 'firebase/firestore';
  import { adminApi } from '$lib/api/admin';
  import { t } from '$lib/i18n';
  import { fade, slide, scale, fly } from 'svelte/transition';
  import { toast } from '$lib/stores/toast';
  import { uiStore } from '$lib/stores/uiStore';
  import { appStore } from '$lib/stores/appStore';
  
  // Icons
  import { 
    SquaresFour, 
    Users, 
    ChatTeardropDots, 
    Gear, 
    ArrowArcLeft,
    X,
    UserCircle,
    Crown,
    Star,
    Pulse,
    CheckCircle,
    Globe,
    ShieldCheckered,
    Lifebuoy,
    Shield
  } from 'phosphor-svelte';

  // Components
  import StatsGrid from '$lib/components/admin/StatsGrid.svelte';
  import UserTable from '$lib/components/admin/UserTable.svelte';
  import SystemConsole from '$lib/components/admin/SystemConsole.svelte';
  import LiveActivityFeed from '$lib/components/admin/LiveActivityFeed.svelte';
  import TicketManager from '$lib/components/admin/TicketManager.svelte';
  import LobbyManager from '$lib/components/admin/LobbyManager.svelte';
  import LichessPulse from '$lib/components/admin/LichessPulse.svelte';
  import StripeSimulator from '$lib/components/StripeSimulator.svelte';
  import UpdatePill from '$lib/components/common/UpdatePill.svelte';
  import PrestigeBadge from '$lib/components/economy/PrestigeBadge.svelte';

  import GovernanceHub from '$lib/components/admin/GovernanceHub.svelte';
  import BroadcastCenter from '$lib/components/admin/BroadcastCenter.svelte';

  // Constants
  import { INSIGNIAS } from '$lib/constants/insignias';

  // --- State (Svelte 5) ---
  let activeTab = $state('dashboard');
  let stats = $state({
    totalUsers: 0,
    totalStudents: 0,
    totalSchools: 0,
    totalClasses: 0,
    premiumUsers: 0,
    recentUsers: 0,
    totalInsignias: 0,
    totalRevenue: 0
  });

  let users = $state<any[]>([]);
  let systemLogs = $state<any[]>([]);
  let lobbySuggestions = $state<any[]>([]);
  let supportTickets = $state<any[]>([]);
  let activities = $state<any[]>([]);
  let maintenanceMode = $state(false);
  let isLoading = $state(true);
  let isSaving = $state(false);
  let searchTimeout: any;

  // Derive activities from logs and users
  $effect(() => {
    const rawLogs = systemLogs.map(l => {
      const isAchievement = l.type === 'insignia_awarded' || l.type === 'achievement_unlocked';
      return {
        id: l.id,
        type: isAchievement ? 'insignia_unlocked' : 'system_log',
        title: isAchievement ? $t('common.achievement') : (l.type || l.action),
        subtitle: typeof l.details === 'string' ? l.details : JSON.stringify(l.details),
        timestamp: l.timestamp,
        status: isAchievement ? 'premium' : (l.status || 'info')
      };
    });

    const rawUsers = users.slice(0, 5).map(u => ({
      id: u.id,
      type: 'user_joined',
      title: $t('admin.stats.teachers'),
      subtitle: `${u.displayName} (${u.email})`,
      timestamp: u.createdAt,
      status: 'premium'
    }));

    activities = [...rawLogs, ...rawUsers]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  });

  // Selection/Modals
  let selectedUser = $state<any>(null);
  let showEditModal = $state(false);
  let userDetails = $state<any>(null);
  let userInsignias = $state<any[]>([]);
  let isLoadingDetails = $state(false);

  // Scroll logic for mobile nav
  let lastScrollY = $state(0);
  let isNavVisible = $state(true);
  const navThreshold = 30;

  function handleScroll() {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    
    if (currentScrollY < 20) {
      isNavVisible = true;
    } else if (Math.abs(currentScrollY - lastScrollY) < 5) {
      return;
    } else if (currentScrollY > lastScrollY && currentScrollY > navThreshold) {
      isNavVisible = false;
    } else if (currentScrollY < lastScrollY) {
      isNavVisible = true;
    }
    lastScrollY = currentScrollY;
  }

  // Subscriptions Cleanup
  let unsubscribes: (() => void)[] = [];

  // --- Initialization ---

  onMount(async () => {
    try {
      const config = await adminApi.getMaintenanceStatus();
      maintenanceMode = config.maintenanceMode;

      startRealTimeMonitoring();

      refreshStats();
      const statsInterval = setInterval(refreshStats, 60000);
      unsubscribes.push(() => clearInterval(statsInterval));
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      isLoading = false;
    } catch (err) {
      console.error("Admin Init Error:", err);
      toast.error($t('admin.broadcast.error'));
    }
  });

  onDestroy(() => {
    unsubscribes.forEach(unsub => unsub());
    window.removeEventListener('scroll', handleScroll);
  });

  function startRealTimeMonitoring() {
    const usersUnsub = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc"), limit(100)),
      (snap) => {
        users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      },
      (err) => console.error("Users Listener Error:", err)
    );

    const logsUnsub = onSnapshot(
      query(collection(db, "system_logs"), orderBy("timestamp", "desc"), limit(50)),
      (snap) => {
        systemLogs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    );

    const lobbyUnsub = onSnapshot(
      query(collection(db, "lobby_suggestions"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        lobbySuggestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    );

    const ticketsUnsub = onSnapshot(
      query(collection(db, "lobby_reports"), orderBy("createdAt", "desc"), limit(50)),
      (snap) => {
        supportTickets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    );

    unsubscribes.push(usersUnsub, logsUnsub, lobbyUnsub, ticketsUnsub);
  }

  async function refreshStats() {
    const s = await adminApi.getGlobalStats();
    stats = s;
  }

  async function handleSearchUsers(queryStr: string) {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(async () => {
      isLoading = true;
      try {
        const results = await adminApi.getUsersList(100, queryStr);
        users = results;
      } catch (e) {
        toast.error($t('admin.broadcast.error'));
      } finally {
        isLoading = false;
      }
    }, 300);
  }

  async function openUserDetails(user: any) {
    selectedUser = user;
    showEditModal = true;
    isLoadingDetails = true;
    try {
      const [details, insignias] = await Promise.all([
        adminApi.getUserDetails(user.id),
        adminApi.getUserInsignias(user.id)
      ]);
      userDetails = details;
      userInsignias = insignias;
    } catch (err) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isLoadingDetails = false;
    }
  }

  async function handleGrantPremium(userId: string, days: number) {
    isSaving = true;
    try {
      await adminApi.grantTrial(userId, days);
      toast.success($t('admin.users.grant_success'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  async function handleMintNets(amount: number) {
    if (!selectedUser || !amount) return;
    try {
      isSaving = true;
      await adminApi.mintNets(selectedUser.id, amount);
      toast.success('Nets acuñados correctamente');
      // Refrescar detalles para ver el nuevo balance
      const details = await adminApi.getUserDetails(selectedUser.id);
      userDetails = { ...userDetails, ...details };
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  async function handleRevokePremium(userId: string) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.msg.revoke_premium_confirm'),
      message: $t('common.undone_action'),
      type: 'danger',
      confirmText: $t('common.delete'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;
    isSaving = true;
    try {
      await adminApi.revokePremium(userId);
      toast.success($t('admin.users.revoke_success'));
    } catch (e: any) {
      toast.error(e.message || $t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  async function handleToggleMaintenance() {
    const next = !maintenanceMode;
    maintenanceMode = next;
    try {
      await adminApi.toggleMaintenanceMode(next);
      toast.success($t('admin.system.maintenance_toggle_success'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
      maintenanceMode = !next;
    }
  }

  async function handleRepairUsers() {
    isSaving = true;
    try {
      const res = await adminApi.repairUsersData();
      toast.success($t('admin.msg.sync_complete', { count: res.count }));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  async function handleRepairEconomy() {
    isSaving = true;
    try {
      const res = await adminApi.repairEconomyData();
      toast.success(`Economía sincronizada: ${res.initializedCount} carteras inicializadas.`);
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
    }
  }

  async function handleUpdateSuggestionStatus(id: string, status: string) {
    try {
      await adminApi.updateSuggestionStatus(id, status);
      toast.success($t('admin.system.maintenance_toggle_success'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function handleDeleteSuggestion(id: string) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.msg.delete_suggestion_confirm'),
      message: $t('common.undone_action'),
      type: 'danger',
      confirmText: $t('common.delete'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;
    try {
      await adminApi.deleteSuggestion(id);
      toast.success($t('admin.lobby.delete'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function handleImpersonate(user: any) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.msg.impersonate_confirm', { email: user.email }),
      message: $t('admin.msg.impersonate_warning'),
      type: 'warning',
      confirmText: $t('common.accept'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;
    
    try {
      document.cookie = `impersonate_id=${user.id}; path=/; max-age=3600; SameSite=Lax`;
      document.cookie = `impersonate_email=${user.email}; path=/; max-age=3600; SameSite=Lax`;
      
      toast.success($t('admin.msg.impersonate_start', { email: user.email }));
      setTimeout(() => {
        window.location.href = `/panel`;
      }, 1000);
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function handleAwardInsignia(insigniaId: string) {
    if (!selectedUser) return;
    try {
      await adminApi.awardInsignia(selectedUser.id, insigniaId);
      userInsignias = await adminApi.getUserInsignias(selectedUser.id);
      toast.success($t('admin.modal.award_insignias'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function handleRevokeInsignia(insigniaId: string) {
    if (!selectedUser) return;
    try {
      await adminApi.revokeInsignia(selectedUser.id, insigniaId);
      userInsignias = await adminApi.getUserInsignias(selectedUser.id);
      toast.success($t('admin.modal.award_insignias'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  function getPlanStatus(user: any) {
    return (user.settings?.plan === 'premium' || user.settings?.plan === 'pro') ? 'pro' : 'free';
  }
</script>

<div class="min-w-[320px] min-h-screen bg-[#02040a] text-white selection:bg-violet-500/30 font-sans">
  <!-- Top Navigation Bar -->
  <nav class="sticky z-[60] bg-[#02040a]/90 backdrop-blur-2xl border-b border-white/10 pt-[env(safe-area-inset-top)] px-4 sm:px-8 flex items-center justify-between transition-all duration-300" style="top: var(--banner-height, 0px)">
    <div class="flex items-center gap-3 sm:gap-4 py-4 sm:py-5">
      <div class="w-9 h-9 bg-primary-600 flex items-center justify-center rounded-none">
        <SquaresFour weight="bold" class="w-5 h-5 text-white" />
      </div>
      <div class="overflow-visible pr-4">
        <h1 class="text-base sm:text-xl font-black font-display uppercase italic tracking-tighter leading-none text-white whitespace-nowrap">ChessNet <span class="text-primary-500">/</span> {$t('admin.title')}</h1>
        <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
          <span class="w-1 h-1 bg-emerald-500 animate-pulse"></span>
          {$t('admin.tech.sys_desc')} // v0.13.0 Beta
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-500/5 border border-violet-500/20">
        <span class="w-1.5 h-1.5 bg-violet-500 animate-pulse"></span>
        <span class="text-[9px] font-mono font-black text-violet-400 uppercase tracking-widest">{$t('admin.nav.operational')}</span>
      </div>

      <PrestigeBadge 
        nets={$appStore.settings.economy?.netsBalance || 0} 
        prestige={$appStore.settings.economy?.prestige || 0}
        variant="ghost" 
      />
      
      <a 
        href="/panel" 
        class="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-white rounded-none"
      >
        <ArrowArcLeft weight="bold" class="w-4 h-4" />
        <span class="hidden md:inline">{$t('admin.nav.exit')}</span>
      </a>
    </div>
  </nav>

  <!-- Mobile Only Header Stats -->
  <div class="lg:hidden grid grid-cols-3 gap-px bg-white/10 border-b border-white/10">
    {#each [
      { label: $t('admin.nav.stats_users'), val: stats.totalUsers, color: 'text-violet-400' },
      { label: $t('admin.nav.stats_revenue'), val: `$${Math.round(stats.totalRevenue)}`, color: 'text-violet-400' },
      { label: $t('admin.nav.stats_tickets'), val: supportTickets.filter(t => t.status === 'open').length, color: 'text-amber-400' }
    ] as s}
      <div class="p-4 bg-[#02040a] text-center">
        <p class="text-[7px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">{s.label}</p>
        <p class="text-sm font-black font-display {s.color} italic leading-none">{s.val}</p>
      </div>
    {/each}
  </div>

  <div class="flex">
    <!-- Sidebar Navigation -->
    <aside class="w-64 min-h-[calc(100vh-57px-var(--banner-height,0px))] border-r border-white/10 bg-[#02040a] hidden lg:flex flex-col sticky top-[57px]">
      <div class="p-8 space-y-8 flex-1">
        <div>
          <p class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span class="w-1 h-1 bg-primary-500"></span>
            {$t('admin.sidebar.principal')}
          </p>
          <nav class="space-y-px">
            {#each [
              { id: 'dashboard', label: $t('admin.sidebar.dashboard'), icon: SquaresFour },
              { id: 'users', label: $t('admin.sidebar.teachers'), icon: Users },
              { id: 'governance', label: $t('admin.sidebar.governance'), icon: ShieldCheckered },
              { id: 'broadcast', label: $t('admin.sidebar.broadcast'), icon: Globe },
              { id: 'tickets', label: $t('admin.sidebar.support'), icon: Lifebuoy },
              { id: 'lobby', label: $t('admin.sidebar.community'), icon: ChatTeardropDots },
              { id: 'system', label: $t('admin.sidebar.system'), icon: Gear }
            ] as item}
              {@const Icon = item.icon}
              <button 
                onclick={() => activeTab = item.id}
                class="w-full flex items-center gap-4 px-4 py-4 text-[11px] font-mono font-black uppercase tracking-widest transition-all {activeTab === item.id ? 'bg-primary-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.2)] relative z-10' : 'text-slate-500 hover:text-white hover:bg-white/5'} rounded-none group"
              >
                <Icon weight={activeTab === item.id ? 'fill' : 'bold'} class="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span class="truncate">{item.label}</span>
                {#if item.id === 'tickets' && supportTickets.filter(t => t.status === 'open').length > 0}
                  <span class="ml-auto px-1.5 py-0.5 {activeTab === item.id ? 'bg-white text-primary-600' : 'bg-amber-500 text-black'} text-[9px] font-black animate-pulse">
                    {supportTickets.filter(t => t.status === 'open').length}
                  </span>
                {/if}
              </button>
            {/each}
          </nav>
        </div>

        <div class="space-y-6">
          <p class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
             <span class="w-1 h-1 bg-violet-500"></span>
             SYSTEM STATUS
          </p>
          <div class="grid grid-cols-1 gap-px bg-white/10 border border-white/10">
            <div class="bg-black/40 p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">NETWORK LOAD</span>
                <span class="text-[9px] font-mono font-black text-emerald-500 uppercase">OPTIMAL</span>
              </div>
              <div class="h-1 bg-white/5 overflow-hidden">
                <div class="h-full bg-emerald-500 w-1/3 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div class="bg-black/40 p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">LATENCY</span>
                <span class="text-[9px] font-mono font-black text-violet-400 uppercase">24ms</span>
              </div>
              <div class="h-1 bg-white/5 overflow-hidden">
                <div class="h-full bg-violet-500 w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-8 border-t border-white/10 bg-white/[0.01]">
        <div class="flex items-center justify-between text-slate-700">
          <p class="text-[8px] font-mono font-black uppercase tracking-widest">OPERATIONAL LEVEL</p>
          <span class="text-[10px] font-black font-display italic">L3</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-6 sm:p-8 md:p-12 max-w-[1600px] mx-auto min-h-[calc(100vh-57px-var(--banner-height,0px))] relative pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-12">
      <!-- Background Patterns -->
      <div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.03)_0%,transparent_50%)]"></div>
        <div class="absolute inset-0 opacity-[0.03] grayscale invert" style="background-image: radial-gradient(#fff 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>
      </div>
      
      <div class="relative z-10 h-full">
        {#if isLoading && users.length === 0}
         <div class="h-[60vh] flex items-center justify-center" in:fade>
           <div class="flex flex-col items-center gap-8">
              <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-2 border-primary-500/20 rounded-none"></div>
                <div class="absolute inset-0 border-2 border-primary-500 border-t-transparent animate-spin rounded-none"></div>
              </div>
              <p class="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-slate-600 animate-pulse">{$t('admin.msg.loading_realtime')}</p>
           </div>
         </div>
      {:else}
          {#each [activeTab] as _ (activeTab)}
          <div in:fly={{ y: 20, duration: 500, delay: 100 }}>
            {#if activeTab === 'dashboard'}
               <div class="space-y-12">
                  <!-- Dashboard Header -->
                  <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div class="space-y-6">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-white text-black flex items-center justify-center font-display italic font-black text-2xl">
                          01
                        </div>
                        <div>
                          <div class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono font-black text-violet-400 uppercase tracking-[0.3em] rounded-none">
                            <span class="w-1.5 h-1.5 bg-violet-500 animate-pulse rounded-none"></span>
                            {$t('admin.dashboard.sync')}
                          </div>
                          <h2 class="text-5xl md:text-7xl font-black font-display uppercase italic tracking-[-0.05em] leading-[0.8] mt-2">
                            CENTRAL<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">OPERACIONES</span>
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="hidden sm:flex flex-col items-end mr-4">
                        <p class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">Tiempo de Actividad</p>
                        <p class="text-sm font-black font-display italic text-emerald-500">99.98%</p>
                      </div>
                      <button 
                        onclick={refreshStats} 
                        class="h-14 px-8 bg-white hover:bg-violet-500 hover:text-white text-black transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest group rounded-none"
                      >
                        <Pulse class="w-5 h-5 group-hover:animate-pulse" />
                        {$t('admin.dashboard.refresh')}
                      </button>
                    </div>
                  </div>

                  <LichessPulse />
                  <StatsGrid {stats} />

                  <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
                     <!-- Real-time Activity Hub -->
                     <div class="xl:col-span-8 space-y-8">
                        <div class="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden group">
                           <div class="absolute top-0 right-0 p-8 opacity-5">
                             <Pulse size={80} />
                           </div>
                           <LiveActivityFeed {activities} />
                        </div>
                     </div>

                     <!-- Sidebar Blocks -->
                     <div class="xl:col-span-4 space-y-8">

                        <!-- Guard Terminal -->
                        <div class="bg-[#02040a] border border-white/10 p-8 space-y-8 relative overflow-hidden">
                           <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50"></div>
                           
                           <div class="flex items-center gap-4">
                              <div class="w-10 h-10 bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500">
                                <Shield weight="fill" size={20} />
                              </div>
                              <div>
                                <h3 class="text-xs font-mono font-black uppercase tracking-[0.3em] text-white">{$t('admin.guard.title')}</h3>
                                <p class="text-[8px] font-mono text-slate-600 uppercase mt-0.5 tracking-widest italic">PROTOCOL LEVEL: OMEGA</p>
                              </div>
                           </div>

                           <div class="space-y-4">
                              <button 
                                 onclick={handleToggleMaintenance}
                                 class="w-full flex items-center justify-between p-6 border {maintenanceMode ? 'bg-red-500 text-white border-red-400' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20 hover:text-white'} transition-all rounded-none group"
                              >
                                 <div class="text-left">
                                   <p class="text-[9px] font-mono font-black uppercase tracking-widest opacity-60 mb-1">{$t('admin.guard.maintenance_mode')}</p>
                                   <p class="text-sm font-black uppercase italic">{maintenanceMode ? $t('admin.system.active') : $t('admin.system.inactive')}</p>
                                 </div>
                                 <Gear weight="fill" class="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                              </button>
                              
                              <button 
                                 onclick={handleRepairUsers}
                                 class="w-full flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 text-slate-400 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all rounded-none group"
                              >
                                 <div class="text-left">
                                   <p class="text-[9px] font-mono font-black uppercase tracking-widest opacity-60 mb-1">{$t('admin.guard.db_integrity')}</p>
                                   <p class="text-sm font-black uppercase italic">{$t('admin.guard.sync_repair')}</p>
                                 </div>
                                 <Pulse weight="bold" class="w-6 h-6 group-hover:scale-110 transition-transform" />
                              </button>

                              <button 
                                 onclick={handleRepairEconomy}
                                 class="w-full flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 text-slate-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all rounded-none group"
                              >
                                 <div class="text-left">
                                   <p class="text-[9px] font-mono font-black uppercase tracking-widest opacity-60 mb-1">Gestión de Nets</p>
                                   <p class="text-sm font-black uppercase italic">Sincronizar Economía</p>
                                 </div>
                                 <Star weight="bold" class="w-6 h-6 group-hover:scale-110 transition-transform text-violet-500" />
                              </button>
                           </div>

                           <div class="grid grid-cols-2 gap-4">
                             <div class="p-4 bg-white/[0.02] border border-white/5">
                               <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest mb-1">DB SYNC</p>
                               <p class="text-xs font-black text-emerald-500 uppercase italic">SUCCESS</p>
                             </div>
                             <div class="p-4 bg-white/[0.02] border border-white/5">
                               <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest mb-1">API LAYER</p>
                               <p class="text-xs font-black text-violet-400 uppercase italic">ACTIVE</p>
                             </div>
                           </div>
                         </div>

                          <!-- Governance Prediction Hub -->
                          <div class="bg-black/20 border border-white/5 p-8 relative overflow-hidden">
                            <div class="flex items-center justify-between mb-6">
                              <h3 class="text-xs font-mono font-black uppercase tracking-[0.3em] text-white">CENTRO DE GOBERNANZA</h3>
                              <button onclick={() => activeTab = 'governance'} class="text-[9px] font-mono font-black text-primary-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                                GESTIONAR <ArrowArcLeft class="rotate-180 w-3 h-3" />
                              </button>
                            </div>
                            <p class="text-slate-500 text-[10px] leading-relaxed">Accede al panel de gobernanza para gestionar hitos de predicción, resolver oráculos de Lichess y distribuir recompensas.</p>
                          </div>

                         <!-- Technical Metadata -->
                        <div class="bg-zinc-900/20 border border-white/5 p-8 space-y-6">
                           <div class="flex items-center justify-between">
                              <h4 class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">{$t('admin.env.title')}</h4>
                              <span class="text-[9px] font-mono font-black text-white px-2 py-0.5 bg-violet-500">PRODUCTION</span>
                           </div>
                           <div class="space-y-4">
                              {#each [
                                { label: $t('admin.env.uptime'), val: '99.98%', color: 'text-emerald-500' },
                                { label: $t('admin.env.cpu'), val: '12.4%', color: 'text-violet-400' },
                                { label: $t('admin.env.region'), val: 'eu-west3', color: 'text-white' },
                                { label: 'Node Version', val: 'v20.11.0', color: 'text-slate-500' }
                              ] as row}
                                <div class="flex justify-between items-center border-b border-white/5 pb-3">
                                  <span class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">{row.label}</span>
                                  <span class="text-[10px] font-black italic {row.color}">{row.val}</span>
                                </div>
                              {/each}
                           </div>
                           <div class="pt-4 flex items-center gap-3">
                             <div class="w-full h-1.5 bg-white/5 rounded-none overflow-hidden flex">
                               <div class="h-full bg-violet-500 w-1/2"></div>
                               <div class="h-full bg-violet-400 w-1/4 opacity-50"></div>
                             </div>
                             <span class="text-[8px] font-mono font-black text-slate-700 uppercase">LOAD</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            {:else if activeTab === 'users'}
               <div class="space-y-12">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
                      02
                    </div>
                    <div>
                       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">{$t('admin.users.list_title')}</h2>
                       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                         <span class="w-1.5 h-1.5 bg-primary-500 rounded-none"></span>
                         {$t('admin.users.list_subtitle')}
                       </p>
                    </div>
                  </div>

                  <UserTable 
                     {users} 
                     onEdit={openUserDetails}
                     onImpersonate={handleImpersonate}
                     onSearch={handleSearchUsers}
                  />
               </div>

            {:else if activeTab === 'governance'}
               <div class="space-y-12">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
                      03
                    </div>
                    <div>
                       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">Centro de Gobernanza</h2>
                       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                         <span class="w-1.5 h-1.5 bg-primary-500 rounded-none animate-pulse"></span>
                         Gobernanza de Hitos y Distribución de Nets
                       </p>
                    </div>
                  </div>
                  <GovernanceHub />
               </div>

            {:else if activeTab === 'broadcast'}
               <div class="space-y-12">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
                      04
                    </div>
                    <div>
                       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">Avisos Globales</h2>
                       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                         <span class="w-1.5 h-1.5 bg-primary-500 rounded-none animate-pulse"></span>
                         Comunicaciones prioritarias para toda la red
                       </p>
                    </div>
                  </div>
                  <BroadcastCenter />
               </div>

            {:else if activeTab === 'tickets'}
              <div class="space-y-12">
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
                    05
                  </div>
                  <div>
                     <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">Centro de Soporte</h2>
                     <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                       <span class="w-1.5 h-1.5 bg-amber-500 rounded-none animate-pulse"></span>
                       Gestión de Incidencias y Tickets
                     </p>
                  </div>
                </div>
                <TicketManager tickets={supportTickets} />
              </div>

            {:else if activeTab === 'lobby'}
               <LobbyManager suggestions={lobbySuggestions} />
            {:else if activeTab === 'system'}
               <div class="space-y-12">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
                      06
                    </div>
                    <div>
                       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">{$t('admin.system.engine')}</h2>
                       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                         <span class="w-1.5 h-1.5 bg-red-500 rounded-none animate-ping"></span>
                         {$t('admin.system.engine_desc')}
                       </p>
                    </div>
                  </div>
                  
                  <StripeSimulator />
                  
                  <div class="bg-zinc-900/40 border border-white/5 p-8 md:p-12">
                    <SystemConsole 
                      logs={systemLogs}
                      {maintenanceMode}
                      onToggleMaintenance={handleToggleMaintenance}
                      onRepairData={handleRepairUsers}
                      onClearLogs={() => toast.info('No disponible temporalmente')}
                    />
                  </div>
               </div>
            {/if}
          </div>
          {/each}
        {/if}
      </div>
    </main>
  </div>
</div>



  <!-- User Detail Modal -->
  {#if showEditModal && selectedUser}
    <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/90 backdrop-blur-md" transition:fade>
      <div 
        class="bg-[#02040a] w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto rounded-none"
        transition:fly={{ y: 100, duration: 400 }}
      >
        <!-- Modal Header -->
        <div class="sticky top-0 z-10 px-8 py-5 border-b border-white/10 flex items-center justify-between bg-[#02040a]/95 backdrop-blur-xl">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-violet-400 rounded-none">
              <UserCircle class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-mono font-black uppercase tracking-widest text-white">{$t('admin.modal.command_manager')}</h3>
              <p class="text-[9px] font-mono text-slate-600 uppercase mt-0.5 truncate max-w-[200px]">{selectedUser?.email}</p>
            </div>
          </div>
          <button 
            onclick={() => showEditModal = false}
            class="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all cursor-pointer text-white rounded-none"
          >
            <X weight="bold" class="w-4 h-4" />
          </button>
        </div>

        <div class="p-8 space-y-8">
           <!-- Entity Counts -->
           <div class="grid grid-cols-3 gap-px bg-white/10 border border-white/10">
              {#each [
                { label: $t('admin.stats.schools'), val: userDetails?.schools || 0 },
                { label: $t('admin.stats.classes'), val: userDetails?.classes || 0 },
                { label: $t('admin.stats.students'), val: userDetails?.students || 0 }
              ] as ent}
                <div class="bg-[#02040a] p-5 text-center">
                  <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-2 truncate">{ent.label}</p>
                  {#if isLoadingDetails}
                    <div class="h-7 w-12 bg-white/5 animate-pulse mx-auto rounded-none"></div>
                  {:else}
                    <span class="text-3xl font-black font-display italic text-white leading-none">{ent.val}</span>
                  {/if}
                </div>
              {/each}
           </div>

           <!-- Premium Commands -->
           <div class="space-y-4">
              <div class="flex items-center gap-3">
                <Crown weight="duotone" class="w-4 h-4 text-amber-500" />
                <p class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">{$t('admin.modal.subscription_control')}</p>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10">
                 {#each [3, 7, 30, 365] as days}
                   <button 
                    onclick={() => handleGrantPremium(selectedUser?.id, days)}
                    disabled={isSaving}
                    class="py-4 bg-[#02040a] text-[10px] font-mono font-black uppercase tracking-widest transition-all hover:bg-primary-500/10 hover:text-primary-400 disabled:opacity-50 text-slate-400 cursor-pointer rounded-none"
                   >
                    {days === 365 ? $t('admin.modal.one_year') : $t('admin.users.days', { n: days })}
                   </button>
                 {/each}
              </div>
              {#if getPlanStatus(selectedUser) === 'pro'}
                 <button 
                  onclick={() => handleRevokePremium(selectedUser?.id)}
                  class="w-full py-3.5 bg-red-500/10 text-red-500 border border-red-500/30 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer rounded-none"
                 >
                  {$t('admin.modal.revoke_privileges')}
                 </button>
              {/if}
            </div>

            <!-- Economy Control -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <Star weight="duotone" class="w-4 h-4 text-emerald-500" />
                <p class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">Gestión de Nets (MINT)</p>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10">
                 {#each [100, 500, 1000, 5000] as amount}
                   <button 
                    onclick={() => handleMintNets(amount)}
                    disabled={isSaving}
                    class="py-4 bg-[#02040a] text-[10px] font-mono font-black uppercase tracking-widest transition-all hover:bg-emerald-500/10 hover:text-emerald-400 disabled:opacity-50 text-slate-400 cursor-pointer rounded-none"
                   >
                    +{amount}
                   </button>
                 {/each}
              </div>
            </div>

            <!-- Badge Command -->
            <div class="space-y-6">
               <div class="flex items-center gap-3">
                 <Star weight="duotone" class="w-4 h-4 text-violet-500" />
                 <p class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">{$t('admin.modal.award_insignias')}</p>
               </div>
               
               <div class="space-y-4">
                 <!-- Special / Admin Badges -->
                 <div>
                   <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest mb-3 italic">Especiales / Manuales</p>
                   <div class="flex flex-wrap gap-1.5">
                     {#each INSIGNIAS.filter(b => b.type === 'special') as badge}
                        {@const isOwned = userInsignias.some(ui => ui.id === badge.id)}
                        <button 
                         onclick={() => isOwned ? handleRevokeInsignia(badge.id) : handleAwardInsignia(badge.id)}
                         class="flex items-center gap-2 px-3 py-2.5 border transition-all {isOwned ? 'bg-violet-500 border-violet-400 text-white' : 'bg-white/[0.02] border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'} cursor-pointer rounded-none group/badge"
                        >
                         <badge.icon weight="fill" class="w-3.5 h-3.5 {isOwned ? 'text-white' : 'group-hover/badge:text-violet-400'}" />
                         <span class="text-[9px] font-mono font-black uppercase tracking-widest">{$t(badge.titleKey)}</span>
                        </button>
                     {/each}
                   </div>
                 </div>

                 <!-- Automatic Badges -->
                 <div>
                   <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest mb-3 italic">Progreso Automático (Fuerza Bruta)</p>
                   <div class="flex flex-wrap gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                     {#each INSIGNIAS.filter(b => b.type === 'automatic') as badge}
                        {@const isOwned = userInsignias.some(ui => ui.id === badge.id)}
                        <button 
                         onclick={() => isOwned ? handleRevokeInsignia(badge.id) : handleAwardInsignia(badge.id)}
                         class="flex items-center gap-2 px-2.5 py-2 border transition-all {isOwned ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white/[0.01] border-white/5 text-slate-600 hover:border-white/20 hover:text-slate-400'} cursor-pointer rounded-none"
                        >
                         <badge.icon weight="fill" class="w-2.5 h-2.5" />
                         <span class="text-[8px] font-mono font-black uppercase tracking-widest">{$t(badge.titleKey)}</span>
                        </button>
                     {/each}
                   </div>
                 </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Mobile Navigation for Admins -->
  <div 
    class="lg:hidden fixed bottom-5 left-4 right-4 z-[100] pb-[env(safe-area-inset-bottom)] transition-all duration-500 {isNavVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-30 pointer-events-none'}"
    onclick={() => isNavVisible = true}
    role="button"
    tabindex="0"
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') isNavVisible = true; }}
  >
    <div class="bg-[#0a0a0c]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-stretch rounded-none">
      {#each [
        { id: 'dashboard', icon: SquaresFour, label: 'Dash' },
        { id: 'users', icon: Users, label: 'Users' },
        { id: 'broadcast', icon: Globe, label: 'Info' }
      ] as item}
        {@const Icon = item.icon}
        <button 
          onclick={() => activeTab = item.id}
          class="flex-1 flex flex-col items-center gap-1.5 py-4 transition-all border-r border-white/5 {activeTab === item.id ? 'text-primary-400 bg-primary-500/5' : 'text-slate-600 hover:text-white'} rounded-none"
        >
          <Icon weight={activeTab === item.id ? 'fill' : 'bold'} size={20} />
          <span class="text-[8px] font-mono font-black uppercase tracking-widest">{item.label}</span>
        </button>
      {/each}

      <!-- Center Tickets Button -->
      <button 
        onclick={() => activeTab = 'tickets'}
        class="relative flex-1 flex flex-col items-center gap-1.5 py-4 transition-all border-r border-white/5 {activeTab === 'tickets' ? 'text-amber-400 bg-amber-500/5' : 'text-slate-600 hover:text-amber-400'} rounded-none"
      >
        <Lifebuoy weight={activeTab === 'tickets' ? 'fill' : 'bold'} size={20} />
        <span class="text-[8px] font-mono font-black uppercase tracking-widest">Tickets</span>
        {#if supportTickets.filter(t => t.status === 'open').length > 0}
          <div class="absolute top-2 right-3 min-w-[16px] h-4 bg-amber-500 text-black flex items-center justify-center text-[8px] font-black px-1 rounded-none">
            {supportTickets.filter(t => t.status === 'open').length}
          </div>
        {/if}
      </button>

      {#each [
        { id: 'lobby', icon: ChatTeardropDots, label: 'Hub' },
        { id: 'system', icon: Gear, label: 'Sys' }
      ] as item}
        {@const Icon = item.icon}
        <button 
          onclick={() => activeTab = item.id}
          class="flex-1 flex flex-col items-center gap-1.5 py-4 transition-all {item.id !== 'system' ? 'border-r border-white/5' : ''} {activeTab === item.id ? 'text-primary-400 bg-primary-500/5' : 'text-slate-600 hover:text-white'} rounded-none"
        >
          <Icon weight={activeTab === item.id ? 'fill' : 'bold'} size={20} />
          <span class="text-[8px] font-mono font-black uppercase tracking-widest">{item.label}</span>
        </button>
      {/each}
    </div>
  </div>

<UpdatePill />

<style>
  :global(.pointer-interactions) {
    cursor: pointer;
    user-select: none;
  }
</style>

