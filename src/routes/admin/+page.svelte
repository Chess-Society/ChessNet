<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { db, auth } from '$lib/firebase';
  import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
  import { onAuthStateChanged } from 'firebase/auth';
  import { fade, slide, scale } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';

  const ADMIN_EMAIL = 'andrelgumuzio@gmail.com';

  let users = $state<any[]>([]);
  let stats = $derived({
    total: users.length,
    premium: users.filter(u => u.config?.settings?.subscription?.plan === 'premium').length,
    free: users.filter(u => u.config?.settings?.subscription?.plan !== 'premium').length,
    recent: users.filter(u => {
        const date = new Date(u.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }).length
  });

  let isLoading = $state(true);
  let isAuthorized = $state(false);
  let error = $state('');

  onMount(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        goto('/login');
        return;
      }

      if (user.email !== ADMIN_EMAIL) {
        console.error('🚫 Acceso denegado: No autorizado');
        goto('/');
        return;
      }

      isAuthorized = true;
      startMonitoring();
    });

    return () => {
      unsubscribeAuth();
    };
  });

  function startMonitoring() {
    isLoading = true;
    try {
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

  function formatDate(dateStr: string) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Admin Dashboard - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-[#0f172a] text-white font-sans p-4 md:p-8">
  {#if !isAuthorized}
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4" in:fade>
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <p class="text-slate-400">Verificando credenciales de administrador...</p>
    </div>
  {:else}
    <div class="max-w-7xl mx-auto space-y-8" in:fade>
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <Logo size="w-10 h-10" iconSize="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight">Panel de Administración</h1>
            <p class="text-slate-400 text-sm">Monitorización global en tiempo real</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            LIVE
          </div>
          <button 
            onclick={() => window.location.reload()}
            class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
            title="Refrescar"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {#if error}
        <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" in:slide>
          {error}
        </div>
      {/if}

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl hover:border-emerald-500/30 transition-all group">
          <p class="text-slate-400 text-sm font-medium mb-1">Total Profesores</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tabular-nums">
              {stats.total}
            </h3>
          </div>
        </div>

        <div class="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl hover:border-purple-500/30 transition-all group">
          <p class="text-slate-400 text-sm font-medium mb-1">Maestros Premium</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-purple-400 tabular-nums">{stats.premium}</h3>
            <span class="text-xs text-slate-500">
              {stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        <div class="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
          <p class="text-slate-400 text-sm font-medium mb-1">Registros (7d)</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-blue-400 tabular-nums">{stats.recent}</h3>
          </div>
        </div>

        <div class="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl hover:border-slate-500/30 transition-all group">
          <p class="text-slate-400 text-sm font-medium mb-1">Ajedrecistas (Free)</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-slate-400 tabular-nums">{stats.free}</h3>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <div class="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20">
            <h3 class="font-bold flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Profesores Registrados
            </h3>
            <div class="text-xs text-slate-500">Mostrando últimos 100</div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-400 text-[10px] uppercase tracking-widest bg-slate-800/30">
                <th class="px-6 py-4 font-bold">Profesor</th>
                <th class="px-6 py-4 font-bold">Email</th>
                <th class="px-6 py-4 font-bold">Plan</th>
                <th class="px-6 py-4 font-bold">Registro</th>
                <th class="px-6 py-4 font-bold">ID (UID)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/30">
              {#if isLoading}
                <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-slate-500 italic">Cargando base de datos...</td>
                </tr>
              {:else if users.length === 0}
                <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-slate-500 italic">No hay profesores registrados todavía</td>
                </tr>
              {:else}
                {#each users as user (user.id)}
                  <tr class="hover:bg-white/5 transition-colors group" in:scale={{duration: 200, start: 0.98}}>
                    <td class="px-6 py-4">
                      <div class="font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {user.displayName || 'Sin nombre'}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-slate-400 text-sm select-all">{user.email}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                        {#if user.config?.settings?.subscription?.plan === 'premium'}
                            <span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]">PREMIUM</span>
                        {:else}
                            <span class="px-2 py-0.5 rounded-md bg-slate-700/20 text-slate-400 text-[10px] font-bold border border-slate-600/30">FREE</span>
                        {/if}
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-slate-500 text-xs">{formatDate(user.createdAt)}</span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="text-[9px] font-mono text-slate-600 uppercase tracking-tighter truncate max-w-[80px] block" title={user.id}>{user.id}</span>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
        
        <div class="p-4 bg-slate-800/10 border-t border-slate-700/50 text-center">
            <p class="text-[10px] text-slate-600 uppercase tracking-widest font-bold">ChessNet Global Admin Engine v1.0</p>
        </div>
      </div>

    </div>
  {/if}
</div>

<style>
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style>
