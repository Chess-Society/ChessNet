<script lang="ts">
    import {
        appStore,
        storeActions,
        checkPlanLimit,
        type Student,
        type ClassGroup,
    } from "$lib/services/storage";
    import {
        Users,
        Search,
        UserPlus,
        Trash2,
        Pencil,
        FileUp,
    } from "lucide-svelte";
    import { fade, scale, slide } from "svelte/transition";
    import {
        X,
        GraduationCap,
        CalendarCheck,
        TrendingUp,
        Award,
        Save,
    } from "lucide-svelte";

    $: store = $appStore;

    let searchTerm = "";

    // Form State for Creating/Editing
    let showForm = false;
    let isEditing = false;
    let selectedClassId = ""; // For class assignment

    let currentStudent: Student = {
        id: "",
        name: "",
        level: "Pawn",
        email: "",
        notes: "",
    };

    $: filteredStudents = store.students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    function translateLevel(level: string): string {
        const map: Record<string, string> = {
            Pawn: "Peón",
            Bishop: "Alfil",
            Rook: "Torre",
            King: "Rey",
        };
        return map[level] || level;
    }

    // Helper to find student's class
    function getStudentClass(studentId: string): ClassGroup | undefined {
        return store.classes.find((c) => c.students.includes(studentId));
    }

    function getCenterNameForClass(cls: ClassGroup | undefined) {
        if (!cls) return "—";
        const center = store.centers.find((c) => c.id === cls.centerId);
        return center ? center.name : "—";
    }

    let fileInput: HTMLInputElement;

    function triggerFileUpload() {
        if (!checkPlanLimit(store, "students")) {
            alert(
                `Has alcanzado el límite de alumnos de tu plan actual (${store.settings.plan}). Actualiza tu plan para importar más.`,
            );
            return;
        }
        fileInput.click();
    }

    async function handleFileUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        const text = await file.text();
        const lines = text.split("\n");

        let importedCount = 0;
        let limitReached = false;

        for (const line of lines) {
            if (!checkPlanLimit(store, "students")) {
                limitReached = true;
                break;
            }
            const [name, levelRaw, email] = line
                .split(",")
                .map((s) => s.trim());

            if (name && name.length > 2) {
                // Map level text to internal ID if possible, else default
                let level = "Pawn";
                const lowerLevel = (levelRaw || "").toLowerCase();
                if (
                    lowerLevel.includes("alfil") ||
                    lowerLevel.includes("intermedio")
                )
                    level = "Bishop";
                if (
                    lowerLevel.includes("torre") ||
                    lowerLevel.includes("avanzado")
                )
                    level = "Rook";
                if (
                    lowerLevel.includes("rey") ||
                    lowerLevel.includes("maestro")
                )
                    level = "King";

                storeActions.addStudent({
                    id: crypto.randomUUID(),
                    name,
                    level,
                    email: email || "",
                    notes: "Importado vía CSV",
                });
                importedCount++;
            }
        }

        if (limitReached) {
            alert(
                `Se importaron ${importedCount} alumnos, pero se detuvo porque alcanzaste el límite de tu plan.`,
            );
        } else {
            alert(`Se han importado ${importedCount} alumnos correctamente.`);
        }

        target.value = ""; // Reset
    }

    function openCreateForm() {
        if (!checkPlanLimit(store, "students")) {
            alert(
                `Has alcanzado el límite de alumnos de tu plan actual (${store.settings.plan}). Actualiza tu plan para añadir más.`,
            );
            return;
        }

        isEditing = false;
        currentStudent = {
            id: "",
            name: "",
            level: "Pawn",
            email: "",
            notes: "",
        };
        selectedClassId = "";
        showForm = true;
    }

    function openEditForm(student: Student) {
        isEditing = true;
        currentStudent = { ...student };
        const cls = getStudentClass(student.id);
        selectedClassId = cls ? cls.id : "";
        showForm = true;
    }

    function handleSubmit() {
        if (!currentStudent.name) return;

        if (isEditing) {
            // Update existing student
            storeActions.updateStudent(currentStudent);

            // Handle Class Change logic if needed (complex: remove from old, add to new)
            // Ideally we should check if they were in another class and move them.
            const oldClass = getStudentClass(currentStudent.id);
            if (oldClass && oldClass.id !== selectedClassId) {
                storeActions.removeClassMember(oldClass.id, currentStudent.id);
            }
            if (
                selectedClassId &&
                (!oldClass || oldClass.id !== selectedClassId)
            ) {
                storeActions.addClassMember(selectedClassId, currentStudent.id);
            }
        } else {
            // Create new student
            const studentId = crypto.randomUUID();
            const studentToAdd = {
                ...currentStudent,
                id: studentId,
            };
            storeActions.addStudent(studentToAdd);
            if (selectedClassId) {
                storeActions.addClassMember(selectedClassId, studentId);
            }
        }

        // Reset form
        currentStudent = {
            id: "",
            name: "",
            level: "Pawn",
            email: "",
            notes: "",
        };
        selectedClassId = "";
        showForm = false;
        isEditing = false;
    }

    function handleDelete(id: string) {
        if (
            confirm(
                "¿Estás seguro de que quieres eliminar a este alumno? Esta acción no se puede deshacer.",
            )
        ) {
            // Remove from classes first to be clean
            const cls = getStudentClass(id);
            if (cls) {
                storeActions.removeClassMember(cls.id, id);
            }
            storeActions.removeStudent(id);
        }
    }

    // Report Modal State
    let selectedStudentForReport: Student | null = null;
    let showReportModal = false;
    let studentStats = {
        attendanceRate: 0,
        classesAttended: 0,
        totalClasses: 0,
    };
    let studentSkills: any[] = [];
    let skillProgress = 0;

    function generateReport(student: Student) {
        // Fetch latest student object to ensure up-to-date skills/notes
        const freshStudent =
            store.students.find((s) => s.id === student.id) ?? student;
        selectedStudentForReport = { ...freshStudent };

        // Calculate Stats
        const studentRecords = store.attendance.flatMap((r) =>
            r.records
                .filter((rec) => rec.studentId === freshStudent.id)
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

        // Resolve Skills objects for the report
        if (freshStudent.skills && freshStudent.skills.length > 0) {
            studentSkills = store.skills.filter((skill) =>
                freshStudent.skills?.includes(skill.id),
            );
        } else {
            studentSkills = [];
        }

        // Calculate Progression
        skillProgress =
            store.skills.length > 0
                ? Math.round((studentSkills.length / store.skills.length) * 100)
                : 0;

        showReportModal = true;
    }

    function saveReportNote() {
        if (selectedStudentForReport) {
            storeActions.updateStudent(selectedStudentForReport);
            alert("Nota guardada correctamente.");
            // Refresh local list if needed, though store is reactive
        }
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
            <p class="mt-2 text-slate-400">
                Directorio completo de alumnos. Gestiona sus datos, asignaciones
                e informes.
            </p>
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

            <!-- Import Button -->
            <input
                type="file"
                accept=".csv,.txt"
                class="hidden"
                bind:this={fileInput}
                onchange={handleFileUpload}
            />
            <button
                onclick={triggerFileUpload}
                class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
                title="Formato: Nombre, Nivel, Email"
            >
                <FileUp class="w-5 h-5" />
                <span class="hidden sm:inline">Importar</span>
            </button>

            <button
                onclick={openCreateForm}
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
                {isEditing ? "Editar Alumno" : "Matricular Nuevo Alumno"}
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
                            bind:value={currentStudent.name}
                            type="text"
                            placeholder="Ej: Magnus Carlsen"
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label
                            for="student-level"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Nivel</label
                        >
                        <select
                            id="student-level"
                            bind:value={currentStudent.level}
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
                        for="student-class"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Asignar a Clase</label
                    >
                    <select
                        id="student-class"
                        bind:value={selectedClassId}
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                        <option value="">-- Sin asignar --</option>
                        {#each store.classes as group}
                            <option value={group.id}
                                >{group.name} ({group.schedule})</option
                            >
                        {/each}
                    </select>
                    <p class="text-xs text-slate-500 mt-1">
                        Sugerencia: Si cambias la clase, el alumno será movido
                        automáticamente.
                    </p>
                </div>
                <div>
                    <label
                        for="student-email"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Email de Contacto</label
                    >
                    <input
                        id="student-email"
                        bind:value={currentStudent.email}
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
                    >
                        {isEditing ? "Guardar Cambios" : "Registrar Alumno"}
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <div
        class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
    >
        <!-- Mobile View (Cards) -->
        <div class="block sm:hidden divide-y divide-slate-700">
            {#if filteredStudents.length === 0}
                <div class="p-8 text-center text-slate-500">
                    No se encontraron estudiantes.
                </div>
            {:else}
                {#each filteredStudents as student}
                    {@const studentClass = getStudentClass(student.id)}
                    <div class="p-4 flex flex-col gap-3">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-sm"
                                >
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <div class="font-medium text-white text-lg">
                                        {student.name}
                                    </div>
                                    <div class="text-sm text-slate-500">
                                        {studentClass
                                            ? studentClass.name
                                            : "Sin asignar"}
                                    </div>
                                </div>
                            </div>
                            <span
                                class="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold"
                            >
                                {translateLevel(student.level)}
                            </span>
                        </div>

                        <div
                            class="flex items-center justify-between mt-2 pt-3 border-t border-slate-700/50"
                        >
                            <div class="text-xs text-slate-500">
                                {getCenterNameForClass(studentClass)}
                            </div>
                            <div class="flex items-center gap-2">
                                <button
                                    onclick={() => generateReport(student)}
                                    class="p-2 bg-slate-800 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                    title="Ver Informe"
                                >
                                    <Award class="w-5 h-5" />
                                </button>
                                <button
                                    onclick={() => openEditForm(student)}
                                    class="p-2 bg-slate-800 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                                    title="Editar"
                                >
                                    <Pencil class="w-5 h-5" />
                                </button>
                                <button
                                    onclick={() => handleDelete(student.id)}
                                    class="p-2 bg-slate-800 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Desktop View (Table) -->
        <table class="w-full text-left hidden sm:table">
            <thead class="bg-slate-900/50">
                <tr>
                    <th class="p-4 text-slate-400 font-medium text-sm"
                        >Nombre</th
                    >
                    <th class="p-4 text-slate-400 font-medium text-sm"
                        >Centro/Clase</th
                    >
                    <th class="p-4 text-slate-400 font-medium text-sm">Nivel</th
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
                        {@const studentClass = getStudentClass(student.id)}
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
                                    <div>
                                        <div class="font-medium text-white">
                                            {student.name}
                                        </div>
                                        <div class="text-xs text-slate-500">
                                            {student.email || "—"}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="text-sm text-white">
                                    {studentClass
                                        ? studentClass.name
                                        : "Sin asignar"}
                                </div>
                                <div class="text-xs text-slate-500">
                                    {getCenterNameForClass(studentClass)}
                                </div>
                            </td>
                            <td class="p-4">
                                <span
                                    class="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold"
                                >
                                    {translateLevel(student.level)}
                                </span>
                            </td>
                            <td class="p-4 text-right">
                                <div
                                    class="flex items-center justify-end gap-2"
                                >
                                    <button
                                        onclick={() => generateReport(student)}
                                        class="text-slate-500 hover:text-emerald-400 p-2 rounded hover:bg-emerald-500/10 transition-colors"
                                        title="Ver Informe"
                                    >
                                        <Award class="w-4 h-4" />
                                    </button>
                                    <button
                                        onclick={() => openEditForm(student)}
                                        class="text-slate-500 hover:text-blue-400 p-2 rounded hover:bg-blue-500/10 transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil class="w-4 h-4" />
                                    </button>
                                    <button
                                        onclick={() => handleDelete(student.id)}
                                        class="text-slate-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>

<!-- Report Modal -->
{#if showReportModal && selectedStudentForReport}
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
                        {selectedStudentForReport.name.charAt(0)}
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-white">
                            {selectedStudentForReport.name}
                        </h3>
                        <div class="flex items-center gap-2 mt-1">
                            <span
                                class="bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-500/30"
                            >
                                Nivel: {translateLevel(
                                    selectedStudentForReport.level,
                                )}
                            </span>
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

                    <div
                        class="mb-4 bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700 relative group"
                    >
                        <div
                            class="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-1000 ease-out"
                            style="width: {skillProgress}%"
                        ></div>
                        <div
                            class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md"
                        >
                            {skillProgress}% COMPLETADO
                        </div>
                    </div>
                </div>

                <div
                    class="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg"
                >
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-bold text-blue-200"
                            >Nota del Profesor:</span
                        >
                        <button
                            onclick={saveReportNote}
                            class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"
                        >
                            <Save class="w-3 h-3" /> Guardar
                        </button>
                    </div>
                    <textarea
                        bind:value={selectedStudentForReport.notes}
                        class="w-full bg-blue-900/30 text-blue-100 text-sm p-2 rounded border border-blue-500/30 focus:outline-none focus:border-blue-400 h-24 resize-none"
                        placeholder="Escribe aquí tus observaciones sobre el progreso del alumno..."
                    ></textarea>
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
```

<style>
    @media print {
        :global(body *) {
            visibility: hidden;
        }

        .fixed.inset-0,
        .fixed.inset-0 * {
            visibility: visible;
        }

        .fixed.inset-0 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            background: white !important;
            display: block !important;
        }

        .fixed.inset-0 > div {
            position: static !important;
            width: 100% !important;
            max-width: none !important;
            max-height: none !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
        }

        .text-white {
            color: black !important;
        }
        .text-slate-300,
        .text-slate-400,
        .text-slate-500 {
            color: #333 !important;
        }

        button {
            display: none !important;
        }

        .bg-slate-900\/50,
        .bg-blue-900\/20 {
            background: #fff !important;
            border: 1px solid #ccc !important;
        }

        textarea {
            background: white !important;
            color: black !important;
            border: 1px solid #ccc !important;
        }
    }
</style>
