<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    School, 
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Users,
    GraduationCap,
    Clock,
    MapPin,
    Target,
    TrendingUp,
    UserCheck,
    UserX,
    Phone,
    Mail,
    Globe,
    Calendar,
    BookOpen,
    Star
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let school = data.school;
  let classes = data.classes || [];
  let stats = data.stats || { 
    totalClasses: 0, activeClasses: 0, inactiveClasses: 0,
    totalStudents: 0, totalCapacity: 0, occupancyRate: 0,
    levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 },
    averageClassSize: 0
  };

  // Filtros
  let selectedLevel = '';
  let selectedStatus = 'active';

  // Filtros reactivos - SOLO con campos que existen en la tabla classes
  $: filteredClasses = classes.filter(classItem => {
    const matchesLevel = !selectedLevel || classItem.level === selectedLevel;
    // No hay campo active en la tabla, todas las clases se consideran activas
    const matchesStatus = selectedStatus === 'all' || selectedStatus === 'active';
    
    return matchesLevel && matchesStatus;
  });

  const levelColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
    mixed: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  const levelLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    mixed: 'Mixto'
  };

  onMount(() => {
    console.log('🏫 School detail page loaded:', school?.name);
    console.log('📚 Classes found:', classes.length);
  });

  const handleGoBack = () => {
    goto('/schools');
  };

  const handleCreateClass = () => {
    goto(`/classes/create?school_id=${school.id}`);
  };

  const handleEditClass = (classId: string) => {
    goto(`/classes/${classId}/edit`);
  };

  const handleViewClass = (classId: string) => {
    goto(`/classes/${classId}?from_school=${school.id}`);
  };

  const handleViewAllClasses = () => {
    goto('/classes');
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta clase?')) {
      return;
    }

    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove from local state
        classes = classes.filter(c => c.id !== classId);
        // Recalculate stats
        stats.totalClasses = classes.length;
        stats.activeClasses = classes.length;
        stats.levels = {
          beginner: classes.filter(c => c.level === 'beginner').length,
          intermediate: classes.filter(c => c.level === 'intermediate').length,
          advanced: classes.filter(c => c.level === 'advanced').length,
          mixed: 0
        };
      } else {
        alert('Error al eliminar la clase');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Error al eliminar la clase');
    }
  };

  const clearFilters = () => {
    selectedLevel = '';
    selectedStatus = 'active';
  };
</script>

<svelte:head>
  <title>{school?.name || 'Centro'} | ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 text-white">
  <!-- Header -->
  <div class="bg-slate-800 border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-4">
          <button
            on:click={handleGoBack}
            class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>Volver a Centros</span>
          </button>
          
          <div class="h-6 w-px bg-slate-600"></div>
          
          <div class="flex items-center space-x-3">
            <School class="w-6 h-6 text-blue-400" />
            <div>
              <h1 class="text-xl font-semibold">{school?.name || 'Centro'}</h1>
              <p class="text-sm text-slate-400">Gestión de clases y estudiantes</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            on:click={() => goto(`/schools/${school.id}/edit`)}
            class="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            <Edit class="w-4 h-4 mr-2 inline" />
            Editar Centro
          </button>
          
          <button
            on:click={handleCreateClass}
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus class="w-4 h-4" />
            <span>Nueva Clase</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Información del Centro -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-white mb-2">{school?.name}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {#if school?.city}
              <div class="flex items-center space-x-2">
                <MapPin class="w-4 h-4 text-slate-500" />
                <span class="text-slate-300">{school.city}</span>
              </div>
            {/if}
            {#if school?.phone}
              <div class="flex items-center space-x-2">
                <Phone class="w-4 h-4 text-slate-500" />
                <span class="text-slate-300">{school.phone}</span>
              </div>
            {/if}
            {#if school?.email}
              <div class="flex items-center space-x-2">
                <Mail class="w-4 h-4 text-slate-500" />
                <span class="text-slate-300">{school.email}</span>
              </div>
            {/if}
            {#if school?.website}
              <div class="flex items-center space-x-2">
                <Globe class="w-4 h-4 text-slate-500" />
                <a href={school.website} target="_blank" class="text-blue-400 hover:text-blue-300">
                  Sitio web
                </a>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm text-slate-400">Clases</span>
          </div>
          <GraduationCap class="w-8 h-8 text-blue-400" />
        </div>
        <p class="text-2xl font-bold text-white">{stats.totalClasses}</p>
        <p class="text-xs text-slate-500">
          {stats.levels.beginner} principiantes, {stats.levels.intermediate} intermedios, {stats.levels.advanced} avanzados
        </p>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm text-slate-400">Capacidad Total</span>
          </div>
          <Users class="w-8 h-8 text-green-400" />
        </div>
        <p class="text-2xl font-bold text-white">{stats.totalCapacity}</p>
        <p class="text-xs text-slate-500">estudiantes máximo</p>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm text-slate-400">Niveles</span>
          </div>
          <Target class="w-8 h-8 text-yellow-400" />
        </div>
        <p class="text-2xl font-bold text-white">{Object.values(stats.levels).reduce((a, b) => a + b, 0)}</p>
        <p class="text-xs text-slate-500">diferentes niveles</p>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm text-slate-400">Estado</span>
          </div>
          <TrendingUp class="w-8 h-8 text-purple-400" />
        </div>
        <p class="text-2xl font-bold text-white">Activo</p>
        <p class="text-xs text-slate-500">centro operativo</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-2">
          <label for="level_filter" class="text-sm font-medium text-slate-300">Nivel:</label>
          <select id="level_filter" bind:value={selectedLevel} class="input">
            <option value="">Todos los niveles</option>
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        <div class="flex items-center space-x-2">
          <label for="status_filter" class="text-sm font-medium text-slate-300">Estado:</label>
          <select id="status_filter" bind:value={selectedStatus} class="input">
            <option value="active">Solo activas</option>
            <option value="all">Todas</option>
          </select>
        </div>

        <button
          on:click={clearFilters}
          class="px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Lista de Clases -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">Clases del Centro</h3>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-slate-400">{filteredClasses.length} clases</span>
          <button 
            on:click={handleViewAllClasses}
            class="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Ver todas las clases
          </button>
        </div>
      </div>

      {#if filteredClasses.length === 0}
        <div class="text-center py-12">
          <GraduationCap class="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-slate-400 mb-2">
            {selectedLevel || selectedStatus !== 'active' ? 'No se encontraron clases' : 'No hay clases en este centro'}
          </h3>
          <p class="text-slate-500 mb-6">
            {selectedLevel || selectedStatus !== 'active' ? 'Prueba con otros filtros' : 'Comienza creando la primera clase'}
          </p>
          {#if !selectedLevel && selectedStatus === 'active'}
            <button on:click={handleCreateClass} class="btn-primary">
              <Plus class="w-4 h-4 mr-2" />
              Crear Primera Clase
            </button>
          {/if}
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filteredClasses as classItem (classItem.id)}
            <div class="bg-slate-700 border border-slate-600 rounded-xl p-6 hover:border-slate-500 transition-colors">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <button 
                      class="text-lg font-semibold text-white mb-2 cursor-pointer hover:text-blue-400 transition-colors text-left"
                      on:click={() => handleViewClass(classItem.id)}
                      aria-label="Ver detalles de la clase {classItem.name}">
                    {classItem.name}
                  </button>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    on:click={() => handleEditClass(classItem.id)}
                    class="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Editar clase"
                  >
                    <Edit class="w-4 h-4 text-slate-400" />
                  </button>
                  
                  <button
                    on:click={() => handleDeleteClass(classItem.id)}
                    class="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Eliminar clase"
                  >
                    <Trash2 class="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <!-- Información básica de la clase -->
              <div class="space-y-2 mb-4">
                {#if classItem.max_students}
                  <div class="flex items-center space-x-2 text-sm">
                    <Users class="w-4 h-4 text-slate-500" />
                    <span class="text-slate-300">Capacidad máxima: {classItem.max_students} estudiantes</span>
                  </div>
                {/if}
              </div>

              <!-- Nivel y estado -->
              <div class="flex items-center justify-between">
                <span class={`px-3 py-1 rounded-full text-xs font-medium border ${levelColors[classItem.level] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                  {levelLabels[classItem.level] || classItem.level}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-medium border bg-green-500/20 text-green-400 border-green-500/30">
                  Activa
                </span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .input {
    @apply px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors;
  }
  
  .btn-primary {
    @apply px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center;
  }
</style>