<script lang="ts">
    import { onMount } from "svelte";
    import { getClasses, type ClassGroup } from "$lib/services/mockData";
    import {
        BookOpen,
        Users,
        Clock,
        Calendar,
        CheckCircle2,
        UserPlus,
    } from "lucide-svelte";

    let classes: ClassGroup[] = [];
    let loading = true;

    onMount(async () => {
        classes = await getClasses();
        loading = false;
    });
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
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none transition-colors cursor-pointer"
            >
                <UserPlus class="w-4 h-4 mr-2" />
                Nueva Clase
            </button>
        </div>
    </div>

    <!-- Active Sessions Today -->
    <div class="mt-8">
        <h2 class="text-lg font-semibold text-white mb-4">Próximas Sesiones</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#if loading}
                {#each Array(3) as _}
                    <div
                        class="animate-pulse bg-[#1e293b] rounded-2xl h-48 border border-slate-700/50"
                    ></div>
                {/each}
            {:else}
                {#each classes as group}
                    <div
                        class="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:border-purple-500/30 transition-all"
                    >
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">
                                    {group.name}
                                </h3>
                                <p class="text-slate-400 text-sm mt-1">
                                    {group.center}
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
                                {group.nextSession}
                            </div>
                            <div
                                class="flex items-center text-slate-400 text-sm"
                            >
                                <Users class="w-4 h-4 mr-2 text-slate-500" />
                                {group.students} Alumnos inscritos
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
