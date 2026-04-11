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
    BarChart3,
    Trophy,
    Boxes,
    ClipboardCheck
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  const classData = $derived(data.class as any);
  const students = $derived((data.students || []) as any[]);
  const classSkills = $derived((data.classSkills || []) as any[]);
  const classStats = $derived(data.classStats as any);
  const attendanceStats = $derived(data.attendanceStats as any);

  let currentView = $state<'overview' | 'students' | 'skills' | 'attendance'>('overview');

  const levelColors = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    mixed: 'bg-surface-500/10 text-surface-400 border-surface-500/20'
  };

  const levelLabels = {
    beginner: 'PRINCIPIANTE',
    intermediate: 'INTERMEDIO',
    advanced: 'AVANZADO',
    mixed: 'MIXTO'
  };

  const handleGoBack = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSchool = urlParams.get('from_school');
    if (fromSchool) goto(`/schools/${fromSchool}`);
    else if (classData?.college_id) goto(`/schools/${classData.college_id}`);
    else goto('/classes');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
</script>

<svelte:head>
  <title>{classData?.name} - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={handleGoBack}
        class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Regresar
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">
          <GraduationCap class="w-8 h-8" />
        </div>
        <div>
          <div class="flex items-center gap-3 mb-1">
             <h1 class="text-3xl font-black text-white tracking-tighter uppercase">{classData?.name}</h1>
             <span class={`text-[8px] font-black px-2 py-0.5 rounded-full border ${levelColors[classData?.level as keyof typeof levelColors]}`}>
               {levelLabels[classData?.level as keyof typeof levelColors]}
             </span>
          </div>
          <p class="text-surface-500 text-sm font-medium uppercase tracking-widest">{classData?.school?.name} • {classData?.schedule}</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => goto(`/classes/${classData.id}/attendance`)}
        class="bg-surface-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-primary-500/50 transition-all flex items-center gap-3"
      >
        <ClipboardCheck class="w-4 h-4 text-primary-400" />
        Asistencia
      </button>
      <button 
        onclick={() => goto(`/classes/${classData.id}/edit`)}
        class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3"
      >
        <Settings class="w-4 h-4" />
        Configurar
      </button>
    </div>
  </div>

  <!-- Tab Navigation -->
  <div class="flex items-center gap-1 bg-surface-950/50 p-1.5 rounded-2xl border border-surface-900 w-fit">
    <button 
      onclick={() => currentView = 'overview'}
      class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'overview' ? 'bg-primary-500 text-black' : 'text-surface-500 hover:text-white'}`}
    >
      <BarChart3 class="w-3.5 h-3.5" />
      Resumen
    </button>
    <button 
      onclick={() => currentView = 'students'}
      class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'students' ? 'bg-primary-500 text-black' : 'text-surface-500 hover:text-white'}`}
    >
      <Users class="w-3.5 h-3.5" />
      Alumnos ({students.length})
    </button>
    <button 
      onclick={() => currentView = 'skills'}
      class={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentView === 'skills' ? 'bg-primary-500 text-black' : 'text-surface-500 hover:text-white'}`}
    >
      <Target class="w-3.5 h-3.5" />
      Temario ({classSkills.length})
    </button>
  </div>

  {#if currentView === 'overview'}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10" in:fly={{ y: 20 }}>
      <!-- Main Info Panel -->
      <div class="lg:col-span-2 space-y-8">
        <section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500">
           <div class="flex items-center justify-between">
              <h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">
                <Boxes class="w-5 h-5 text-primary-400" />
                Detalles del Grupo
              </h2>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-surface-950 rounded-2xl text-primary-400 border border-surface-800">
                    <Clock class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1">Horario Semanal</p>
                    <p class="text-white font-bold">{classData?.schedule}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="p-3 bg-surface-950 rounded-2xl text-primary-400 border border-surface-800">
                    <MapPin class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1">Aula / Ubicación</p>
                    <p class="text-white font-bold">{classData?.room || 'POR DEFINIR'}</p>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-surface-950 rounded-2xl text-primary-400 border border-surface-800">
                    <Calendar class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1">Periodo Lectivo</p>
                    <p class="text-white font-bold text-xs">
                      {new Date(classData?.start_date).toLocaleDateString('es-ES')} - {new Date(classData?.end_date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="p-3 bg-surface-950 rounded-2xl text-primary-400 border border-surface-800">
                    <DollarSign class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1">Cuota Mensual</p>
                    <p class="text-white font-bold">{formatCurrency(classData?.price || 0)}</p>
                  </div>
                </div>
              </div>
           </div>

           {#if classData?.description}
             <div class="bg-surface-950/50 border border-surface-900 p-6 rounded-2xl">
               <h3 class="text-[8px] font-black text-surface-500 uppercase tracking-[0.2em] mb-3">Descripción General</h3>
               <p class="text-surface-400 text-sm leading-relaxed font-medium">{classData.description}</p>
             </div>
           {/if}
        </section>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onclick={() => goto(`/students/create?class_id=${classData.id}&college_id=${classData.college_id}`)}
            class="glass-panel p-8 text-left hover:border-primary-500/50 transition-all group relative overflow-hidden"
          >
            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserPlus class="w-24 h-24 text-white" />
            </div>
            <UserPlus class="w-8 h-8 text-primary-400 mb-4" />
            <h4 class="text-white font-black uppercase text-sm mb-1">Inscribir Alumno</h4>
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-widest">Añadir nuevo registro</p>
          </button>

          <button 
            onclick={() => goto(`/classes/${classData.id}/attendance`)}
            class="glass-panel p-8 text-left hover:border-emerald-500/50 transition-all group relative overflow-hidden"
          >
            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ClipboardCheck class="w-24 h-24 text-white" />
            </div>
            <ClipboardCheck class="w-8 h-8 text-emerald-400 mb-4" />
            <h4 class="text-white font-black uppercase text-sm mb-1">Tomar Asistencia</h4>
            <p class="text-surface-500 text-[10px] font-black uppercase tracking-widest">Pasar lista hoy</p>
          </button>
        </div>
      </div>

      <!-- Stats Sidebar -->
      <div class="space-y-8">
        <!-- Capacity Card -->
        <div class="glass-panel p-8 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Ocupación</h3>
            <span class="text-xs font-black text-primary-400">{classStats.occupancy_rate}%</span>
          </div>
          
          <div class="h-3 bg-surface-950 rounded-full border border-surface-900 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000"
              style="width: {classStats.occupancy_rate}%"
            ></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-surface-950 p-4 rounded-2xl border border-surface-900 text-center">
               <p class="text-[8px] font-black text-surface-500 uppercase mb-1">Activos</p>
               <p class="text-xl font-black text-white">{classStats.active_students}</p>
            </div>
            <div class="bg-surface-950 p-4 rounded-2xl border border-surface-900 text-center">
               <p class="text-[8px] font-black text-surface-500 uppercase mb-1">Libres</p>
               <p class="text-xl font-black text-primary-400">{(classData.max_students || 0) - classStats.total_students}</p>
            </div>
          </div>
        </div>

        <!-- Attendance Stats -->
        <div class="glass-panel p-8 space-y-6">
           <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Métricas de Asistencia</h3>
           
           <div class="space-y-4">
              <div class="flex items-center justify-between py-2 border-b border-surface-900">
                <span class="text-[10px] font-black text-surface-500 uppercase">Promedio</span>
                <span class="text-xs font-black text-emerald-400">{attendanceStats.average_attendance_rate}%</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-surface-900">
                <span class="text-[10px] font-black text-surface-500 uppercase">Puntualidad</span>
                <span class="text-xs font-black text-blue-400">{attendanceStats.average_punctuality_rate}%</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-[10px] font-black text-surface-500 uppercase">Última Sesión</span>
                <span class="text-[10px] font-bold text-white uppercase">{new Date(attendanceStats.last_session_date).toLocaleDateString()}</span>
              </div>
           </div>
        </div>

        <!-- Trophy/Motivation -->
        <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5 text-center space-y-2">
           <Trophy class="w-10 h-10 text-primary-400 mx-auto mb-2" />
           <p class="text-[10px] font-black text-white uppercase tracking-widest">Grupo en Proceso</p>
           <p class="text-[10px] text-surface-500 font-bold leading-relaxed">Este grupo ha completado el 45% de las habilidades programadas.</p>
        </div>
      </div>
    </div>

  {:else if currentView === 'students'}
    <div class="space-y-6" in:fly={{ y: 20 }}>
      <div class="flex items-center justify-between">
         <h2 class="text-xl font-black text-white uppercase tracking-tighter">Estudiantes Registrados</h2>
         <div class="flex items-center gap-3">
             <button 
               onclick={() => goto(`/classes/${classData.id}/students`)}
               class="bg-surface-950 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-primary-500/50 transition-all flex items-center gap-2"
             >
               <Users class="w-4 h-4" />
               Gestionar
             </button>
         </div>
      </div>

      {#if students.length === 0}
         <div class="glass-panel p-20 text-center space-y-6">
            <div class="w-20 h-20 bg-surface-950 rounded-full border border-surface-800 flex items-center justify-center mx-auto text-surface-800">
              <Users class="w-10 h-10" />
            </div>
            <div class="space-y-2">
              <h3 class="text-white font-black uppercase">Sin alumnos todavía</h3>
              <p class="text-surface-500 text-xs font-medium">Comienza por añadir tu primer estudiante a este grupo.</p>
            </div>
            <button 
              onclick={() => goto(`/students/create?class_id=${classData.id}`)}
              class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all"
            >
              Crear Nuevo Estudiante
            </button>
         </div>
      {:else}
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each students as student}
               <div class="glass-panel p-6 hover:border-primary-500/30 transition-all group">
                  <div class="flex items-center gap-4 mb-6">
                     <div class="w-14 h-14 bg-surface-950 rounded-2xl border border-surface-800 flex items-center justify-center text-primary-400 font-black text-lg group-hover:border-primary-500/50 transition-colors">
                        {student.name.charAt(0)}
                     </div>
                     <div>
                        <h4 class="text-white font-black uppercase text-sm leading-tight">{student.name}</h4>
                        <p class="text-[10px] text-surface-500 font-bold uppercase tracking-widest">{student.age} años • {levelLabels[student.level as keyof typeof levelLabels]}</p>
                     </div>
                  </div>

                  <div class="space-y-3 pb-6 border-b border-surface-900 mb-6">
                     <div class="flex items-center gap-3 text-surface-400">
                        <Mail class="w-3.5 h-3.5 text-primary-500/50" />
                        <span class="text-[10px] font-bold truncate uppercase">{student.email || 'SIN EMAIL'}</span>
                     </div>
                     <div class="flex items-center gap-3 text-surface-400">
                        <Phone class="w-3.5 h-3.5 text-primary-500/50" />
                        <span class="text-[10px] font-bold uppercase">{student.phone || 'SIN TELÉFONO'}</span>
                     </div>
                  </div>

                  <div class="flex items-center justify-between">
                     <div class="flex items-center gap-2">
                        <div class={`w-1.5 h-1.5 rounded-full ${student.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-surface-800'}`}></div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-surface-500">{student.active ? 'ACTIVO' : 'INACTIVO'}</span>
                     </div>
                     <button 
                       onclick={() => goto(`/students/${student.id}`)}
                       class="p-2 bg-surface-950 rounded-xl border border-surface-800 hover:text-primary-400 transition-colors"
                     >
                       <Eye class="w-4 h-4" />
                     </button>
                  </div>
               </div>
            {/each}
         </div>
      {/if}
    </div>

  {:else if currentView === 'skills'}
    <div class="space-y-6" in:fly={{ y: 20 }}>
      <div class="flex items-center justify-between">
         <h2 class="text-xl font-black text-white uppercase tracking-tighter">Temario Programado</h2>
         <button 
           onclick={() => goto(`/classes/${classData.id}/skills`)}
           class="bg-primary-500 text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all flex items-center gap-2"
         >
           <Plus class="w-4 h-4" />
           Gestionar Skills
         </button>
      </div>

      {#if classSkills.length === 0}
         <div class="glass-panel p-20 text-center space-y-6">
            <Target class="w-16 h-16 text-surface-800 mx-auto" />
            <div class="space-y-2">
              <h3 class="text-white font-black uppercase">Sin objetivos definidos</h3>
              <p class="text-surface-500 text-xs font-medium">Asigna habilidades del currículo de ChessNet a esta clase.</p>
            </div>
         </div>
      {:else}
         <div class="space-y-4">
            {#each classSkills as skill, i}
               <div class="glass-panel p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary-500/30 transition-all">
                  <div class="text-2xl font-black text-surface-900 group-hover:text-primary-500/20 transition-colors">
                     {(i+1).toString().padStart(2, '0')}
                  </div>
                  <div class="flex-1 space-y-2">
                     <div class="flex items-center gap-3">
                        <h4 class="text-white font-black uppercase text-base">{skill.skill.name}</h4>
                        <span class="text-[8px] font-black px-2 py-0.5 rounded-full border border-surface-800 text-surface-500 uppercase">
                          {skill.skill.category?.name}
                        </span>
                     </div>
                     <p class="text-surface-500 text-xs font-medium leading-relaxed max-w-2xl">{skill.skill.description}</p>
                  </div>
                  <div class="flex items-center gap-1">
                     {#each Array(5) as _, j}
                        <Star class={`w-3 h-3 ${j < skill.skill.difficulty ? 'text-primary-500 fill-primary-500' : 'text-surface-900'}`} />
                     {/each}
                  </div>
               </div>
            {/each}
         </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Class detail styles */
</style>
