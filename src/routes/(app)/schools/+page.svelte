<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { schoolsApi } from '$lib/api/schools';
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
    ArrowLeft,
    BookOpen,
    TrendingUp,
    Eye,
    MoreHorizontal
  } from 'lucide-svelte';
  import type { College as SchoolType } from '$lib/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let schools: SchoolType[] = data.schools || [];
  let isLoading = false; // Ya no necesitamos loading porque los datos vienen del servidor
  let deletingId: string | null = null;

  onMount(async () => {
    console.log('✅ Schools page: User authenticated via server:', data.user?.email);
    console.log('✅ Schools page: Schools from server:', schools.length);
    
    // Solo cargar via API si no hay datos del servidor (modo producción)
    if (!data.schools || data.schools.length === 0) {
      try {
        isLoading = true;
        await loadSchools();
      } catch (error) {
        console.error('Error loading schools:', error);
        schools = [];
      } finally {
        isLoading = false;
      }
    }
  });

  const handleViewSchool = (schoolId: string) => {
    goto(`/schools/${schoolId}`);
  };

  async function loadSchools() {
    try {
      // Usar API del servidor en lugar del cliente
      const response = await fetch('/api/schools', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        schools = result.schools || [];
        
        if (result.warning) {
          console.warn('⚠️ Schools warning:', result.warning);
        }
        if (result.error) {
          console.error('❌ Schools error:', result.error);
        }
      } else {
        console.error('Error loading schools:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        schools = [];
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
      
      // Usar el endpoint DELETE de la API
      const response = await fetch('/api/schools', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: school.id })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar el centro');
      }

      // Eliminar del array local
      schools = schools.filter(s => s.id !== school.id);
      showToast.success('Centro eliminado correctamente');
    } catch (error) {
      showError(error, 'Error al eliminar el centro');
    } finally {
      deletingId = null;
    }
  }

  function editSchool(school: SchoolType) {
    goto(`/schools/${school.id}/edit`);
  }

  function viewSchool(school: SchoolType) {
    goto(`/schools/${school.id}`);
  }

  async function refreshSchools() {
    isLoading = true;
    try {
      await loadSchools();
    } finally {
      isLoading = false;
    }
  }

  // Funciones para mejorar UX
  const getTotalClasses = () => {
    // Esta función se puede mejorar cuando tengamos datos reales de clases
    return schools.length * 2; // Estimación temporal
  };

  const getTotalStudents = () => {
    // Esta función se puede mejorar cuando tengamos datos reales de estudiantes
    return schools.length * 15; // Estimación temporal
  };

  const handleQuickCreateClass = (schoolId: string) => {
    goto(`/classes/create?school_id=${schoolId}&from_school=${schoolId}`);
  };

  const handleViewClasses = (schoolId: string) => {
    goto(`/classes?school_id=${schoolId}&from_school=${schoolId}`);
  };
</script>

<svelte:head>
  <title>Mis Centros - ChessNet</title>
</svelte:head>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
{:else}
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <header class="bg-slate-800 border-b border-slate-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <button 
              on:click={() => {
                invalidateAll().then(() => {
                  goto('/dashboard');
                });
              }}
              class="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-2xl font-bold text-white">Mis Centros</h1>
          </div>
          
          <div class="flex items-center space-x-3">
            <button 
              on:click={refreshSchools}
              disabled={isLoading}
              class="btn-secondary"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </button>
            <button 
              on:click={() => goto('/schools/create')}
              class="btn-primary"
            >
              <Plus class="w-4 h-4 mr-2" />
              Nuevo centro
            </button>
          </div>
        </div>

        <!-- Estadísticas -->
        {#if schools.length > 0}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-400">Total Centros</p>
                  <p class="text-2xl font-bold text-white">{schools.length}</p>
                </div>
                <div class="bg-blue-500/20 p-3 rounded-lg">
                  <School class="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-400">Clases Estimadas</p>
                  <p class="text-2xl font-bold text-white">{getTotalClasses()}</p>
                </div>
                <div class="bg-green-500/20 p-3 rounded-lg">
                  <BookOpen class="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
            
            <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-400">Estudiantes Estimados</p>
                  <p class="text-2xl font-bold text-white">{getTotalStudents()}</p>
                </div>
                <div class="bg-purple-500/20 p-3 rounded-lg">
                  <Users class="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      {#if schools.length === 0}
        <!-- Empty state -->
        <div class="text-center py-16">
          <div class="bg-slate-800 rounded-2xl p-8 max-w-md mx-auto">
            <School class="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <h2 class="text-2xl font-bold mb-4">No tienes centros aún</h2>
            <p class="text-slate-400 mb-6">
              Crea tu primer centro educativo para comenzar a organizar tus clases de ajedrez
            </p>
            <button on:click={() => goto('/schools/create')} class="btn-primary">
              <Plus class="w-4 h-4 mr-2" />
              Crear mi primer centro
            </button>
          </div>
        </div>
      {:else}
        <!-- Schools grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each schools as school}
            <div class="card group hover:border-primary-500/50 transition-all duration-200">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="bg-primary-600 p-3 rounded-lg">
                    <School class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg text-white">{school.name}</h3>
                    {#if school.city}
                      <div class="flex items-center text-sm text-slate-400">
                        <MapPin class="w-4 h-4 mr-1" />
                        {school.city}
                      </div>
                    {/if}
                  </div>
                </div>
                
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex space-x-1">
                    <button
                      on:click={() => editSchool(school)}
                      class="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                      title="Editar centro"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      on:click={() => deleteSchool(school)}
                      disabled={deletingId === school.id}
                      class="p-2 rounded-lg bg-red-700 hover:bg-red-600 transition-colors disabled:opacity-50"
                      title="Eliminar centro"
                    >
                      {#if deletingId === school.id}
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {:else}
                        <Trash2 class="w-4 h-4" />
                      {/if}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Información del centro -->
              <div class="space-y-3 mb-4">
                <div class="flex items-center text-sm text-slate-400">
                  <Calendar class="w-4 h-4 mr-2" />
                  Creado {formatDate(school.created_at)}
                </div>
                
                <!-- Estadísticas estimadas -->
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-slate-400">
                    <BookOpen class="w-4 h-4 mr-1" />
                    ~2 clases
                  </div>
                  <div class="flex items-center text-slate-400">
                    <Users class="w-4 h-4 mr-1" />
                    ~15 estudiantes
                  </div>
                </div>
              </div>

              <!-- Acciones rápidas -->
              <div class="mt-4 pt-4 border-t border-slate-700">
                <div class="flex space-x-2">
                  <button
                    on:click={() => handleViewSchool(school.id)}
                    class="flex-1 btn-secondary text-sm py-2"
                  >
                    <Eye class="w-4 h-4 mr-1" />
                    Ver Detalles
                  </button>
                  <button
                    on:click={() => handleQuickCreateClass(school.id)}
                    class="flex-1 btn-primary text-sm py-2"
                  >
                    <Plus class="w-4 h-4 mr-1" />
                    Nueva Clase
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </main>
  </div>
{/if}
