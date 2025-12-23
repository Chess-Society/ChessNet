<script lang="ts">
    import { page } from "$app/stores";
    import {
        appStore,
        storeActions,
        type Center,
        type ClassGroup,
        type Student,
    } from "$lib/services/storage";
    import {
        Building2,
        Users,
        BookOpen,
        MapPin,
        Phone,
        Mail,
        Plus,
        Trash2,
        ArrowLeft,
        Pencil,
        X,
        UserPlus,
    } from "lucide-svelte";
    import { slide, fade } from "svelte/transition";
    import { base } from "$app/paths";

    $: store = $appStore;

    let centerId = $page.params.id;
    let center: Center | undefined;

    // Tabs
    let activeTab: "overview" | "classes" | "students" = "overview";

    // Derived Data
    $: center = store.centers.find((c) => c.id === centerId);
    $: centerClasses = store.classes.filter((c) => c.centerId === centerId);

    // Get all unique student IDs in this center's classes
    $: centerStudentIds = new Set(centerClasses.flatMap((c) => c.students));
    $: centerStudents = store.students.filter((s) =>
        centerStudentIds.has(s.id),
    );

    // --- CLASS MANAGEMENT ---
    let showClassForm = false;
    let newClass: ClassGroup = {
        id: "",
        name: "",
        centerId: centerId || "", // Pre-filled
        schedule: "",
        level: "Pawn",
        students: [],
    };

    function handleAddClass() {
        if (!newClass.name || !center) return;

        const classToAdd = {
            ...newClass,
            id: crypto.randomUUID(),
            centerId: center.id, // Ensure it's locked to this center
        };

        storeActions.addClass(classToAdd);

        // Reset form
        newClass = {
            id: "",
            name: "",
            centerId: center.id,
            schedule: "",
            level: "Pawn",
            students: [],
        };
        showClassForm = false;
    }

    function handleDeleteClass(id: string) {
        if (
            confirm(
                "¿Seguro que quieres eliminar esta clase? Los alumnos no se borrarán, pero serán desasignados.",
            )
        ) {
            // Logic to remove class would typically go in storeActions.removeClass (need to check if it exists or add it)
            // Ideally we'd add removeClass to storeActions. Assuming user might want it.
            // For now, I'll direct update store manually or add the action if missing.
            // Let's check storeActions first. It likely doesn't have removeClass properly defined yet based on previous views.
            // I will implement a local remover for now or assume I added it.
            // Actually, best to add it to storeActions in storage.ts if needed, but I can use update for now.
            appStore.update((s) => ({
                ...s,
                classes: s.classes.filter((c) => c.id !== id),
            }));
        }
    }

    // --- STUDENT MANAGEMENT (Read-Onlyish view of the Center's roster) ---
    // Deleting a student here implies removing them from the Center (== removing from the class they are in at this center)
    // Or deleting them entirely? "User wants to be able to delete everything".
    // Let's offer "Remove from Center" (Unenroll) and "Delete User" (Global).
    // For simplicity given the prompt "delete student", I'll do Global Delete with warning.

    function handleDeleteStudent(id: string) {
        if (
            confirm(
                "¿Eliminar alumno del sistema completo? Esta acción es irreversible.",
            )
        ) {
            storeActions.removeStudent(id);
            // Also need to clean up class references, which I added logic for in previous turns.
            // But wait, the previous `removeStudent` helper only removed from student list.
            // I should ensure cleanup happens.
            // Ideally the removeStudent action handles deep cleanup, or I do it here.
            // I'll do it purely via the existing removeStudent action for now, assuming the store is the source of truth,
            // BUT `ClassGroup.students` is an array of IDs. If I delete the student object, the ID remains in the class array
            // making "ghost" students.
            // I should fix `removeStudent` in `storage.ts` to clean references OR do it here.
            // I'll do it here to be safe:

            // 1. Remove from all classes
            store.classes.forEach((c) => {
                if (c.students.includes(id)) {
                    storeActions.removeClassMember(c.id, id);
                }
            });
            // 2. Remove student
            storeActions.removeStudent(id);
        }
    }

    // Helper
    function getStudentClassesInCenter(studentId: string) {
        return centerClasses
            .filter((c) => c.students.includes(studentId))
            .map((c) => c.name)
            .join(", ");
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if !center}
        <div class="text-center text-slate-500 mt-20">
            <h2 class="text-2xl font-bold text-white mb-4">
                Centro no encontrado
            </h2>
            <a
                href="{base}/dashboard/centers"
                class="text-purple-400 hover:underline">Volver a la lista</a
            >
        </div>
    {:else}
        <!-- Header -->
        <div class="mb-8">
            <a
                href="{base}/dashboard/centers"
                class="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
            >
                <ArrowLeft class="w-4 h-4 mr-1" /> Volver a Centros
            </a>

            <div
                class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            >
                <div class="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                    <Building2 class="w-32 h-32 sm:w-48 sm:h-48 text-white" />
                </div>

                <div class="relative z-10">
                    <h1 class="text-4xl font-bold text-white mb-4">
                        {center.name}
                    </h1>
                    <div class="flex flex-wrap gap-6 text-slate-300">
                        {#if center.location}
                            <div class="flex items-center gap-2">
                                <MapPin class="w-5 h-5 text-purple-400" />
                                {center.location}
                            </div>
                        {/if}
                        <div class="flex items-center gap-2">
                            <Users class="w-5 h-5 text-blue-400" />
                            {centerStudents.length} Alumnos
                        </div>
                        <div class="flex items-center gap-2">
                            <BookOpen class="w-5 h-5 text-emerald-400" />
                            {centerClasses.length} Clases
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <div
            class="flex gap-2 mb-8 border-b border-slate-700 overflow-x-auto pb-1 no-scrollbar"
        >
            <button
                onclick={() => (activeTab = "overview")}
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'overview'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-white'}"
            >
                Resumen
            </button>
            <button
                onclick={() => (activeTab = "classes")}
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'classes'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-white'}"
            >
                Clases ({centerClasses.length})
            </button>
            <button
                onclick={() => (activeTab = "students")}
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'students'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-white'}"
            >
                Alumnos ({centerStudents.length})
            </button>
        </div>

        <!-- TABS CONTENT -->

        <!-- OVERVIEW -->
        {#if activeTab === "overview"}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6" transition:fade>
                <div
                    class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"
                >
                    <h3 class="text-slate-400 text-sm font-bold uppercase mb-2">
                        Ingresos Mensuales Estimados
                    </h3>
                    <p class="text-3xl font-bold text-white">
                        {new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "EUR",
                        }).format(centerStudents.length * 45)}
                    </p>
                    <p class="text-xs text-slate-500 mt-1">
                        Basado en 45€/alumno
                    </p>
                </div>

                <div
                    class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"
                >
                    <h3 class="text-slate-400 text-sm font-bold uppercase mb-2">
                        Ocupación Media
                    </h3>
                    <p class="text-3xl font-bold text-white">
                        {centerClasses.length > 0
                            ? Math.round(
                                  centerStudents.length / centerClasses.length,
                              )
                            : 0}
                    </p>
                    <p class="text-xs text-slate-500 mt-1">Alumnos por clase</p>
                </div>

                <!-- Quick Actions -->
                <div
                    class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col gap-3 justify-center"
                >
                    <button
                        onclick={() => {
                            activeTab = "classes";
                            showClassForm = true;
                        }}
                        class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus class="w-4 h-4" /> Nueva Clase
                    </button>
                </div>
            </div>
        {/if}

        <!-- CLASSES -->
        {#if activeTab === "classes"}
            <div transition:fade>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-white">
                        Clases en {center.name}
                    </h2>
                    <button
                        onclick={() => (showClassForm = !showClassForm)}
                        class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus class="w-4 h-4" />
                        Nueva Clase
                    </button>
                </div>

                {#if showClassForm}
                    <div
                        transition:slide
                        class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8 max-w-2xl"
                    >
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-white">
                                Crear Clase en {center.name}
                            </h3>
                            <button
                                onclick={() => (showClassForm = false)}
                                class="text-slate-400 hover:text-white"
                                ><X class="w-6 h-6" /></button
                            >
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label
                                    for="c-name"
                                    class="block text-sm font-medium text-slate-400 mb-1"
                                    >Nombre</label
                                >
                                <input
                                    id="c-name"
                                    bind:value={newClass.name}
                                    type="text"
                                    placeholder="Ej: Avanzado Martes"
                                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label
                                    for="c-sched"
                                    class="block text-sm font-medium text-slate-400 mb-1"
                                    >Horario</label
                                >
                                <input
                                    id="c-sched"
                                    bind:value={newClass.schedule}
                                    type="text"
                                    placeholder="Ej: Martes 18:00"
                                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label
                                    for="c-level"
                                    class="block text-sm font-medium text-slate-400 mb-1"
                                    >Nivel</label
                                >
                                <select
                                    id="c-level"
                                    bind:value={newClass.level}
                                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                >
                                    <option value="Pawn"
                                        >Peón (Iniciación)</option
                                    >
                                    <option value="Bishop"
                                        >Alfil (Intermedio)</option
                                    >
                                    <option value="King">Rey (Avanzado)</option>
                                </select>
                            </div>
                            <button
                                onclick={handleAddClass}
                                class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg mt-2"
                                >Crear Clase</button
                            >
                        </div>
                    </div>
                {/if}

                {#if centerClasses.length === 0}
                    <div
                        class="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl"
                    >
                        No hay clases registradas en este centro.
                    </div>
                {:else}
                    <div class="grid gap-4">
                        {#each centerClasses as cls}
                            <div
                                class="bg-[#1e293b] border border-slate-700/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-500/30 transition-colors"
                            >
                                <div>
                                    <h4 class="text-lg font-bold text-white">
                                        {cls.name}
                                    </h4>
                                    <p class="text-sm text-slate-400">
                                        {cls.schedule} • {cls.students.length} alumnos
                                    </p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <a
                                        href="{base}/dashboard/classes"
                                        class="text-sm text-purple-400 hover:text-purple-300 font-medium"
                                        >Gestionar</a
                                    >
                                    <button
                                        onclick={() =>
                                            handleDeleteClass(cls.id)}
                                        class="text-slate-500 hover:text-red-400 p-2 transition-colors"
                                        title="Eliminar Clase"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}

        <!-- STUDENTS -->
        {#if activeTab === "students"}
            <div
                class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
                transition:fade
            >
                <div
                    class="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center"
                >
                    <span class="font-bold text-slate-300"
                        >Listado de Alumnos ({centerStudents.length})</span
                    >
                    <a
                        href="{base}/dashboard/students"
                        class="text-sm text-emerald-400 hover:underline flex items-center gap-1"
                    >
                        <UserPlus class="w-4 h-4" /> Matricular Nuevo
                    </a>
                </div>
                {#if centerStudents.length === 0}
                    <div class="text-center py-12 text-slate-500">
                        No hay alumnos matriculados en las clases de este
                        centro.
                    </div>
                {:else}
                    <div class="block sm:hidden space-y-4 p-4">
                        {#each centerStudents as s}
                            <div
                                class="bg-slate-900/50 border border-slate-700 rounded-xl p-4"
                            >
                                <div
                                    class="flex justify-between items-start mb-2"
                                >
                                    <h4 class="text-white font-bold text-lg">
                                        {s.name}
                                    </h4>
                                    <button
                                        onclick={() =>
                                            handleDeleteStudent(s.id)}
                                        class="text-slate-500 hover:text-red-400 p-2 -mr-2"
                                        title="Baja definitiva"
                                    >
                                        <Trash2 class="w-5 h-5" />
                                    </button>
                                </div>
                                <div
                                    class="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg mb-2"
                                >
                                    <span
                                        class="block text-xs uppercase font-bold text-slate-500 mb-1"
                                        >Clases:</span
                                    >
                                    {getStudentClassesInCenter(s.id)}
                                </div>
                            </div>
                        {/each}
                    </div>

                    <table class="hidden sm:table w-full text-left">
                        <thead
                            class="bg-slate-900/30 text-slate-400 text-xs uppercase"
                        >
                            <tr>
                                <th class="p-4">Nombre</th>
                                <th class="p-4">Clases</th>
                                <th class="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-700">
                            {#each centerStudents as s}
                                <tr class="hover:bg-slate-800/30">
                                    <td class="p-4 font-medium text-white"
                                        >{s.name}</td
                                    >
                                    <td class="p-4 text-sm text-slate-400"
                                        >{getStudentClassesInCenter(s.id)}</td
                                    >
                                    <td class="p-4 text-right">
                                        <button
                                            onclick={() =>
                                                handleDeleteStudent(s.id)}
                                            class="text-slate-500 hover:text-red-400 p-2 transition-colors"
                                            title="Baja definitiva"
                                        >
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
        {/if}
    {/if}
</div>
