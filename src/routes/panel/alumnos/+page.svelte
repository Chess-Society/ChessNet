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
        User,
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
        ClipboardCheck,
        TrendingUp,
        Award,
        Save,
        Share2,
    } from "lucide-svelte";
    import { notifications } from "$lib/stores/notifications";
    import DiplomaModal from "$lib/components/dashboard/students/DiplomaModal.svelte";
    import ConfirmationModal from "$lib/components/ConfirmationModal.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import StudentProfileModal from "$lib/components/dashboard/students/StudentProfileModal.svelte";
    import StudentReportModal from "$lib/components/dashboard/students/StudentReportModal.svelte";
    import { fireConfetti } from "$lib/utils/confetti";

    $: store = $appStore;

    // Stats Logic
    $: totalStudents = store.students.length;

    // Attendance
    $: averageAttendance = (() => {
        if (store.attendance.length === 0) return 0;
        let total = 0;
        let present = 0;
        store.attendance.forEach((record) => {
            total += record.records.length;
            present += record.records.filter(
                (r) => r.status === "present",
            ).length;
        });
        return total > 0 ? Math.round((present / total) * 100) : 0;
    })();

    // Level Distribution
    $: mainLevel = (() => {
        if (store.students.length === 0) return "N/A";
        // Create a type-safe object with index signature
        const counts: Record<string, number> = {
            Pawn: 0,
            Bishop: 0,
            Rook: 0,
            King: 0,
        };
        store.students.forEach((s) => {
            const l = s.level;
            if (counts[l] !== undefined) counts[l]++;
        });
        // Find max
        const entries = Object.entries(counts);
        entries.sort((a, b) => b[1] - a[1]);
        const top = entries[0];

        const translations: Record<string, string> = {
            Pawn: "Peón",
            Bishop: "Alfil",
            Rook: "Torre",
            King: "Rey",
        };
        return translations[top[0]] || top[0];
    })();

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
            notifications.warning(
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
            notifications.warning(
                `Se importaron ${importedCount} alumnos, pero se detuvo porque alcanzaste el límite de tu plan.`,
            );
        } else {
            notifications.success(
                `Se han importado ${importedCount} alumnos correctamente.`,
            );
        }

        target.value = ""; // Reset
    }

    function openCreateForm() {
        if (!checkPlanLimit(store, "students")) {
            notifications.warning(
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
            // JUICY
            fireConfetti();
            notifications.success(`¡Bienvenido/a, ${currentStudent.name}! ♟️`);
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

    // Modals State
    let showDeleteModal = false;
    let studentToDeleteId: string | null = null;

    let showProfileModal = false;
    let selectedStudentForProfile: Student | null = null;
    let profileAttendanceRate = 0;

    let showReportModal = false;
    let selectedStudentForReport: Student | null = null;
    let reportStats = {
        attendanceRate: 0,
        classesAttended: 0,
        totalClasses: 0,
    };

    function handleDelete(id: string) {
        studentToDeleteId = id;
        showDeleteModal = true;
        // If profile is open, close it (optional)
        showProfileModal = false;
    }

    function confirmDelete() {
        if (studentToDeleteId) {
            const cls = getStudentClass(studentToDeleteId);
            if (cls) {
                storeActions.removeClassMember(cls.id, studentToDeleteId);
            }
            storeActions.removeStudent(studentToDeleteId);
            notifications.success("Estudiante eliminado correctamente.");
            studentToDeleteId = null;
            showDeleteModal = false;
        }
    }

    // Helper to calculate stats for a student
    function calculateStudentStats(studentId: string) {
        const studentRecords = store.attendance.flatMap((r) =>
            r.records
                .filter((rec) => rec.studentId === studentId)
                .map((rec) => ({ date: r.date, status: rec.status })),
        );
        const total = studentRecords.length;
        const present = studentRecords.filter(
            (r) => r.status === "present",
        ).length;
        return {
            totalClasses: total,
            classesAttended: present,
            attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
        };
    }

    function openProfile(student: Student) {
        selectedStudentForProfile = student;
        const s = calculateStudentStats(student.id);
        profileAttendanceRate = s.attendanceRate;
        showProfileModal = true;
    }

    function openReportFromProfile(event: CustomEvent<Student>) {
        const student = event.detail;
        selectedStudentForProfile = null; // Close profile ? Or keep open? Let's close for now to avoid overlapping backdrops issues unless z-index handled well.
        showProfileModal = false;

        selectedStudentForReport = student;
        reportStats = calculateStudentStats(student.id);
        showReportModal = true;
    }

    // Direct report open
    function generateReport(student: Student) {
        selectedStudentForReport = student;
        reportStats = calculateStudentStats(student.id);
        showReportModal = true;
    }

    function handleEditFromProfile(event: CustomEvent<Student>) {
        showProfileModal = false;
        openEditForm(event.detail);
    }

    function handleDeleteFromProfile(event: CustomEvent<string>) {
        // showProfileModal = false; // Keep open or close? Better close to show confirm.
        // Actually the delete logic uses an ID.
        handleDelete(event.detail);
    }

    function handleSaveNotesFromReport(
        event: CustomEvent<{ studentId: string; notes: string }>,
    ) {
        const { studentId, notes } = event.detail;
        const student = store.students.find((s) => s.id === studentId);
        if (student) {
            storeActions.updateStudent({ ...student, notes });
            // Update the modal's student reference
            if (
                selectedStudentForReport &&
                selectedStudentForReport.id === studentId
            ) {
                selectedStudentForReport = {
                    ...selectedStudentForReport,
                    notes,
                };
            }
        }
    }

    function handleShareProfile(student: Student) {
        // Calculate minimal stats for the public card
        const freshStudent =
            store.students.find((s) => s.id === student.id) ?? student;

        // Attendance
        const studentRecords = store.attendance.flatMap((r) =>
            r.records
                .filter((rec) => rec.studentId === freshStudent.id)
                .map((rec) => rec.status),
        );
        const total = studentRecords.length;
        const present = studentRecords.filter((s) => s === "present").length;
        const attendanceRate =
            total > 0 ? Math.round((present / total) * 100) : 0;

        // Skills (Mock progress since we don't track % per skill yet, just binary possession)
        // In a real app, we would have specific progress per skill.
        // For now, if they have the skill ID, we show 100%, or we can simulate "Mastery".
        let publicSkills: { name: string; val: number }[] = [];
        if (freshStudent.skills && freshStudent.skills.length > 0) {
            publicSkills = store.skills
                .filter((skill) => freshStudent.skills?.includes(skill.id))
                .map((skill) => ({ name: skill.name, val: 100 }));
        }

        const payload = {
            name: freshStudent.name,
            level: freshStudent.level,
            attendance: attendanceRate,
            skills: publicSkills,
            notes: freshStudent.notes || "",
        };

        const str = btoa(JSON.stringify(payload));
        const url = `${window.location.origin}/area-alumno/vista?d=${str}`;

        if (navigator.share) {
            navigator
                .share({
                    title: `Perfil de Ajedrez: ${freshStudent.name}`,
                    text: `Mira el progreso de ${freshStudent.name} en ChessNet`,
                    url: url,
                })
                .catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            notifications.success("Enlace del perfil copiado al portapapeles.");
        }
    }

    // Diploma Modal State
    let showDiplomaModal = false;
    let selectedStudentForDiploma: Student | null = null;

    function openDiplomaModal(student: Student) {
        selectedStudentForDiploma = student;
        showDiplomaModal = true;
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
                    class="form-input w-64 pl-10"
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
                class="btn btn-secondary btn-md shadow-sm"
                title="Formato: Nombre, Nivel, Email"
            >
                <FileUp class="w-5 h-5 mr-2" />
                <span class="hidden sm:inline">Importar</span>
            </button>

            <button
                onclick={openCreateForm}
                class="btn btn-primary btn-md bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20 shadow-sm btn-bounce"
            >
                <UserPlus class="w-5 h-5 mr-2" />
                Nuevo Alumno
            </button>
        </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
            class="bg-[#1e293b] border border-slate-700 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-colors"
        >
            <div
                class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
            >
                <Users class="w-12 h-12 text-emerald-500" />
            </div>
            <p
                class="text-slate-400 text-xs font-bold uppercase tracking-wider"
            >
                Total Alumnos
            </p>
            <div>
                <span class="text-3xl font-bold text-white block mt-1"
                    >{totalStudents}</span
                >
                <span class="text-xs text-emerald-400 font-medium">Activos</span
                >
            </div>
        </div>

        <div
            class="bg-[#1e293b] border border-slate-700 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-colors"
        >
            <div
                class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
            >
                <TrendingUp class="w-12 h-12 text-blue-500" />
            </div>
            <p
                class="text-slate-400 text-xs font-bold uppercase tracking-wider"
            >
                Nivel Dominante
            </p>
            <div>
                <span class="text-2xl font-bold text-white block mt-1"
                    >{mainLevel}</span
                >
                <span class="text-xs text-blue-400 font-medium"
                    >Mayoría del grupo</span
                >
            </div>
        </div>

        <div
            class="bg-[#1e293b] border border-slate-700 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-pink-500/50 transition-colors"
        >
            <div
                class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
            >
                <ClipboardCheck class="w-12 h-12 text-pink-500" />
            </div>
            <p
                class="text-slate-400 text-xs font-bold uppercase tracking-wider"
            >
                Asistencia
            </p>
            <div>
                <span class="text-3xl font-bold text-white block mt-1"
                    >{averageAttendance}%</span
                >
                <span
                    class="text-xs {averageAttendance > 80
                        ? 'text-emerald-400'
                        : 'text-amber-400'} font-medium">Promedio Global</span
                >
            </div>
        </div>

        <div
            class="bg-[#1e293b] border border-slate-700 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-colors"
        >
            <div
                class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
            >
                <GraduationCap class="w-12 h-12 text-purple-500" />
            </div>
            <p
                class="text-slate-400 text-xs font-bold uppercase tracking-wider"
            >
                Clases
            </p>
            <div>
                <span class="text-3xl font-bold text-white block mt-1"
                    >{store.classes.length}</span
                >
                <span class="text-xs text-purple-400 font-medium"
                    >Grupos activos</span
                >
            </div>
        </div>
    </div>

    <Modal
        bind:isOpen={showForm}
        title={isEditing ? "Editar Alumno" : "Matricular Nuevo Alumno"}
        size="md"
    >
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
                        class="form-input focus:border-emerald-500 focus:ring-emerald-500/50"
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
                        class="form-select focus:border-emerald-500 focus:ring-emerald-500/50"
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
                    class="form-select focus:border-emerald-500 focus:ring-emerald-500/50"
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
                    class="btn btn-ghost btn-md">Cancelar</button
                >
                <button
                    onclick={handleSubmit}
                    class="btn btn-primary btn-md bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20 btn-bounce"
                >
                    {isEditing ? "Guardar Cambios" : "Registrar Alumno"}
                </button>
            </div>
        </div>
    </Modal>

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
                                    type="button"
                                    onclick={() => openProfile(student)}
                                    class="p-2 bg-slate-800 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                    title="Ver Perfil"
                                >
                                    <User class="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onclick={() => openEditForm(student)}
                                    class="p-2 bg-slate-800 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                                    title="Editar"
                                >
                                    <Pencil class="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
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
                                        onclick={() => openProfile(student)}
                                        class="text-slate-500 hover:text-white p-2 rounded hover:bg-slate-700/50 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider border border-transparent hover:border-slate-600"
                                        title="Ver Perfil Completo"
                                    >
                                        Ver Perfil
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

    {#if showDiplomaModal && selectedStudentForDiploma}
        <DiplomaModal
            isOpen={showDiplomaModal}
            studentName={selectedStudentForDiploma.name}
            centerName={getCenterNameForClass(
                getStudentClass(selectedStudentForDiploma.id),
            )}
            on:close={() => (showDiplomaModal = false)}
        />
    {/if}

    <ConfirmationModal
        isOpen={showDeleteModal}
        title="Eliminar Alumno"
        message="¿Estás seguro de que deseas eliminar este alumno? Se perderán todos sus datos y asistencia. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        type="danger"
        on:confirm={confirmDelete}
        on:cancel={() => (showDeleteModal = false)}
    />
</div>

{#if showProfileModal && selectedStudentForProfile}
    <StudentProfileModal
        isOpen={showProfileModal}
        student={selectedStudentForProfile}
        studentClass={getStudentClass(selectedStudentForProfile.id)}
        centerName={getCenterNameForClass(
            getStudentClass(selectedStudentForProfile.id),
        )}
        attendanceRate={profileAttendanceRate}
        on:close={() => (showProfileModal = false)}
        on:edit={handleEditFromProfile}
        on:delete={handleDeleteFromProfile}
        on:report={openReportFromProfile}
        on:share={(e) => handleShareProfile(e.detail)}
    />
{/if}

{#if showReportModal && selectedStudentForReport}
    <StudentReportModal
        isOpen={showReportModal}
        student={selectedStudentForReport}
        studentClass={getStudentClass(selectedStudentForReport.id)}
        centerName={getCenterNameForClass(
            getStudentClass(selectedStudentForReport.id),
        )}
        stats={reportStats}
        on:close={() => (showReportModal = false)}
        on:saveNotes={handleSaveNotesFromReport}
    />
{/if}
