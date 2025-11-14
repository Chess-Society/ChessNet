<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Users, 
    Plus, 
    Edit, 
    Trash2,
    ArrowLeft,
    Search,
    Filter,
    UserCheck,
    UserX,
    GraduationCap,
    Calendar,
    Phone,
    Mail,
    School,
    Star
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let students = data.students || [];
  let stats = data.stats || { total: 0, schools: {}, newest: null };
  let schools = data.schools || [];
  let isLoading = false;
  
  // Filtros
  let searchQuery = '';
  let selectedSchool = '';

  // Filtros reactivos
  $: filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (student.first_name && student.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (student.last_name && student.last_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSchool = !selectedSchool || student.college_id === selectedSchool;
    
    return matchesSearch && matchesSchool;
  });

  // Función para obtener el nombre del centro
  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Sin asignar';
  };

  onMount(() => {
    console.log('✅ Students page: User authenticated via server:', data.user?.email);
    console.log('✅ Students page: Students from server:', students.length);
  });

  const handleGoBack = () => {
    goto('/classes');
  };

  const handleCreateStudent = () => {
    goto('/students/create');
  };

  const handleEditStudent = (studentId: string) => {
    goto(`/students/${studentId}/edit`);
  };

  const handleViewStudent = (studentId: string) => {
    goto(`/students/${studentId}`);
  };

  const handleDeleteStudent = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${student?.first_name} ${student?.last_name}?`)) return;
    
    try {
      console.log('🗑️ Deleting student:', studentId);
      
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        // Eliminar del array local solo si la eliminación fue exitosa
        students = students.filter(s => s.id !== studentId);
        console.log('✅ Student deleted successfully:', studentId);
        alert('✅ Estudiante eliminado correctamente');
      } else {
        const errorData = await response.json();
        console.error('❌ Error deleting student:', errorData);
        alert('❌ Error al eliminar el estudiante: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error deleting student:', error);
      alert('❌ Error al eliminar el estudiante');
    }
  };

  // Función eliminada - ya no manejamos estado activo/inactivo

  const clearFilters = () => {
    searchQuery = '';
    selectedSchool = '';
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Función eliminada - ya está declarada arriba
</script>

<svelte:head>
  <title>Estudiantes - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <!-- Header -->
  <header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button on:click={handleGoBack} class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-500/20 rounded-lg">
              <Users class="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">Estudiantes</h1>
              <p class="text-sm text-slate-400">Gestión de alumnado</p>
            </div>
          </div>
        </div>
        
        <button on:click={handleCreateStudent} class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Nuevo Estudiante
        </button>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <!-- Estadísticas simplificadas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-blue-500/20 rounded-lg">
            <Users class="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{stats.total}</div>
            <div class="text-sm text-slate-400">Total</div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-green-500/20 rounded-lg">
            <School class="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{schools.length}</div>
            <div class="text-sm text-slate-400">Centros</div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-purple-500/20 rounded-lg">
            <Calendar class="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">{stats.newest ? new Date(stats.newest).toLocaleDateString('es-ES') : 'N/A'}</div>
            <div class="text-sm text-slate-400">Último Registro</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros simplificados -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            bind:value={searchQuery}
            class="input pl-10 w-full"
          />
        </div>

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

    <!-- Lista de estudiantes -->
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    {:else if filteredStudents.length === 0}
      <div class="text-center py-12">
        <Users class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-slate-400 mb-2">
          {searchQuery || selectedSchool ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
        </h3>
        <p class="text-slate-500 mb-6">
          {searchQuery || selectedSchool ? 'Prueba con otros filtros de búsqueda' : 'Comienza agregando tu primer estudiante'}
        </p>
        {#if !searchQuery && !selectedSchool}
          <button on:click={handleCreateStudent} class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            Agregar Primer Estudiante
          </button>
        {/if}
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {#each filteredStudents as student}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
            <!-- Header del estudiante -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {(student.first_name || 'E').charAt(0)}{(student.last_name || 'S').charAt(0)}
                </div>
                <div>
                  <button 
                      class="font-semibold text-white cursor-pointer hover:text-green-400 transition-colors text-left"
                      on:click={() => handleViewStudent(student.id)}
                      aria-label="Ver detalles del estudiante {student.name}">
                    {student.name}
                  </button>
                  <p class="text-sm text-slate-400">Estudiante</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  on:click={() => handleEditStudent(student.id)}
                  class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  on:click={() => handleDeleteStudent(student.id)}
                  class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Información del estudiante -->
            <div class="space-y-3 mb-4">
              <div class="flex items-center space-x-2 text-sm">
                <School class="w-4 h-4 text-slate-500" />
                <span class="text-slate-300">{getSchoolName(student.college_id)}</span>
              </div>
            </div>

            <!-- Notas (si existen) -->
            {#if student.notes}
              <div class="mt-4 p-3 bg-slate-700/50 rounded-lg">
                <p class="text-xs text-slate-400 mb-1">Notas:</p>
                <p class="text-sm text-slate-300 leading-relaxed">{student.notes}</p>
              </div>
            {/if}

            <!-- Fecha de registro -->
            <div class="mt-4 pt-4 border-t border-slate-700">
              <p class="text-xs text-slate-500">
                Registrado: {new Date(student.created_at).toLocaleDateString('es-ES')}
              </p>
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
