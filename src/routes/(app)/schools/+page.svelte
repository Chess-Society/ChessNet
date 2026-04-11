<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { showError, showToast } from '$lib/utils/toast';
  import { formatDate } from '$lib/utils/date';
  import { 
    School, 
    Plus, 
    Edit, 
    Trash2, 
    Users,
    Calendar,
    MapPin,
    BookOpen,
    Eye,
    RefreshCw,
    Search as SearchIcon
  } from 'lucide-svelte';
  import type { College as SchoolType } from '$lib/types';
  import type { PageData } from './$types';
  import { fade, fly } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let schools = $state((data.schools || []) as any[]);
  let isLoading = $state(false);
  let deletingId = $state<string | null>(null);
  let searchQuery = $state('');

  const filteredSchools = $derived(
    (schools as any[]).filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  onMount(async () => {
    if (!data.schools || data.schools.length === 0) {
      await refreshSchools();
    }
  });

  async function loadSchools() {
    try {
      const response = await fetch('/api/schools', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        schools = result.schools || [];
      }
    } catch (error) {
      console.error('Error loading schools:', error);
      schools = [];
    }
  }

  async function deleteSchool(school: SchoolType) {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${school.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      deletingId = school.id;
      const response = await fetch('/api/schools', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: school.id })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al eliminar el centro');

      schools = (schools as any[]).filter(s => s.id !== school.id);
      showToast.success('Centro eliminado correctamente');
    } catch (error) {
      showError(error, 'Error al eliminar el centro');
    } finally {
      deletingId = null;
    }
  }

  async function refreshSchools() {
    isLoading = true;
    try {
      await loadSchools();
    } finally {
      isLoading = false;
    }
  }

  const getTotalClasses = () => schools.length * 2;
  const getTotalStudents = () => schools.length * 15;
</script>

<svelte:head>
  <title>Mis Centros - ChessNet</title>
</svelte:head>

<div class="space-y-8 animate-fade-in">
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div class="space-y-2 text-center md:text-left">
      <div class="flex items-center justify-center md:justify-start gap-3 text-primary-400 font-bold uppercase tracking-widest text-xs">
        <School class="w-4 h-4" />
        Gestión de Centros
      </div>
      <h1 class="text-4xl font-black text-white tracking-tight">Mis Centros</h1>
      <p class="text-surface-400">Administra tus centros educativos y organiza tus programas de ajedrez.</p>
    </div>

    <div class="flex items-center justify-center gap-3">
      <button 
        onclick={refreshSchools}
        disabled={isLoading}
        class="group p-3 rounded-2xl bg-surface-900 border border-surface-800 text-surface-400 hover:text-white transition-all"
        title="Sincronizar"
      >
        <RefreshCw class="w-5 h-5 {isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}" />
      </button>
      <button 
        onclick={() => goto('/schools/create')}
        class="btn-primary"
      >
        <Plus class="w-5 h-5 mr-2" />
        Nuevo Centro
      </button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div class="glass-card p-6 flex items-center gap-4 border-l-4 border-l-primary-500">
      <div class="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
        <School class="w-6 h-6" />
      </div>
      <div>
        <p class="text-xs font-bold text-surface-500 uppercase tracking-wider">Total Centros</p>
        <p class="text-2xl font-black text-white">{schools.length}</p>
      </div>
    </div>
    
    <div class="glass-card p-6 flex items-center gap-4 border-l-4 border-l-blue-500">
      <div class="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
        <BookOpen class="w-6 h-6" />
      </div>
      <div>
        <p class="text-xs font-bold text-surface-500 uppercase tracking-wider">Clases Estimadas</p>
        <p class="text-2xl font-black text-white">{getTotalClasses()}</p>
      </div>
    </div>
    
    <div class="glass-card p-6 flex items-center gap-4 border-l-4 border-l-accent-500">
      <div class="w-12 h-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
        <Users class="w-6 h-6" />
      </div>
      <div>
        <p class="text-xs font-bold text-surface-500 uppercase tracking-wider">Estudiantes</p>
        <p class="text-2xl font-black text-white">{getTotalStudents()}</p>
      </div>
    </div>
  </div>

  <!-- Search Area -->
  <div class="relative group">
    <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-600 group-focus-within:text-primary-400 transition-colors" />
    <input 
      type="text" 
      bind:value={searchQuery}
      placeholder="Filtrar por nombre o ciudad..." 
      class="bg-surface-900/50 border border-surface-800 rounded-2xl pl-12 pr-4 py-4 text-sm w-full focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all outline-none text-white shadow-xl shadow-black/20"
    />
  </div>

  {#if isLoading && schools.length === 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each Array(6) as _}
        <div class="glass-card h-64 animate-pulse bg-surface-900/50"></div>
      {/each}
    </div>
  {:else if filteredSchools.length === 0}
    <div class="glass-panel p-20 text-center space-y-6">
      <div class="w-24 h-24 bg-surface-900 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-surface-800">
        <School class="w-12 h-12 text-surface-700" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-white">No se encontraron centros</h2>
        <p class="text-surface-500 max-w-xs mx-auto">
          {searchQuery ? 'Prueba con otros términos de búsqueda para encontrar lo que necesitas.' : 'Aún no has agregado ningún centro educativo a tu red.'}
        </p>
      </div>
      {#if !searchQuery}
        <button onclick={() => goto('/schools/create')} class="btn-primary">
          <Plus class="w-5 h-5 mr-2" />
          Crear Primer Centro
        </button>
      {/if}
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each filteredSchools as school, i}
        <div 
          class="glass-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <!-- Background Decor -->
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all"></div>
          
          <div class="p-6 space-y-6 relative z-10">
            <div class="flex items-start justify-between">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <School class="w-8 h-8 text-white" />
              </div>
              
              <div class="flex gap-2">
                <button
                  onclick={() => goto(`/schools/${school.id}/edit`)}
                  class="p-2.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-400 hover:text-white hover:bg-surface-700 transition-all"
                  title="Editar"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  onclick={() => deleteSchool(school)}
                  disabled={deletingId === school.id}
                  class="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-all disabled:opacity-50"
                  title="Eliminar"
                >
                  {#if deletingId === school.id}
                    <RefreshCw class="w-4 h-4 animate-spin" />
                  {:else}
                    <Trash2 class="w-4 h-4" />
                  {/if}
                </button>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-black text-white group-hover:text-primary-400 transition-colors truncate">{school.name}</h3>
              {#if school.city}
                <div class="flex items-center text-sm text-surface-500 mt-2 font-medium">
                  <MapPin class="w-3.5 h-3.5 mr-1.5 text-primary-500/50" />
                  {school.city}
                </div>
              {/if}
            </div>

            <div class="grid grid-cols-2 gap-4 py-4 border-y border-surface-800/50">
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest">Clases</p>
                <div class="flex items-center gap-2 text-white font-bold">
                  <BookOpen class="w-3.5 h-3.5 text-blue-400" />
                   ~2
                </div>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest">Estudiantes</p>
                <div class="flex items-center gap-2 text-white font-bold">
                  <Users class="w-3.5 h-3.5 text-accent-400" />
                   ~15
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-[10px] text-surface-600 font-bold uppercase tracking-wider">
                <Calendar class="w-3 h-3" />
                 {formatDate(school.updated_at || school.created_at)}
              </div>
              <div class="h-2 w-2 rounded-full bg-primary-500 shadow-glow animate-pulse"></div>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                onclick={() => goto(`/schools/${school.id}`)}
                class="flex-1 px-4 py-3 rounded-xl bg-surface-800 text-white text-xs font-bold hover:bg-surface-700 transition-all border border-surface-700 flex items-center justify-center gap-2"
              >
                <Eye class="w-4 h-4 text-primary-400" />
                Detalles
              </button>
              <button
                onclick={() => goto(`/classes/create?school_id=${school.id}`)}
                class="flex-1 px-4 py-3 rounded-xl bg-primary-500 text-white text-xs font-extrabold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
              >
                <Plus class="w-4 h-4" />
                Nueva Clase
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Advanced design system styles */
  .animate-fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
