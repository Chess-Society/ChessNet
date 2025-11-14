<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    GraduationCap, 
    Plus, 
    Edit, 
    Trash2,
    ArrowLeft,
    Search,
    Filter,
    Users,
    UserPlus,
    Clock,
    MapPin,
    School,
    Calendar,
    UserCheck,
    UserX,
    TrendingUp,
    Target,
    BookOpen,
    Star,
    Eye,
    Settings,
    BarChart3,
    Activity
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let classes = data.classes || [];
  let stats = data.stats || { 
    total: 0, 
    levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }, 
    schools: {}, totalStudents: 0, totalCapacity: 0, occupancyRate: 0, averageClassSize: 0 
  };
  let schools = data.schools || [];
  let isLoading = false;
  
  // Filtros
  let searchQuery = '';
  let selectedLevel = '';
  let selectedSchool = '';

  // Filtros reactivos (solo con campos que existen)
  $: filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (classItem.description && classItem.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = !selectedLevel || classItem.level === selectedLevel;
    const matchesSchool = !selectedSchool || classItem.college_id === selectedSchool;
    
    return matchesSearch && matchesLevel && matchesSchool;
  });

  const levelColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
    mixed: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const levelLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    mixed: 'Mixto'
  };


  const levelIcons = {
    beginner: BookOpen,
    intermediate: Target,
    advanced: Star,
    mixed: Users
  };

  onMount(() => {
    console.log('✅ Classes page: User authenticated via server:', data.user?.email);
    console.log('✅ Classes page: Classes from server:', classes.length);
  });

  const handleGoBack = () => {
    goto('/dashboard');
  };

  const handleCreateClass = () => {
    goto('/classes/create');
  };

  const handleEditClass = (classId: string) => {
    goto(`/classes/${classId}/edit`);
  };

  const handleViewClass = (classId: string) => {
    goto(`/classes/${classId}`);
  };

  const handleManageStudents = (classId: string) => {
    goto(`/classes/${classId}/students`);
  };

  const handleManageSkills = (classId: string) => {
    goto(`/classes/${classId}/skills`);
  };

  const handleTakeAttendance = (classId: string) => {
    goto(`/classes/${classId}/attendance`);
  };

  const handleDeleteClass = async (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    if (!confirm(`¿Estás seguro de que quieres eliminar la clase "${classItem?.name}"? Esta acción no se puede deshacer.`)) return;
    
    try {
      // Usar el endpoint DELETE de la API
      const response = await fetch('/api/classes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: classId })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar la clase');
      }

      // Eliminar del array local
      classes = classes.filter(c => c.id !== classId);
      console.log('✅ Class deleted successfully:', classId);
    } catch (error) {
      console.error('❌ Error deleting class:', error);
      alert('Error al eliminar la clase: ' + (error as Error).message);
    }
  };


  // Funciones para mejorar UX
  const getSchoolName = (collegeId: string) => {
    const school = schools.find(s => s.id === collegeId);
    return school?.name || 'Centro no asignado';
  };


  const handleQuickViewClass = (classId: string) => {
    goto(`/classes/${classId}`);
  };

  const handleQuickManageStudents = (classId: string) => {
    goto(`/classes/${classId}/students`);
  };

  const handleQuickCreateStudent = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    goto(`/students/create?class_id=${classId}&college_id=${classItem?.college_id}&return_to=${encodeURIComponent(`/classes/${classId}`)}`);
  };

  const clearFilters = () => {
    searchQuery = '';
    selectedLevel = '';
    selectedSchool = '';
  };


  const getOccupancyColor = (current: number, max: number) => {
    const rate = (current / max) * 100;
    if (rate >= 90) return 'text-red-400';
    if (rate >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getOccupancyBarColor = (current: number, max: number) => {
    const rate = (current / max) * 100;
    if (rate >= 90) return 'bg-red-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
</script>

<svelte:head>
  <title>Clases - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <!-- Header -->
  <header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
    <div class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button on:click={handleGoBack} class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-500/20 rounded-lg">
              <GraduationCap class="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Clases</h1>
              <p class="text-sm text-slate-400">Gestión de grupos y aulas</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <button on:click={handleCreateClass} class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            Nueva Clase
          </button>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      {#if classes.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">Total Clases</p>
                <p class="text-2xl font-bold text-white">{classes.length}</p>
              </div>
              <div class="bg-blue-500/20 p-3 rounded-lg">
                <GraduationCap class="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">Total Estudiantes</p>
                <p class="text-2xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <div class="bg-green-500/20 p-3 rounded-lg">
                <Activity class="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">Estudiantes</p>
                <p class="text-2xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <div class="bg-purple-500/20 p-3 rounded-lg">
                <Users class="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
          
          <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-400">Centros</p>
                <p class="text-2xl font-bold text-white">{schools.length}</p>
              </div>
              <div class="bg-orange-500/20 p-3 rounded-lg">
                <School class="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">

    <!-- Filtros -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar clases..."
            bind:value={searchQuery}
            class="input pl-10 w-full"
          />
        </div>

        <select bind:value={selectedLevel} class="input">
          <option value="">Todos los niveles</option>
          <option value="beginner">Principiante</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
          <option value="mixed">Mixto</option>
        </select>

        <select bind:value={selectedSchool} class="input">
          <option value="">Todos los centros</option>
          {#each schools as school}
            <option value={school.id}>{school.name}</option>
          {/each}
        </select>


        <button on:click={clearFilters} class="btn-secondary">
          <Filter class="w-4 h-4 mr-2" />
          Limpiar
        </button>
      </div>
    </div>

    <!-- Lista de clases -->
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    {:else if filteredClasses.length === 0}
      <div class="text-center py-12">
        <GraduationCap class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-slate-400 mb-2">
          {searchQuery || selectedLevel || selectedSchool ? 'No se encontraron clases' : 'No hay clases registradas'}
        </h3>
        <p class="text-slate-500 mb-6">
          {searchQuery || selectedLevel || selectedSchool ? 'Prueba con otros filtros de búsqueda' : 'Comienza creando tu primera clase'}
        </p>
        {#if !searchQuery && !selectedLevel && !selectedSchool}
          <button on:click={handleCreateClass} class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            Crear Primera Clase
          </button>
        {/if}
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {#each filteredClasses as classItem}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors group">
            <!-- Header de la clase -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="p-3 bg-blue-500/20 rounded-lg">
                  <GraduationCap class="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-lg text-white">{classItem.name}</h3>
                  <p class="text-sm text-slate-400">{getSchoolName(classItem.college_id)}</p>
                </div>
              </div>
              
              <!-- Estado de la clase -->
              <div class="flex items-center space-x-2">
                <span class={`px-2 py-1 rounded-full text-xs font-medium ${getClassStatusColor(classItem)} bg-slate-700/50`}>
                  {getClassStatusText(classItem)}
                </span>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    on:click={() => handleEditClass(classItem.id)}
                    class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    title="Editar clase"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button 
                    on:click={() => handleDeleteClass(classItem.id)}
                    class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                    title="Eliminar clase"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Información básica -->
            <div class="space-y-3 mb-4">
              <div class="flex items-center text-sm text-slate-400">
                <Calendar class="w-4 h-4 mr-2" />
                Creada {new Date(classItem.created_at).toLocaleDateString('es-ES')}
              </div>
              
              <!-- Estadísticas estimadas -->
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center text-slate-400">
                  <Users class="w-4 h-4 mr-1" />
                  ~15 estudiantes
                </div>
                <div class="flex items-center text-slate-400">
                  <BookOpen class="w-4 h-4 mr-1" />
                  ~5 temas
                </div>
              </div>
            </div>

            <!-- Acciones rápidas -->
            <div class="mt-4 pt-4 border-t border-slate-700">
              <div class="grid grid-cols-2 gap-2">
                <button
                  on:click={() => handleQuickViewClass(classItem.id)}
                  class="btn-secondary text-sm py-2"
                >
                  <Eye class="w-4 h-4 mr-1" />
                  Ver Detalles
                </button>
                <button
                  on:click={() => handleQuickCreateStudent(classItem.id)}
                  class="btn-primary text-sm py-2"
                >
                  <UserPlus class="w-4 h-4 mr-1" />
                  Nuevo Estudiante
                </button>
              </div>
              
              <!-- Acciones secundarias -->
              <div class="flex space-x-2 mt-2">
                <button
                  on:click={() => handleQuickManageStudents(classItem.id)}
                  class="flex-1 btn-secondary text-xs py-1"
                >
                  <Users class="w-3 h-3 mr-1" />
                  Gestionar
                </button>
                <button
                  on:click={() => handleManageSkills(classItem.id)}
                  class="flex-1 btn-secondary text-xs py-1"
                >
                  <Target class="w-3 h-3 mr-1" />
                  Temario
                </button>
                <button
                  on:click={() => handleTakeAttendance(classItem.id)}
                  class="flex-1 btn-secondary text-xs py-1"
                >
                  <UserCheck class="w-3 h-3 mr-1" />
                  Lista
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>

<style>
  .input {
    @apply bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500;
  }
</style>
