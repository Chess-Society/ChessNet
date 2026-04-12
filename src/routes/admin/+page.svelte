<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { db, auth } from '$lib/firebase';
  import { collection, query, onSnapshot, orderBy, limit, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
  import { onAuthStateChanged } from 'firebase/auth';
  import { fade, slide, scale } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { Settings, UserCheck, Clock, ShieldCheck, Mail, LogOut, ChevronRight, Edit3, Trophy } from 'lucide-svelte';

  const ADMIN_EMAILS = ['andreslgumuzio@gmail.com', 'andrelgumuzio@gmail.com'];

  let users = $state<any[]>([]);
  let stats = $derived({
    total: users.length,
    premium: users.filter(u => u.settings?.plan === 'premium' || u.config?.settings?.subscription?.plan === 'premium').length,
    free: users.filter(u => u.settings?.plan !== 'premium' && u.config?.settings?.subscription?.plan !== 'premium').length,
    recent: users.filter(u => {
        const date = u.createdAt ? new Date(u.createdAt) : new Date();
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }).length
  });

  let isLoading = $state(true);
  let isAuthorized = $state(false);
  let isInitialized = $state(false); // Added for safety timeout
  let error = $state('');

  // Modales y Edición
  let selectedUser = $state<any>(null);
  let showEditModal = $state(false);
  let isSaving = $state(false);

  onMount(() => {
    console.log('🛡️ Admin Guard: Initializing...');
    
    // Safety timeout to prevent infinite loading
    const safetyTimer = setTimeout(() => {
      if (!isInitialized) {
        console.warn('⚠️ Admin Guard: Safety timeout triggered');
        isInitialized = true;
        isLoading = false;
      }
    }, 3000);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      console.log('👤 Admin Guard: Auth state changed', user?.email);
      
      if (!user) {
        console.log('🚶 No user, redirecting to login');
        goto('/login');
        return;
      }

      if (!ADMIN_EMAILS.includes(user.email || '')) {
        console.error('🚫 Acceso denegado: No autorizado para admin');
        goto('/panel'); // Redirect back to panel if not admin
        return;
      }

      isAuthorized = true;
      isInitialized = true;
      clearTimeout(safetyTimer);
      startMonitoring();
    }, (err) => {
      console.error('❌ Auth error in Admin:', err);
      isInitialized = true;
      isLoading = false;
      error = 'Error de autenticación. Por favor, reintenta.';
    });

    return () => {
      unsubscribeAuth();
      clearTimeout(safetyTimer);
    };
  });

  function startMonitoring() {
    isLoading = true;
    try {
      // Monitoreamos la colección de usuarios
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const usersList: any[] = [];
        snapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        users = usersList;
        isLoading = false;
      }, (err) => {
        console.error('❌ Error de Firestore:', err);
        error = 'Error de permisos en Firestore. Asegúrate de haber desplegado las nuevas reglas.';
        isLoading = false;
      });

      return unsubscribe;
    } catch (err: any) {
        error = err.message;
        isLoading = false;
    }
  }

  async function handleGrantPremium(userId: string, days: number) {
    isSaving = true;
    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);
        
        // Actualizamos tanto en el doc de usuario como en su configuración de app
        const userDocRef = doc(db, 'users', userId);
        const appDataRef = doc(db, 'users', userId, 'appData', 'v1');

        const updatePayload = {
            'settings.plan': 'premium',
            'settings.planExpiresAt': expirationDate.toISOString(),
            'updatedAt': new Date().toISOString()
        };

        await updateDoc(userDocRef, updatePayload);
        
        // También actualizamos el config dentro de appData para que el frontend lo vea
        const snap = await getDoc(appDataRef);
        if (snap.exists()) {
            const currentData = snap.data();
            await updateDoc(appDataRef, {
                'settings.plan': 'premium',
                'settings.planExpiresAt': expirationDate.toISOString()
            });
        }

        console.log(`✅ Plan Premium concedido por ${days} días`);
        showEditModal = false;
    } catch (err: any) {
        alert('Error al conceder plan: ' + err.message);
    } finally {
        isSaving = false;
    }
  }

  async function handleRevokePremium(userId: string) {
    if (!confirm('¿Estás seguro de revocar el plan Premium?')) return;
    isSaving = true;
    try {
        const userDocRef = doc(db, 'users', userId);
        const appDataRef = doc(db, 'users', userId, 'appData', 'v1');

        await updateDoc(userDocRef, {
            'settings.plan': 'free',
            'settings.planExpiresAt': null
        });

        await updateDoc(appDataRef, {
            'settings.plan': 'free',
            'settings.planExpiresAt': null
        });

        showEditModal = false;
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

  function formatDate(dateStr: any) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function getPlanStatus(user: any) {
    const plan = user.settings?.plan || user.config?.settings?.subscription?.plan || 'free';
    const expiresAt = user.settings?.planExpiresAt;
    
    if (plan === 'premium') {
        if (expiresAt && new Date(expiresAt) < new Date()) return 'expired';
        return 'premium';
    }
    return 'free';
  }
</script>

<svelte:head>
  <title>Admin HQ - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-[#0f172a] text-white font-sans p-4 md:p-8 selection:bg-emerald-500/30">
  
  <!-- Background Elements -->
  <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
  </div>
  <div class="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>

  {#if !isInitialized}
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4 relative z-10" in:fade>
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <p class="text-slate-400 font-medium tracking-wide font-display uppercase text-xs">Cargando Administración...</p>
    </div>
  {:else if !isAuthorized}
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4 relative z-10" in:fade>
      <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <ShieldCheck class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-white">Acceso Denegado</h2>
        <p class="text-slate-400 text-sm mt-2">No tienes permisos para acceder a esta sección.</p>
        <button onclick={() => goto('/panel')} class="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all">
          Volver al Panel
        </button>
      </div>
    </div>
  {:else}
    <div class="max-w-7xl mx-auto space-y-8 relative z-10" in:fade>
      
      <!-- Top Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="relative group">
            <div class="absolute -inset-2 bg-emerald-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative p-3.5 bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl">
              <Logo size="w-10 h-10" iconSize="w-6 h-6" />
            </div>
          </div>
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-white mb-1">Centro de Mando</h1>
            <div class="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-widest">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
                Acceso Super-Admin
                <span class="mx-2 text-slate-700">|</span>
                <span class="text-emerald-500/80">Sincronización Activa</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-700/50 flex items-center gap-3 shadow-inner">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-[10px] font-bold text-slate-300 tracking-tighter uppercase tabular-nums">Real-time Node</span>
          </div>
          <button 
            onclick={() => window.location.reload()}
            class="p-2.5 bg-[#1e293b] hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-slate-400 hover:text-white shadow-lg"
          >
            <Settings class="w-5 h-5" />
          </button>
        </div>
      </div>

      {#if error}
        <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3" in:slide>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      {/if}

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl group relative overflow-hidden transition-all hover:border-emerald-500/20 shadow-2xl">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Mail class="w-12 h-12" />
          </div>
          <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Total Profesores</p>
          <h3 class="text-4xl font-extrabold text-white tabular-nums tracking-tighter group-hover:text-emerald-400 transition-colors">
            {stats.total}
          </h3>
        </div>

        <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl group relative overflow-hidden transition-all hover:border-purple-500/20 shadow-2xl">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy class="w-12 h-12" />
          </div>
          <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Maestros Premium</p>
          <div class="flex items-baseline gap-3">
              <h3 class="text-4xl font-extrabold text-purple-400 tabular-nums tracking-tighter">
                {stats.premium}
              </h3>
              <span class="text-xs font-bold text-slate-600">
                {stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(0) : 0}%
              </span>
          </div>
        </div>

        <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl group relative overflow-hidden transition-all hover:border-blue-500/20 shadow-2xl">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserCheck class="w-12 h-12" />
          </div>
          <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Registros (7d)</p>
          <h3 class="text-4xl font-extrabold text-blue-400 tabular-nums tracking-tighter">
            {stats.recent}
          </h3>
        </div>

        <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl group relative overflow-hidden transition-all hover:border-slate-500/20 shadow-2xl">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock class="w-12 h-12" />
          </div>
          <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Tasa Conversión</p>
          <h3 class="text-4xl font-extrabold text-slate-300 tabular-nums tracking-tighter">
            {stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(1) : 0}%
          </h3>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div class="p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
            <div>
                <h3 class="text-xl font-bold flex items-center gap-3">
                    Directorio de Profesores
                </h3>
                <p class="text-slate-500 text-xs mt-1">Gestión avanzada de permisos y planes</p>
            </div>
            <div class="relative w-full sm:w-64">
                <input 
                    type="text" 
                    placeholder="Buscar por email..." 
                    class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all"
                />
            </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] bg-white/5">
                <th class="px-8 py-5">Nombre / Email</th>
                <th class="px-8 py-5">Estado Plan</th>
                <th class="px-8 py-5">Registro</th>
                <th class="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              {#if isLoading}
                <tr><td colspan="4" class="px-8 py-20 text-center text-slate-600 italic">Analizando base de datos...</td></tr>
              {:else if users.length === 0}
                <tr><td colspan="4" class="px-8 py-20 text-center text-slate-600 italic">No se han encontrado registros</td></tr>
              {:else}
                {#each users as user (user.id)}
                  {@const status = getPlanStatus(user)}
                  <tr class="hover:bg-white/5 transition-all group" in:fade={{duration: 200}}>
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-slate-300 shadow-lg border border-white/5 group-hover:scale-110 transition-transform">
                            {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div class="font-bold text-white group-hover:text-emerald-400 transition-colors">{user.displayName || 'Maestro Anónimo'}</div>
                            <div class="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-8 py-5">
                        <div class="flex items-center gap-3">
                            {#if status === 'premium'}
                                <span class="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-500/30">PREMIUM</span>
                                <span class="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Hasta {formatDate(user.settings?.planExpiresAt)}</span>
                            {:else if status === 'expired'}
                                <span class="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2.5 py-1 rounded-lg border border-amber-500/30 text-decoration-line-through">EXPIRED</span>
                            {:else}
                                <span class="bg-slate-800/50 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-slate-700/50">AJEDRECISTA</span>
                            {/if}
                        </div>
                    </td>
                    <td class="px-8 py-5">
                      <div class="text-xs text-slate-400 font-medium">{formatDate(user.createdAt)}</div>
                      <div class="text-slate-600 text-[10px] lowercase max-w-[150px] truncate">{user.email}</div>
                    </td>
                    <td class="px-8 py-5 text-right">
                        <button 
                            onclick={() => openEditModal(user)}
                            class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-95"
                        >
                            Gestionar
                        </button>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <!-- Modals -->
  {#if showEditModal && selectedUser}
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm" transition:fade>
        <div class="bg-[#1e293b] w-full max-w-lg rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden" in:scale={{start: 0.95}}>
            <div class="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div>
                    <h3 class="text-xl font-bold tracking-tight">Gestionar Profesor</h3>
                    <p class="text-slate-400 text-xs mt-1">{selectedUser.email}</p>
                </div>
                <button onclick={() => showEditModal = false} class="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                    <LogOut class="w-5 h-5 rotate-180" />
                </button>
            </div>

            <div class="p-8 space-y-8">
                <div>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Conceder Periodo Premium</p>
                    <div class="grid grid-cols-2 gap-3">
                        <button 
                            onclick={() => handleGrantPremium(selectedUser.id, 3)}
                            disabled={isSaving}
                            class="px-4 py-3 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 border border-slate-700 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                        >
                            3 Días (Trial)
                        </button>
                        <button 
                            onclick={() => handleGrantPremium(selectedUser.id, 7)}
                            disabled={isSaving}
                            class="px-4 py-3 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 border border-slate-700 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                        >
                            7 Días (Cortesía)
                        </button>
                        <button 
                            onclick={() => handleGrantPremium(selectedUser.id, 15)}
                            disabled={isSaving}
                            class="px-4 py-3 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 border border-slate-700 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                        >
                            15 Días (Extend.)
                        </button>
                        <button 
                            onclick={() => handleGrantPremium(selectedUser.id, 30)}
                            disabled={isSaving}
                            class="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                        >
                            30 Días (Mes)
                        </button>
                    </div>
                </div>

                {#if getPlanStatus(selectedUser) === 'premium'}
                    <div class="pt-6 border-t border-white/5">
                        <button 
                            onclick={() => handleRevokePremium(selectedUser.id)}
                            disabled={isSaving}
                            class="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                        >
                            Revocar Plan Premium
                        </button>
                    </div>
                {/if}
            </div>

            <div class="p-6 bg-slate-900/50 text-center">
                <p class="text-[9px] text-slate-600 uppercase font-black">ChessNet Admin Engine v1.0 • Acceso Super-Admin</p>
            </div>
        </div>
    </div>
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

  h1, h3 {
    font-family: 'Outfit', sans-serif;
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
</style>
