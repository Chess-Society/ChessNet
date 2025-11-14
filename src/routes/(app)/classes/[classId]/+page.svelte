<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    GraduationCap,
    Users,
    Target,
    UserCheck,
    UserPlus,
    Settings,
    Calendar,
    Clock,
    MapPin,
    DollarSign,
    TrendingUp,
    BookOpen,
    Star,
    Phone,
    Mail,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Plus,
    Edit,
    Eye,
    BarChart3
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let classData = data.class;
  let students = data.students || [];
  let classSkills = data.classSkills || [];
  let classStats = data.classStats;
  let attendanceStats = data.attendanceStats;

  // Vista actual
  let currentView: 'overview' | 'students' | 'skills' | 'attendance' = 'overview';

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

  onMount(() => {
    console.log('✅ Individual class page: Class:', classData?.name);
    console.log('✅ Students:', students.length);
    console.log('✅ Skills:', classSkills.length);
  });

  const handleGoBack = () => {
    // Navegación contextual: clase → centro → dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const fromSchool = urlParams.get('from_school');
    
    if (fromSchool) {
      // Si viene de un centro específico, volver al centro
      goto(`/schools/${fromSchool}`);
    } else if (classData?.college_id) {
      // Si la clase tiene un centro asignado, ir al centro
      goto(`/schools/${classData.college_id}`);
    } else {
      // Por defecto, volver a la lista de clases
      goto('/classes');
    }
  };

  const handleManageStudents = () => {
    // Mantener el contexto del centro si viene de ahí
    const urlParams = new URLSearchParams(window.location.search);
    const fromSchool = urlParams.get('from_school');
    
    let queryParams = new URLSearchParams();
    if (fromSchool) {
      queryParams.set('from_school', fromSchool);
    } else if (classData?.college_id) {
      queryParams.set('from_school', classData.college_id);
    }
    queryParams.set('from_class', classData.id);
    
    const queryString = queryParams.toString();
    goto(`/classes/${classData.id}/students${queryString ? `?${queryString}` : ''}`);
  };

  const handleCreateStudent = () => {
    // Ir directamente al formulario de creación con contexto de la clase
    goto(`/students/create?class_id=${classData.id}&college_id=${classData.college_id}&return_to=${encodeURIComponent(`/classes/${classData.id}`)}`);
  };

  const handleManageSkills = () => {
    goto(`/classes/${classData.id}/skills`);
  };

  const handleEditClass = () => {
    goto(`/classes/${classData.id}/edit`);
  };

  const handleTakeAttendance = () => {
    goto(`/classes/${classData.id}/attendance`);
  };

  const handleViewStudent = (studentId: string) => {
    goto(`/students/${studentId}`);
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-400';
    if (rate >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getOccupancyBarColor = (rate: number) => {
    if (rate >= 90) return 'bg-red-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => i < difficulty);
  };
</script>

<svelte:head>
  <title>{classData?.name || 'Clase'} - ChessNet</title>
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
            <div class="p-2 bg-blue-500/20 rounded-lg">
              <GraduationCap class="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">{classData?.name}</h1>
              <p class="text-sm text-slate-400">{classData?.school?.name} • {classData?.schedule}</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <button on:click={handleTakeAttendance} class="btn-primary">
            <UserCheck class="w-4 h-4 mr-2" />
            Pasar Lista
          </button>
          <button on:click={handleEditClass} class="btn-secondary">
            <Settings class="w-4 h-4 mr-2" />
            Configurar
          </button>
        </div>
      </div>

      <!-- Navigation tabs -->
      <div class="mt-4">
        <div class="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1 w-fit">
          <button 
            on:click={() => currentView = 'overview'}
            class={`px-4 py-2 rounded-md transition-colors ${currentView === 'overview' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart3 class="w-4 h-4 inline mr-2" />
            Resumen
          </button>
          <button 
            on:click={() => currentView = 'students'}
            class={`px-4 py-2 rounded-md transition-colors ${currentView === 'students' ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Users class="w-4 h-4 inline mr-2" />
            Estudiantes ({students.length})
          </button>
          <button 
            on:click={() => currentView = 'skills'}
            class={`px-4 py-2 rounded-md transition-colors ${currentView === 'skills' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Target class="w-4 h-4 inline mr-2" />
            Temario ({classSkills.length})
          </button>
          <button 
            on:click={() => currentView = 'attendance'}
            class={`px-4 py-2 rounded-md transition-colors ${currentView === 'attendance' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Calendar class="w-4 h-4 inline mr-2" />
            Asistencia
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    {#if currentView === 'overview'}
      <!-- Resumen General -->
      <div class="space-y-8">
        <!-- Información de la clase -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Detalles principales -->
          <div class="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-6">Información de la Clase</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <Clock class="w-5 h-5 text-slate-500" />
                  <div>
                    <p class="text-slate-300">{classData?.schedule}</p>
                    <p class="text-slate-400 text-sm">Horario de clases</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <MapPin class="w-5 h-5 text-slate-500" />
                  <div>
                    <p class="text-slate-300">{classData?.room}</p>
                    <p class="text-slate-400 text-sm">Aula asignada</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <Users class="w-5 h-5 text-slate-500" />
                  <div>
                    <p class="text-slate-300">{classStats.total_students}/{classData?.max_students} estudiantes</p>
                    <p class="text-slate-400 text-sm">Ocupación actual</p>
                  </div>
                </div>

                {#if classData?.price}
                  <div class="flex items-center space-x-3">
                    <DollarSign class="w-5 h-5 text-slate-500" />
                    <div>
                      <p class="text-slate-300">{formatCurrency(classData.price)}/mes</p>
                      <p class="text-slate-400 text-sm">Precio mensual</p>
                    </div>
                  </div>
                {/if}
              </div>

              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <Calendar class="w-5 h-5 text-slate-500" />
                  <div>
                    <p class="text-slate-300">
                      {new Date(classData?.start_date).toLocaleDateString('es-ES')} - 
                      {new Date(classData?.end_date).toLocaleDateString('es-ES')}
                    </p>
                    <p class="text-slate-400 text-sm">Duración del curso</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <Target class="w-5 h-5 text-slate-500" />
                  <div>
                    <span class={`px-3 py-1 rounded-full text-sm font-medium border ${levelColors[classData?.level]}`}>
                      {levelLabels[classData?.level]}
                    </span>
                    <p class="text-slate-400 text-sm mt-1">Nivel de la clase</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <TrendingUp class="w-5 h-5 text-slate-500" />
                  <div>
                    <p class={`text-slate-300 font-medium ${getOccupancyColor(classStats.occupancy_rate)}`}>
                      {classStats.occupancy_rate}% ocupación
                    </p>
                    <p class="text-slate-400 text-sm">Tasa de ocupación</p>
                  </div>
                </div>
              </div>
            </div>

            {#if classData?.description}
              <div class="mt-6 p-4 bg-slate-700/50 rounded-lg">
                <h3 class="font-medium text-slate-300 mb-2">Descripción</h3>
                <p class="text-slate-400 leading-relaxed">{classData.description}</p>
              </div>
            {/if}

            {#if classData?.instructor_notes}
              <div class="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 class="font-medium text-blue-300 mb-2">Notas del Instructor</h3>
                <p class="text-blue-200 leading-relaxed">{classData.instructor_notes}</p>
              </div>
            {/if}
          </div>

          <!-- Estadísticas rápidas -->
          <div class="space-y-6">
            <!-- Ocupación -->
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 class="font-semibold mb-4">Ocupación de la Clase</h3>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Estudiantes activos</span>
                  <span class="font-bold text-green-400">{classStats.active_students}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Estudiantes inactivos</span>
                  <span class="font-bold text-gray-400">{classStats.inactive_students}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Plazas disponibles</span>
                  <span class="font-bold text-blue-400">{classData?.max_students - classStats.total_students}</span>
                </div>
              </div>

              <div class="mt-4">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-400">Ocupación</span>
                  <span class={`font-medium ${getOccupancyColor(classStats.occupancy_rate)}`}>
                    {classStats.occupancy_rate}%
                  </span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    class={`h-3 rounded-full transition-all duration-300 ${getOccupancyBarColor(classStats.occupancy_rate)}`}
                    style={`width: ${classStats.occupancy_rate}%`}
                  ></div>
                </div>
              </div>
            </div>

            <!-- Asistencia -->
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 class="font-semibold mb-4">Estadísticas de Asistencia</h3>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Sesiones totales</span>
                  <span class="font-bold">{attendanceStats.total_sessions}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Asistencia promedio</span>
                  <span class="font-bold text-green-400">{attendanceStats.average_attendance_rate}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Puntualidad promedio</span>
                  <span class="font-bold text-blue-400">{attendanceStats.average_punctuality_rate}%</span>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-slate-700">
                <div class="text-sm space-y-2">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Última sesión</span>
                    <span class="text-slate-300">
                      {new Date(attendanceStats.last_session_date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Próxima sesión</span>
                    <span class="text-slate-300">
                      {new Date(attendanceStats.next_session_date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Temario -->
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold">Temario</h3>
                <button on:click={handleManageSkills} class="text-purple-400 hover:text-purple-300 text-sm">
                  Gestionar
                </button>
              </div>
              
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Skills asignadas</span>
                  <span class="font-bold text-purple-400">{classStats.total_skills}</span>
                </div>
                
                {#if classStats.skills_by_category && typeof classStats.skills_by_category === 'object'}
                  {#each Object.entries(classStats.skills_by_category) as [category, count]}
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-slate-500">{category}</span>
                      <span class="text-slate-400">{count}</span>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-6">Acciones Rápidas</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button on:click={handleTakeAttendance} class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors text-left">
              <UserCheck class="w-8 h-8 text-green-400 mb-3" />
              <h3 class="font-medium text-green-300">Pasar Lista</h3>
              <p class="text-sm text-green-400/80">Marcar asistencia hoy</p>
            </button>

            <button on:click={handleCreateStudent} class="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors text-left">
              <UserPlus class="w-8 h-8 text-cyan-400 mb-3" />
              <h3 class="font-medium text-cyan-300">Nuevo Estudiante</h3>
              <p class="text-sm text-cyan-400/80">Crear e inscribir</p>
            </button>

            <button on:click={handleManageStudents} class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors text-left">
              <Users class="w-8 h-8 text-blue-400 mb-3" />
              <h3 class="font-medium text-blue-300">Gestionar Estudiantes</h3>
              <p class="text-sm text-blue-400/80">Inscribir/desinscribir</p>
            </button>

            <button on:click={handleManageSkills} class="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors text-left">
              <Target class="w-8 h-8 text-purple-400 mb-3" />
              <h3 class="font-medium text-purple-300">Gestionar Temario</h3>
              <p class="text-sm text-purple-400/80">Asignar skills</p>
            </button>

            <button on:click={handleEditClass} class="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors text-left">
              <Settings class="w-8 h-8 text-orange-400 mb-3" />
              <h3 class="font-medium text-orange-300">Configurar Clase</h3>
              <p class="text-sm text-orange-400/80">Editar información</p>
            </button>
          </div>
        </div>
      </div>

    {:else if currentView === 'students'}
      <!-- Lista de Estudiantes -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Estudiantes Inscritos</h2>
          <div class="flex items-center space-x-3">
            <button on:click={handleCreateStudent} class="btn-secondary">
              <UserPlus class="w-4 h-4 mr-2" />
              Nuevo Estudiante
            </button>
            <button on:click={handleManageStudents} class="btn-primary">
              <Plus class="w-4 h-4 mr-2" />
              Gestionar Inscripciones
            </button>
          </div>
        </div>

        {#if students.length === 0}
          <div class="text-center py-12 bg-slate-800 border border-slate-700 rounded-xl">
            <Users class="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-slate-400 mb-2">No hay estudiantes inscritos</h3>
            <p class="text-slate-500 mb-6">Crea nuevos estudiantes o inscribe estudiantes existentes en esta clase</p>
            <div class="flex items-center justify-center space-x-4">
              <button on:click={handleCreateStudent} class="btn-primary">
                <UserPlus class="w-4 h-4 mr-2" />
                Crear Estudiante
              </button>
              <button on:click={handleManageStudents} class="btn-secondary">
                <Plus class="w-4 h-4 mr-2" />
                Inscribir Existentes
              </button>
            </div>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each students as student}
              <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span class="text-white font-bold text-lg">
                        {student.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'XX'}
                      </span>
                    </div>
                    <div>
                      <h3 class="font-semibold">{student.name}</h3>
                      <p class="text-sm text-slate-400">{student.age} años</p>
                    </div>
                  </div>
                  
                  <button 
                    on:click={() => handleViewStudent(student.id)}
                    class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    title="Ver perfil del estudiante"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center space-x-2 text-sm">
                    <Mail class="w-4 h-4 text-slate-500" />
                    <span class="text-slate-300">{student.email}</span>
                  </div>
                  
                  <div class="flex items-center space-x-2 text-sm">
                    <Phone class="w-4 h-4 text-slate-500" />
                    <span class="text-slate-300">{student.phone}</span>
                  </div>

                  <div class="flex items-center space-x-2 text-sm">
                    <AlertTriangle class="w-4 h-4 text-slate-500" />
                    <span class="text-slate-300 text-xs">{student.emergency_contact}</span>
                  </div>

                  <div class="flex items-center justify-between pt-3 border-t border-slate-700">
                    <span class={`px-3 py-1 rounded-full text-xs font-medium border ${levelColors[student.level]}`}>
                      {levelLabels[student.level]}
                    </span>
                    <div class="flex items-center space-x-1">
                      {#if student.active}
                        <CheckCircle class="w-4 h-4 text-green-400" />
                        <span class="text-xs text-green-400">Activo</span>
                      {:else}
                        <XCircle class="w-4 h-4 text-gray-400" />
                        <span class="text-xs text-gray-400">Inactivo</span>
                      {/if}
                    </div>
                  </div>

                  {#if student.notes}
                    <div class="p-3 bg-slate-700/50 rounded-lg">
                      <p class="text-xs text-slate-400 mb-1">Notas:</p>
                      <p class="text-sm text-slate-300 leading-relaxed">{student.notes}</p>
                    </div>
                  {/if}

                  <div class="text-xs text-slate-500">
                    Inscrito: {new Date(student.enrollment_date).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

    {:else if currentView === 'skills'}
      <!-- Temario de la Clase -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Temario de la Clase</h2>
          <button on:click={handleManageSkills} class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            Gestionar Temario
          </button>
        </div>

        {#if classSkills.length === 0}
          <div class="text-center py-12 bg-slate-800 border border-slate-700 rounded-xl">
            <Target class="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-slate-400 mb-2">No hay skills asignadas</h3>
            <p class="text-slate-500 mb-6">Asigna habilidades para crear el temario de la clase</p>
            <button on:click={handleManageSkills} class="btn-primary">
              <Plus class="w-4 h-4 mr-2" />
              Asignar Skills
            </button>
          </div>
        {:else}
          <div class="space-y-4">
            {#each classSkills as classSkill, index}
              <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-4">
                    <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h3 class="font-semibold text-lg">{classSkill.skill.name}</h3>
                        <div class="flex items-center space-x-1">
                          {#each getDifficultyStars(classSkill.skill.difficulty) as filled}
                            <Star class={`w-4 h-4 ${filled ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                          {/each}
                        </div>
                      </div>
                      
                      <p class="text-slate-400 mb-3 leading-relaxed">{classSkill.skill.description}</p>
                      
                      <div class="flex items-center space-x-4">
                        <span 
                          class="px-3 py-1 rounded-full text-xs font-medium"
                          style={`background-color: ${classSkill.skill.category?.color}20; color: ${classSkill.skill.category?.color}; border: 1px solid ${classSkill.skill.category?.color}30`}
                        >
                          {classSkill.skill.category?.name || 'Sin categoría'}
                        </span>
                        <span class="text-xs text-slate-500">
                          Dificultad: {classSkill.skill.difficulty}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

    {:else if currentView === 'attendance'}
      <!-- Vista de Asistencia -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Control de Asistencia</h2>
          <button on:click={handleTakeAttendance} class="btn-primary">
            <UserCheck class="w-4 h-4 mr-2" />
            Pasar Lista Hoy
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Estadísticas generales -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 class="font-semibold mb-4">Estadísticas Generales</h3>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Sesiones totales</span>
                  <span class="font-bold">{attendanceStats.total_sessions}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Asistencia promedio</span>
                  <span class="font-bold text-green-400">{attendanceStats.average_attendance_rate}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Puntualidad promedio</span>
                  <span class="font-bold text-blue-400">{attendanceStats.average_punctuality_rate}%</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 class="font-semibold mb-4">Próximas Sesiones</h3>
              
              <div class="space-y-3">
                <div class="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Calendar class="w-5 h-5 text-blue-400" />
                  <div>
                    <p class="font-medium text-blue-300">
                      {new Date(attendanceStats.next_session_date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p class="text-sm text-blue-400/80">{classData?.schedule?.split(' ')[2] || '10:00'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acceso rápido -->
          <div class="lg:col-span-2">
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 class="font-semibold mb-6">Gestión de Asistencia</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button on:click={handleTakeAttendance} class="p-6 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors text-left">
                  <UserCheck class="w-10 h-10 text-green-400 mb-4" />
                  <h4 class="font-medium text-green-300 mb-2">Pasar Lista</h4>
                  <p class="text-sm text-green-400/80">Marcar asistencia para la sesión de hoy</p>
                </button>

                <button on:click={() => goto(`/classes/${classData.id}/attendance`)} class="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors text-left">
                  <Calendar class="w-10 h-10 text-blue-400 mb-4" />
                  <h4 class="font-medium text-blue-300 mb-2">Ver Historial</h4>
                  <p class="text-sm text-blue-400/80">Revisar asistencia de sesiones anteriores</p>
                </button>

                <button on:click={() => goto(`/classes/${classData.id}/attendance`)} class="p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors text-left">
                  <BarChart3 class="w-10 h-10 text-purple-400 mb-4" />
                  <h4 class="font-medium text-purple-300 mb-2">Ver Estadísticas</h4>
                  <p class="text-sm text-purple-400/80">Analizar patrones de asistencia</p>
                </button>

                <button on:click={() => goto(`/classes/${classData.id}/attendance`)} class="p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors text-left">
                  <TrendingUp class="w-10 h-10 text-orange-400 mb-4" />
                  <h4 class="font-medium text-orange-300 mb-2">Reportes</h4>
                  <p class="text-sm text-orange-400/80">Generar informes de asistencia</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  .input {
    @apply bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500;
  }
</style>
