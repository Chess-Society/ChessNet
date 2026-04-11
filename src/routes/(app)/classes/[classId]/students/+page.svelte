<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { 
    Users, 
    ArrowLeft,
    UserPlus,
    UserMinus,
    Search,
    Calendar,
    Mail,
    GraduationCap,
    Clock,
    MapPin,
    TrendingUp,
    UserCheck,
    AlertCircle,
    Edit,
    Eye,
    BarChart3,
    Activity,
    BookOpen,
    School
  } from 'lucide-svelte';
  import { showToast, showError } from '$lib/utils/toast';
  import type { PageData } from './$types';

  export let data: PageData;

  let classData = data.class as any;
  let enrolledStudents = (data.enrolledStudents || []) as any[];
  let availableStudents = (data.availableStudents || []) as any[];
  let stats = (data.stats || { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 }) as any;
  
  let searchQuery = '';
  let isEnrolling = false;
  let selectedStudentId = '';

  // Filtrar estudiantes disponibles por búsqueda
  $: filteredAvailableStudents = availableStudents.filter(student =>
    student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const levelColors: Record<string, string> = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400'
  };

  const levelLabels: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };

  onMount(() => {
    console.log('✅ Class students page: Class:', classData?.name);
    console.log('✅ Enrolled students:', enrolledStudents.length);
    console.log('✅ Available students:', availableStudents.length);
  });

  const handleGoBack = () => {
    // Navegación contextual: estudiantes → clase → centro → dashboard
    const fromSchool = $page.url.searchParams.get('from_school');
    const fromClass = $page.url.searchParams.get('from_class');
    
    if (fromSchool) {
      // Si viene de un centro específico, volver al centro
      goto(`/schools/${fromSchool}`);
    } else if (fromClass) {
      // Si viene de una clase específica, volver a la clase
      goto(`/classes/${fromClass}`);
    } else if (classData?.college_id) {
      // Si la clase tiene un centro asignado, ir al centro
      goto(`/schools/${classData.college_id}`);
    } else {
      // Por defecto, volver a la clase
      goto(`/classes/${classData.id}`);
    }
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

  const handleEnrollStudent = async (studentId: string) => {
    if (stats.available <= 0) {
      showError('La clase ha alcanzado su capacidad máxima');
      return;
    }

    try {
      isEnrolling = true;
      
      const response = await fetch('/api/class-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class_id: classData.id,
          student_id: studentId
        })
      });

      if (response.ok) {
        // Mover estudiante de disponible a inscrito
        const student = availableStudents.find(s => s.id === studentId);
        if (student) {
          enrolledStudents = [...enrolledStudents, { ...student, enrolled_at: new Date().toISOString() }];
          availableStudents = availableStudents.filter(s => s.id !== studentId);
          
          // Actualizar estadísticas
          stats.enrolled += 1;
          stats.available -= 1;
          stats.occupancyRate = Math.round((stats.enrolled / stats.capacity) * 100);
        }
        
        showToast.success(`${student?.first_name} ${student?.last_name} inscrito correctamente`);
      } else {
        const error = await response.json();
        showError(error.error || 'Error al inscribir al estudiante');
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      showError('Error al inscribir al estudiante');
    } finally {
      isEnrolling = false;
    }
  };

  const handleEditStudent = (studentId: string) => {
    // Pasar el college_id de la clase como parámetro para asignación automática
    const collegeId = classData?.college_id;
    const queryParam = collegeId ? `?college_id=${collegeId}` : '';
    goto(`/students/${studentId}/edit${queryParam}`);
  };

  const handleUnenrollStudent = async (studentId: string) => {
    const student = enrolledStudents.find(s => s.id === studentId);
    if (!confirm(`¿Estás seguro de que quieres desinscribir a ${student?.first_name} ${student?.last_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/class-students?class_id=${classData.id}&student_id=${studentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Mover estudiante de inscrito a disponible
        if (student) {
          const { enrolled_at, ...studentData } = student;
          availableStudents = [...availableStudents, studentData];
          enrolledStudents = enrolledStudents.filter(s => s.id !== studentId);
          
          // Actualizar estadísticas
          stats.enrolled -= 1;
          stats.available += 1;
          stats.occupancyRate = Math.round((stats.enrolled / stats.capacity) * 100);
        }
        
        showToast.success(`${student?.first_name} ${student?.last_name} desinscrito correctamente`);
      } else {
        const error = await response.json();
        showError(error.error || 'Error al desinscribir al estudiante');
      }
    } catch (error) {
      console.error('Error unenrolling student:', error);
      showError('Error al desinscribir al estudiante');
    }
  };

  const getOccupancyColor = () => {
    if (stats.occupancyRate >= 90) return 'text-red-400';
    if (stats.occupancyRate >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getOccupancyBarColor = () => {
    if (stats.occupancyRate >= 90) return 'bg-red-500';
    if (stats.occupancyRate >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
</script>

<svelte:head>
  <title>Estudiantes - {classData?.name || 'Clase'} - ChessNet</title>
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
              <Users class="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">{classData?.name}</h1>
              <p class="text-sm text-slate-400">Gestión de estudiantes</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <button 
            on:click={() => goto(`/classes/${classData?.id}`)}
            class="btn-secondary"
          >
            <Eye class="w-4 h-4 mr-2" />
            Ver Clase
          </button>
          <button 
            on:click={() => goto(`/students/create?class_id=${classData?.id}&college_id=${classData?.college_id}&return_to=${encodeURIComponent(`/classes/${classData?.id}/students`)}`)}
            class="btn-primary"
          >
            <UserPlus class="w-4 h-4 mr-2" />
            Nuevo Estudiante
          </button>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-400">Estudiantes Inscritos</p>
              <p class="text-2xl font-bold text-white">{stats.enrolled}</p>
            </div>
            <div class="bg-green-500/20 p-3 rounded-lg">
              <UserCheck class="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-400">Disponibles</p>
              <p class="text-2xl font-bold text-white">{stats.available}</p>
            </div>
            <div class="bg-blue-500/20 p-3 rounded-lg">
              <Users class="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-400">Capacidad</p>
              <p class="text-2xl font-bold text-white">{stats.capacity}</p>
            </div>
            <div class="bg-purple-500/20 p-3 rounded-lg">
              <BarChart3 class="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        
        <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-400">Ocupación</p>
              <p class="text-2xl font-bold text-white">{stats.occupancyRate}%</p>
            </div>
            <div class="bg-orange-500/20 p-3 rounded-lg">
              <Activity class="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Estudiantes Inscritos -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white flex items-center">
            <UserCheck class="w-5 h-5 mr-2" />
            Estudiantes Inscritos ({enrolledStudents.length})
          </h2>
        </div>

        {#if enrolledStudents.length === 0}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <Users class="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-slate-400 mb-2">No hay estudiantes inscritos</h3>
            <p class="text-slate-500 mb-4">Comienza inscribiendo estudiantes en esta clase</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                on:click={() => goto(`/students/create?class_id=${classData.id}&college_id=${classData.college_id}&return_to=/classes/${classData.id}/students`)}
                class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <UserPlus class="w-4 h-4" />
                <span>Crear Nuevo Estudiante</span>
              </button>
              {#if availableStudents.length > 0}
                <button
                  on:click={() => document.querySelector('.available-students-section')?.scrollIntoView({ behavior: 'smooth' })}
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <UserCheck class="w-4 h-4" />
                  <span>Ver Estudiantes Disponibles ({availableStudents.length})</span>
                </button>
              {/if}
            </div>
          </div>
        {:else}
          <div class="space-y-3">
            {#each enrolledStudents as student}
              <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                    </div>
                    <div>
                      <h3 class="font-semibold text-white">
                        {student.first_name} {student.last_name}
                      </h3>
                      <div class="flex items-center space-x-4 text-sm text-slate-400">
                        <span>{calculateAge(student.date_of_birth)} años</span>
                        <span class={levelColors[student.chess_level]}>
                          {levelLabels[student.chess_level]}
                        </span>
                        <div class="flex items-center space-x-1">
                          <Calendar class="w-3 h-3" />
                          <span>
                            {new Date(student.enrolled_at).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    on:click={() => handleEditStudent(student.id)}
                    class="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-slate-400 hover:text-blue-400"
                    title="Editar estudiante"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button 
                    on:click={() => handleUnenrollStudent(student.id)}
                    class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                    title="Desinscribir estudiante"
                  >
                    <UserMinus class="w-4 h-4" />
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Estudiantes Disponibles -->
      <div class="space-y-6 available-students-section">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white flex items-center">
            <UserPlus class="w-5 h-5 mr-2" />
            Estudiantes Disponibles ({filteredAvailableStudents.length})
          </h2>
          <button
            on:click={() => goto(`/students/create?class_id=${classData.id}&college_id=${classData.college_id}&return_to=/classes/${classData.id}/students`)}
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <UserPlus class="w-4 h-4" />
            <span>Crear Estudiante</span>
          </button>
        </div>

        <!-- Búsqueda -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar estudiantes disponibles..."
            bind:value={searchQuery}
            class="input pl-10 w-full"
          />
        </div>

        {#if stats.available <= 0}
          <div class="bg-slate-800 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertCircle class="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-red-400 mb-2">Clase completa</h3>
            <p class="text-slate-400">La clase ha alcanzado su capacidad máxima de {stats.capacity} estudiantes</p>
          </div>
        {:else if filteredAvailableStudents.length === 0}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <Users class="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-slate-400 mb-2">
              {searchQuery ? 'No se encontraron estudiantes' : 'No hay estudiantes disponibles'}
            </h3>
            <p class="text-slate-500">
              {searchQuery ? 'Prueba con otros términos de búsqueda' : 'Todos los estudiantes activos ya están inscritos'}
            </p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each filteredAvailableStudents as student}
              <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                    </div>
                    <div>
                      <h3 class="font-semibold text-white">
                        {student.first_name} {student.last_name}
                      </h3>
                      <div class="flex items-center space-x-4 text-sm text-slate-400">
                        <span>{calculateAge(student.date_of_birth)} años</span>
                        <span class={levelColors[student.chess_level]}>
                          {levelLabels[student.chess_level]}
                        </span>
                        <div class="flex items-center space-x-1">
                          <Mail class="w-3 h-3" />
                          <span>{student.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    on:click={() => handleEnrollStudent(student.id)}
                    disabled={isEnrolling}
                    class="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-slate-400 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Inscribir estudiante"
                  >
                    {#if isEnrolling}
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                    {:else}
                      <UserPlus class="w-4 h-4" />
                    {/if}
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>

<style lang="postcss">
  .input {
    @apply bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500;
  }
</style>
