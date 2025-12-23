<script lang="ts">
    import { onMount } from "svelte";
    import {
        appStore,
        storeActions,
        checkPlanLimit,
        type ClassGroup,
    } from "$lib/services/storage";
    import { notifications } from "$lib/stores/notifications";
    import ConfirmationModal from "$lib/components/ConfirmationModal.svelte";

    function handleToggleForm() {
        if (!showForm) {
            // Trying to open
            if (!checkPlanLimit(store, "classes")) {
                notifications.warning(
                    `Has alcanzado el límite de clases de tu plan actual (${store.settings.plan}). Actualiza tu plan.`,
                );
                return;
            }
        }
        showForm = !showForm;
    }
    import {
        BookOpen,
        Users,
        Clock,
        Calendar,
        CheckCircle2,
        UserPlus,
        Plus,
        X,
        UserPlus as UserPlusIcon,
        Trash2,
        Search,
        Pencil,
    } from "lucide-svelte";
    import { slide, fade, scale } from "svelte/transition";
    import { base } from "$app/paths";

    $: store = $appStore;

    let showForm = false;
    let newClass: ClassGroup = {
        id: "",
        name: "",
        centerId: "",
        schedule: "",
        level: "Pawn",
        students: [],
        duration: 90, // Default 1.5h
    };

    // Structured Schedule State
    let selectedDay = "Lunes";
    let selectedTime = "17:00";

    // Days of Week
    const DAYS = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
    ];

    // Update schedule string when day or time changes
    $: newClass.schedule = `${selectedDay} ${selectedTime}`;

    // Manage Students Modal State
    let showManageModal = false;
    let selectedClassForManage: ClassGroup | null = null;
    let studentSearchTerm = "";

    function openManageModal(group: ClassGroup) {
        selectedClassForManage = group;
        studentSearchTerm = "";
        showManageModal = true;
    }

    function addStudentToClass(studentId: string) {
        if (selectedClassForManage) {
            storeActions.addClassMember(selectedClassForManage.id, studentId);
            // Update local reference to reflect changes immediately in UI
            selectedClassForManage = {
                ...selectedClassForManage,
                students: [...selectedClassForManage.students, studentId],
            };
        }
    }

    function removeStudentFromClass(studentId: string) {
        if (selectedClassForManage) {
            storeActions.removeClassMember(
                selectedClassForManage.id,
                studentId,
            );
            // Update local reference
            selectedClassForManage = {
                ...selectedClassForManage,
                students: selectedClassForManage.students.filter(
                    (id) => id !== studentId,
                ),
            };
        }
    }

    function getStudentName(id: string) {
        const s = store.students.find((stud) => stud.id === id);
        return s ? s.name : "Alumno Desconocido";
    }

    // Filter students NOT in the class for the "Add" list
    $: availableStudents = selectedClassForManage
        ? store.students.filter(
              (s) =>
                  !selectedClassForManage?.students.includes(s.id) &&
                  s.name
                      .toLowerCase()
                      .includes(studentSearchTerm.toLowerCase()),
          )
        : [];

    function handleSubmit() {
        if (!newClass.name) return;

        if (newClass.id) {
            storeActions.updateClass(newClass);
        } else {
            const classToAdd = {
                ...newClass,
                id: crypto.randomUUID(),
            };
            storeActions.addClass(classToAdd);
        }

        // Reset form
        newClass = {
            id: "",
            name: "",
            centerId: "",
            schedule: "",
            level: "Pawn",
            students: [],
            duration: 90,
        };
        showForm = false;
        selectedDay = "Lunes";
        selectedTime = "17:00";
    }

    function editClass(group: ClassGroup) {
        newClass = { ...group };
        showForm = true;
    }

    let showDeleteModal = false;
    let classToDeleteId: string | null = null;

    function deleteClass(id: string) {
        classToDeleteId = id;
        showDeleteModal = true;
    }

    function confirmDelete() {
        if (classToDeleteId) {
            storeActions.removeClass(classToDeleteId);
            classToDeleteId = null;
            notifications.success("Clase eliminada correctamente.");
        }
    }

    function getCenterName(id: string) {
        const center = store.centers.find((c) => c.id === id);
        return center ? center.name : "Centro Desconocido";
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center justify-between">
        <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <BookOpen class="w-8 h-8 text-purple-400" /> Gestionar Clases
            </h1>
            <p class="mt-2 text-sm text-slate-400">
                Organiza tus grupos, horarios y controla la asistencia de hoy.
            </p>
        </div>
        <div class="mt-4 sm:mt-0">
            <button
                onclick={() => (showForm = !showForm)}
                type="button"
                class="btn btn-primary btn-md shadow-sm"
            >
                <Plus class="w-4 h-4 mr-2" />
                Nueva Clase
            </button>
        </div>
    </div>

    {#if showForm}
        <div
            transition:slide
            class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 mt-6 max-w-2xl"
        >
            <h3 class="text-lg font-bold text-white mb-4">Crear Nuevo Grupo</h3>
            <div class="space-y-4">
                <div>
                    <label
                        for="class-name"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Nombre del Grupo</label
                    >
                    <input
                        id="class-name"
                        bind:value={newClass.name}
                        type="text"
                        placeholder="Ej: Iniciación Lunes"
                        class="form-input"
                    />
                </div>
                <div>
                    <label
                        for="class-center"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Centro Educativo</label
                    >
                    <select
                        id="class-center"
                        bind:value={newClass.centerId}
                        class="form-select"
                    >
                        <option value="">Selecciona un centro...</option>
                        {#each store.centers as center}
                            <option value={center.id}>{center.name}</option>
                        {/each}
                    </select>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            for="class-day"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Día de la Semana</label
                        >
                        <select
                            id="class-day"
                            bind:value={selectedDay}
                            class="form-select"
                        >
                            {#each DAYS as day}
                                <option value={day}>{day}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label
                            for="class-time"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Hora de Inicio</label
                        >
                        <input
                            id="class-time"
                            bind:value={selectedTime}
                            type="time"
                            class="form-input"
                        />
                    </div>
                    <div>
                        <label
                            for="class-duration"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Duración (min)</label
                        >
                        <input
                            id="class-duration"
                            bind:value={newClass.duration}
                            type="number"
                            min="30"
                            step="15"
                            class="form-input"
                        />
                    </div>
                </div>
                <!-- Preview hidden/read-only or just implicit -->
                <p class="text-xs text-slate-500">
                    Se mostrará en el calendario como: <span
                        class="text-purple-400"
                        >{selectedDay} {selectedTime}</span
                    >
                </p>
                <div class="flex justify-end gap-3 mt-6">
                    <button
                        onclick={() => (showForm = false)}
                        class="btn btn-ghost btn-md">Cancelar</button
                    >
                    <button
                        onclick={handleSubmit}
                        class="btn btn-primary btn-md">Crear Clase</button
                    >
                </div>
            </div>
        </div>
    {/if}

    <!-- Active Sessions Today -->
    <div class="mt-8">
        <h2 class="text-lg font-semibold text-white mb-4">
            Tus Grupos Activos
        </h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#if store.classes.length === 0}
                <div
                    class="col-span-full py-12 text-center bg-[#1e293b]/50 rounded-3xl border border-dashed border-slate-700"
                >
                    <BookOpen class="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-white mb-2">
                        No hay clases creadas
                    </h3>
                    <p class="text-slate-400 mb-6">
                        Crea tu primer grupo de alumnos para empezar.
                    </p>
                </div>
            {:else}
                {#each store.classes as group}
                    <div
                        class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:border-purple-500/30 transition-all flex flex-col"
                    >
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <div class="flex items-center gap-2">
                                    <h3 class="text-xl font-bold text-white">
                                        {group.name}
                                    </h3>
                                    <button
                                        onclick={() => editClass(group)}
                                        class="text-slate-500 hover:text-white"
                                        title="Editar Clase"
                                    >
                                        <Pencil class="w-4 h-4" />
                                    </button>
                                    <button
                                        onclick={() => deleteClass(group.id)}
                                        class="text-slate-500 hover:text-red-500"
                                        title="Eliminar Clase"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                                <p class="text-slate-400 text-sm mt-1">
                                    {getCenterName(group.centerId)}
                                </p>
                            </div>
                            <span
                                class="bg-purple-500/10 text-purple-400 text-xs font-bold px-2 py-1 rounded-lg border border-purple-500/20"
                            >
                                {group.level}
                            </span>
                        </div>

                        <div class="space-y-3 mb-6 flex-1">
                            <div
                                class="flex items-center text-slate-400 text-sm"
                            >
                                <Clock class="w-4 h-4 mr-2 text-slate-500" />
                                {group.schedule}
                            </div>
                            <div
                                class="flex items-center text-slate-400 text-sm"
                            >
                                <Users class="w-4 h-4 mr-2 text-slate-500" />
                                {group.students.length} Alumnos inscritos
                            </div>
                        </div>

                        <div class="flex gap-2 mt-auto">
                            <a
                                href="{base}/dashboard/attendance?classId={group.id}"
                                class="flex-1 bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer no-underline"
                            >
                                <CheckCircle2 class="w-4 h-4" />
                                Pasar Lista
                            </a>
                            <button
                                onclick={() => openManageModal(group)}
                                class="flex-1 bg-slate-800 text-slate-300 py-2 rounded-xl text-sm font-semibold hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
                            >
                                Alumnos
                            </button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>

<ConfirmationModal
    bind:isOpen={showDeleteModal}
    title="¿Eliminar clase?"
    message="Esta acción eliminará el grupo y todos sus registros de asistencia. Los alumnos no se borrarán."
    confirmText="Eliminar Clase"
    on:confirm={confirmDelete}
/>

<!-- Manage Students Modal -->
{#if showManageModal && selectedClassForManage}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        transition:fade
    >
        <div
            class="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[85vh]"
            transition:scale
        >
            <div
                class="p-6 border-b border-slate-700 flex justify-between items-center"
            >
                <div>
                    <h2 class="text-xl font-bold text-white">
                        Gestionar Alumnos
                    </h2>
                    <p class="text-slate-400 text-sm">
                        {selectedClassForManage.name}
                    </p>
                </div>
                <button
                    onclick={() => (showManageModal = false)}
                    class="text-slate-400 hover:text-white transition-colors"
                >
                    <X class="w-6 h-6" />
                </button>
            </div>

            <div
                class="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-700"
            >
                <!-- Current Members -->
                <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <h3
                        class="text-sm font-bold text-slate-300 uppercase mb-4 flex items-center gap-2"
                    >
                        <Users class="w-4 h-4" /> Inscritos ({selectedClassForManage
                            .students.length})
                    </h3>
                    {#if selectedClassForManage.students.length === 0}
                        <p class="text-slate-500 text-sm italic">
                            No hay alumnos en este grupo.
                        </p>
                    {:else}
                        <div class="space-y-2">
                            {#each selectedClassForManage.students as studentId}
                                <div
                                    class="bg-slate-800/50 p-2 rounded-lg flex justify-between items-center group"
                                >
                                    <span class="text-slate-200 text-sm"
                                        >{getStudentName(studentId)}</span
                                    >
                                    <button
                                        onclick={() =>
                                            removeStudentFromClass(studentId)}
                                        class="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Eliminar del grupo"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                <!-- Add New -->
                <div class="flex-1 p-6 flex flex-col bg-slate-900/30">
                    <h3
                        class="text-sm font-bold text-emerald-400 uppercase mb-4 flex items-center gap-2"
                    >
                        <UserPlusIcon class="w-4 h-4" /> Añadir Alumno
                    </h3>

                    <div class="relative mb-4">
                        <Search
                            class="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
                        />
                        <input
                            bind:value={studentSearchTerm}
                            type="text"
                            placeholder="Buscar alumno..."
                            class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div
                        class="flex-1 overflow-y-auto custom-scrollbar space-y-2"
                    >
                        {#if availableStudents.length === 0}
                            <p class="text-slate-500 text-sm text-center py-4">
                                {studentSearchTerm
                                    ? "No se encontraron alumnos."
                                    : "Busca un alumno para añadir."}
                            </p>
                        {:else}
                            {#each availableStudents as student}
                                <button
                                    onclick={() =>
                                        addStudentToClass(student.id)}
                                    class="w-full text-left bg-slate-800 border border-slate-700 hover:border-emerald-500/50 p-2 rounded-lg flex justify-between items-center group transition-colors"
                                >
                                    <div>
                                        <p
                                            class="text-slate-200 text-sm font-medium"
                                        >
                                            {student.name}
                                        </p>
                                        <p class="text-slate-500 text-xs">
                                            {student.level === "Pawn"
                                                ? "Peón"
                                                : student.level === "Bishop"
                                                  ? "Alfil"
                                                  : student.level === "Rook"
                                                    ? "Torre"
                                                    : student.level === "King"
                                                      ? "Rey"
                                                      : student.level}
                                        </p>
                                    </div>
                                    <Plus
                                        class="w-4 h-4 text-slate-500 group-hover:text-emerald-500"
                                    />
                                </button>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>

            <div
                class="p-4 border-t border-slate-700 text-right bg-slate-900/50 rounded-b-2xl"
            >
                <button
                    onclick={() => (showManageModal = false)}
                    class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                    Listo
                </button>
            </div>
        </div>
    </div>
{/if}
