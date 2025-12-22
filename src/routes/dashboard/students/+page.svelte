<script lang="ts">
    import { onMount } from "svelte";
    import { getStudents, type Student } from "$lib/services/mockData";
    import {
        Users,
        Search,
        Filter,
        Crown,
        TrendingUp,
        Clock,
    } from "lucide-svelte";

    let students: Student[] = [];
    let loading = true;

    onMount(async () => {
        students = await getStudents();
        loading = false;
    });

    const getLevelColor = (level: string) => {
        switch (level) {
            case "King":
                return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    import { appStore, storeActions, type Student } from "$lib/services/storage";
    import { Users, Search, Filter, Plus, UserPlus, Trash2 } from "lucide-svelte";
    import { slide } from "svelte/transition";

    let store = $appStore;
    appStore.subscribe(value => store = value);

    let searchTerm = "";
    let showForm = false;
    let newStudent: Student = {
        id: '',
        name: '',
        level: 'Pawn',
        email: '',
        notes: ''
    };

    $: filteredStudents = store.students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleSubmit() {
        if (!newStudent.name) return;
        
        const studentToAdd = {
            ...newStudent,
            id: crypto.randomUUID()
        };
        
        storeActions.addStudent(studentToAdd);
        
        // Reset form
        newStudent = { id: '', name: '', level: 'Pawn', email: '', notes: '' };
        showForm = false;
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Users class="w-8 h-8 text-emerald-500" /> Estudiantes
            </h1>
            <p class="mt-2 text-slate-400">
                Directorio completo de alumnos.
            </p>
        </div>
        <div class="flex gap-3">
             <div class="relative">
                <Search class="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                    bind:value={searchTerm}
                    type="text" 
                    placeholder="Buscar alumno..." 
                    class="bg-[#1e293b] border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-emerald-500 w-64"
                >
            </div>
            <button
                onclick={() => showForm = !showForm}
                class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
            >
                <UserPlus class="w-5 h-5" />
                Nuevo Alumno
            </button>
        </div>
    </div>

    {#if showForm}
        <div transition:slide class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 max-w-2xl">
            <h3 class="text-lg font-bold text-white mb-4">Matricular Nuevo Alumno</h3>
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-1">Nombre Completo</label>
                        <input bind:value={newStudent.name} type="text" placeholder="Ej: Magnus Carlsen" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                         <label class="block text-sm font-medium text-slate-400 mb-1">Nivel Inicial</label>
                         <select bind:value={newStudent.level} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                            <option value="Pawn">Peón (Iniciación)</option>
                            <option value="Bishop">Alfil (Intermedio I)</option>
                            <option value="Rook">Torre (Intermedio II)</option>
                            <option value="King">Rey (Avanzado)</option>
                         </select>
                    </div>
                </div>
                 <div>
                    <label class="block text-sm font-medium text-slate-400 mb-1">Email de Contacto</label>
                    <input bind:value={newStudent.email} type="email" placeholder="email@ejemplo.com" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <button onclick={() => showForm = false} class="text-slate-400 hover:text-white px-4 py-2">Cancelar</button>
                    <button onclick={handleSubmit} class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium">Guardar Alumno</button>
                </div>
            </div>
        </div>
    {/if}

    <div class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden">
        <table class="w-full text-left">
            <thead class="bg-slate-900/50">
                <tr>
                    <th class="p-4 text-slate-400 font-medium text-sm">Nombre</th>
                    <th class="p-4 text-slate-400 font-medium text-sm">Nivel</th>
                    <th class="p-4 text-slate-400 font-medium text-sm">Email</th>
                    <th class="p-4 text-slate-400 font-medium text-sm text-right">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
                {#if filteredStudents.length === 0}
                    <tr>
                        <td colspan="4" class="p-8 text-center text-slate-500">
                            No se encontraron estudiantes.
                        </td>
                    </tr>
                                    <div class="flex items-center gap-1">
                                        <Clock class="w-4 h-4" />
                                        <span>{student.lastActive}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <button
                                        class="text-blue-400 hover:text-blue-300 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        Ver Perfil
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>
