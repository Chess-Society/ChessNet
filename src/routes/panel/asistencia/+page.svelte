<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { 
    CheckCircle, 
    XCircle, 
    Calendar, 
    Users, 
    ChevronLeft, 
    ChevronRight,
    Search,
    Clock,
    UserCheck,
    Save
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  let selectedClassId = $state($page.url.searchParams.get('classId') || '');
  let selectedDate = $state(new Date().toISOString().split('T')[0]);

  // Datos reactivos
  let classes = $derived($appStore.classes || []);
  let selectedClass = $derived(classes.find(c => c.id === selectedClassId));
  let students = $derived($appStore.students || []);
  
  // Alumnos inscritos en la clase seleccionada
  let classStudents = $derived(() => {
    if (!selectedClass) return [];
    return students.filter(s => selectedClass.studentIds?.includes(s.id));
  });

  // Registro de asistencia actual (si existe en el store)
  let currentAttendance = $derived(() => {
    return $appStore.attendance.find(a => a.classId === selectedClassId && a.date === selectedDate);
  });

  // Estado local para la edición antes de sincronizar si es necesario, 
  // pero el store es reactivo, así que podemos modificarlo directamente.
  
  const toggleStatus = (studentId: string) => {
    if (!selectedClassId) return;
    
    const records = currentAttendance()?.records || [];
    const recordIdx = records.findIndex((r: any) => r.studentId === studentId);
    
    let newRecords = [...records];
    if (recordIdx === -1) {
      newRecords.push({ studentId, status: 'present' });
    } else {
      const currentStatus = records[recordIdx].status;
      newRecords[recordIdx].status = currentStatus === 'present' ? 'absent' : 'present';
    }

    appStore.updateAttendance(selectedClassId, selectedDate, newRecords);
  };

  const getStatus = (studentId: string) => {
    const record = currentAttendance()?.records.find((r: any) => r.studentId === studentId);
    return record ? record.status : 'unmarked';
  };

  const markAllPresent = () => {
    if (!selectedClassId) return;
    const newRecords = classStudents().map(s => ({ studentId: s.id, status: 'present' }));
    appStore.updateAttendance(selectedClassId, selectedDate, newRecords);
  };

  const stats = $derived(() => {
    const records = currentAttendance()?.records || [];
    const present = records.filter((r: any) => r.status === 'present').length;
    const total = classStudents().length;
    return { present, total, percent: total > 0 ? Math.round((present / total) * 100) : 0 };
  });

</script>

<svelte:head>
  <title>Control de Asistencia - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-pink-500">
          <CheckCircle class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Control de Asistencia</h1>
          <p class="text-slate-400 text-sm">Registra la asistencia diaria de tus grupos y mantén el control.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
    <div class="lg:col-span-1 space-y-4">
        <label class="block">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Seleccionar Clase</span>
            <select 
              bind:value={selectedClassId}
              class="w-full mt-1.5 bg-[#1e293b]/50 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:border-pink-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl"
            >
              <option value="">Selecciona una clase...</option>
              {#each classes as cls}
                <option value={cls.id}>{cls.name}</option>
              {/each}
            </select>
        </label>
    </div>

    <div class="lg:col-span-1 space-y-4">
        <label class="block">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha de Sesión</span>
            <div class="relative">
                <Calendar class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="date"
                  bind:value={selectedDate}
                  class="w-full mt-1.5 bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-pink-500/50 outline-none transition-all backdrop-blur-xl"
                />
            </div>
        </label>
    </div>

    {#if selectedClassId}
    <div class="lg:col-span-2 flex items-end gap-3">
        <div class="flex-grow bg-[#1e293b]/30 border border-slate-800 rounded-2xl px-6 py-3 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="text-center">
                    <p class="text-[9px] font-bold text-slate-500 uppercase">Presentes</p>
                    <p class="text-lg font-bold text-emerald-500">{stats().present}</p>
                </div>
                <div class="w-px h-8 bg-slate-800"></div>
                <div class="text-center">
                    <p class="text-[9px] font-bold text-slate-500 uppercase">Ausentes</p>
                    <p class="text-lg font-bold text-red-500">{stats().total - stats().present}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <div class="text-right">
                    <p class="text-[9px] font-bold text-slate-500 uppercase">Asistencia</p>
                    <p class="text-xl font-bold text-white">{stats().percent}%</p>
                </div>
                <div class="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                    <div class="absolute inset-0 rounded-full border-2 border-pink-500 border-t-transparent" style="transform: rotate({stats().percent * 3.6}deg)"></div>
                    <UserCheck class="w-4 h-4 text-pink-500" />
                </div>
            </div>
        </div>
        <button 
            onclick={markAllPresent}
            class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl text-xs font-bold transition-all border border-slate-700 whitespace-nowrap"
        >
            Todos Presentes
        </button>
    </div>
    {/if}
  </div>

  {#if !selectedClassId}
    <div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6">
      <div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">
        <Clock class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">Selecciona una clase</h2>
        <p class="text-slate-500 text-sm">Elige el grupo del que quieres registrar la asistencia hoy.</p>
      </div>
    </div>
  {:else if classStudents().length === 0}
    <div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6">
      <div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">
        <Users class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">No hay alumnos en esta clase</h2>
        <p class="text-slate-500 text-sm">Añade alumnos a la clase "{selectedClass?.name}" para empezar el registro.</p>
        <button onclick={() => goto(`/panel/clases/${selectedClassId}`)} class="text-pink-500 font-bold text-xs mt-4">Configurar Clase →</button>
      </div>
    </div>
  {:else}
    <div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div class="grid grid-cols-1 divide-y divide-slate-800">
            {#each classStudents() as student}
                {@const status = getStatus(student.id)}
                <div class="flex items-center justify-between p-6 hover:bg-slate-800/30 transition-all group">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400">
                            {student.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                            <p class="text-white font-bold">{student.name}</p>
                            <p class="text-[10px] text-slate-500 uppercase tracking-widest">{student.level || 'Sin nivel'}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button 
                            onclick={() => toggleStatus(student.id)}
                            class="flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all font-bold text-xs
                            {status === 'present' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-emerald-500/30'}"
                        >
                            <CheckCircle class="w-4 h-4" />
                            Presente
                        </button>
                        <button 
                            onclick={() => toggleStatus(student.id)}
                            class="flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all font-bold text-xs
                            {status === 'absent' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-red-500/30'}"
                        >
                            <XCircle class="w-4 h-4" />
                            Ausente
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="mt-8 flex justify-end">
        <div class="flex items-center gap-4 text-slate-500 text-xs italic">
            <Save class="w-4 h-4" />
            Los cambios se guardan automáticamente en la nube.
        </div>
    </div>
  {/if}
</div>
