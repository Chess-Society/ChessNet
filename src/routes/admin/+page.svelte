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
  import { systemConfig } from '$lib/stores/configStore';
  
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
    Shield, 
    Warning,
    Megaphone,
    ChatCenteredDots,
    ListDashes,
    Coins,
    List,
    ChartBar
  } from 'phosphor-svelte';

  // Components
  import StatsGrid from '$lib/components/admin/StatsGrid.svelte';
  import UserTable from '$lib/components/admin/UserTable.svelte';
  import SystemConsole from '$lib/components/admin/SystemConsole.svelte';
  import LiveActivityFeed from '$lib/components/admin/LiveActivityFeed.svelte';

  import UpdatePill from '$lib/components/common/UpdatePill.svelte';

  import BroadcastCenter from '$lib/components/admin/BroadcastCenter.svelte';
  import DangerZone from '$lib/components/admin/DangerZone.svelte';

  // --- State (Svelte 5) ---
  let activeTab = $state('dashboard');
  let stats = $state({
    totalUsers: 0,
    totalStudents: 0,
    totalSchools: 0,
    totalClasses: 0,
    premiumUsers: 0,
    recentUsers: 0,
    totalRevenue: 0,
    activeSessions: 0,
    serverLoad: 0
  });

  let users = $state<any[]>([]);
  let systemLogs = $state<any[]>([]);
  let activities = $state<any[]>([]);
  let isLoading = $state(true);
  let isSaving = $state(false);
  let isSidebarOpen = $state(false); // Mobile sidebar state
  let searchTimeout: any;

  const navigationGroups = [
    {
      title: 'MONITOR',
      items: [
        { id: 'dashboard', label: 'Consola Central', icon: SquaresFour },
        { id: 'system', label: 'Logs del Sistema', icon: ListDashes }
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { id: 'users', label: 'Usuarios', icon: Users }
      ]
    },
    {
      title: 'COMUNICACIÓN',
      items: [
        { id: 'broadcast', label: 'Avisos Globales', icon: Globe }
      ]
    },
    {
      title: 'MOTOR',
      items: [
        { id: 'danger', label: 'Zona Crítica', icon: Warning }
      ]
    }
  ];

  // Derive activities from logs and users
  $effect(() => {
    const rawLogs = systemLogs.map(l => {
      return {
        id: l.id,
        type: 'system_log',
        title: (l.type || l.action),
        subtitle: typeof l.details === 'string' ? l.details : JSON.stringify(l.details),
        timestamp: l.timestamp,
        status: (l.status || 'info')
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
      // maintenanceMode is now handled by systemConfig store
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

    unsubscribes.push(usersUnsub, logsUnsub);
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
      const details = await adminApi.getUserDetails(user.id);
      userDetails = details;
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
    const next = !$systemConfig.maintenanceMode;
    isSaving = true;
    try {
      await adminApi.toggleMaintenanceMode(next);
      toast.success($t('admin.system.maintenance_toggle_success'));
    } catch (e) {
      toast.error($t('admin.broadcast.error'));
    } finally {
      isSaving = false;
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

  function getPlanStatus(user: any) {
    return (user.settings?.plan === 'premium' || user.settings?.plan === 'pro') ? 'pro' : 'free';
  }
</script>

<div class="min-w-[320px] min-h-screen bg-[#02040a] text-white selection:bg-violet-500/30 font-sans flex flex-col lg:flex-row w-full overflow-x-hidden">
  <!-- Desktop Sidebar -->
  <aside class="w-[280px] border-r border-white/5 hidden lg:flex flex-col bg-[#02040a]/80 backdrop-blur-3xl relative z-50">
    <!-- Sidebar Header -->
    <div class="px-10 py-12">
      <button 
        type="button"
        class="w-full flex items-center gap-4 group cursor-pointer bg-transparent border-none p-0 text-left" 
        onclick={() => activeTab = 'dashboard'}
      >
        <div class="w-12 h-12 bg-white flex items-center justify-center transition-transform group-hover:scale-105">
          <SquaresFour weight="fill" size={24} class="text-black" />
        </div>
        <div>
          <h1 class="text-lg font-black font-display uppercase italic tracking-tighter text-white leading-none">ADMIN_OS</h1>
          <p class="text-[8px] font-mono font-black text-primary-500 uppercase tracking-widest mt-1 animate-pulse">SISTEMA_ACTIVO</p>
        </div>
      </button>
    </div>

    <!-- Navigation Groups -->
    <nav class="flex-1 px-8 space-y-12 overflow-y-auto custom-scrollbar pb-10">
      {#each navigationGroups as group}
        <div class="space-y-4">
          <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-[0.3em] px-4">{group.title}</p>
          <div class="space-y-1">
            {#each group.items as item}
              {@const Icon = item.icon}
              <button 
                onclick={() => activeTab = item.id}
                class="w-full flex items-center gap-4 py-3.5 px-4 transition-all relative group/nav {activeTab === item.id ? 'bg-primary-500/5 text-primary-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}"
              >
                {#if activeTab === item.id}
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" transition:slide={{ axis: 'y' }}></div>
                {/if}
                <Icon weight={activeTab === item.id ? 'fill' : 'bold'} size={18} />
                <span class="text-[10px] font-mono font-black uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-8 border-t border-white/5 bg-black/20">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
        <span class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">SERVIDOR: OK_STABLE</span>
      </div>
      <button 
        onclick={() => window.location.href = '/panel'}
        class="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all"
      >
        SALIR_AL_PANEL
        <ArrowArcLeft weight="bold" size={14} />
      </button>
    </div>
  </aside>

  <!-- Mobile Header -->
  <header class="lg:hidden h-16 bg-[#02040a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-[60] w-full">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-white flex items-center justify-center">
        <SquaresFour weight="fill" size={18} class="text-black" />
      </div>
      <span class="text-xs font-mono font-black text-white uppercase tracking-widest">ADMIN_OS</span>
    </div>

    <div class="flex items-center gap-4">
      <button 
        onclick={() => window.location.href = '/panel'}
        class="px-4 py-2 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-black transition-all"
      >
        SALIR
      </button>
      
      <button 
        onclick={() => isSidebarOpen = !isSidebarOpen}
        class="p-2 text-white hover:bg-white/5 transition-colors"
      >
        <List size={24} />
      </button>
    </div>
  </header>

  <!-- Mobile Navigation Drawer -->
  {#if isSidebarOpen}
    <div 
      class="fixed inset-0 z-[70] lg:hidden"
      transition:fade={{ duration: 200 }}
    >
      <button 
        type="button"
        class="absolute inset-0 bg-black/80 backdrop-blur-sm w-full h-full border-none cursor-default" 
        onclick={() => isSidebarOpen = false}
        aria-label="Cerrar navegación"
      ></button>
      <div 
        class="absolute left-0 top-0 bottom-0 w-[300px] bg-[#02040a] border-r border-white/10 flex flex-col shadow-2xl"
        transition:fly={{ x: -300, duration: 400, opacity: 1, easing: (t) => t }}
      >
        <!-- Drawer Header -->
        <div class="p-8 border-b border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-white flex items-center justify-center">
              <SquaresFour weight="fill" size={18} class="text-black" />
            </div>
            <span class="text-[10px] font-mono font-black text-white uppercase tracking-widest">ADMIN_MENU</span>
          </div>
          <button onclick={() => isSidebarOpen = false} class="text-slate-500 hover:text-white transition-colors">
            <X size={20} weight="bold" />
          </button>
        </div>

        <!-- Drawer Content -->
        <nav class="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {#each navigationGroups as group}
            <div class="space-y-4">
              <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-[0.3em]">{group.title}</p>
              <div class="space-y-1">
                {#each group.items as item}
                  {@const Icon = item.icon}
                  <button 
                    onclick={() => { activeTab = item.id; isSidebarOpen = false; }}
                    class="w-full flex items-center gap-4 py-3.5 px-4 transition-all relative {activeTab === item.id ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}"
                  >
                    <Icon weight={activeTab === item.id ? 'fill' : 'bold'} size={18} />
                    <span class="text-[10px] font-mono font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </nav>

        <!-- Drawer Footer -->
        <div class="p-8 border-t border-white/5 bg-white/[0.02]">
          <button 
            onclick={() => window.location.href = '/panel'}
            class="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-slate-400"
          >
            SALIR_AL_PANEL
            <ArrowArcLeft weight="bold" size={14} />
          </button>
        </div>
      </div>
    </div>
  {/if}

    <!-- Main Content Area -->
    <main class="flex-1 p-6 sm:p-8 md:p-12 max-w-[1600px] mx-auto w-full overflow-x-hidden min-h-[calc(100vh-57px-var(--banner-height,0px))] relative pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-12">
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
                  <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                    <div class="space-y-4">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white text-black flex items-center justify-center font-display italic font-black text-xl sm:text-2xl">
                          01
                        </div>
                        <div>
                          <div class="inline-flex items-center gap-2 px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-[8px] font-mono font-black text-violet-400 uppercase tracking-[0.3em]">
                            <span class="w-1 h-1 bg-violet-500 animate-pulse"></span>
                            {$t('admin.dashboard.sync')}
                          </div>
                          <h2 class="text-4xl sm:text-5xl md:text-7xl font-black font-display uppercase italic tracking-[-0.05em] leading-[0.8] mt-2">
                            CENTRAL<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">OPERACIONES</span>
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <button 
                        onclick={refreshStats} 
                        class="h-14 px-8 bg-white hover:bg-violet-500 hover:text-white text-black transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest group rounded-none"
                      >
                        <Pulse class="w-5 h-5 group-hover:animate-pulse" />
                        {$t('admin.dashboard.refresh')}
                      </button>
                    </div>
                  </div>


                  
                  <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
                      <!-- Monitoring Feed -->
                      <div class="xl:col-span-8 space-y-8">
                         <StatsGrid {stats} />
                         
                         <!-- Recent Activity Preview -->
                         <div class="bg-black/40 border border-white/5 p-8">
                            <div class="flex items-center justify-between mb-6">
                               <div class="flex items-center gap-3">
                                 <ChartBar weight="fill" class="text-primary-500" />
                                 <h3 class="text-xs font-mono font-black uppercase tracking-[0.3em] text-white">ÚLTIMA ACTIVIDAD</h3>
                               </div>
                               <button onclick={() => activeTab = 'system'} class="text-[8px] font-mono text-primary-400 uppercase tracking-widest hover:underline">Ver todos los logs</button>
                            </div>
                            <LiveActivityFeed activities={activities.slice(0, 10)} />
                         </div>
                      </div>

                     <!-- Environment Info -->
                     <div class="xl:col-span-4 space-y-8">
                        <div class="bg-zinc-900/40 border border-white/5 p-6">
                           <div class="flex items-center justify-between mb-4">
                              <h4 class="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">ESTADO_ENTORNO</h4>
                              <span class="text-[8px] font-black bg-emerald-500 px-1.5 py-0.5 text-black">ONLINE</span>
                           </div>
                           <div class="space-y-4">
                             <div class="flex justify-between text-[10px] font-mono font-black">
                               <span class="text-slate-700">VERSION</span>
                               <span class="text-slate-400">v1.2.0-STABLE</span>
                             </div>
                             <div class="flex justify-between text-[10px] font-mono font-black">
                               <span class="text-slate-700">MANTENIMIENTO</span>
                               <span class="{$systemConfig.maintenanceMode ? 'text-red-500' : 'text-emerald-500'} italic">
                                 {$systemConfig.maintenanceMode ? 'ACTIVO' : 'INACTIVO'}
                               </span>
                             </div>
                             <div class="flex justify-between text-[10px] font-mono font-black">
                               <span class="text-slate-700">REGIÓN</span>
                               <span class="text-slate-400 italic">eu-west-3</span>
                             </div>
                           </div>
                        </div>

                        <div class="p-6 bg-primary-500/5 border border-primary-500/20">
                          <p class="text-[8px] font-mono font-black text-primary-400 uppercase tracking-widest mb-2">REVENUE ESTIMADO</p>
                          <p class="text-2xl font-black font-display italic text-white">${(stats.totalRevenue ?? 0).toLocaleString()}</p>
                          <div class="mt-4 pt-4 border-t border-primary-500/10">
                            <p class="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest mb-1">CONVERSIÓN PREMIUM</p>
                            <p class="text-lg font-black font-display italic text-primary-300">
                              {((stats.premiumUsers / (stats.totalUsers || 1)) * 100).toFixed(1)}%
                            </p>
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
            {:else if activeTab === 'system'}
               <div class="space-y-12">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
                      06
                    </div>
                    <div>
                       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">{$t('admin.system.engine')}</h2>
                       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                         <span class="w-1.5 h-1.5 bg-violet-500 rounded-none animate-pulse"></span>
                         {$t('admin.system.engine_desc')}
                       </p>
                    </div>
                  </div>
                  
                   <!-- Production Status Console -->
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="p-6 bg-white/[0.02] border border-white/5">
                        <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">CORE_ENGINE_STATUS</p>
                        <div class="flex items-center gap-3">
                           <div class="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse"></div>
                           <p class="text-xl font-black font-display italic text-white uppercase">Operational</p>
                        </div>
                      </div>
                      <div class="p-6 bg-white/[0.02] border border-white/5">
                        <p class="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">NETWORK_RELIABILITY</p>
                        <p class="text-xl font-black font-display italic text-violet-400 uppercase">99.99% Guaranteed</p>
                      </div>
                   </div>
                  
                   <SystemConsole 
                    logs={systemLogs}
                    maintenanceMode={$systemConfig.maintenanceMode}
                    onToggleMaintenance={handleToggleMaintenance}
                    onRepairData={handleRepairUsers}
                    onClearLogs={() => systemLogs = []}
                  />
               </div>

            {:else if activeTab === 'broadcast'}
               <div class="space-y-12">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-white text-black flex items-center justify-center font-display italic font-black text-3xl">
                      04
                    </div>
                    <div>
                       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">{$t('admin.broadcast.title')}</h2>
                       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                         <span class="w-1.5 h-1.5 bg-primary-500 rounded-none animate-pulse"></span>
                         ENVÍO DE COMUNICACIONES GLOBALES
                       </p>
                    </div>
                  </div>
                  
                  <BroadcastCenter />
               </div>

            {:else if activeTab === 'danger'}
               <div class="space-y-12">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-red-600 text-white flex items-center justify-center font-display italic font-black text-3xl">
                      !!
                    </div>
                    <div>
                       <h2 class="text-5xl font-black font-display uppercase italic tracking-tighter text-white leading-none">ZONA CRÍTICA</h2>
                       <p class="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                         <span class="w-1.5 h-1.5 bg-red-500 rounded-none animate-bounce"></span>
                         OPERACIONES DE ALTO RIESGO
                       </p>
                    </div>
                  </div>

                  <DangerZone 
                    onRepairIntegrity={handleRepairUsers}
                    onToggleMaintenance={handleToggleMaintenance}
                    maintenanceMode={$systemConfig.maintenanceMode}
                    {isSaving}
                  />
               </div>
            {/if}
          </div>
          {/each}
        {/if}
      </div>
    </main>
  </div>



  <!-- User Detail Modal -->
  {#if showEditModal && selectedUser}
    <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/95 backdrop-blur-xl" transition:fade>
      <div 
        class="bg-[#02040a] w-full max-w-2xl border-t sm:border border-white/10 shadow-2xl overflow-hidden relative h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto rounded-none"
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
        </div>
      </div>
    </div>
  {/if}

  <!-- Premium Mobile Navigation -->
  <div 
    class="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pb-[env(safe-area-inset-bottom)] bg-[#02040a]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
  >
    <div class="flex items-stretch h-20">
      {#each [
        { id: 'dashboard', icon: SquaresFour, label: 'Dash' },
        { id: 'users', icon: Users, label: 'User' },
        { id: 'system', icon: Gear, label: 'Sys' },
        { id: 'exit', icon: ArrowArcLeft, label: 'Exit' }
      ] as item}
        {@const Icon = item.icon}
        <button 
          onclick={() => {
            if (item.id === 'exit') {
              window.location.href = '/panel';
            } else {
              activeTab = item.id;
            }
          }}
          class="flex-1 flex flex-col items-center justify-center gap-1.5 transition-all relative {activeTab === item.id ? 'text-primary-400 bg-primary-500/5' : 'text-slate-600'}"
        >
          {#if activeTab === item.id}
            <div class="absolute top-0 left-0 right-0 h-1 bg-primary-500" in:fade></div>
          {/if}
          
          <div class="relative">
            <Icon weight={activeTab === item.id ? 'fill' : 'bold'} size={24} />
          </div>
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

  .custom-scrollbar::-webkit-scrollbar {
    width: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }
</style>

