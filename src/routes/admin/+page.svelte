<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { db, auth } from "$lib/firebase";
  import {
    collection,
    query,
    onSnapshot,
    orderBy,
    limit,
    doc,
    updateDoc,
    setDoc,
    getDoc,
    addDoc,
  } from "firebase/firestore";
  import { user as authUser, loading as authLoading } from "$lib/stores/auth";
  import { fade, slide, scale } from "svelte/transition";
  import {
    Gear as Settings,
    UserCheck,
    CheckCircle,
    Clock,
    ShieldCheck,
    EnvelopeSimple as Mail,
    SignOut as LogOut,
    CaretRight,
    NotePencil as Edit3,
    Trophy,
    ChartLineUp as BarChart3,
    User as UserIcon,
    UserCircle,
    Users,
    Bell,
    Shield,
    Target,
    Lightning as Zap,
    Pulse as Activity,
    Funnel as Filter,
    MagnifyingGlass as Search,
    DotsThreeOutline as MoreHorizontal,
    ArrowLeft,
    Check,
    CurrencyDollar,
    Lightbulb,
    ChatCircleDots,
    Database,
    X,
    Star,
    Medal
  } from "phosphor-svelte";
  import { adminApi } from "$lib/api/admin";
  import { ADMIN_EMAILS } from "$lib/constants";
  import StripeSimulator from "$lib/components/StripeSimulator.svelte";
  import { t } from "$lib/i18n";
  import { uiStore } from "$lib/stores/uiStore";
  import { toast, showError } from "$lib/stores/toast";
  import { invalidateAll } from "$app/navigation";
  import Logo from "$lib/components/Logo.svelte";
  import { INSIGNIAS } from "$lib/constants/insignias";

  let { data }: { data: any } = $props();

  // Estado de Navegación
  let activeTab = $state<"dashboard" | "users" | "announcements" | "lobby" | "system">(
    "dashboard",
  );

  // Estado de Datos
  let users = $state<any[]>([]);
  let globalStats = $state<{
    totalUsers: number;
    totalStudents: number;
    totalSchools: number;
    totalClasses: number;
    premiumUsers: number;
    recentUsers: number;
  }>({
    totalUsers: 0,
    totalStudents: 0,
    totalSchools: 0,
    totalClasses: 0,
    premiumUsers: 0,
    recentUsers: 0,
  });

  let announcements = $state<any[]>([]);
  let systemLogs = $state<any[]>([]);
  let maintenanceMode = $state(false);
  let userSearchTerm = $state("");
  let lobbySuggestions = $state<any[]>([]);

  let isLoading = $state(true);
  let error = $state("");

  // Reactividad refinada
  let isAuthorized = $derived(
    data?.isAdmin ||
      ($authUser?.email &&
        ADMIN_EMAILS.includes($authUser.email.toLowerCase())),
  );

  // Modales y Edición
  let selectedUser = $state<any>(null);
  let userDetails = $state<any>(null);
  let userInsignias = $state<any[]>([]);
  let isLoadingDetails = $state(false);
  let showEditModal = $state(false);
  let isSaving = $state(false);

  // Anuncios
  let announcementForm = $state({
    title: "",
    content: "",
    type: "general" as any,
    priority: "normal" as any,
  });

  let unsubscribeUsers: (() => void) | null = null;

  async function loadData() {
    try {
      const stats = await adminApi.getGlobalStats();
      globalStats = stats;
      const config = await adminApi.getMaintenanceStatus();
      maintenanceMode = config.maintenanceMode;
    } catch (err: any) {
      showError(err);
    }
  }

  onMount(async () => {

    // Si ya sabemos que no está autorizado y el auth no está cargando, paramos aquí
    if (!$authLoading && !isAuthorized) {
      isLoading = false;
      return;
    }

    // Safety timeout: 10s
    const timeout = setTimeout(() => {
      if (isLoading) {
        isLoading = false;
        if (!isAuthorized)
          error = "No tiene permisos para acceder o la sesión ha expirado.";
      }
    }, 10000);

    if (isAuthorized) {
      isLoading = true;
      try {
        await loadData();
        const unsub = startMonitoring();
        if (unsub) unsubscribeUsers = unsub;
      } catch (err: any) {
        console.error("❌ [Admin] Error loading initial data:", err);
        error = err.message || "Error desconocido al cargar datos.";
      } finally {
        clearTimeout(timeout);
        isLoading = false;
      }
    } else {

      clearTimeout(timeout);
      isLoading = false;
    }
  });

  onDestroy(() => {
    if (unsubscribeUsers) {
      unsubscribeUsers();
    }
  });

  $effect(() => {
    if (activeTab === "users") {
      adminApi.getUsersList(100, userSearchTerm).then((data) => (users = data));
    }
    if (activeTab === "announcements") {
      adminApi.getGlobalAnnouncements().then((data) => (announcements = data));
    }
    if (activeTab === "system") {
      adminApi.getSystemLogs().then((data) => (systemLogs = data));
    }
    if (activeTab === "lobby") {
      adminApi.getLobbySuggestions().then((data) => (lobbySuggestions = data));
    }
  });

  function startMonitoring() {
    try {
      // Usamos email como orden predeterminado para asegurar que todos los usuarios sean visibles,
      // incluso si les falta el campo 'createdAt' (que causa que Firestore los ignore en un orderBy).
      // El administrador puede usar el botón "Reparar" para normalizar los datos.
      
      const q = query(
        collection(db, "users"),
        orderBy("email"),
        limit(100),
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const usersList: any[] = [];
          snapshot.forEach((doc) => {
            usersList.push({ id: doc.id, ...doc.data() });
          });
          users = usersList;
        },
        (err) => {
          console.error("❌ Error de Firestore:", err);
          error = "Error de permisos en Firestore.";
        },
      );
      return unsubscribe;
    } catch (err: any) {
      error = err.message;
    }
  }

  async function handleRepairUsers() {
    const confirmed = await uiStore.confirm({
      title: "Reparar Datos de Usuarios",
      message: "¿Deseas inicializar los campos faltantes (createdAt) en todos los usuarios registrados?",
      type: "warning"
    });
    
    if (!confirmed) return;
    
    isSaving = true;
    try {
      const result = await adminApi.repairUsersData();
      toast.success(`Se han reparado ${result.count} de ${result.total} usuarios.`);
      // No necesitamos recargar manualmente si el snapshot está activo,
      // pero como el query de snapshot filtra por createdAt, ahora sí deberían aparecer.
    } catch (err: any) {
      showError(err);
    } finally {
      isSaving = false;
    }
  }

  // Lógica de Suplantación (Impersonate)
  async function handleImpersonate(userId: string) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.users.impersonate'),
      message: $t('admin.confirm.impersonate'),
      type: 'warning'
    });
    if (!confirmed) return;
    document.cookie = `impersonate_id=${userId}; path=/; max-age=3600`;
    toast.success("Modo suplantación activado");
    goto("/panel");
  }

  function handleStopImpersonation() {
    document.cookie =
      "impersonate_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    location.reload();
  }

  async function handleSendAnnouncement() {
    if (!announcementForm.title || !announcementForm.content) return;
    isSaving = true;
    try {
      await addDoc(collection(db, "announcements"), {
        ...announcementForm,
        is_global: true,
        is_published: true,
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        owner_id: $authUser?.uid,
      });
      announcements = await adminApi.getGlobalAnnouncements();
      toast.success($t('admin.announcement_success'));
      announcementForm = {
        title: "",
        content: "",
        type: "general",
        priority: "normal",
      };
    } catch (err: any) {
      showError(err);
    } finally {
      isSaving = false;
    }
  }

  async function handleUpdateSuggestionStatus(id: string, status: string) {
    try {
      await adminApi.updateSuggestionStatus(id, status);
      lobbySuggestions = lobbySuggestions.map(s => s.id === id ? { ...s, status } : s);
      toast.success("Estado actualizado");
    } catch (err: any) {
      showError(err);
    }
  }

  async function handleDeleteAnnouncement(id: string) {
    const confirmed = await uiStore.confirm({
      title: $t('common.delete'),
      message: $t('admin.confirm.delete_announcement'),
      type: 'danger'
    });
    if (!confirmed) return;
    try {
      await adminApi.deleteAnnouncement(id);
      announcements = announcements.filter((a) => a.id !== id);
      toast.success($t('admin.announcement_success'));
    } catch (err: any) {
      showError(err);
    }
  }

  async function handleToggleMaintenance() {
    const next = !maintenanceMode;
    const confirmed = await uiStore.confirm({
      title: $t('admin.system.security'),
      message: $t('admin.confirm.toggle_maintenance'),
      type: 'warning'
    });
    if (!confirmed) return;
    try {
      await adminApi.toggleMaintenanceMode(next);
      maintenanceMode = next;
      toast.success($t('admin.maintenance_toggle_success'));
    } catch (err: any) {
      showError(err);
    }
  }

  // Gestión de Planes Premium
  async function handleOpenManage(user: any) {
    selectedUser = user;
    showEditModal = true;
    userDetails = null;
    userInsignias = [];
    isLoadingDetails = true;
    
    try {
      const [details, insignias] = await Promise.all([
        adminApi.getUserDetails(user.id),
        adminApi.getUserInsignias(user.id)
      ]);
      userDetails = details;
      userInsignias = insignias;
    } catch (e) {
      console.error("Error fetching user details:", e);
    } finally {
      isLoadingDetails = false;
    }
  }

  async function handleToggleInsignia(insigniaId: string) {
    if (!selectedUser) return;
    const isUnlocked = userInsignias.some(i => i.id === insigniaId);
    
    isSaving = true;
    try {
      if (isUnlocked) {
        await adminApi.revokeInsignia(selectedUser.id, insigniaId);
        userInsignias = userInsignias.filter(i => i.id !== insigniaId);
        toast.success("Insignia revocada con éxito");
      } else {
        await adminApi.awardInsignia(selectedUser.id, insigniaId);
        // Volvemos a cargar para tener el objeto completo si fuera necesario, 
        // o simplemente actualizamos el estado local
        userInsignias = [...userInsignias, { id: insigniaId, unlockedAt: new Date().toISOString() }];
        toast.success("Insignia concedida con éxito");
      }
    } catch (err: any) {
      showError(err);
    } finally {
      isSaving = false;
    }
  }

  async function handleToggleFeaturedAdmin(insigniaId: string) {
    if (!selectedUser) return;
    const currentFeatured = selectedUser.settings?.featuredInsignias || [];
    let nextFeatured: string[];
    
    if (currentFeatured.includes(insigniaId)) {
      nextFeatured = currentFeatured.filter((id: string) => id !== insigniaId);
    } else {
      if (currentFeatured.length >= 3) {
        toast.error("Máximo 3 insignias destacadas");
        return;
      }
      nextFeatured = [...currentFeatured, insigniaId];
    }

    isSaving = true;
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        "settings.featuredInsignias": nextFeatured
      });
      selectedUser.settings = { ...selectedUser.settings, featuredInsignias: nextFeatured };
      toast.success("Perfil actualizado");
    } catch (err: any) {
      showError(err);
    } finally {
      isSaving = false;
    }
  }

  async function handleGrantPremium(userId: string, days: number) {
    isSaving = true;
    try {
      await adminApi.grantTrial(userId, days);
      showEditModal = false;
      await loadData();
      toast.success($t('admin.users.grant_success'));
      await invalidateAll();
      // Pequeño delay para asegurar que Firestore se actualiza en el cliente
      await new Promise(r => setTimeout(r, 500));
    } catch (err: any) {
      showError(err);
    } finally {
      isSaving = false;
    }
  }

  async function handleRevokePremium(userId: string) {
    const confirmed = await uiStore.confirm({
      title: $t('admin.users.revoke_premium'),
      message: $t('admin.confirm.revoke_premium'),
      type: 'danger'
    });
    if (!confirmed) return;
    isSaving = true;
    try {
      await adminApi.revokePremium(userId);
      showEditModal = false;
      toast.success($t('admin.users.revoke_success'));
      await invalidateAll();
      await new Promise(r => setTimeout(r, 100));
    } catch (err: any) {
      showError(err);
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
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  }

  function getPlanStatus(user: any) {
    if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return "pro";
    
    // Prioridad absoluta al nuevo esquema de settings
    const plan = user?.settings?.plan || "free";
    
    // Si el nuevo esquema es free, pero tiene el viejo esquema como premium, 
    // lo mostramos como "legacy-pro" o similar para que el admin sepa que hay algo raro,
    // pero para simplicidad y dado que vamos a limpiar, sigamos con settings.plan como único origen.
    return plan === 'premium' ? 'pro' : plan;
  }
</script>

<svelte:head>
  <title>ChessNet | {$t('admin.title')}</title>
</svelte:head>

<div
  class="min-h-screen bg-bento-bg text-white font-sans selection:bg-primary-500/30"
>
  <!-- Background Elements -->
  <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    ></div>
  </div>
  <div
    class="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"
  ></div>

  {#if $authLoading || isLoading}
    <div
      class="flex flex-col items-center justify-center min-h-screen gap-6 relative z-10"
      in:fade
    >
      <Logo size="w-16 h-16" iconSize="w-8 h-8" />
      <div class="flex flex-col items-center gap-2">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"
        ></div>
        <p class="text-slate-400 font-medium tracking-widest uppercase text-xs">
          {$t('common.loading')}
        </p>
      </div>
    </div>
  {:else if !isAuthorized}
    <div
      class="flex flex-col items-center justify-center min-h-screen gap-4 relative z-10"
      in:fade
    >
      <div
        class="p-8 bg-[#1e293b]/80 backdrop-blur-2xl border border-red-500/20 rounded-3xl text-center shadow-2xl max-w-md"
      >
        <div
          class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ShieldCheck class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-black text-white mb-2 font-display uppercase">
          {$t('common.access_denied')}
        </h2>
        <p class="text-slate-400 text-sm leading-relaxed mb-8">
          {$t('admin.subtitle')}
        </p>
        <button
          onclick={() => goto("/panel")}
          class="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all shadow-xl hover:scale-[1.02] active:scale-95"
        >
          {$t('nav.goPanel')}
        </button>
      </div>
    </div>
  {:else}
    <div
      class="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10 relative z-10"
      in:fade
    >
      <header
        class="sticky top-4 z-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#16161e]/90 backdrop-blur-2xl border border-white/10 p-5 md:p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <!-- Glossy effect -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div class="flex items-center gap-6 relative">
          <div
            class="p-4 bg-violet-500/10 border border-violet-500/20 rounded-3xl shadow-xl shadow-violet-500/10 group-hover:scale-110 transition-transform duration-500"
          >
            <Logo size="w-10 h-10" iconSize="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-3 mb-1.5">
              <h1
                class="text-3xl font-outfit font-black tracking-tight text-white uppercase italic leading-none"
              >
                Control <span class="text-violet-500">Center</span>
              </h1>
              <span class="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/80 backdrop-blur-md border border-white/5 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-lg">
                V2.5.0
              </span>
            </div>
            <div class="flex items-center gap-4">
              <span
                class="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest"
              >
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                {$t('common.system_online')}
              </span>
              <span
                class="text-slate-500 text-[10px] font-outfit font-black uppercase tracking-[0.25em] hidden sm:inline opacity-60"
                >{$t('common.access_level')}: ADMIN <span class="text-violet-500">ROOT</span></span
              >
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row items-center gap-4 relative">
          <!-- Navigation Tabs - Scrollable on mobile -->
          <nav
            class="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner w-full md:w-auto overflow-x-auto no-scrollbar"
          >
            {#each [
              { id: "dashboard", label: $t('admin.dashboard'), icon: Activity },
              { id: "users", label: $t('admin.users'), icon: Users },
              { id: "announcements", label: $t('admin.announcements'), icon: Bell },
              { id: "lobby", label: "Lobby & Feedback", icon: Lightbulb },
              { id: "system", label: $t('admin.system'), icon: Settings }
            ] as tab}
              <button
                onclick={() => (activeTab = tab.id as any)}
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap {activeTab ===
                tab.id
                  ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}"
              >
                <tab.icon class="w-3.5 h-3.5" />
                {tab.label}
              </button>
            {/each}
          </nav>

          <button
            onclick={() => goto("/panel")}
            class="flex items-center gap-3 px-6 py-3.5 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group active:scale-95 w-full md:w-auto justify-center"
          >
            <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            PANEL
          </button>
        </div>
      </header>

      {#if activeTab === "dashboard"}
        <!-- Dashboard View -->
        <div class="space-y-10" in:fade>
          <!-- KPI Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each [
              { label: $t('admin.stats.total_teachers'), value: globalStats.totalUsers, icon: Users, color: 'text-primary-500', bg: 'bg-primary-500/10', border: 'hover:border-primary-500/20' },
              { label: $t('admin.stats.premium_users'), value: globalStats.premiumUsers, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/20' },
              { label: $t('admin.stats.new_7d'), value: globalStats.recentUsers, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/20' },
              { label: 'Estimated MRR', value: '$' + ((globalStats.premiumUsers || 0) * 9.99).toFixed(2), icon: CurrencyDollar, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/20' }
            ] as kpi}
              <div
                class="bg-[#1a1a24]/60 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] group {kpi.border} transition-all duration-500 shadow-2xl relative overflow-hidden"
              >
                <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 group-hover:scale-110">
                  <kpi.icon size={160} />
                </div>
                <div class="flex items-center justify-between mb-6 relative z-10">
                  <div class="p-3 {kpi.bg} rounded-2xl shadow-inner">
                    <kpi.icon class="w-6 h-6 {kpi.color}" />
                  </div>
                </div>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 relative z-10">
                  {kpi.label}
                </p>
                <h3 class="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter relative z-10">
                  {kpi.value}
                </h3>
              </div>
            {/each}
          </div>
        </div>
      {:else if activeTab === "users"}
        <!-- Users CRM View -->
        <div class="space-y-8" in:fade>
          <!-- Search & Filters -->
          <div class="flex flex-col md:flex-row gap-4">
              <div
                class="flex-1 flex items-center gap-4 bg-[#1a1a24]/60 backdrop-blur-3xl p-2 rounded-3xl border border-white/5 shadow-2xl"
              >
                <div class="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500">
                    <Search weight="duotone" class="w-5 h-5" />
                </div>
                <input
                  bind:value={userSearchTerm}
                  type="text"
                  placeholder={$t('admin.users.search')}
                  class="bg-transparent border-none focus:ring-0 text-sm text-white w-full py-1.5 placeholder:text-slate-600 font-bold"
                />
                {#if userSearchTerm}
                  <button
                    onclick={() => (userSearchTerm = "")}
                    class="p-2 hover:bg-white/5 rounded-xl transition-all mr-2"
                  >
                    <X class="w-4 h-4 text-slate-500" />
                  </button>
                {/if}
              </div>
          </div>

          <div
            class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
          >
            <!-- Desktop View -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-black/20 border-b border-white/5">
                    <th
                      class="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                      >{$t('admin.users.table.teacher')}</th
                    >
                    <th
                      class="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                      >{$t('admin.users.table.plan')}</th
                    >
                    <th
                      class="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                      >{$t('admin.users.table.registered')}</th
                    >
                    <th
                      class="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right"
                      >{$t('admin.users.table.actions')}</th
                    >
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  {#each users as user}
                    <tr class="hover:bg-white/[0.02] transition-colors group">
                      <td class="p-6">
                        <div class="flex items-center gap-4">
                          <div
                            class="w-10 h-10 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center font-bold text-violet-400 shadow-lg"
                          >
                            {user.email?.[0].toUpperCase()}
                          </div>
                          <div>
                            <p class="font-bold text-sm tracking-tight text-white">
                              {user.email}
                            </p>
                            <p
                              class="text-[9px] text-slate-500 font-mono tracking-tighter uppercase"
                            >
                              {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td class="p-6">
                        <span
                          class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest {getPlanStatus(
                            user,
                          ) === 'pro'
                            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                            : 'bg-slate-500/10 text-slate-500 border border-white/10'}"
                        >
                          {getPlanStatus(user) === 'pro' ? 'PREMIUM' : 'FREE'}
                        </span>
                      </td>
                      <td class="p-6 text-xs text-slate-400 font-medium"
                        >{formatDate(user.createdAt)}</td
                      >
                      <td class="p-6 text-right">
                        <div
                          class="flex items-center justify-end gap-2"
                        >
                          <button
                            onclick={() => handleImpersonate(user.id)}
                            title="Suplantar"
                            class="p-2.5 bg-blue-500/5 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/10 rounded-xl transition-all"
                          >
                             <LogOut weight="bold" class="w-4 h-4 rotate-180" />
                          </button>
                          <button
                            onclick={() => handleOpenManage(user)}
                            class="p-2.5 bg-primary-500/5 hover:bg-primary-500 text-primary-400 hover:text-white border border-primary-500/10 rounded-xl transition-all"
                          >
                             <Edit3 weight="bold" class="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <!-- Mobile View -->
            <div class="md:hidden grid grid-cols-1 gap-4 p-4">
              {#each users as user}
                <div class="bg-[#1a1a24]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden group">
                  <div class="absolute -right-4 -top-4 w-24 h-24 bg-violet-600/5 blur-2xl rounded-full"></div>
                  
                  <div class="flex items-start justify-between relative z-10">
                    <div class="flex items-center gap-4">
                      <div class="w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center font-outfit font-black text-violet-400 text-xl shadow-inner">
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <div class="space-y-1">
                        <p class="font-outfit font-black text-sm text-white tracking-tight truncate max-w-[160px]">{user.email}</p>
                        <div class="flex items-center gap-2">
                           <span class="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest {getPlanStatus(user) === 'pro' ? 'bg-violet-500 text-black shadow-lg shadow-violet-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}">
                            {getPlanStatus(user) === 'pro' ? 'PRO' : 'FREE'}
                          </span>
                          <span class="text-[9px] text-slate-600 font-bold uppercase tracking-tighter tabular-nums">{formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3 relative z-10">
                    <button
                      onclick={() => handleImpersonate(user.id)}
                      class="py-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2 hover:bg-violet-500/5 hover:text-violet-400 transition-all active:scale-95"
                    >
                      <LogOut weight="bold" class="w-3.5 h-3.5 rotate-180" /> {$t('common.access_btn') || 'Access'}
                    </button>
                    <button
                      onclick={() => openEditModal(user)}
                      class="py-4 bg-violet-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-violet-600/10 hover:bg-violet-500 transition-all active:scale-95 border border-violet-400/20"
                    >
                      <Edit3 weight="bold" class="w-3.5 h-3.5" /> {$t('admin.users.manage_btn') || 'Gestionar'}
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else if activeTab === "announcements"}
        <!-- Announcements View -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" in:fade>
          <div
            class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
          >
            <h3
              class="text-xl font-bold font-display uppercase italic tracking-wider mb-8"
            >
              {$t('admin.announcements.new')}
            </h3>
            <div class="space-y-6">
              <input
                bind:value={announcementForm.title}
                type="text"
                placeholder={$t('admin.announcements.title')}
                class="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-primary-500 transition-all"
              />
              <textarea
                bind:value={announcementForm.content}
                rows="4"
                placeholder={$t('admin.announcements.content')}
                class="w-full px-6 py-4 bg-black/20 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-primary-500 transition-all resize-none"
              ></textarea>
              <button
                onclick={handleSendAnnouncement}
                disabled={isSaving}
                class="w-full py-4 bg-primary-500 text-black rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary-500/20 disabled:opacity-50"
              >
                {isSaving ? $t('admin.announcements.sending') : $t('admin.announcements.send')}
              </button>
            </div>
          </div>

          <div
            class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <h3
              class="text-xl font-bold font-display uppercase italic tracking-wider mb-8"
            >
              {$t('admin.announcements.active')}
            </h3>
            <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {#each announcements as a}
                <div
                  class="p-5 bg-white/5 border border-white/10 rounded-2xl group transition-all hover:bg-white/[0.08]"
                  in:slide
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1">
                      <h4 class="font-bold text-sm">{a.title}</h4>
                      <p class="text-xs text-slate-400 line-clamp-2">
                        {a.content}
                      </p>
                      <p
                        class="text-[9px] text-slate-500 uppercase tracking-tighter"
                      >
                        {formatDate(a.created_at)}
                      </p>
                    </div>
                    <button
                      onclick={() => handleDeleteAnnouncement(a.id)}
                      class="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <LogOut class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              {/each}
              {#if announcements.length === 0}
                <p class="text-center text-slate-500 py-10 text-sm italic">
                  {$t('admin.announcements.empty')}
                </p>
              {/if}
            </div>
          </div>
        </div>
      {:else if activeTab === "lobby"}
        <!-- Lobby Moderation View -->
        <div class="space-y-10" in:fade>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-black font-display uppercase italic tracking-wider">Lobby Moderation</h2>
              <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Sugerencias y Feedback de Profesores Premium</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6">
            {#each lobbySuggestions as s (s.id)}
              <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
                <div class="flex flex-col md:flex-row gap-8">
                  <!-- Suggestion Info -->
                  <div class="flex-1 space-y-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20 font-black">
                        {#if s.authorAvatar}
                          <img src={s.authorAvatar} alt="Avatar" class="w-full h-full object-cover rounded-2xl" />
                        {:else}
                          {s.authorName?.[0] || '?'}
                        {/if}
                      </div>
                      <div>
                        <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest">{s.authorName || 'Anónimo'}</p>
                        <div class="flex items-center gap-1 mt-1">
                          {#each (s.authorInsignias || []).slice(0, 3) as insigniaId}
                            {@const insignia = INSIGNIAS.find(i => i.id === insigniaId)}
                            {#if insignia}
                              <div 
                                class="w-4 h-4 rounded-md bg-black/40 border border-white/10 flex items-center justify-center p-0.5 {insignia.color}"
                                title={$t(insignia.titleKey)}
                              >
                                <insignia.icon weight="duotone" class="w-full h-full" />
                              </div>
                            {/if}
                          {/each}
                          <p class="text-[9px] text-slate-500 font-bold ml-1">{formatDate(s.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <h3 class="text-xl font-bold text-white uppercase italic tracking-tight">{s.title}</h3>
                    <p class="text-sm text-slate-400 leading-relaxed font-medium">{s.content}</p>
                    
                    <div class="flex items-center gap-4 pt-4">
                       <div class="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl text-slate-400 border border-white/5">
                         <Star weight="fill" class="w-4 h-4 text-yellow-500" />
                         <span class="text-xs font-black">{s.votes?.length || 0} Votos</span>
                       </div>
                    </div>
                  </div>

                  <!-- Status Control -->
                  <div class="md:w-64 space-y-4">
                    <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Cambiar Estado</p>
                    <div class="flex flex-col gap-2">
                       {#each ['pending', 'planned', 'implemented'] as status}
                         <button 
                           onclick={() => handleUpdateSuggestionStatus(s.id, status)}
                           class="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border {s.status === status ? 'bg-violet-500 text-white border-violet-400 shadow-lg shadow-violet-500/20' : 'bg-black/20 text-slate-500 border-white/5 hover:bg-white/5 hover:text-slate-300'}"
                         >
                           {status === 'pending' ? 'En Revisión' : status === 'planned' ? 'Planificado' : 'Completado'}
                         </button>
                       {/each}
                    </div>
                  </div>
                </div>
              </div>
            {/each}

            {#if lobbySuggestions.length === 0}
               <div class="py-20 text-center bg-black/20 border border-dashed border-white/10 rounded-[2.5rem] space-y-4">
                  <div class="p-4 bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-700">
                    <Lightbulb class="w-8 h-8" />
                  </div>
                  <p class="text-slate-500 text-xs italic">No hay sugerencias en el lobby actualmente.</p>
               </div>
            {/if}
          </div>
        </div>
      {:else if activeTab === "system"}
        <!-- System Controls View -->
        <div class="space-y-10" in:fade>
          <!-- Stripe Simulator -->
          <StripeSimulator />

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Maintenance Control -->

            <div
              class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
            >
              <div class="flex items-center gap-4 mb-2">
                 <div class="p-3 bg-violet-600/10 border border-violet-500/20 rounded-2xl">
                   <Database weight="duotone" class="w-6 h-6 text-violet-500" />
                 </div>
                 <h3 class="text-lg font-bold uppercase tracking-wider">
                   Mantenimiento
                 </h3>
               </div>
              <div class="space-y-4">
                <p class="text-xs text-slate-400 leading-relaxed">
                  Repara inconsistencias en los datos de los usuarios (campos faltantes como createdAt).
                </p>
                <button
                  onclick={handleRepairUsers}
                  disabled={isSaving}
                  class="w-full py-4 bg-white/5 text-violet-400 border border-violet-500/20 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-violet-500/10 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'Reparando...' : 'Reparar Usuarios'}
                </button>
              </div>
            </div>

            <div
              class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
            >
              <div class="flex items-center gap-4 mb-2">
                 <div class="p-3 bg-red-600/10 border border-red-500/20 rounded-2xl">
                   <Shield weight="duotone" class="w-6 h-6 text-red-500" />
                 </div>
                 <h3 class="text-lg font-bold uppercase tracking-wider">
                   {$t('admin.system.security')}
                 </h3>
               </div>
              <div class="space-y-4">
                <p class="text-xs text-slate-400 leading-relaxed">
                  {$t('admin.system.maintenance_desc')}
                </p>
                <button
                  onclick={handleToggleMaintenance}
                  class="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all {maintenanceMode
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse'
                    : 'bg-white/5 text-red-500 border border-red-500/20 hover:bg-red-500/10'}"
                >
                  {maintenanceMode
                    ? $t('admin.system.maintenance_on')
                    : $t('admin.system.maintenance_off')}
                </button>
              </div>
            </div>

            <!-- Stats Summary Sidebar -->
            <div
              class="lg:col-span-2 bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div
                class="p-8 border-b border-white/5 flex items-center justify-between"
              >
                <h3 class="text-lg font-bold uppercase tracking-wider">
                  {$t('admin.system.monitor')}
                </h3>
                <span
                  class="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/20"
                  >{$t('admin.system.events')}</span
                >
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="bg-black/10 border-b border-white/5">
                      <th
                        class="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                        >Evento</th
                      >
                      <th
                        class="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                        >Timestamp</th
                      >
                      <th
                        class="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                        >Estado</th
                      >
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    {#each systemLogs as log}
                      <tr class="hover:bg-white/[0.02] transition-colors">
                        <td class="p-5">
                          <p
                            class="text-xs font-bold text-slate-300 capitalize"
                          >
                            {log.type?.replace(/_/g, " ") ||
                              log.action ||
                              "Evento"}
                          </p>
                          <p
                            class="text-[10px] text-slate-500 truncate max-w-xs"
                          >
                            {typeof log.details === "object"
                              ? JSON.stringify(log.details)
                              : log.details}
                          </p>
                        </td>
                        <td class="p-5 text-[10px] font-mono text-slate-500"
                          >{formatDate(log.timestamp)}</td
                        >
                        <td class="p-5">
                          <span
                            class="px-2 py-0.5 {log.status === 'error'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-violet-500/10 text-violet-400 border-violet-500/20'} text-[9px] font-bold rounded-lg uppercase tracking-tighter border"
                          >
                            {log.status === 'success' ? 'Éxito' : (log.status || "Éxito")}
                          </span>
                        </td>
                      </tr>
                    {/each}
                    {#if systemLogs.length === 0}
                      <tr>
                        <td
                          colspan="3"
                          class="p-10 text-center text-slate-500 text-xs italic"
                          >No hay logs recientes en el sistema.</td
                        >
                      </tr>
                    {/if}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      {/if}    <!-- Modal de Edición -->
    {#if showEditModal && selectedUser}
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        transition:fade
      >
        <div
          class="bg-[#1e293b] w-full max-w-xl rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden"
          transition:scale
        >
          <div
            class="p-8 border-b border-white/5 flex items-center justify-between bg-violet-500/5"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20">
                <UserIcon weight="bold" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-black font-display uppercase italic tracking-wider">
                  {$t('admin.users.manage')}
                </h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedUser.email}</p>
              </div>
            </div>
            <button
              onclick={() => (showEditModal = false)}
              class="p-2 hover:bg-white/5 rounded-xl transition-all"
              ><X weight="bold" class="w-5 h-5" /></button
            >
          </div>
          
          <div class="p-8 space-y-8">
            <!-- Insights Section -->
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Escuelas</p>
                {#if isLoadingDetails}
                  <div class="h-6 w-8 bg-white/5 animate-pulse mx-auto rounded"></div>
                {:else}
                  <span class="text-xl font-black font-display">{userDetails?.schools || 0}</span>
                {/if}
              </div>
              <div class="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Clases</p>
                {#if isLoadingDetails}
                  <div class="h-6 w-8 bg-white/5 animate-pulse mx-auto rounded"></div>
                {:else}
                  <span class="text-xl font-black font-display">{userDetails?.classes || 0}</span>
                {/if}
              </div>
              <div class="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Alumnos</p>
                {#if isLoadingDetails}
                  <div class="h-6 w-8 bg-white/5 animate-pulse mx-auto rounded"></div>
                {:else}
                  <span class="text-xl font-black font-display">{userDetails?.students || 0}</span>
                {/if}
              </div>
            </div>

            <div class="space-y-4">
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CONCEDER ACCESO TEMPORAL</p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {#each [3, 7, 15, 28, 30] as days}
                  <button
                    onclick={() => handleGrantPremium(selectedUser.id, days)}
                    disabled={isSaving}
                    class="px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all {days === 30 ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' : 'bg-zinc-900/60 text-slate-300 border border-white/5 hover:bg-primary-500/10 hover:text-primary-400'}"
                  >
                    {days} DÍAS
                  </button>
                {/each}
                <button
                    onclick={() => handleGrantPremium(selectedUser.id, 365)}
                    disabled={isSaving}
                    class="px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500"
                >
                    1 AÑO
                </button>
              </div>
            </div>

            {#if getPlanStatus(selectedUser) === "pro"}
              <div class="pt-4 border-t border-white/5 text-center">
                <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                  <Star weight="fill" /> Usuario Premium Activo
                </p>
                <button
                  onclick={() => handleRevokePremium(selectedUser.id)}
                  disabled={isSaving}
                  class="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >{$t('admin.users.revoke_premium')}</button
                >
              </div>
            {/if}

            <!-- Insignias Section -->
            <div class="space-y-4 pt-6 border-t border-white/5">
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">GESTIONAR INSIGNIAS ESPECIALES</p>
              <div class="grid grid-cols-2 gap-3">
                {#each INSIGNIAS.filter(i => i.type === 'special') as insignia}
                  {@const isUnlocked = userInsignias.some(ui => ui.id === insignia.id)}
                  <button
                    onclick={() => handleToggleInsignia(insignia.id)}
                    disabled={isSaving || isLoadingDetails}
                    class="p-3 rounded-2xl border transition-all flex items-center gap-3 text-left group
                    {isUnlocked 
                      ? 'bg-violet-500/10 border-violet-500/30 text-white' 
                      : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/5'}"
                  >
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center {isUnlocked ? insignia.color + ' bg-zinc-950' : 'bg-zinc-950/50'}">
                      <insignia.icon weight={isUnlocked ? 'duotone' : 'regular'} class="w-5 h-5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[10px] font-black uppercase tracking-tight truncate">{$t(insignia.titleKey)}</p>
                      <p class="text-[8px] font-medium text-slate-500 uppercase tracking-tighter">
                        {isUnlocked ? 'CONCEDIDA' : 'BLOQUEADA'}
                      </p>
                    </div>
                    {#if isUnlocked}
                      <CheckCircle weight="fill" class="w-4 h-4 text-emerald-400" />
                    {/if}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Manage Featured Insignias (Admin) -->
            {#if userInsignias.length > 0}
              <div class="space-y-4 pt-6 border-t border-white/5">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">DESTACAR EN PERFIL (MÁX 3)</p>
                <div class="flex flex-wrap gap-2">
                  {#each INSIGNIAS.filter(ins => userInsignias.some(ui => ui.id === ins.id)) as insignia}
                    {@const isFeatured = (selectedUser.settings?.featuredInsignias || []).includes(insignia.id)}
                    <button
                      onclick={() => handleToggleFeaturedAdmin(insignia.id)}
                      class="px-3 py-2 rounded-xl border transition-all flex items-center gap-2
                      {isFeatured 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/10'}"
                    >
                      <insignia.icon weight={isFeatured ? 'fill' : 'regular'} class="w-3 h-3" />
                      <span class="text-[9px] font-bold uppercase">{$t(insignia.titleKey)}</span>
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap");

  :global(body) {
    font-family: "Inter", sans-serif;
  }

  .font-display {
    font-family: "Outfit", sans-serif;
  }

  h1,
  h3,
  h4 {
    font-family: "Outfit", sans-serif;
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
