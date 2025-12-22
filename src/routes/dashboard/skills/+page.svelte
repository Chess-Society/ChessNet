<script lang="ts">
    import { onMount } from "svelte";
    import { appStore, storeActions, type Skill } from "$lib/services/storage";
    import {
        Target,
        CheckCircle,
        Award,
        Brain,
        Sword,
        Shield,
        Book,
        Plus,
        X,
        Search,
    } from "lucide-svelte";
    import { slide, fade } from "svelte/transition";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let showForm = false;
    let newSkill: Skill = {
        id: "",
        name: "",
        category: "Tactics",
        level: 1,
        description: "",
    };

    // Evaluation State
    let evaluatingSkill: Skill | null = null;
    let evalSearchTerm = "";

    function handleSubmit() {
        if (!newSkill.name) return;

        const skillToAdd = {
            ...newSkill,
            id: crypto.randomUUID(),
        };

        storeActions.addSkill(skillToAdd);

        // Reset form
        newSkill = {
            id: "",
            name: "",
            category: "Tactics",
            level: 1,
            description: "",
        };
        showForm = false;
    }

    function openEvaluation(skill: Skill) {
        evaluatingSkill = skill;
        evalSearchTerm = "";
    }

    function toggleStudentSkill(studentId: string) {
        if (!evaluatingSkill) return;
        storeActions.toggleStudentSkill(studentId, evaluatingSkill.id);
    }

    const getIcon = (category: string) => {
        switch (category) {
            case "Tactics":
                return Sword;
            case "Strategy":
                return Brain;
            case "Endgame":
                return Award;
            case "Openings":
                return Book;
            default:
                return Target;
        }
    };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Target class="w-8 h-8 text-yellow-500" /> Matriz de Habilidades
            </h1>
            <p class="mt-2 text-sm text-slate-400">
                Define qué deben aprender tus alumnos y marca su progreso.
            </p>
        </div>
        <div class="mt-4 sm:mt-0">
            <button
                onclick={() => (showForm = !showForm)}
                class="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
                <Plus class="w-5 h-5" />
                Nueva Habilidad
            </button>
        </div>
    </div>

    {#if showForm}
        <div
            transition:slide
            class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 mt-6 max-w-2xl"
        >
            <h3 class="text-lg font-bold text-white mb-4">
                Definir Nueva Habilidad
            </h3>
            <div class="space-y-4">
                <div>
                    <label
                        for="skill-name"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Nombre de la Habilidad</label
                    >
                    <input
                        id="skill-name"
                        bind:value={newSkill.name}
                        type="text"
                        placeholder="Ej: Mate del Pasillo"
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            for="skill-category"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Categoría</label
                        >
                        <select
                            id="skill-category"
                            bind:value={newSkill.category}
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="Tactics">Táctica</option>
                            <option value="Strategy">Estrategia</option>
                            <option value="Openings">Aperturas</option>
                            <option value="Endgame">Finales</option>
                        </select>
                    </div>
                    <div>
                        <label
                            for="skill-level"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Nivel (1-5)</label
                        >
                        <input
                            id="skill-level"
                            bind:value={newSkill.level}
                            type="number"
                            min="1"
                            max="5"
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                </div>
                <div>
                    <label
                        for="skill-description"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Descripción</label
                    >
                    <textarea
                        id="skill-description"
                        bind:value={newSkill.description}
                        rows="2"
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    ></textarea>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <button
                        onclick={() => (showForm = false)}
                        class="text-slate-400 hover:text-white px-4 py-2"
                        >Cancelar</button
                    >
                    <button
                        onclick={handleSubmit}
                        class="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium"
                        >Guardar Habilidad</button
                    >
                </div>
            </div>
        </div>
    {/if}

    <!-- Skills Grid -->
    <div class="mt-8 grid gap-6 md:grid-cols-2">
        {#if store.skills.length === 0}
            <div
                class="col-span-full py-12 text-center bg-[#1e293b]/50 rounded-3xl border border-dashed border-slate-700"
            >
                <Target class="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-white mb-2">
                    Sin habilidades definidas
                </h3>
                <p class="text-slate-400 mb-6">
                    Crea una matriz de habilidades para evaluar a tus alumnos.
                </p>
            </div>
        {:else}
            {#each store.skills as skill}
                <div
                    class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 flex items-start gap-4 hover:border-yellow-500/30 transition-colors group"
                >
                    <div
                        class="p-3 bg-slate-800 rounded-xl group-hover:bg-yellow-500/10 group-hover:text-yellow-500 transition-colors"
                    >
                        <svelte:component
                            this={getIcon(skill.category)}
                            class="w-8 h-8 text-slate-400 group-hover:text-yellow-500"
                        />
                    </div>

                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-bold text-white">
                                {skill.name}
                            </h3>
                            <span
                                class="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded"
                                >Nivel {skill.level}</span
                            >
                        </div>
                        <p class="text-slate-400 text-sm mt-1">
                            {skill.description}
                        </p>

                        <div class="mt-4 flex items-center justify-between">
                            <div
                                class="flex items-center gap-2 text-sm text-slate-500"
                            >
                                <CheckCircle class="w-4 h-4 text-green-500" />
                                <span class="text-slate-300 font-medium"
                                    >{store.students.filter((s) =>
                                        s.skills?.includes(skill.id),
                                    ).length}</span
                                > alumnos lo dominan
                            </div>
                            <button
                                onclick={() => openEvaluation(skill)}
                                class="text-yellow-500 text-sm font-semibold hover:underline cursor-pointer"
                            >
                                Evaluar Grupo
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

<!-- Evaluation Modal -->
{#if evaluatingSkill}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        transition:fade
    >
        <!-- Backdrop -->
        <div
            class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onclick={() => (evaluatingSkill = null)}
        ></div>

        <!-- Modal Panel -->
        <div
            class="relative bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
        >
            <!-- Header -->
            <div
                class="p-6 border-b border-slate-700 flex justify-between items-center"
            >
                <div>
                    <h3
                        class="text-xl font-bold text-white flex items-center gap-2"
                    >
                        <Award class="w-6 h-6 text-yellow-500" />
                        Evaluando: {evaluatingSkill.name}
                    </h3>
                    <p class="text-slate-400 text-sm mt-1">
                        Marca los alumnos que han dominado esta habilidad.
                    </p>
                </div>
                <button
                    onclick={() => (evaluatingSkill = null)}
                    class="text-slate-500 hover:text-white transition-colors"
                >
                    <X class="w-6 h-6" />
                </button>
            </div>

            <!-- Search/Filter -->
            <div class="p-4 bg-slate-900/50 border-b border-slate-700">
                <div class="relative">
                    <Search
                        class="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
                    />
                    <input
                        bind:value={evalSearchTerm}
                        type="text"
                        placeholder="Buscar alumno..."
                        class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-yellow-500 outline-none"
                    />
                </div>
            </div>

            <!-- List -->
            <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {#each store.students.filter((s) => s.name
                            .toLowerCase()
                            .includes(evalSearchTerm.toLowerCase())) as student}
                        <button
                            onclick={() => toggleStudentSkill(student.id)}
                            class="flex items-center justify-between p-3 rounded-xl border transition-all duration-200 {student.skills?.includes(
                                evaluatingSkill.id,
                            )
                                ? 'bg-yellow-500/10 border-yellow-500/50'
                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white"
                                >
                                    {student.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div class="text-left">
                                    <div class="font-bold text-white text-sm">
                                        {student.name}
                                    </div>
                                    <div class="text-xs text-slate-500">
                                        {student.level}
                                    </div>
                                </div>
                            </div>

                            {#if student.skills?.includes(evaluatingSkill.id)}
                                <div
                                    class="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center"
                                    transition:fade
                                >
                                    <CheckCircle class="w-4 h-4" />
                                </div>
                            {:else}
                                <div
                                    class="w-6 h-6 rounded-full border-2 border-slate-600"
                                ></div>
                            {/if}
                        </button>
                    {/each}

                    {#if store.students.length === 0}
                        <div
                            class="col-span-full text-center py-8 text-slate-500"
                        >
                            No tienes alumnos registrados para evaluar.
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Footer -->
            <div
                class="p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl flex justify-end"
            >
                <button
                    onclick={() => (evaluatingSkill = null)}
                    class="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                >
                    Listo
                </button>
            </div>
        </div>
    </div>
{/if}
