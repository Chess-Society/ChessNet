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
    Shield,
    Lifebuoy
  } from 'phosphor-svelte';

  // Components
  import StatsGrid from '$lib/components/admin/StatsGrid.svelte';
  import UserTable from '$lib/components/admin/UserTable.svelte';
  import SystemConsole from '$lib/components/admin/SystemConsole.svelte';
  import LiveActivityFeed from '$lib/components/admin/LiveActivityFeed.svelte';
  import BroadcastCenter from '$lib/components/admin/BroadcastCenter.svelte';
  import TicketManager from '$lib/components/admin/TicketManager.svelte';
  import StripeSimulator from '$lib/components/StripeSimulator.svelte';
  import UpdatePill from '$lib/components/common/UpdatePill.svelte';

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
      status: 'success'
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
      query(collection(db, "lobby_suggestions"), orderBy("createdAt", "desc")),
      (snap) => {
        lobbySuggestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    );

    const ticketsUnsub = onSnapshot(
      query(collection(db, "lobby_reports"), orderBy("createdAt", "desc")),
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

  async function handleRevokePremium(userId: string) {
    if (!confirm($t('admin.msg.revoke_premium_confirm'))) return;
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

  async function handleUpdateSuggestionStatus(id: string, status: string) {
    try {
      await adminApi.updateSuggestionStatus(id, status);
      toast.success($t('admin.system.maintenance_toggle_success'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function handleDeleteSuggestion(id: string) {
    if (!confirm($t('admin.msg.delete_suggestion_confirm'))) return;
    try {
      await adminApi.deleteSuggestion(id);
      toast.success($t('admin.lobby.delete'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    }
  }

  async function handleImpersonate(user: any) {
    if (!confirm($t('admin.msg.impersonate_confirm', { email: user.email }))) return;
    
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

<div class="min-w-[320px] min-h-screen bg-zinc-950 text-white selection:bg-violet-500/30">
  <!-- Top Navigation Bar -->
  <nav class="sticky top-0 z-[60] bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 pt-[env(safe-area-inset-top)] px-4 sm:px-8 flex items-center justify-between">
    <div class="flex items-center gap-3 sm:gap-4 py-4 sm:py-6">
      <div class="p-2.5 sm:p-3 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-lg shadow-violet-500/20">
        <SquaresFour weight="duotone" class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div>
        <h1 class="text-sm sm:text-xl font-black font-display uppercase italic tracking-tighter leading-none">{$t('admin.title')}</h1>
        <p class="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 opacity-60">ChessNet Operational Interface v2.5</p>
      </div>
    </div>

    <div class="flex items-center gap-6">
      <div class="hidden sm:flex flex-col items-end border-r border-white/5 pr-6 mr-6">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{$t('admin.nav.status')}</span>
        <div class="flex items-center gap-2 mt-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[10px] font-bold text-emerald-400 uppercase">{$t('admin.nav.operational')}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <a 
          href="/panel" 
          class="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all pointer-interactions text-white"
        >
          <ArrowArcLeft weight="bold" class="w-4 h-4" />
          <span class="hidden md:inline">{$t('admin.nav.exit')}</span>
        </a>
      </div>
    </div>
  </nav>

  <!-- Mobile Only Header Stats (Premium Bento Style) -->
  <div class="lg:hidden grid grid-cols-3 gap-3 p-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
    {#each [
      { label: 'Users', val: stats.totalUsers, color: 'text-violet-400' },
      { label: 'Rev', val: `$${Math.round(stats.totalRevenue)}`, color: 'text-emerald-400' },
      { label: 'Tickets', val: supportTickets.filter(t => t.status === 'open').length, color: 'text-amber-400' }
    ] as s}
      <div class="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center group active:scale-95 transition-all">
        <p class="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
        <p class="text-xs font-black {s.color} italic leading-none">{s.val}</p>
      </div>
    {/each}
  </div>

  <div class="flex">
    <!-- Sidebar Navigation -->
    <aside class="w-72 min-h-[calc(100vh-84px)] border-r border-white/5 bg-zinc-950 p-8 space-y-8 hidden lg:block">
      <div>
        <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">{$t('admin.sidebar.principal')}</p>
        <nav class="space-y-2">
          {#each [
            { id: 'dashboard', label: $t('admin.sidebar.dashboard'), icon: SquaresFour },
            { id: 'users', label: $t('admin.sidebar.teachers'), icon: Users },
            { id: 'tickets', label: $t('admin.sidebar.support'), icon: Lifebuoy },
            { id: 'lobby', label: $t('admin.sidebar.community'), icon: ChatTeardropDots },
            { id: 'system', label: $t('admin.sidebar.system'), icon: Gear }
          ] as item}
            {@const Icon = item.icon}
            <button 
              onclick={() => activeTab = item.id}
              class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all {activeTab === item.id ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}"
            >
              <Icon weight={activeTab === item.id ? 'duotone' : 'bold'} class="w-5 h-5" />
              {item.label}
              {#if item.id === 'tickets' && supportTickets.filter(t => t.status === 'open').length > 0}
                <span class="ml-auto px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded-lg animate-pulse">
                  {supportTickets.filter(t => t.status === 'open').length}
                </span>
              {/if}
            </button>
          {/each}
        </nav>
      </div>

      <div class="pt-8 border-t border-white/5">
        <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">{$t('admin.sidebar.shortcuts')}</p>
        <div class="space-y-4">
           <div class="p-5 bg-white/5 rounded-[1.5rem] border border-white/5">
              <p class="text-[10px] font-bold text-slate-400 mb-2">{$t('admin.sidebar.db_health')}</p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold font-display italic">98%</span>
                <div class="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <CheckCircle weight="bold" class="w-5 h-5" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-4 sm:p-6 md:p-10 max-w-[1600px] mx-auto min-h-[calc(100vh-84px)] relative overflow-hidden pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-10">
      <!-- Gradient Background Architecture -->
      <div class="absolute inset-0 -z-10 bg-zinc-950">
        <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(139,92,246,0.05)_0%,transparent_50%)]"></div>
        <div class="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,rgba(79,70,229,0.03)_0%,transparent_50%)]"></div>
      </div>
      
      <div class="relative z-10 h-full">
        {#if isLoading && users.length === 0}
         <div class="h-full flex items-center justify-center" in:fade>
           <div class="flex flex-col items-center gap-6">
              <div class="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
              <p class="text-xs font-black uppercase tracking-widest text-slate-500">{$t('admin.msg.loading_realtime')}</p>
           </div>
         </div>
      {:else}
          {#each [activeTab] as _ (activeTab)}
          <div in:fade={{ duration: 400 }}>
            {#if activeTab === 'dashboard'}
               <div class="space-y-8 sm:space-y-12">
                  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 class="text-3xl sm:text-4xl font-black font-display uppercase italic tracking-[-0.05em] leading-[0.9]">Operational<br/><span class="text-violet-500">Overview</span></h2>
                      <p class="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-4 flex items-center gap-2 text-slate-500">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {$t('admin.dashboard.sync')}
                      </p>
                    </div>
                  <div class="flex items-center gap-2">
                     <button onclick={refreshStats} class="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 text-white">
                        <Pulse class="w-4 h-4" />
                        {$t('admin.dashboard.refresh')}
                     </button>
                  </div>
                </div>

                <StatsGrid {stats} />

                <div class="grid grid-cols-1 xl:grid-cols-3 gap-10">
                   <!-- Real-time Activity Hub -->
                   <div class="xl:col-span-2 space-y-10">
                      <LiveActivityFeed {activities} />
                      <BroadcastCenter />
                   </div>

                   <!-- Info & Critical Actions -->
                   <div class="space-y-10">
                      <!-- Critical Actions Card -->
                      <div class="bg-gradient-to-br from-red-500/10 to-violet-500/10 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div class="relative z-10 space-y-8">
                           <h3 class="text-xl font-black font-display uppercase italic tracking-wider flex items-center gap-3 text-white">
                             <Shield weight="duotone" class="w-7 h-7 text-red-500" />
                             {$t('admin.guard.title')}
                           </h3>
                           <div class="space-y-4">
                             <button 
                                onclick={handleToggleMaintenance}
                                class="w-full flex items-center justify-between p-6 rounded-3xl border {maintenanceMode ? 'bg-red-500 text-white border-red-400 shadow-xl shadow-red-500/20' : 'bg-black/20 border-white/5 text-slate-400 hover:border-white/20'} transition-all group/btn"
                             >
                                <div class="text-left">
                                  <p class="text-[10px] font-black uppercase tracking-widest opacity-60">{$t('admin.guard.maintenance_mode')}</p>
                                  <p class="text-sm font-bold uppercase italic">{maintenanceMode ? $t('admin.system.active') : $t('admin.system.inactive')}</p>
                                </div>
                                <Gear weight="fill" class="w-6 h-6 animate-spin-slow group-hover/btn:rotate-90 transition-transform" />
                             </button>
                             
                             <button 
                                onclick={handleRepairUsers}
                                class="w-full flex items-center justify-between p-6 rounded-3xl bg-black/40 border border-white/5 text-slate-400 hover:border-primary-500/30 hover:bg-primary-500/10 hover:text-primary-400 transition-all"
                             >
                                <div class="text-left">
                                  <p class="text-[10px] font-black uppercase tracking-widest opacity-60">{$t('admin.guard.db_integrity')}</p>
                                  <p class="text-sm font-bold uppercase italic">{$t('admin.guard.sync_repair')}</p>
                                </div>
                                <Pulse weight="bold" class="w-6 h-6" />
                             </button>
                           </div>
                        </div>
                        <!-- Decorative element -->
                        <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/5 blur-[80px] rounded-full"></div>
                      </div>

                      <!-- System Info -->
                      <div class="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                        <div class="flex items-center justify-between">
                          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{$t('admin.env.title')}</h4>
                          <span class="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[8px] font-black">{$t('admin.env.stable')}</span>
                        </div>
                        <div class="space-y-4">
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-600 font-bold uppercase">{$t('admin.env.uptime')}</span>
                            <span class="text-white font-black italic">99.98%</span>
                          </div>
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-600 font-bold uppercase">{$t('admin.env.cpu')}</span>
                            <span class="text-white font-black italic">12.4%</span>
                          </div>
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-600 font-bold uppercase">{$t('admin.env.region')}</span>
                            <span class="text-white font-black italic">europe-west3</span>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
             </div>

          {:else if activeTab === 'users'}
            <div class="space-y-12">
               <div>
                  <h2 class="text-4xl font-black font-display uppercase italic tracking-tighter text-white">{$t('admin.users.list_title')}</h2>
                  <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                    {$t('admin.users.list_subtitle')}
                  </p>
               </div>

               <UserTable 
                  {users} 
                  onEdit={openUserDetails}
                  onImpersonate={handleImpersonate}
                  onSearch={handleSearchUsers}
               />
            </div>

          {:else if activeTab === 'tickets'}
            <div in:fade>
              <TicketManager tickets={supportTickets} />
            </div>

          {:else if activeTab === 'lobby'}
             <div class="space-y-10">
               <div>
                  <h2 class="text-4xl font-black font-display uppercase italic tracking-tighter text-white">{$t('admin.lobby.title')}</h2>
                  <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 italic">{$t('admin.lobby.subtitle')}</p>
               </div>

               <div class="grid grid-cols-1 gap-6">
                 {#each lobbySuggestions as s (s.id)}
                   <div 
                    class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
                    in:slide
                   >
                     <div class="flex flex-col md:flex-row gap-8">
                       <div class="flex-1 space-y-4">
                         <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black border border-white/10 uppercase text-white">
                              {s.authorName?.[0] || 'A'}
                            </div>
                            <div>
                               <p class="text-[10px] font-black text-primary-400 uppercase tracking-widest">{s.authorName}</p>
                               <p class="text-[9px] text-slate-500 font-bold uppercase italic">{new Date(s.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <h4 class="text-xl font-black uppercase italic tracking-tight text-white">{s.title}</h4>
                         <p class="text-sm text-slate-400 leading-relaxed font-medium">{s.content}</p>
                       </div>
                       
                       <div class="md:w-64 space-y-3">
                           <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">{$t('admin.lobby.update_status')}</p>
                           <select 
                             value={s.status} 
                             onchange={(e) => handleUpdateSuggestionStatus(s.id, (e.target as HTMLSelectElement).value)}
                             class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase outline-none focus:border-primary-500 transition-all appearance-none text-slate-400"
                           >
                             <option value="pending">{$t('admin.lobby.status_pending')}</option>
                             <option value="planned">{$t('admin.lobby.status_planned')}</option>
                             <option value="implemented">{$t('admin.lobby.status_implemented')}</option>
                           </select>
                           <button 
                             onclick={() => handleDeleteSuggestion(s.id)}
                             class="w-full py-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5 cursor-pointer"
                           >
                              {$t('admin.lobby.delete')}
                           </button>
                        </div>
                     </div>
                   </div>
                 {/each}
               </div>
             </div>

          {:else if activeTab === 'system'}
             <div class="space-y-12">
                <div>
                  <h2 class="text-4xl font-black font-display uppercase italic tracking-tighter text-white">{$t('admin.system.engine')}</h2>
                  <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">{$t('admin.system.engine_desc')}</p>
                </div>
                
                <StripeSimulator />
                
                <SystemConsole 
                  logs={systemLogs}
                  {maintenanceMode}
                  onToggleMaintenance={handleToggleMaintenance}
                  onRepairData={handleRepairUsers}
                  onClearLogs={() => toast.info('No disponible temporalmente')}
                />
             </div>
          {/if}
        </div>
        {/each}
      {/if}
    </div>
  </main>
</div>

  <!-- User Detail Modal (Heavy Refactor) -->
  {#if showEditModal && selectedUser}
    <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/90 backdrop-blur-md" transition:fade>
      <div 
        class="bg-zinc-950 w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[3rem] border-t sm:border border-white/10 shadow-3xl overflow-hidden relative max-h-[90vh] overflow-y-auto"
        transition:fly={{ y: 100, duration: 400 }}
      >
        <!-- Modal Header -->
        <div class="sticky top-0 z-10 px-6 sm:px-10 py-6 sm:py-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center text-violet-400 border border-white/10">
              <UserCircle class="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <h3 class="text-lg sm:text-2xl font-black font-display uppercase italic text-white leading-none">{$t('admin.modal.command_manager')}</h3>
              <p class="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2 truncate max-w-[150px] sm:max-w-none">{selectedUser?.email}</p>
            </div>
          </div>
          <button 
            onclick={() => showEditModal = false}
            class="p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all cursor-pointer text-white"
          >
            <X weight="bold" class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div class="p-6 sm:p-10 space-y-8 sm:space-y-10">
           <!-- Entity Counts -->
           <div class="grid grid-cols-3 gap-3 sm:gap-6">
              {#each [
                { label: $t('admin.stats.schools'), val: userDetails?.schools || 0 },
                { label: $t('admin.stats.classes'), val: userDetails?.classes || 0 },
                { label: $t('admin.stats.students'), val: userDetails?.students || 0 }
              ] as ent}
                <div class="bg-black/40 border border-white/5 p-4 sm:p-6 rounded-[1.5rem] text-center">
                  <p class="text-[7px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 truncate">{ent.label}</p>
                  {#if isLoadingDetails}
                    <div class="h-6 sm:h-8 w-10 sm:w-12 bg-white/5 animate-pulse mx-auto rounded-lg"></div>
                  {:else}
                    <span class="text-xl sm:text-3xl font-black font-display italic text-white leading-none">{ent.val}</span>
                  {/if}
                </div>
              {/each}
           </div>

           <!-- Premium Commands -->
           <div class="space-y-4">
              <div class="flex items-center gap-3 mb-2">
                <Crown weight="duotone" class="w-5 h-5 text-amber-500" />
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{$t('admin.modal.subscription_control')}</p>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {#each [3, 7, 30, 365] as days}
                   <button 
                    onclick={() => handleGrantPremium(selectedUser?.id, days)}
                    disabled={isSaving}
                    class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-white/5 border border-white/10 hover:bg-primary-500/10 hover:text-primary-400 hover:border-primary-500/30 disabled:opacity-50 text-white cursor-pointer"
                   >
                    {days === 365 ? $t('admin.modal.one_year') : $t('admin.users.days', { n: days })}
                   </button>
                 {/each}
              </div>
              {#if getPlanStatus(selectedUser) === 'pro'}
                 <button 
                  onclick={() => handleRevokePremium(selectedUser?.id)}
                  class="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all mt-2 cursor-pointer shadow-lg shadow-red-500/5"
                 >
                  {$t('admin.modal.revoke_privileges')}
                 </button>
              {/if}
           </div>

           <!-- Badge Command -->
           <div class="space-y-4">
              <div class="flex items-center gap-3 mb-2">
                <Star weight="duotone" class="w-5 h-5 text-violet-500" />
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{$t('admin.modal.award_insignias')}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                {#each INSIGNIAS as badge}
                   {@const isOwned = userInsignias.some(ui => ui.id === badge.id)}
                   <button 
                    onclick={() => isOwned ? handleRevokeInsignia(badge.id) : handleAwardInsignia(badge.id)}
                    class="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all {isOwned ? 'bg-violet-500 border-violet-400 text-white shadow-lg shadow-violet-500/20' : 'bg-black/20 border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300'} cursor-pointer"
                   >
                    <badge.icon weight="fill" class="w-4 h-4" />
                    <span class="text-[10px] font-black uppercase tracking-widest">{$t(badge.titleKey)}</span>
                   </button>
                {/each}
              </div>
           </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Premium Mobile Navigation for Admins -->
  <div 
    class="lg:hidden fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[450px] z-[100] pb-[env(safe-area-inset-bottom)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer overflow-hidden {isNavVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-75 opacity-30 blur-[2px]'}"
    onclick={() => isNavVisible = true}
    role="button"
    tabindex="0"
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') isNavVisible = true; }}
  >
    <div class="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 p-2 sm:p-2.5 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] flex items-center justify-between">
      {#each [
        { id: 'dashboard', icon: SquaresFour, label: 'Dash' },
        { id: 'users', icon: Users, label: 'Users' }
      ] as item}
        {@const Icon = item.icon}
        <button 
          onclick={() => activeTab = item.id}
          class="flex flex-col items-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl transition-all {activeTab === item.id ? 'text-violet-400' : 'text-zinc-500'}"
        >
          <Icon weight={activeTab === item.id ? 'fill' : 'bold'} size={20} class="sm:w-[22px] sm:h-[22px]" />
          <span class="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
        </button>
      {/each}

      <!-- Center Support Ticket Spotlight (Amber) -->
      <button 
        onclick={() => activeTab = 'tickets'}
        class="relative group active:scale-95 transition-all -translate-y-4 sm:-translate-y-5"
      >
        <div class="absolute -inset-4 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all"></div>
        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(245,158,11,0.5)] border-4 border-zinc-950 group-hover:rotate-12 transition-all">
          <Lifebuoy weight="fill" size={24} class="sm:w-[28px] sm:h-[28px] text-zinc-950" />
          {#if supportTickets.filter(t => t.status === 'open').length > 0}
            <div class="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white border-2 border-zinc-950 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-black">
              {supportTickets.filter(t => t.status === 'open').length}
            </div>
          {/if}
        </div>
      </button>

      {#each [
        { id: 'lobby', icon: ChatTeardropDots, label: 'Hub' },
        { id: 'system', icon: Gear, label: 'System' }
      ] as item}
        {@const Icon = item.icon}
        <button 
          onclick={() => activeTab = item.id}
          class="flex flex-col items-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl transition-all {activeTab === item.id ? 'text-violet-400' : 'text-zinc-500'}"
        >
          <Icon weight={activeTab === item.id ? 'fill' : 'bold'} size={20} class="sm:w-[22px] sm:h-[22px]" />
          <span class="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<UpdatePill />

<style>
  :global(.pointer-interactions) {
    cursor: pointer;
    user-select: none;
  }
</style>
