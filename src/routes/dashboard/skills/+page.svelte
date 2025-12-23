<script lang="ts">
    import { onMount } from "svelte";
    import { appStore, storeActions, type Skill } from "$lib/services/storage";
    import {
        getAllTemplates,
        type SkillTemplate,
    } from "$lib/data/skillTemplates";
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
        Edit,
        Trash2,
        TrendingUp,
        BarChart3,
        AlertTriangle,
        Download,
        FileText,
    } from "lucide-svelte";
    import { slide, fade } from "svelte/transition";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let showForm = false;
    let editingSkill: Skill | null = null;
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

    // Filter/Search State
    let searchTerm = "";
    let selectedCategory = "all";
    let filterLevel = "";

    // Delete confirmation
    let deletingSkill: Skill | null = null;

    // Template import
    let showTemplateModal = false;
    let availableTemplates = getAllTemplates();

    function handleSubmit() {
        if (!newSkill.name) return;

        if (editingSkill) {
            // Update existing skill
            storeActions.updateSkill(editingSkill.id, newSkill);
            editingSkill = null;
        } else {
            // Add new skill
            const skillToAdd = {
                ...newSkill,
                id: crypto.randomUUID(),
            };
            storeActions.addSkill(skillToAdd);
        }

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

    function editSkill(skill: Skill) {
        editingSkill = skill;
        newSkill = { ...skill };
        showForm = true;
    }

    function confirmDelete(skill: Skill) {
        deletingSkill = skill;
    }

    function deleteSkill() {
        if (deletingSkill) {
            storeActions.deleteSkill(deletingSkill.id);
            deletingSkill = null;
        }
    }

    function openEvaluation(skill: Skill) {
        evaluatingSkill = skill;
        evalSearchTerm = "";
    }

    function toggleStudentSkill(studentId: string) {
        if (!evaluatingSkill) return;
        storeActions.toggleStudentSkill(studentId, evaluatingSkill.id);
    }

    function importTemplate(template: SkillTemplate) {
        // Import all skills from template
        template.skills.forEach((skillData) => {
            const newSkill: Skill = {
                ...skillData,
                id: crypto.randomUUID(),
            };
            storeActions.addSkill(newSkill);
        });

        showTemplateModal = false;

        // Show success message (you could add a toast notification here)
        alert(
            `✅ Se han importado ${template.skills.length} habilidades del temario "${template.name}"`,
        );
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

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case "Tactics":
                return "Táctica";
            case "Strategy":
                return "Estrategia";
            case "Endgame":
                return "Finales";
            case "Openings":
                return "Aperturas";
            default:
                return category;
        }
    };

    // Reactive calculations
    $: skillProgress = store.skills.map((skill) => {
        const studentsWithSkill = store.students.filter((s) =>
            s.skills?.includes(skill.id),
        ).length;
        const totalStudents = store.students.length;
        return {
            ...skill,
            progress:
                totalStudents > 0
                    ? (studentsWithSkill / totalStudents) * 100
                    : 0,
            studentsCount: studentsWithSkill,
            totalStudents,
        };
    });

    $: skillsByCategory = {
        all: skillProgress,
        Tactics: skillProgress.filter((s) => s.category === "Tactics"),
        Strategy: skillProgress.filter((s) => s.category === "Strategy"),
        Openings: skillProgress.filter((s) => s.category === "Openings"),
        Endgame: skillProgress.filter((s) => s.category === "Endgame"),
    };

    $: filteredSkills = (
        skillsByCategory[selectedCategory as keyof typeof skillsByCategory] ||
        []
    )
        .filter((s: any) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .filter((s: any) =>
            filterLevel ? s.level === parseInt(filterLevel) : true,
        );

    $: stats = {
        totalSkills: store.skills.length,
        avgMastery:
            skillProgress.length > 0
                ? Math.round(
                      skillProgress.reduce((sum, s) => sum + s.progress, 0) /
                          skillProgress.length,
                  )
                : 0,
        topSkill:
            skillProgress.length > 0
                ? [...skillProgress].sort((a, b) => b.progress - a.progress)[0]
                : null,
        leastMastered:
            skillProgress.length > 0
                ? [...skillProgress].sort((a, b) => a.progress - b.progress)[0]
                : null,
    };

    $: categories = [
        { id: "all", label: "Todas", count: skillsByCategory.all?.length || 0 },
        {
            id: "Tactics",
            label: "Táctica",
            count: skillsByCategory.Tactics?.length || 0,
        },
        {
            id: "Strategy",
            label: "Estrategia",
            count: skillsByCategory.Strategy?.length || 0,
        },
        {
            id: "Openings",
            label: "Aperturas",
            count: skillsByCategory.Openings?.length || 0,
        },
        {
            id: "Endgame",
            label: "Finales",
            count: skillsByCategory.Endgame?.length || 0,
        },
    ];
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
        <div class="mt-4 sm:mt-0 flex gap-3">
            <button
                onclick={() => (showTemplateModal = true)}
                class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
                <Download class="w-5 h-5" />
                Importar Plantilla
            </button>
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

    <!-- Stats Panel -->
    {#if store.skills.length > 0}
        <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
            transition:slide
        >
            <div class="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-slate-400 text-sm font-medium">
                            Total Habilidades
                        </p>
                        <p class="text-3xl font-bold text-white mt-2">
                            {stats.totalSkills}
                        </p>
                    </div>
                    <div class="bg-yellow-500/10 p-3 rounded-xl">
                        <Target class="w-6 h-6 text-yellow-500" />
                    </div>
                </div>
            </div>

            <div class="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-slate-400 text-sm font-medium">
                            Dominio Promedio
                        </p>
                        <p class="text-3xl font-bold text-white mt-2">
                            {stats.avgMastery}%
                        </p>
                    </div>
                    <div class="bg-emerald-500/10 p-3 rounded-xl">
                        <TrendingUp class="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
            </div>

            <div class="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
                <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                        <p class="text-slate-400 text-sm font-medium">
                            Más Dominada
                        </p>
                        <p class="text-lg font-bold text-white mt-2 truncate">
                            {stats.topSkill?.name || "N/A"}
                        </p>
                        {#if stats.topSkill}
                            <p class="text-xs text-emerald-500 mt-1">
                                {Math.round(stats.topSkill.progress)}% de
                                alumnos
                            </p>
                        {/if}
                    </div>
                    <div class="bg-amber-500/10 p-3 rounded-xl flex-shrink-0">
                        <Award class="w-6 h-6 text-amber-500" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Category Tabs -->
        <div class="mt-8 border-b border-slate-700">
            <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                {#each categories as cat}
                    <button
                        onclick={() => (selectedCategory = cat.id)}
                        class="px-4 py-2 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap {selectedCategory ===
                        cat.id
                            ? 'bg-yellow-500/10 text-yellow-500 border-b-2 border-yellow-500'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
                    >
                        {cat.label}
                        <span
                            class="ml-2 bg-slate-700 px-2 py-0.5 rounded-full text-xs"
                        >
                            {cat.count}
                        </span>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="mt-6 flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
                <Search
                    class="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
                />
                <input
                    bind:value={searchTerm}
                    type="text"
                    placeholder="Buscar habilidades..."
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-yellow-500 outline-none"
                />
            </div>
            <select
                bind:value={filterLevel}
                class="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 outline-none"
            >
                <option value="">Todos los niveles</option>
                <option value="1">Nivel 1</option>
                <option value="2">Nivel 2</option>
                <option value="3">Nivel 3</option>
                <option value="4">Nivel 4</option>
                <option value="5">Nivel 5</option>
            </select>
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
        {:else if filteredSkills.length === 0}
            <div class="col-span-full py-12 text-center text-slate-500">
                <Search class="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron habilidades con esos filtros.</p>
            </div>
        {:else}
            {#each filteredSkills as skill}
                <div
                    class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 hover:border-yellow-500/30 transition-colors group"
                >
                    <div class="flex items-start gap-4">
                        <div
                            class="p-3 bg-slate-800 rounded-xl group-hover:bg-yellow-500/10 transition-colors flex-shrink-0"
                        >
                            <svelte:component
                                this={getIcon(skill.category)}
                                class="w-8 h-8 text-slate-400 group-hover:text-yellow-500"
                            />
                        </div>

                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start gap-3">
                                <div class="flex-1 min-w-0">
                                    <h3
                                        class="text-lg font-bold text-white truncate"
                                    >
                                        {skill.name}
                                    </h3>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span
                                            class="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded"
                                            >Nivel {skill.level}</span
                                        >
                                        <span
                                            class="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded"
                                            >{getCategoryLabel(
                                                skill.category,
                                            )}</span
                                        >
                                    </div>
                                </div>

                                <!-- Action buttons -->
                                <div class="flex gap-2 flex-shrink-0">
                                    <button
                                        onclick={() => editSkill(skill)}
                                        class="p-2 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit class="w-4 h-4" />
                                    </button>
                                    <button
                                        onclick={() => confirmDelete(skill)}
                                        class="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p class="text-slate-400 text-sm mt-2 line-clamp-2">
                                {skill.description}
                            </p>

                            <!-- Progress Bar -->
                            <div class="mt-4">
                                <div
                                    class="flex justify-between text-xs mb-1.5"
                                >
                                    <span class="text-slate-400">Progreso</span>
                                    <span class="text-white font-bold"
                                        >{Math.round(skill.progress)}%</span
                                    >
                                </div>
                                <div
                                    class="h-2 bg-slate-800 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full transition-all duration-500 {skill.progress >=
                                        70
                                            ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                            : skill.progress >= 30
                                              ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                                              : 'bg-gradient-to-r from-red-500 to-orange-500'}"
                                        style="width: {skill.progress}%"
                                    ></div>
                                </div>
                                <p class="text-xs text-slate-500 mt-1.5">
                                    {skill.studentsCount} de {skill.totalStudents}
                                    alumnos
                                </p>
                            </div>

                            <div class="mt-4 flex justify-end">
                                <button
                                    onclick={() => openEvaluation(skill)}
                                    class="text-yellow-500 text-sm font-semibold hover:underline cursor-pointer flex items-center gap-1"
                                >
                                    Evaluar Grupo
                                    <CheckCircle class="w-4 h-4" />
                                </button>
                            </div>
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
        <button
            class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm w-full h-full cursor-default"
            onclick={() => (evaluatingSkill = null)}
            aria-label="Cerrar modal"
        ></button>

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

<!-- Delete Confirmation Modal -->
{#if deletingSkill}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        transition:fade
    >
        <!-- Backdrop -->
        <button
            class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm w-full h-full cursor-default"
            onclick={() => (deletingSkill = null)}
            aria-label="Cerrar modal"
        ></button>

        <!-- Modal Panel -->
        <div
            class="relative bg-[#1e293b] border border-red-500/50 rounded-2xl w-full max-w-md shadow-2xl"
        >
            <div class="p-6">
                <div class="flex items-start gap-4">
                    <div class="bg-red-500/10 p-3 rounded-xl">
                        <AlertTriangle class="w-6 h-6 text-red-500" />
                    </div>
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-white">
                            ¿Eliminar habilidad?
                        </h3>
                        <p class="text-slate-400 text-sm mt-2">
                            Estás a punto de eliminar "<span
                                class="font-semibold text-white"
                                >{deletingSkill.name}</span
                            >".
                        </p>
                        <p
                            class="text-amber-400 text-sm mt-2 flex items-start gap-2"
                        >
                            <AlertTriangle
                                class="w-4 h-4 flex-shrink-0 mt-0.5"
                            />
                            <span
                                >Esta habilidad también se eliminará del
                                progreso de todos los alumnos.</span
                            >
                        </p>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button
                        onclick={() => (deletingSkill = null)}
                        class="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onclick={deleteSkill}
                        class="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Template Import Modal -->
{#if showTemplateModal}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        transition:fade
    >
        <!-- Backdrop -->
        <button
            class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm w-full h-full cursor-default"
            onclick={() => (showTemplateModal = false)}
            aria-label="Cerrar modal"
        ></button>

        <!-- Modal Panel -->
        <div
            class="relative bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl"
        >
            <!-- Header -->
            <div class="p-6 border-b border-slate-700">
                <div class="flex justify-between items-start">
                    <div>
                        <h3
                            class="text-xl font-bold text-white flex items-center gap-2"
                        >
                            <FileText class="w-6 h-6 text-blue-500" />
                            Importar Plantilla de Habilidades
                        </h3>
                        <p class="text-slate-400 text-sm mt-1">
                            Selecciona un temario predefinido para empezar
                            rápidamente
                        </p>
                    </div>
                    <button
                        onclick={() => (showTemplateModal = false)}
                        class="text-slate-500 hover:text-white transition-colors"
                    >
                        <X class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div class="space-y-4">
                    {#each availableTemplates as template}
                        <div
                            class="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1">
                                    <h4
                                        class="text-lg font-bold text-white flex items-center gap-2"
                                    >
                                        <Target
                                            class="w-5 h-5 text-yellow-500"
                                        />
                                        {template.name}
                                    </h4>
                                    <p class="text-slate-400 text-sm mt-2">
                                        {template.description}
                                    </p>

                                    <!-- Stats -->
                                    <div class="flex flex-wrap gap-4 mt-4">
                                        <div
                                            class="flex items-center gap-2 text-sm"
                                        >
                                            <div
                                                class="bg-yellow-500/10 p-2 rounded-lg"
                                            >
                                                <Target
                                                    class="w-4 h-4 text-yellow-500"
                                                />
                                            </div>
                                            <div>
                                                <p
                                                    class="text-slate-500 text-xs"
                                                >
                                                    Total
                                                </p>
                                                <p class="text-white font-bold">
                                                    {template.skills.length} habilidades
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            class="flex items-center gap-2 text-sm"
                                        >
                                            <div
                                                class="bg-blue-500/10 p-2 rounded-lg"
                                            >
                                                <BarChart3
                                                    class="w-4 h-4 text-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <p
                                                    class="text-slate-500 text-xs"
                                                >
                                                    Niveles
                                                </p>
                                                <p class="text-white font-bold">
                                                    1 - 5
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            class="flex items-center gap-2 text-sm"
                                        >
                                            <div
                                                class="bg-emerald-500/10 p-2 rounded-lg"
                                            >
                                                <CheckCircle
                                                    class="w-4 h-4 text-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <p
                                                    class="text-slate-500 text-xs"
                                                >
                                                    Categorías
                                                </p>
                                                <p class="text-white font-bold">
                                                    4 tipos
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Preview -->
                                    <details class="mt-4">
                                        <summary
                                            class="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                                        >
                                            Ver contenido completo
                                        </summary>
                                        <div
                                            class="mt-3 max-h-60 overflow-y-auto custom-scrollbar bg-slate-950/50 rounded-lg p-4"
                                        >
                                            <div class="space-y-2">
                                                {#each template.skills as skill, index}
                                                    <div
                                                        class="text-xs flex items-center gap-2 text-slate-400"
                                                    >
                                                        <span
                                                            class="text-slate-600 font-mono"
                                                            >{index + 1}.</span
                                                        >
                                                        <span class="flex-1"
                                                            >{skill.name}</span
                                                        >
                                                        <span
                                                            class="bg-slate-800 px-2 py-0.5 rounded text-[10px]"
                                                        >
                                                            Nivel {skill.level}
                                                        </span>
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                    </details>
                                </div>

                                <button
                                    onclick={() => importTemplate(template)}
                                    class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 flex-shrink-0"
                                >
                                    <Download class="w-5 h-5" />
                                    Importar
                                </button>
                            </div>
                        </div>
                    {/each}

                    {#if availableTemplates.length === 0}
                        <div class="text-center py-12 text-slate-500">
                            <FileText
                                class="w-12 h-12 mx-auto mb-4 opacity-50"
                            />
                            <p>No hay plantillas disponibles</p>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-slate-700 bg-slate-900/50">
                <button
                    onclick={() => (showTemplateModal = false)}
                    class="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                    Cerrar
                </button>
            </div>
        </div>
    </div>
{/if}
