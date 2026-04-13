<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { db, auth } from '$lib/firebase';
  import { collection, query, onSnapshot, orderBy, limit, doc, updateDoc, setDoc, getDoc, addDoc } from 'firebase/firestore';
  import { user as authUser, loading as authLoading } from '$lib/stores/auth';
  import { fade, slide, scale } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { 
    Settings, UserCheck, Clock, ShieldCheck, Mail, LogOut, 
    ChevronRight, Edit3, Trophy, BarChart3, Users, Bell, 
    Shield, Target, Zap, Activity, Filter, Search, MoreHorizontal
  } from 'lucide-svelte';
  import { adminApi } from '$lib/api/admin';
  import { ADMIN_EMAILS } from '$lib/constants';
  import StripeSimulator from '$lib/components/StripeSimulator.svelte';

  let { data }: { data: any } = $props();

  
  // Estado de Navegación
  let activeTab = $state<'dashboard' | 'users' | 'announcements' | 'system'>('dashboard');

  // Estado de Datos
  let users = $state<any[]>([]);
  let globalStats = $state<{
    totalUsers: number,
    totalStudents: number,
    totalSchools: number,
    totalClasses: number,
    premiumUsers: number,
    recentUsers: number
  }>({ totalUsers: 0, totalStudents: 0, totalSchools: 0, totalClasses: 0, premiumUsers: 0, recentUsers: 0 });

  let announcements = $state<any[]>([]);
  let systemLogs = $state<any[]>([]);
  let maintenanceMode = $state(false);
  let userSearchTerm = $state('');


  let isLoading = $state(true);
  let isSuperAdmin = $derived($authUser?.email?.toLowerCase() === "andreslgumuzio@gmail.com");
  let isAuthorized = $derived(data.isAdmin || isSuperAdmin);
  let error = $state('');

  // Modales y Edición
  let selectedUser = $state<any>(null);
  let showEditModal = $state(false);
  let isSaving = $state(false);

  // Anuncios
  let announcementForm = $state({
    title: '',
    content: '',
    type: 'general' as any,
    priority: 'normal' as any
  });

  onMount(async () => {
    console.log('🚀 [Admin] onMount - isAuthorized:', isAuthorized);
    
    // Safety timeout: 5s
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [Admin] Loading timeout hit. Forcing UI display.');
        isLoading = false;
        error = 'La carga de datos está tardando demasiado. Verifique su conexión y permisos.';
      }
    }, 5000);

    if (isAuthorized) {
      isLoading = true;
      try {
        console.log('📊 [Admin] Fetching stats...');
        const stats = await adminApi.getGlobalStats();
        console.log('✅ [Admin] Stats received:', stats);
        globalStats = stats;
        
        console.log('🔧 [Admin] Fetching maintenance status...');
        const config = await adminApi.getMaintenanceStatus();
        maintenanceMode = config.maintenanceMode;

        console.log('📡 [Admin] Starting monitoring...');
        startMonitoring();
      } catch (err: any) {
        console.error('❌ [Admin] Error loading initial data:', err);
        error = err.message || 'Error desconocido al cargar datos.';
      } finally {
        console.log('🏁 [Admin] Loading finished.');
        clearTimeout(timeout);
        isLoading = false;
      }
    } else {
      console.warn('🚫 [Admin] Not authorized according to isAuthorized property.');
      clearTimeout(timeout);
      isLoading = false;
    }
  });

  $effect(() => {
    if (activeTab === 'users') {
      adminApi.getUsersList(100, userSearchTerm).then(data => users = data);
    }
    if (activeTab === 'announcements') {
      adminApi.getGlobalAnnouncements().then(data => announcements = data);
    }
    if (activeTab === 'system') {
      adminApi.getSystemLogs().then(data => systemLogs = data);
    }
  });

  function startMonitoring() {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const usersList: any[] = [];
        snapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        users = usersList;
      }, (err) => {
        console.error('❌ Error de Firestore:', err);
        error = 'Error de permisos en Firestore.';
      });
      return unsubscribe;
    } catch (err: any) {
        error = err.message;
    }
  }

  // Lógica de Suplantación (Impersonate)
  function handleImpersonate(userId: string) {
    if (!confirm('¿Entrar en modo suplantación para este usuario? Podrás ver su panel como si fueras él.')) return;
    document.cookie = `impersonate_id=${userId}; path=/; max-age=3600`;
    goto('/panel');
  }

  function handleStopImpersonation() {
    document.cookie = 'impersonate_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    location.reload();
  }

  async function handleSendAnnouncement() {
    if (!announcementForm.title || !announcementForm.content) return;
    isSaving = true;
    try {
      await addDoc(collection(db, 'announcements'), {
        ...announcementForm,
        is_global: true,
        is_published: true,
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        owner_id: $authUser?.uid // El admin es el dueño del anuncio
      });
      announcements = await adminApi.getGlobalAnnouncements();
      alert('Anuncio enviado correctamente');
      announcementForm = { title: '', content: '', type: 'general', priority: 'normal' };
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
       isSaving = false;
    }
  }

  async function handleDeleteAnnouncement(id: string) {
    if (!confirm('¿Eliminar este anuncio?')) return;
    try {
      await adminApi.deleteAnnouncement(id);
      announcements = announcements.filter(a => a.id !== id);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  }

  async function handleToggleMaintenance() {
    const next = !maintenanceMode;
    if (next && !confirm('¿Activar modo mantenimiento? Se bloqueará el acceso a todos los usuarios.')) return;
    try {
      await adminApi.toggleMaintenanceMode(next);
      maintenanceMode = next;
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  }

  // Gestión de Planes Premium
  async function handleGrantPremium(userId: string, days: number) {
    isSaving = true;
    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);
        
        const userDocRef = doc(db, 'users', userId);
        const appDataRef = doc(db, 'users', userId, 'appData', 'v1');

        const updatePayload = {
            'settings.plan': 'premium',
            'settings.planExpiresAt': expirationDate.toISOString(),
            'updatedAt': new Date().toISOString()
        };

        await updateDoc(userDocRef, updatePayload);
        
        const snap = await getDoc(appDataRef);
        if (snap.exists()) {
            await updateDoc(appDataRef, {
                'settings.plan': 'premium',
                'settings.planExpiresAt': expirationDate.toISOString()
            });
        }
        showEditModal = false;
        alert('Plan concedido con éxito');
    } catch (err: any) {
        alert('Error: ' + err.message);
    } finally {
        isSaving = false;
    }
  }

  async function handleRevokePremium(userId: string) {
    if (!confirm('¿Revocar suscripción premium?')) return;
    isSaving = true;
    try {
        const userDocRef = doc(db, 'users', userId);
        const appDataRef = doc(db, 'users', userId, 'appData', 'v1');

        await updateDoc(userDocRef, {
            'settings.plan': 'free',
            'settings.planExpiresAt': null
        });

        const snap = await getDoc(appDataRef);
        if (snap.exists()) {
            await updateDoc(appDataRef, {
                'settings.plan': 'free',
                'settings.planExpiresAt': null
            });
        }
        showEditModal = false;
        alert('Plan revocado');
    } catch (err: any) {
        alert('Error: ' + err.message);
    } finally {
        isSaving = false;
    }
  }

  function openEditModal(user: any) {
    selectedUser = user;
    showEditModal = true;
  }

  // Helpers existentes corregidos
  function formatDate(dateStr: any) {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch { return 'N/A'; }
  }

  function getPlanStatus(user: any) {
    return user?.settings?.plan || user?.config?.settings?.subscription?.plan || 'free';
  }
</script>

<svelte:head>
  <title>ChessNet | Centro de Mando Admin</title>
</svelte:head>

<div class="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30">
  
  <!-- Background Elements -->
  <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
  </div>
  <div class="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>

  {#if $authLoading || isLoading}
    <div class="flex flex-col items-center justify-center min-h-screen gap-6 relative z-10" in:fade>
      <Logo size="w-16 h-16" iconSize="w-8 h-8" />
      <div class="flex flex-col items-center gap-2">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <p class="text-slate-400 font-medium tracking-widest uppercase text-xs">Sincronizando Sistema...</p>
      </div>
    </div>
  {:else if !isAuthorized}
    <div class="flex flex-col items-center justify-center min-h-screen gap-4 relative z-10" in:fade>
      <div class="p-8 bg-[#1e293b]/80 backdrop-blur-2xl border border-red-500/20 rounded-3xl text-center shadow-2xl max-w-md">
        <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-black text-white mb-2 font-display">ACCESO DENEGADO</h2>
        <p class="text-slate-400 text-sm leading-relaxed mb-8">Esta área está reservada para el control central de la plataforma.</p>
        <button onclick={() => goto('/panel')} class="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all shadow-xl hover:scale-[1.02] active:scale-95">
          Volver al Panel Seguro
        </button>
      </div>
    </div>
  {:else}
    <div class="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10 relative z-10" in:fade>
      
      <!-- Top Navigation & Profile -->
      <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] shadow-2xl">
        <div class="flex items-center gap-6">
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-lg ring-4 ring-emerald-500/5">
            <Logo size="w-10 h-10" iconSize="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-3xl font-black tracking-tight text-white mb-1 font-display uppercase italic">COMMAND CENTER</h1>
            <div class="flex items-center gap-3">
                <span class="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    <Activity class="w-3 h-3" /> System Live
                </span>
                <span class="text-slate-500 text-xs font-medium uppercase tracking-widest hidden md:inline">Root Level Auth</span>
            </div>
          </div>
        </div>

        <nav class="flex flex-wrap items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
            {#each ['dashboard', 'users', 'announcements', 'system'] as tab}
                <button 
                    onclick={() => activeTab = tab as any}
                    class="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 {activeTab === tab ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}"
                >
                    {tab}
                </button>
            {/each}
        </nav>
      </header>

      {#if activeTab === 'dashboard'}
        <!-- Dashboard View -->
        <div class="space-y-10" in:fade>
            <!-- KPI Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-[#1e293b]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem] group hover:border-emerald-500/20 transition-all shadow-2xl relative overflow-hidden">
                    <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <Users class="w-40 h-40" />
                    </div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="p-3 bg-emerald-500/10 rounded-2xl">
                            <Users class="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Profesores</p>
                    <h3 class="text-5xl font-black text-white tabular-nums tracking-tighter">{globalStats.totalUsers}</h3>
                </div>

                <div class="bg-[#1e293b]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem] group hover:border-blue-500/20 transition-all shadow-2xl relative overflow-hidden">
                    <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <Target class="w-40 h-40" />
                    </div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="p-3 bg-blue-500/10 rounded-2xl">
                            <Target class="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Maestros Premium</p>
                    <h3 class="text-5xl font-black text-white tabular-nums tracking-tighter">{globalStats.premiumUsers}</h3>
                </div>

                <div class="bg-[#1e293b]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem] group hover:border-purple-500/20 transition-all shadow-2xl relative overflow-hidden">
                    <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <Logo size="w-40 h-40" />
                    </div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="p-3 bg-purple-500/10 rounded-2xl">
                            <Zap class="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Registros (7d)</p>
                    <h3 class="text-5xl font-black text-white tabular-nums tracking-tighter">{globalStats.recentUsers}</h3>
                </div>

                <div class="bg-[#1e293b]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem] group hover:border-amber-500/20 transition-all shadow-2xl relative overflow-hidden">
                    <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <Trophy class="w-40 h-40" />
                    </div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="p-3 bg-amber-500/10 rounded-2xl">
                            <Shield class="w-6 h-6 text-amber-500" />
                        </div>
                    </div>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Tasa Conversión</p>
                    <h3 class="text-5xl font-black text-white tabular-nums tracking-tighter">{globalStats.totalUsers > 0 ? ((globalStats.premiumUsers / globalStats.totalUsers) * 100).toFixed(1) : 0}%</h3>
                </div>
            </div>
        </div>
      {:else if activeTab === 'users'}
        <!-- Users CRM View -->
        <div class="space-y-6" in:fade>
            <!-- Search Bar -->
            <div class="flex items-center gap-4 bg-[#1e293b]/60 backdrop-blur-xl p-3 rounded-2xl border border-white/5 mb-6 shadow-xl">
                <Search class="w-5 h-5 text-slate-500 ml-3" />
                <input 
                    bind:value={userSearchTerm}
                    type="text" 
                    placeholder="Buscar profesor por email..." 
                    class="bg-transparent border-none focus:ring-0 text-sm text-white w-full py-1.5 placeholder:text-slate-600 font-bold"
                />
                {#if userSearchTerm}
                    <button onclick={() => userSearchTerm = ''} class="text-[10px] uppercase font-black text-slate-500 hover:text-white px-3 transition-colors">Limpiar</button>
                {/if}
            </div>

            <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-black/20 border-b border-white/5">
                                <th class="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Profesor / Email</th>
                                <th class="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan</th>
                                <th class="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Registro</th>
                                <th class="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                            {#each users as user}
                                <tr class="hover:bg-white/[0.02] transition-colors group">
                                    <td class="p-6">
                                        <div class="flex items-center gap-4">
                                            <div class="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-300">
                                                {user.email?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p class="font-bold text-sm tracking-tight">{user.email}</p>
                                                <p class="text-[9px] text-slate-500 font-mono tracking-tighter uppercase">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest {getPlanStatus(user) === 'premium' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-500/10 text-slate-500 border border-white/10'}">
                                            {getPlanStatus(user)}
                                        </span>
                                    </td>
                                    <td class="p-6 text-xs text-slate-400 font-medium">{formatDate(user.createdAt)}</td>
                                    <td class="p-6 text-right">
                                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onclick={() => handleImpersonate(user.id)}
                                                class="p-2.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl transition-all"
                                            >
                                                <LogOut class="w-4 h-4 rotate-180" />
                                            </button>
                                            <button 
                                                onclick={() => openEditModal(user)}
                                                class="p-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl transition-all"
                                            >
                                                <Edit3 class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      {:else if activeTab === 'announcements'}
        <!-- Announcements View -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" in:fade>
            <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                <h3 class="text-xl font-bold font-display uppercase italic tracking-wider mb-8">Lanzar Notificación Global</h3>
                <div class="space-y-6">
                    <input bind:value={announcementForm.title} type="text" placeholder="Título" class="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 transition-all" />
                    <textarea bind:value={announcementForm.content} rows="4" placeholder="Contenido..." class="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none"></textarea>
                    <button onclick={handleSendAnnouncement} disabled={isSaving} class="w-full py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-500/20 disabled:opacity-50">
                        {isSaving ? 'Enviando...' : 'Lanzar Anuncio'}
                    </button>
                </div>
            </div>

            <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <h3 class="text-xl font-bold font-display uppercase italic tracking-wider mb-8">Anuncios Activos</h3>
                <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {#each announcements as a}
                        <div class="p-5 bg-white/5 border border-white/10 rounded-2xl group transition-all hover:bg-white/[0.08]" in:slide>
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-1">
                                    <h4 class="font-bold text-sm">{a.title}</h4>
                                    <p class="text-xs text-slate-400 line-clamp-2">{a.content}</p>
                                    <p class="text-[9px] text-slate-500 uppercase tracking-tighter">{formatDate(a.created_at)}</p>
                                </div>
                                <button onclick={() => handleDeleteAnnouncement(a.id)} class="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                    <LogOut class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    {/each}
                    {#if announcements.length === 0}
                        <p class="text-center text-slate-500 py-10 text-sm italic">No hay anuncios globales activos.</p>
                    {/if}
                </div>
            </div>
        </div>
      {:else if activeTab === 'system'}
        <!-- System Controls View -->
        <div class="space-y-10" in:fade>
            <!-- Stripe Simulator -->
            <StripeSimulator />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Maintenance Control -->

                <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                    <div class="flex items-center gap-4 mb-2">
                        <div class="p-3 bg-red-500/10 rounded-2xl">
                            <Shield class="w-6 h-6 text-red-500" />
                        </div>
                        <h3 class="text-lg font-bold uppercase tracking-wider">Seguridad Global</h3>
                    </div>
                    <div class="space-y-4">
                        <p class="text-xs text-slate-400 leading-relaxed">Activar el modo mantenimiento bloqueará el acceso a todos los usuarios no administrativos de forma instantánea.</p>
                        <button 
                            onclick={handleToggleMaintenance}
                            class="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all {maintenanceMode ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-red-400 border border-red-500/20 hover:bg-red-500/10'}"
                        >
                            {maintenanceMode ? 'Desactivar Bloqueo' : 'Activar Mantenimiento'}
                        </button>
                    </div>
                </div>

                <!-- Stats Summary Sidebar -->
                <div class="lg:col-span-2 bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                    <div class="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 class="text-lg font-bold uppercase tracking-wider">Monitor de Actividad</h3>
                        <span class="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">Últimos Eventos</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="bg-black/10 border-b border-white/5">
                                    <th class="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Evento</th>
                                    <th class="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                                    <th class="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                {#each systemLogs as log}
                                    <tr class="hover:bg-white/[0.02] transition-colors">
                                        <td class="p-5">
                                            <p class="text-xs font-bold text-slate-300 capitalize">{log.type?.replace(/_/g, ' ') || log.action || 'Evento'}</p>
                                            <p class="text-[10px] text-slate-500 truncate max-w-xs">{typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}</p>
                                        </td>
                                        <td class="p-5 text-[10px] font-mono text-slate-500">{formatDate(log.timestamp)}</td>
                                        <td class="p-5">
                                            <span class="px-2 py-0.5 {log.status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'} text-[9px] font-bold rounded-lg uppercase tracking-tighter border">
                                                {log.status || 'Success'}
                                            </span>
                                        </td>
                                    </tr>
                                {/each}
                                {#if systemLogs.length === 0}
                                    <tr>
                                        <td colspan="3" class="p-10 text-center text-slate-500 text-xs italic">No hay logs recientes en el sistema.</td>
                                    </tr>
                                {/if}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      {/if}

    </div>

    <!-- Modal de Edición -->
    {#if showEditModal && selectedUser}
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" transition:fade>
            <div class="bg-[#1e293b] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden" transition:scale>
                <div class="p-8 border-b border-white/5 flex items-center justify-between bg-emerald-500/5">
                    <h3 class="text-xl font-black font-display uppercase italic tracking-wider">Gestión de Perfil</h3>
                    <button onclick={() => showEditModal = false} class="p-2 hover:bg-white/5 rounded-xl transition-all"><LogOut class="w-5 h-5 rotate-180" /></button>
                </div>
                <div class="p-8 space-y-8">
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick={() => handleGrantPremium(selectedUser.id, 7)} disabled={isSaving} class="px-4 py-4 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 border border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">7 Días</button>
                        <button onclick={() => handleGrantPremium(selectedUser.id, 30)} disabled={isSaving} class="px-4 py-4 bg-emerald-500 text-black border border-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">30 Días</button>
                    </div>
                    {#if getPlanStatus(selectedUser) === 'premium'}
                        <button onclick={() => handleRevokePremium(selectedUser.id)} disabled={isSaving} class="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Revocar Premium</button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
  {/if}

</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

  :global(body) {
    font-family: 'Inter', sans-serif;
  }

  .font-display {
    font-family: 'Outfit', sans-serif;
  }

  h1, h3, h4 {
    font-family: 'Outfit', sans-serif;
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
