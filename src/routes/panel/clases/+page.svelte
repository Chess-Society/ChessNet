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
    import Modal from "$lib/components/Modal.svelte";
    import EmptyState from "$lib/components/common/EmptyState.svelte";
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
    import { slide, fade, scale, fly } from "svelte/transition";
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

    // Form validation errors
    let formErrors: {
        name?: string;
        centerId?: string;
    } = {};

    function validateClassForm(): boolean {
        formErrors = {};
        let isValid = true;

        if (!newClass.name || newClass.name.trim().length < 3) {
            formErrors.name = "El nombre debe tener al menos 3 caracteres";
            isValid = false;
        }

        if (!newClass.centerId) {
            formErrors.centerId = "Selecciona un centro";
            isValid = false;
        }

        return isValid;
    }

    function handleToggleForm() {
        if (!showForm) {
            // Trying to create new
            newClass = {
                id: "",
                name: "",
                centerId: "",
                schedule: "",
                level: "Pawn",
                students: [],
                duration: 90,
            };
            selectedDay = "Lunes";
            selectedTime = "17:00";
            formErrors = {};

            if (!checkPlanLimit(store, "classes")) {
                notifications.warning(
                    `Has alcanzado el límite de clases de tu plan actual (${store.settings.plan}). Actualiza tu plan.`,
                );
                return;
            }
        }
        showForm = !showForm;
    }

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
        if (!validateClassForm()) {
            notifications.error(
                "Por favor, corrige los errores del formulario",
            );
            return;
        }

        if (newClass.id) {
            storeActions.updateClass(newClass);
            notifications.success("Clase actualizada");
        } else {
            const classToAdd = {
                ...newClass,
                id: crypto.randomUUID(),
            };
            storeActions.addClass(classToAdd);
            notifications.success("Clase creada");
        }

        showForm = false;
        formErrors = {};
    }

    function editClass(group: ClassGroup) {
        // Parse current schedule to set form defaults
        const parts = group.schedule.split(" ");
        if (parts.length >= 2) {
            // Basic parsing assume "Day Time", robust enough for MVP
            if (DAYS.includes(parts[0])) selectedDay = parts[0];
            selectedTime = parts[1];
        }

        newClass = { ...group };
        formErrors = {};
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
    <div class="sm:flex sm:items-center justify-between mb-8">
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
                onclick={handleToggleForm}
                type="button"
                class="btn btn-primary btn-md shadow-sm"
            >
                <Plus class="w-4 h-4 mr-2" />
                Nueva Clase
            </button>
        </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-[#1e293b] border border-slate-800 rounded-xl p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-slate-400 text-sm font-medium">
                        Total Clases
                    </p>
                    <p class="text-3xl font-bold text-white mt-1">
                        {store.classes.length}
                    </p>
                </div>
                <div class="bg-purple-500/10 p-3 rounded-lg">
                    <BookOpen class="w-6 h-6 text-purple-500" />
                </div>
            </div>
        </div>

        <div class="bg-[#1e293b] border border-slate-800 rounded-xl p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-slate-400 text-sm font-medium">
                        Total Alumnos
                    </p>
                    <p class="text-3xl font-bold text-white mt-1">
                        {store.students.length}
                    </p>
                </div>
                <div class="bg-emerald-500/10 p-3 rounded-lg">
                    <Users class="w-6 h-6 text-emerald-500" />
                </div>
            </div>
        </div>

        <div class="bg-[#1e293b] border border-slate-800 rounded-xl p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-slate-400 text-sm font-medium">
                        Centros Activos
                    </p>
                    <p class="text-3xl font-bold text-white mt-1">
                        {store.centers.length}
                    </p>
                </div>
                <div class="bg-blue-500/10 p-3 rounded-lg">
                    <Calendar class="w-6 h-6 text-blue-500" />
                </div>
            </div>
        </div>
    </div>

    <!-- Active Sessions Today -->
    <div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#if store.classes.length === 0}
                <div class="col-span-full">
                    <EmptyState
                        icon={BookOpen}
                        title="No hay clases creadas"
                        description="Crea tu primer grupo de alumnos para empezar. Podrás asignar horarios y niveles."
                        actionLabel="Crear Clase"
                        on:action={handleToggleForm}
                    />
                </div>
            {:else}
                {#each store.classes as group, i (group.id)}
                    <div
                        in:fly={{ y: 20, duration: 400, delay: i * 50 }}
                        class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col group relative"
                    >
                        <div
                            class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <button
                                onclick={() => deleteClass(group.id)}
                                class="text-slate-600 hover:text-red-500 transition-colors"
                                title="Eliminar Clase"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>

                        <div class="flex justify-between items-start mb-4 pr-8">
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
                                        <Pencil class="w-3 h-3" />
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
                                href="{base}/panel/asistencia?classId={group.id}"
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

<!-- Forms Modals -->

<!-- 1. Create/Edit Class Modal -->
<Modal
    bind:isOpen={showForm}
    title={newClass.id ? "Editar Clase" : "Crear Nuevo Grupo"}
    size="md"
>
    <div class="space-y-6">
        <div>
            <label
                for="class-name"
                class="block text-sm font-medium text-slate-400 mb-1"
                >Nombre del Grupo <span class="text-red-400">*</span></label
            >
            <input
                id="class-name"
                bind:value={newClass.name}
                type="text"
                placeholder="Ej: Iniciación Lunes"
                class="form-input {formErrors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : ''}"
            />
            {#if formErrors.name}
                <p class="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <svg
                        class="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    {formErrors.name}
                </p>
            {/if}
        </div>
        <div>
            <label
                for="class-center"
                class="block text-sm font-medium text-slate-400 mb-1"
                >Centro Educativo <span class="text-red-400">*</span></label
            >
            <select
                id="class-center"
                bind:value={newClass.centerId}
                class="form-select {formErrors.centerId
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : ''}"
            >
                <option value="">Selecciona un centro...</option>
                {#each store.centers as center}
                    <option value={center.id}>{center.name}</option>
                {/each}
            </select>
            {#if formErrors.centerId}
                <p class="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <svg
                        class="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    {formErrors.centerId}
                </p>
            {/if}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
                <label
                    for="class-level"
                    class="block text-sm font-medium text-slate-400 mb-1"
                    >Nivel</label
                >
                <select
                    id="class-level"
                    bind:value={newClass.level}
                    class="form-select"
                >
                    <option value="Pawn">Peón (Iniciación)</option>
                    <option value="Bishop">Alfil (Intermedio)</option>
                    <option value="Rook">Torre (Avanzado)</option>
                    <option value="King">Rey (Experto)</option>
                </select>
            </div>
        </div>

        <!-- Preview -->
        <div class="bg-slate-800/50 p-3 rounded-lg flex items-center gap-3">
            <Calendar class="w-5 h-5 text-purple-400" />
            <p class="text-sm text-slate-300">
                Se mostrará en calendario como: <span
                    class="font-bold text-white"
                    >{selectedDay} {selectedTime}</span
                >
            </p>
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <button
                onclick={() => (showForm = false)}
                class="btn btn-ghost btn-md">Cancelar</button
            >
            <button onclick={handleSubmit} class="btn btn-primary btn-md"
                >{newClass.id ? "Guardar Cambios" : "Crear Clase"}</button
            >
        </div>
    </div>
</Modal>

<ConfirmationModal
    bind:isOpen={showDeleteModal}
    title="¿Eliminar clase?"
    message="Esta acción eliminará el grupo y todos sus registros de asistencia. Los alumnos no se borrarán."
    confirmText="Eliminar Clase"
    on:confirm={confirmDelete}
/>

<!-- 2. Manage Students Modal (Reusing Generic Modal) -->
<Modal
    bind:isOpen={showManageModal}
    title={"Gestionar Alumnos: " + (selectedClassForManage?.name || "")}
    size="lg"
>
    {#if selectedClassForManage}
        <div
            class="flex flex-col md:flex-row h-[500px] border border-slate-700/50 rounded-xl overflow-hidden"
        >
            <!-- Current Members -->
            <div
                class="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-900/30"
            >
                <h3
                    class="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"
                >
                    <Users class="w-3 h-3" /> Inscritos ({selectedClassForManage
                        .students.length})
                </h3>
                {#if selectedClassForManage.students.length === 0}
                    <div class="text-center py-10 text-slate-500 text-sm">
                        No hay alumnos asignados
                    </div>
                {:else}
                    <div class="space-y-2">
                        {#each selectedClassForManage.students as studentId}
                            <div
                                class="bg-slate-800/80 p-3 rounded-lg flex justify-between items-center group border border-transparent hover:border-slate-600 transition-colors"
                            >
                                <span class="text-slate-200 text-sm font-medium"
                                    >{getStudentName(studentId)}</span
                                >
                                <button
                                    onclick={() =>
                                        removeStudentFromClass(studentId)}
                                    class="text-slate-500 hover:text-red-400 p-1 bg-slate-900/50 rounded hover:bg-red-500/10 transition-colors"
                                    title="Eliminar del grupo"
                                >
                                    <Trash2 class="w-3 h-3" />
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Add New -->
            <div
                class="w-full md:w-72 bg-slate-800/30 border-l border-slate-700 p-4 flex flex-col"
            >
                <h3
                    class="text-xs font-bold text-emerald-500 uppercase mb-3 flex items-center gap-2"
                >
                    <UserPlusIcon class="w-3 h-3" /> Añadir Nuevo
                </h3>

                <div class="relative mb-3">
                    <Search
                        class="absolute left-3 top-2.5 w-3 h-3 text-slate-500"
                    />
                    <input
                        bind:value={studentSearchTerm}
                        type="text"
                        placeholder="Buscar..."
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                    {#each availableStudents as student}
                        <button
                            onclick={() => addStudentToClass(student.id)}
                            class="w-full text-left p-2 rounded-lg flex justify-between items-center hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 transition-colors group"
                        >
                            <span class="text-sm truncate mr-2"
                                >{student.name}</span
                            >
                            <Plus
                                class="w-3 h-3 opacity-0 group-hover:opacity-100"
                            />
                        </button>
                    {/each}
                    {#if availableStudents.length === 0}
                        <p class="text-xs text-slate-600 text-center mt-4">
                            {studentSearchTerm
                                ? "No encontrado"
                                : "Busca un alumno..."}
                        </p>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex justify-end pt-4">
            <button
                onclick={() => (showManageModal = false)}
                class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-900/20"
            >
                Guardar y Cerrar
            </button>
        </div>
    {/if}
</Modal>
