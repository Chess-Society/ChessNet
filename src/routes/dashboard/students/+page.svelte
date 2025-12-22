<script lang="ts">
    import {
        appStore,
        storeActions,
        type Student,
    } from "$lib/services/storage";
    import { Users, Search, UserPlus, Trash2 } from "lucide-svelte";
    import { fade, scale, slide } from "svelte/transition";
    import {
        X,
        GraduationCap,
        CalendarCheck,
        TrendingUp,
        Award,
    } from "lucide-svelte";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let searchTerm = "";
    let showForm = false;
    let newStudent: Student = {
        id: "",
        name: "",
        level: "Pawn",
        email: "",
        notes: "",
    };

    $: filteredStudents = store.students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    function handleSubmit() {
        if (!newStudent.name) return;

        const studentToAdd = {
            ...newStudent,
            id: crypto.randomUUID(),
        };

        storeActions.addStudent(studentToAdd);

        // Reset form
        newStudent = { id: "", name: "", level: "Pawn", email: "", notes: "" };
        showForm = false;
    }

    let selectedStudent: Student | null = null;
    let showReportModal = false;
    let studentStats = {
        attendanceRate: 0,
        classesAttended: 0,
        totalClasses: 0,
    };

    function generateReport(student: Student) {
        selectedStudent = student;

        // Calculate Stats
        const studentRecords = store.attendance.flatMap((r) =>
            r.records
                .filter((rec) => rec.studentId === student.id)
                .map((rec) => ({ date: r.date, status: rec.status })),
        );

        const total = studentRecords.length;
        const present = studentRecords.filter(
            (r) => r.status === "present",
        ).length;

        studentStats = {
            totalClasses: total,
            classesAttended: present,
            attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
        };

        showReportModal = true;
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
    >
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Users class="w-8 h-8 text-emerald-500" /> Estudiantes
            </h1>
            <p class="mt-2 text-slate-400">Directorio completo de alumnos.</p>
        </div>
        <div class="flex gap-3">
            <div class="relative">
                <Search
                    class="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
                />
                <input
                    bind:value={searchTerm}
                    type="text"
                    placeholder="Buscar alumno..."
                    class="bg-[#1e293b] border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-emerald-500 w-64"
                />
            </div>
            <button
                onclick={() => (showForm = !showForm)}
                class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
                <UserPlus class="w-5 h-5" />
                Nuevo Alumno
            </button>
        </div>
    </div>

    {#if showForm}
        <div
            transition:slide
            class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 max-w-2xl"
        >
            <h3 class="text-lg font-bold text-white mb-4">
                Matricular Nuevo Alumno
            </h3>
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            for="student-name"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Nombre Completo</label
                        >
                        <input
                            id="student-name"
                            bind:value={newStudent.name}
                            type="text"
                            placeholder="Ej: Magnus Carlsen"
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label
                            for="student-level"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Nivel Inicial</label
                        >
                        <select
                            id="student-level"
                            bind:value={newStudent.level}
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="Pawn">Peón (Iniciación)</option>
                            <option value="Bishop">Alfil (Intermedio I)</option>
                            <option value="Rook">Torre (Intermedio II)</option>
                            <option value="King">Rey (Avanzado)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label
                        for="student-email"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Email de Contacto</label
                    >
                    <input
                        id="student-email"
                        bind:value={newStudent.email}
                        type="email"
                        placeholder="email@ejemplo.com"
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <button
                        onclick={() => (showForm = false)}
                        class="text-slate-400 hover:text-white px-4 py-2"
                        >Cancelar</button
                    >
                    <button
                        onclick={handleSubmit}
                        class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium"
                        >Guardar Alumno</button
                    >
                </div>
            </div>
        </div>
    {/if}

    <div
        class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
    >
        <table class="w-full text-left">
            <thead class="bg-slate-900/50">
                <tr>
                    <th class="p-4 text-slate-400 font-medium text-sm"
                        >Nombre</th
                    >
                    <th class="p-4 text-slate-400 font-medium text-sm">Nivel</th
                    >
                    <th class="p-4 text-slate-400 font-medium text-sm">Email</th
                    >
                    <th
                        class="p-4 text-slate-400 font-medium text-sm text-right"
                        >Acciones</th
                    >
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
                {#if filteredStudents.length === 0}
                    <tr>
                        <td colspan="4" class="p-8 text-center text-slate-500">
                            No se encontraron estudiantes.
                        </td>
                    </tr>
                {:else}
                    {#each filteredStudents as student}
                        <tr
                            class="hover:bg-slate-800/50 transition-colors group"
                        >
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs"
                                    >
                                        {student.name.charAt(0)}
                                    </div>
                                    <span class="font-medium text-white"
                                        >{student.name}</span
                                    >
                                </div>
                            </td>
                            <td class="p-4">
                                <span
                                    class="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold"
                                >
                                    {student.level}
                                </span>
                            </td>
                            <td class="p-4 text-slate-400 text-sm">
                                {student.email || "—"}
                            </td>
                            <td class="p-4 text-right">
                                <button
                                    onclick={() => generateReport(student)}
                                    class="text-slate-500 hover:text-emerald-400 font-medium text-sm mr-4 cursor-pointer flex items-center gap-1 justify-end ml-auto"
                                >
                                    <Award class="w-4 h-4" />
                                    Generar Informe
                                </button>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>

<!-- Report Modal -->
{#if showReportModal && selectedStudent}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        transition:fade
    >
        <div
            class="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]"
            transition:scale
        >
            <!-- Header -->
            <div
                class="p-6 border-b border-slate-700 flex justify-between items-center"
            >
                <div>
                    <h2 class="text-xl font-bold text-white">
                        Informe del Estudiante
                    </h2>
                    <p class="text-slate-400 text-sm">
                        Generado el {new Date().toLocaleDateString()}
                    </p>
                </div>
                <button
                    onclick={() => (showReportModal = false)}
                    class="text-slate-400 hover:text-white transition-colors"
                >
                    <X class="w-6 h-6" />
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto custom-scrollbar">
                <!-- Profile Header -->
                <div class="flex items-center gap-4 mb-8">
                    <div
                        class="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-2xl border border-emerald-500/30"
                    >
                        {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-white">
                            {selectedStudent.name}
                        </h3>
                        <div class="flex items-center gap-2 mt-1">
                            <span
                                class="bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-500/30"
                            >
                                Nivel: {selectedStudent.level}
                            </span>
                            {#if selectedStudent.email}
                                <span class="text-slate-400 text-sm"
                                    >{selectedStudent.email}</span
                                >
                            {/if}
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <div
                        class="bg-slate-900/50 p-4 rounded-xl border border-slate-800"
                    >
                        <div
                            class="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2"
                        >
                            <CalendarCheck class="w-4 h-4 text-emerald-500" />
                            Asistencia Global
                        </div>
                        <div class="text-2xl font-bold text-white">
                            {studentStats.attendanceRate}%
                        </div>
                        <div class="text-xs text-slate-500 mt-1">
                            {studentStats.classesAttended} de {studentStats.totalClasses}
                            clases
                        </div>
                    </div>
                    <div
                        class="bg-slate-900/50 p-4 rounded-xl border border-slate-800"
                    >
                        <div
                            class="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2"
                        >
                            <TrendingUp class="w-4 h-4 text-blue-500" />
                            Estado
                        </div>
                        <div class="text-2xl font-bold text-white">Activo</div>
                        <div class="text-xs text-slate-500 mt-1">
                            Matrícula vigente
                        </div>
                    </div>
                </div>

                <!-- Learning Progress (Mocked based on Level) -->
                <div class="mb-6">
                    <h4
                        class="text-sm font-bold text-slate-300 uppercase mb-4 flex items-center gap-2"
                    >
                        <GraduationCap class="w-4 h-4 text-purple-500" />
                        Habilidades Adquiridas
                    </h4>

                    <div class="space-y-3">
                        {#if selectedStudent.level === "Pawn"}
                            <div
                                class="flex items-center justify-between text-sm"
                            >
                                <span class="text-slate-300"
                                    >Movimiento de Piezas</span
                                >
                                <span class="text-emerald-400 font-bold"
                                    >100%</span
                                >
                            </div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div
                                    class="bg-emerald-500 h-1.5 rounded-full"
                                    style="width: 100%"
                                ></div>
                            </div>

                            <div
                                class="flex items-center justify-between text-sm mt-3"
                            >
                                <span class="text-slate-300">Mates Básicos</span
                                >
                                <span class="text-yellow-400 font-bold"
                                    >45%</span
                                >
                            </div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div
                                    class="bg-yellow-500 h-1.5 rounded-full"
                                    style="width: 45%"
                                ></div>
                            </div>
                        {:else if selectedStudent.level === "Bishop"}
                            <div
                                class="flex items-center justify-between text-sm"
                            >
                                <span class="text-slate-300"
                                    >Táctica Elemental</span
                                >
                                <span class="text-emerald-400 font-bold"
                                    >80%</span
                                >
                            </div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div
                                    class="bg-emerald-500 h-1.5 rounded-full"
                                    style="width: 80%"
                                ></div>
                            </div>
                            <div
                                class="flex items-center justify-between text-sm mt-3"
                            >
                                <span class="text-slate-300"
                                    >Aperturas Abiertas</span
                                >
                                <span class="text-blue-400 font-bold">60%</span>
                            </div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div
                                    class="bg-blue-500 h-1.5 rounded-full"
                                    style="width: 60%"
                                ></div>
                            </div>
                        {:else}
                            <div
                                class="flex items-center justify-between text-sm"
                            >
                                <span class="text-slate-300"
                                    >Estrategia Avanzada</span
                                >
                                <span class="text-purple-400 font-bold"
                                    >75%</span
                                >
                            </div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div
                                    class="bg-purple-500 h-1.5 rounded-full"
                                    style="width: 75%"
                                ></div>
                            </div>
                        {/if}
                    </div>
                </div>

                <div
                    class="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg"
                >
                    <p class="text-sm text-blue-200">
                        <span class="font-bold">Nota del Profesor:</span>
                        {selectedStudent.notes ||
                            "El alumno progresa adecuadamente según lo esperado para su nivel."}
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-slate-700 flex justify-end">
                <button
                    onclick={() => window.print()}
                    class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mr-2"
                >
                    Imprimir
                </button>
                <button
                    onclick={() => (showReportModal = false)}
                    class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Cerrar
                </button>
            </div>
        </div>
    </div>
{/if}
