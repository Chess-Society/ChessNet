<script lang="ts">
    import { onMount } from "svelte";
    import { getSkills, type Skill } from "$lib/services/mockData";
    import {
        Target,
        CheckCircle,
        Award,
        Brain,
        Sword,
        Shield,
        Book,
    } from "lucide-svelte";

    let skills: Skill[] = [];
    let loading = true;

    onMount(async () => {
        skills = await getSkills();
        loading = false;
    });

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
    </div>

    <!-- Skills Grid -->
    <div class="mt-8 grid gap-6 md:grid-cols-2">
        {#if loading}
            {#each Array(4) as _}
                <div
                    class="animate-pulse bg-[#1e293b] rounded-2xl h-32 border border-slate-700/50"
                ></div>
            {/each}
        {:else}
            {#each skills as skill}
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
                                    >{skill.studentsMastered}</span
                                > alumnos lo dominan
                            </div>
                            <button
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
