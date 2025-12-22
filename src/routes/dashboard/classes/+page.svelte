<script lang="ts">
    import { onMount } from "svelte";
    import {
        appStore,
        storeActions,
        type ClassGroup,
    } from "$lib/services/storage";
    import {
        BookOpen,
        Users,
        Clock,
        Calendar,
        CheckCircle2,
        UserPlus,
        Plus,
    } from "lucide-svelte";
    import { slide } from "svelte/transition";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let showForm = false;
    let newClass: ClassGroup = {
        id: "",
        name: "",
        centerId: "",
        schedule: "",
        level: "Pawn",
        students: [],
    };

    function handleSubmit() {
        if (!newClass.name) return;

        const classToAdd = {
            ...newClass,
            id: crypto.randomUUID(),
        };

        storeActions.addClass(classToAdd);

        // Reset form
        newClass = {
            id: "",
            name: "",
            centerId: "",
            schedule: "",
            level: "Pawn",
            students: [],
        };
        showForm = false;
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
                class="inline-flex items-center justify-center rounded-xl border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none transition-colors cursor-pointer"
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
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
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
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    >
                        <option value="">Selecciona un centro...</option>
                        {#each store.centers as center}
                            <option value={center.id}>{center.name}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label
                        for="class-schedule"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Horario Habitual</label
                    >
                    <input
                        id="class-schedule"
                        bind:value={newClass.schedule}
                        type="text"
                        placeholder="Ej: Lunes 17:00"
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
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
                        class="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium"
                        >Crear Clase</button
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
                        class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:border-purple-500/30 transition-all"
                    >
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">
                                    {group.name}
                                </h3>
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

                        <div class="space-y-3 mb-6">
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

                        <div class="flex gap-2">
                            <button
                                class="flex-1 bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <CheckCircle2 class="w-4 h-4" />
                                Pasar Lista
                            </button>
                            <button
                                class="flex-1 bg-slate-800 text-slate-300 py-2 rounded-xl text-sm font-semibold hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
                            >
                                Detalles
                            </button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
