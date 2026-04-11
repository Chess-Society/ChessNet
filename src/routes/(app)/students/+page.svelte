<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Users, 
    Plus, 
    Edit, 
    Trash2,
    Search,
    Filter,
    School,
    Calendar,
    Eye,
    RefreshCw,
    X,
    TrendingUp,
    Target,
    ChevronRight,
    ArrowUpDown,
    UserCircle
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let students = $state((data.students || []) as any[]);
  let schools = $state((data.schools || []) as any[]);
  let stats = $state(data.stats || { total: 0, schools: {}, newest: null });
  
  // Filtros
  let searchQuery = $state('');
  let selectedSchool = $state('');

  const filteredStudents = $derived(
    students.filter(student => {
      const name = student.name || `${student.first_name || ''} ${student.last_name || ''}`;
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSchool = !selectedSchool || student.college_id === selectedSchool;
      return matchesSearch && matchesSchool;
    })
  );

  const getSchoolName = (schoolId: string) => {
    const school = (schools as any[]).find(s => s.id === schoolId);
    return school ? school.name : 'Sin asignar';
  };

  async function deleteStudent(studentId: string) {
    const student = students.find(s => s.id === studentId);
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${student?.name || 'este estudiante'}?`)) return;
    
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        students = (students as any[]).filter(s => s.id !== studentId);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  }

  const getInitials = (student: any) => {
    if (student.name) {
      return student.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    }
    return `${(student.first_name || 'E').charAt(0)}${(student.last_name || 'S').charAt(0)}`.toUpperCase();
  };
</script>

<svelte:head>
  <title>Estudiantes - ChessNet</title>
</svelte:head>

<div class="space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400">
          <Users class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Comunidad Estudiantil</h1>
          <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Gestión y Seguimiento de Talentos</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="bg-surface-950/50 border border-surface-900 px-5 py-2.5 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
         <div class="text-right">
            <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Base de Datos</p>
            <p class="text-xs font-black text-white uppercase">{students.length} ALUMNOS</p>
         </div>
         <div class="w-px h-6 bg-surface-900"></div>
         <div class="text-right">
            <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Centros</p>
            <p class="text-xs font-black text-white uppercase">{schools.length}</p>
         </div>
      </div>
      
      <button 
        onclick={() => goto('/students/create')}
        class="bg-primary-500 text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/10 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Matricular
      </button>
    </div>
  </div>

  <!-- Search and Filters -->
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-grow relative group">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors" />
      <input
        type="text"
        placeholder="BUSCAR POR NOMBRE O APELLIDO..."
        bind:value={searchQuery}
        class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all backdrop-blur-xl"
      />
    </div>

    <div class="relative group min-w-[240px]">
      <School class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
      <select 
        bind:value={selectedSchool} 
        class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-10 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl"
      >
        <option value="">TODOS LOS CENTROS</option>
        {#each schools as school}
          <option value={school.id}>{school.name.toUpperCase()}</option>
        {/each}
      </select>
    </div>

    <button 
      onclick={() => { searchQuery = ''; selectedSchool = ''; }}
      class="bg-surface-900/50 border border-surface-800 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all backdrop-blur-xl"
    >
      RESETEAR
    </button>
  </div>

  <!-- Students Grid -->
  {#if filteredStudents.length === 0}
    <div class="glass-panel p-24 text-center space-y-6">
      <div class="w-20 h-20 bg-surface-950 rounded-3xl flex items-center justify-center mx-auto border border-surface-900 text-surface-700">
        <Users class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-lg font-black text-white uppercase tracking-tighter">Sin coincidencias</h2>
        <p class="text-surface-500 text-[10px] font-black uppercase tracking-widest">Ajusta los filtros o añade un nuevo alumno</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredStudents as student, i}
        <div 
          class="glass-panel group p-8 space-y-6 hover:border-primary-500/30 transition-all relative overflow-hidden"
          in:fly={{ y: 20, delay: i * 50 }}
        >
          <!-- Accent Light -->
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full group-hover:bg-primary-500/10 transition-all"></div>

          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 bg-surface-950 border border-surface-900 rounded-2xl flex items-center justify-center text-primary-400 font-black text-lg group-hover:scale-110 group-hover:border-primary-500/30 transition-all shadow-2xl">
                {getInitials(student)}
              </div>
              <div>
                <h3 class="text-white font-black uppercase text-sm leading-tight tracking-tight group-hover:text-primary-400 transition-colors">{student.name}</h3>
                <div class="flex items-center gap-2 mt-1">
                   <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest">{getSchoolName(student.college_id)}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onclick={() => goto(`/students/${student.id}/edit`)}
                  class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-500 hover:text-primary-400 hover:border-primary-500/30 transition-all"
                  title="Editar Alumno"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  onclick={() => deleteStudent(student.id)}
                  class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                  title="Eliminar Registro"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
            </div>
          </div>

          {#if student.notes}
            <div class="p-4 bg-surface-950/50 border border-surface-900/50 rounded-xl relative z-10">
              <p class="text-[10px] text-surface-500 font-bold uppercase tracking-widest line-clamp-2 leading-relaxed">
                "{student.notes}"
              </p>
            </div>
          {/if}

          <div class="flex items-center justify-between pt-6 border-t border-surface-900 relative z-10">
            <div class="flex items-center gap-3">
               <div class="px-2 py-0.5 bg-surface-950 border border-surface-900 rounded text-[8px] font-black text-surface-600 uppercase tracking-widest">
                  ALUMNO
               </div>
               {#if student.level}
                <div class="px-2 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded text-[8px] font-black text-primary-400 uppercase tracking-widest">
                  {student.level}
                </div>
               {/if}
            </div>

            <button 
              onclick={() => goto(`/students/${student.id}`)}
              class="flex items-center gap-2 text-[9px] font-black text-primary-400 uppercase tracking-[0.2em] hover:text-white transition-all group/btn"
            >
              PERFIL COMPLETO
              <ChevronRight class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Students page layout */
</style>
