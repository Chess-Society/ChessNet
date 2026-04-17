<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { db } from '$lib/firebase';
  import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    onSnapshot,
    where,
    doc,
    getDoc,
    getCountFromServer
  } from 'firebase/firestore';
  import { adminApi } from '$lib/api/admin';
  import { t } from '$lib/i18n';
  import { fade, slide, scale } from 'svelte/transition';
  import { toast } from '$lib/stores/toast';
  
  // Icons
  import { 
    Layout, 
    Users, 
    Megaphone, 
    ChatTeardropDots, 
    Gear, 
    SignOut,
    IdentificationBadge,
    X,
    UserCircle,
    Crown,
    Star,
    ArrowArcLeft,
    Pulse,
    CheckCircle
  } from 'phosphor-svelte';

  // Components
  import StatsGrid from '$lib/components/admin/StatsGrid.svelte';
  import UserTable from '$lib/components/admin/UserTable.svelte';
  import SystemConsole from '$lib/components/admin/SystemConsole.svelte';
  import LiveActivityFeed from '$lib/components/admin/LiveActivityFeed.svelte';
  import BroadcastCenter from '$lib/components/admin/BroadcastCenter.svelte';
  import StripeSimulator from '$lib/components/StripeSimulator.svelte';

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
    recentUsers: 0
  });

  let users = $state<any[]>([]);
  let systemLogs = $state<any[]>([]);
  let lobbySuggestions = $state<any[]>([]);
  let activities = $state<any[]>([]);
  let maintenanceMode = $state(false);
  let isLoading = $state(true);
  let isSaving = $state(false);
  let searchTimeout: any;

  // Derive activities from logs and users
  $effect(() => {
    const rawLogs = systemLogs.map(l => ({
      id: l.id,
      type: 'system_log',
      title: l.type || l.action,
      subtitle: typeof l.details === 'string' ? l.details : JSON.stringify(l.details),
      timestamp: l.timestamp,
      status: l.status || 'info'
    }));

    const rawUsers = users.slice(0, 5).map(u => ({
      id: u.id,
      type: 'user_joined',
      title: 'Nuevo Profesor Registrado',
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

  // Subscriptions Cleanup
  let unsubscribes: (() => void)[] = [];

  // --- Initialization ---

  onMount(async () => {
    try {
      // 1. Load initial maintenance status
      const config = await adminApi.getMaintenanceStatus();
      maintenanceMode = config.maintenanceMode;

      // 2. Start Real-time Listeners
      startRealTimeMonitoring();

      // 3. Load Stats (one-time or periodic)
      refreshStats();
      const statsInterval = setInterval(refreshStats, 60000);
      unsubscribes.push(() => clearInterval(statsInterval));
      
      isLoading = false;
    } catch (err) {
      console.error("Admin Init Error:", err);
      toast.error("Error al inicializar panel administrativo");
    }
  });

  onDestroy(() => {
    unsubscribes.forEach(unsub => unsub());
  });

  function startRealTimeMonitoring() {
    // Listen for Users (Limited to 100 for performance, searchable separately)
    const usersUnsub = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc"), limit(100)),
      (snap) => {
        users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      },
      (err) => console.error("Users Listener Error:", err)
    );

    // Listen for System Logs
    const logsUnsub = onSnapshot(
      query(collection(db, "system_logs"), orderBy("timestamp", "desc"), limit(50)),
      (snap) => {
        systemLogs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    );

    // Listen for Lobby Suggestions
    const lobbyUnsub = onSnapshot(
      query(collection(db, "lobby_suggestions"), orderBy("createdAt", "desc")),
      (snap) => {
        lobbySuggestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    );

    unsubscribes.push(usersUnsub, logsUnsub, lobbyUnsub);
  }

  async function refreshStats() {
    const s = await adminApi.getGlobalStats();
    stats = s;
  }

  // --- Actions ---

  async function handleSearchUsers(queryStr: string) {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(async () => {
      isLoading = true;
      try {
        const results = await adminApi.getUsersList(100, queryStr);
        users = results;
      } catch (e) {
        toast.error("Error en la búsqueda");
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
      toast.error("Error al cargar detalles");
    } finally {
      isLoadingDetails = false;
    }
  }

  async function handleGrantPremium(userId: string, days: number) {
    isSaving = true;
    try {
      await adminApi.grantTrial(userId, days);
      toast.success(`Premium concedido por ${days} días`);
      // No necesitamos refrescar la lista porque onSnapshot se encargará
    } catch (e) {
      toast.error("Error al conceder premium");
    } finally {
      isSaving = false;
    }
  }

  async function handleRevokePremium(userId: string) {
    if (!confirm("¿Estás seguro de revocar el acceso premium?")) return;
    isSaving = true;
    try {
      await adminApi.revokePremium(userId);
      toast.success("Acceso premium revocado");
    } catch (e: any) {
      toast.error(e.message || "Error al revocar");
    } finally {
      isSaving = false;
    }
  }

  async function handleToggleMaintenance() {
    const next = !maintenanceMode;
    maintenanceMode = next;
    try {
      await adminApi.toggleMaintenanceMode(next);
      toast.success(`Modo mantenimiento ${next ? 'activado' : 'desactivado'}`);
    } catch (e) {
      toast.error("Error al cambiar estado");
      maintenanceMode = !next;
    }
  }

  async function handleRepairUsers() {
    isSaving = true;
    try {
      const res = await adminApi.repairUsersData();
      toast.success(`Sincronización completada: ${res.count} usuarios procesados.`);
    } catch (e) {
      toast.error("Error en sincronización");
    } finally {
      isSaving = false;
    }
  }

  async function handleUpdateSuggestionStatus(id: string, status: string) {
    try {
      await adminApi.updateSuggestionStatus(id, status);
      toast.success("Estado actualizado");
    } catch (e) {
      toast.error("Error al actualizar");
    }
  }

  async function handleDeleteSuggestion(id: string) {
    if (!confirm("¿Eliminar sugerencia permanentemente?")) return;
    try {
      await adminApi.deleteSuggestion(id);
      toast.success("Sugerencia eliminada");
    } catch (e) {
      toast.error("Error al eliminar");
    }
  }

  async function handleImpersonate(user: any) {
    if (!confirm(`¿Deseas entrar en la cuenta de ${user.email}?`)) return;
    
    try {
      // Set the impersonation cookie via api call or similar
      // For now, we use a simple approach: navigate to a handler or set directly if possible
      document.cookie = `impersonate_id=${user.id}; path=/; max-age=3600; SameSite=Lax`;
      document.cookie = `impersonate_email=${user.email}; path=/; max-age=3600; SameSite=Lax`;
      
      toast.success(`Iniciando suplantación de ${user.email}...`);
      setTimeout(() => {
        window.location.href = `/panel/dashboard`;
      }, 1000);
    } catch (e) {
      toast.error("Error al iniciar suplantación");
    }
  }

  async function handleAwardInsignia(insigniaId: string) {
    if (!selectedUser) return;
    try {
      await adminApi.awardInsignia(selectedUser.id, insigniaId);
      userInsignias = await adminApi.getUserInsignias(selectedUser.id);
      toast.success("Insignia concedida");
    } catch (e) {
      toast.error("Error al conceder insignia");
    }
  }

  async function handleRevokeInsignia(insigniaId: string) {
    if (!selectedUser) return;
    try {
      await adminApi.revokeInsignia(selectedUser.id, insigniaId);
      userInsignias = await adminApi.getUserInsignias(selectedUser.id);
      toast.success("Insignia revocada");
    } catch (e) {
      toast.error("Error al revocar");
    }
  }

  function getPlanStatus(user: any) {
    return (user.settings?.plan === 'premium' || user.settings?.plan === 'pro') ? 'pro' : 'free';
  }
</script>

<div class="min-h-screen bg-[#020617] text-white selection:bg-primary-500/30">
  <!-- Top Navigation Bar -->
  <nav class="sticky top-0 z-[60] bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 py-6 px-8 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="p-3 bg-gradient-to-br from-primary-500 to-violet-600 rounded-2xl shadow-lg shadow-primary-500/20">
        <Layout weight="duotone" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 class="text-xl font-black font-display uppercase italic tracking-tighter leading-none">Admin Control Center</h1>
        <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">ChessNet Operational Interface v2.5</p>
      </div>
    </div>

    <div class="flex items-center gap-6">
      <div class="hidden md:flex flex-col items-end border-r border-white/5 pr-6 mr-6">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estado Sistema</span>
        <div class="flex items-center gap-2 mt-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[10px] font-bold text-emerald-400 uppercase">Operational</span>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <a 
          href="/panel/dashboard" 
          class="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all pointer-interactions"
        >
          <ArrowArcLeft weight="bold" class="w-4 h-4" />
          Salir Admin
        </a>
      </div>
    </div>
  </nav>

  <div class="flex">
    <!-- Sidebar Navigation -->
    <aside class="w-72 min-h-[calc(100vh-84px)] border-r border-white/5 bg-[#020617] p-8 space-y-8 hidden lg:block">
      <div>
        <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">Principal</p>
        <nav class="space-y-2">
          {#each [
            { id: 'dashboard', label: 'Dashboard', icon: Layout },
            { id: 'users', label: 'Profesores', icon: Users },
            { id: 'lobby', label: 'Community Hub', icon: ChatTeardropDots },
            { id: 'system', label: 'Sistema & Logs', icon: Gear }
          ] as item}
            <button 
              onclick={() => activeTab = item.id}
              class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all {activeTab === item.id ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}"
            >
              <item.icon weight={activeTab === item.id ? 'duotone' : 'bold'} class="w-5 h-5" />
              {item.label}
            </button>
          {/each}
        </nav>
      </div>

      <div class="pt-8 border-t border-white/5">
        <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">Accesos Rápidos</p>
        <div class="space-y-4">
           <div class="p-5 bg-white/5 rounded-[1.5rem] border border-white/5">
             <p class="text-[10px] font-bold text-slate-400 mb-2">DB HEALTH</p>
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
    <main class="flex-1 p-10 max-w-[1600px] mx-auto min-h-[calc(100vh-84px)] bg-[url('/noise.svg')] bg-repeat">
      {#if isLoading && users.length === 0}
         <div class="h-full flex items-center justify-center" in:fade>
           <div class="flex flex-col items-center gap-6">
              <div class="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
              <p class="text-xs font-black uppercase tracking-widest text-slate-500">Cargando Sistema Real-time...</p>
           </div>
         </div>
      {:else}
        <div in:fade={{ duration: 400 }}>
          {#if activeTab === 'dashboard'}
             <div class="space-y-12">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 class="text-4xl font-black font-display uppercase italic tracking-[ -0.05em] leading-[0.9]">Operational<br/><span class="text-primary-500">Overview</span></h2>
                    <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-4 flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Real-time Infrastructure Sync active
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                     <button onclick={refreshStats} class="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                        <Pulse class="w-4 h-4" />
                        Refresh Global Data
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
                           <h3 class="text-xl font-black font-display uppercase italic tracking-wider flex items-center gap-3">
                             <ShieldCheck weight="duotone" class="w-7 h-7 text-red-500" />
                             Critical Guard
                           </h3>
                           <div class="space-y-4">
                             <button 
                               onclick={handleToggleMaintenance}
                               class="w-full flex items-center justify-between p-6 rounded-3xl border {maintenanceMode ? 'bg-red-500 text-white border-red-400 shadow-xl shadow-red-500/20' : 'bg-black/20 border-white/5 text-slate-400 hover:border-white/20'} transition-all group/btn"
                             >
                               <div class="text-left">
                                 <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Maintenance Mode</p>
                                 <p class="text-sm font-bold uppercase italic">{maintenanceMode ? 'ACTIVE' : 'INACTIVE'}</p>
                               </div>
                               <Gear weight="fill" class="w-6 h-6 animate-spin-slow group-hover/btn:rotate-90 transition-transform" />
                             </button>
                             
                             <button 
                               onclick={handleRepairUsers}
                               class="w-full flex items-center justify-between p-6 rounded-3xl bg-black/40 border border-white/5 text-slate-400 hover:border-primary-500/30 hover:bg-primary-500/10 hover:text-primary-400 transition-all"
                             >
                                <div class="text-left">
                                  <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Database Integrity</p>
                                  <p class="text-sm font-bold uppercase italic">Sync & Repair</p>
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
                          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Environment Status</h4>
                          <span class="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[8px] font-black">STABLE</span>
                        </div>
                        <div class="space-y-4">
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-600 font-bold uppercase">Uptime</span>
                            <span class="text-white font-black italic">99.98%</span>
                          </div>
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-600 font-bold uppercase">CPU Load</span>
                            <span class="text-white font-black italic">12.4%</span>
                          </div>
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-600 font-bold uppercase">Region</span>
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
                  <h2 class="text-4xl font-black font-display uppercase italic tracking-tighter">Directorio de Profesores</h2>
                  <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                    Gestión total, suplantación y concesión de premium
                  </p>
               </div>

               <UserTable 
                  {users} 
                  onEdit={openUserDetails}
                  onImpersonate={handleImpersonate}
                  onSearch={handleSearchUsers}
               />
            </div>

          {:else if activeTab === 'lobby'}
             <div class="space-y-10">
               <div>
                  <h2 class="text-4xl font-black font-display uppercase italic tracking-tighter">Community Moderator</h2>
                  <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 italic">Feedback directo de la comunidad de profesores</p>
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
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black border border-white/10 uppercase">
                              {s.authorName?.[0] || 'A'}
                            </div>
                            <div>
                               <p class="text-[10px] font-black text-primary-400 uppercase tracking-widest">{s.authorName}</p>
                               <p class="text-[9px] text-slate-500 font-bold uppercase italic">{new Date(s.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <h4 class="text-xl font-black uppercase italic tracking-tight">{s.title}</h4>
                         <p class="text-sm text-slate-400 leading-relaxed font-medium">{s.content}</p>
                       </div>
                       
                       <div class="md:w-64 space-y-3">
                           <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Update Status</p>
                           <select 
                             value={s.status} 
                             onchange={(e) => handleUpdateSuggestionStatus(s.id, (e.target as HTMLSelectElement).value)}
                             class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase outline-none focus:border-primary-500 transition-all appearance-none text-slate-400"
                           >
                             <option value="pending">En Revisión</option>
                             <option value="planned">Planificado</option>
                             <option value="implemented">Completado</option>
                           </select>
                           <button 
                             onclick={() => handleDeleteSuggestion(s.id)}
                             class="w-full py-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                           >
                              Eliminar Sugerencia
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
                  <h2 class="text-4xl font-black font-display uppercase italic tracking-tighter">System Engine</h2>
                  <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Logs de operaciones y controles de infraestructura</p>
                </div>
                
                <StripeSimulator />
                
                <SystemConsole 
                  logs={systemLogs}
                  {maintenanceMode}
                  onToggleMaintenance={handleToggleMaintenance}
                  onRepairData={handleRepairUsers}
                  onClearLogs={() => toast('No disponible temporalmente')}
                />
             </div>
          {/if}
        </div>
      {/if}
    </main>
  </div>

  <!-- User Detail Modal (Heavy Refactor) -->
  {#if showEditModal && selectedUser}
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md" transition:fade>
      <div 
        class="bg-[#0f172a] w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden relative"
        transition:scale={{ start: 0.9, duration: 400 }}
      >
        <!-- Modal Header -->
        <div class="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary-500/10 to-transparent">
          <div class="flex items-center gap-6">
            <div class="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-primary-400 border border-white/10">
              <UserCircle class="w-10 h-10" />
            </div>
            <div>
              <h3 class="text-2xl font-black font-display uppercase italic text-white leading-none">Command Manager</h3>
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">{selectedUser?.email}</p>
            </div>
          </div>
          <button 
            onclick={() => showEditModal = false}
            class="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
          >
            <X weight="bold" class="w-6 h-6" />
          </button>
        </div>

        <div class="p-10 space-y-10">
           <!-- Entity Counts -->
           <div class="grid grid-cols-3 gap-6">
              {#each [
                { label: 'Escuelas', val: userDetails?.schools || 0 },
                { label: 'Clases', val: userDetails?.classes || 0 },
                { label: 'Alumnos', val: userDetails?.students || 0 }
              ] as ent}
                <div class="bg-black/40 border border-white/5 p-6 rounded-[1.5rem] text-center">
                  <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{ent.label}</p>
                  {#if isLoadingDetails}
                    <div class="h-8 w-12 bg-white/5 animate-pulse mx-auto rounded-lg"></div>
                  {:else}
                    <span class="text-3xl font-black font-display italic text-white">{ent.val}</span>
                  {/if}
                </div>
              {/each}
           </div>

           <!-- Premium Commands -->
           <div class="space-y-4">
              <div class="flex items-center gap-3 mb-2">
                <Crown weight="duotone" class="w-5 h-5 text-amber-500" />
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription Control</p>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {#each [3, 7, 30, 365] as days}
                   <button 
                    onclick={() => handleGrantPremium(selectedUser?.id, days)}
                    disabled={isSaving}
                    class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-white/5 border border-white/10 hover:bg-primary-500/10 hover:text-primary-400 hover:border-primary-500/30 disabled:opacity-50"
                   >
                    {days === 365 ? '1 Año' : `${days} Días`}
                   </button>
                 {/each}
              </div>
              {#if getPlanStatus(selectedUser) === 'pro'}
                 <button 
                  onclick={() => handleRevokePremium(selectedUser?.id)}
                  class="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all mt-2"
                 >
                  Revocar Todos los Privilegios
                 </button>
              {/if}
           </div>

           <!-- Badge Command -->
           <div class="space-y-4">
              <div class="flex items-center gap-3 mb-2">
                <Star weight="duotone" class="w-5 h-5 text-violet-500" />
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Award Insignias</p>
              </div>
              <div class="flex flex-wrap gap-2">
                {#each INSIGNIAS as badge}
                   {@const isOwned = userInsignias.some(ui => ui.id === badge.id)}
                   <button 
                    onclick={() => isOwned ? handleRevokeInsignia(badge.id) : handleAwardInsignia(badge.id)}
                    class="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all {isOwned ? 'bg-violet-500 border-violet-400 text-white shadow-lg shadow-violet-500/20' : 'bg-black/20 border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300'}"
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
</div>

<style>
  :global(.pointer-interactions) {
    cursor: pointer;
    user-select: none;
  }
</style>
